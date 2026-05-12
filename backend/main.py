from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

import pandas as pd
import pulp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _estado_optimizacion_es(status: int) -> str:
    return {
        pulp.LpStatusOptimal: "Óptimo",
        pulp.LpStatusInfeasible: "Infactible",
        pulp.LpStatusUnbounded: "No acotado",
        pulp.LpStatusUndefined: "Indefinido",
        pulp.LpStatusNotSolved: "No resuelto",
    }.get(status, str(status))


@app.get("/")
def read_root():
    return {"message": "API activa", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/optimizar")
def optimizar():
    """
    Modelo demo: toneladas de aleación A y B que maximizan utilidad,
    respetando suministro de minerales 1–3 según recetas fijas (t/ton de aleación).
    """
    supply = {1: 200.0, 2: 180.0, 3: 160.0}
    recipe_a = {1: 0.35, 2: 0.40, 3: 0.25}
    recipe_b = {1: 0.50, 2: 0.25, 3: 0.25}
    profit_a_usd_per_ton = 520.0
    profit_b_usd_per_ton = 480.0

    prob = pulp.LpProblem("MezclaAleaciones", pulp.LpMaximize)
    t_a = pulp.LpVariable("t_A", lowBound=0)
    t_b = pulp.LpVariable("t_B", lowBound=0)

    prob += profit_a_usd_per_ton * t_a + profit_b_usd_per_ton * t_b

    for m in (1, 2, 3):
        prob += (
            recipe_a[m] * t_a + recipe_b[m] * t_b <= supply[m],
            f"suministro_mineral_{m}",
        )

    prob.solve(pulp.PULP_CBC_CMD(msg=0))

    t_a_val = float(pulp.value(t_a) or 0.0)
    t_b_val = float(pulp.value(t_b) or 0.0)
    utilidad = float(pulp.value(prob.objective) or 0.0)

    distribucion: list[dict[str, str | float]] = []
    for m in (1, 2, 3):
        ton_a = recipe_a[m] * t_a_val
        ton_b = recipe_b[m] * t_b_val
        if ton_a > 1e-6:
            distribucion.append(
                {"Aleacion": "A", "Mineral": str(m), "Toneladas": round(ton_a, 4)}
            )
        if ton_b > 1e-6:
            distribucion.append(
                {"Aleacion": "B", "Mineral": str(m), "Toneladas": round(ton_b, 4)}
            )

    df = pd.DataFrame(distribucion)
    excel_path = os.path.join(BASE_DIR, "optimizacion_resultados.xlsx")
    df.to_excel(excel_path, index=False)

    return {
        "utilidad_maxima_usd": round(utilidad, 2),
        "estado_optimizacion": _estado_optimizacion_es(prob.status),
        "estado_codigo": prob.status,
        "distribucion_toneladas": distribucion,
        "archivo_excel": "optimizacion_resultados.xlsx",
    }
