"""Simulador de mezcla de aleaciones — FastAPI + PuLP + relajación analítica."""

from __future__ import annotations

from typing import Any

import pulp
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator

app = FastAPI(title="Simulador Optimización Aleaciones", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

METALES = ("I", "II", "III", "IV")
SPEC_FIELDS = [
    ("I", "min_I", "max_I"),
    ("II", "min_II", "max_II"),
    ("III", "min_III", "max_III"),
    ("IV", "min_IV", "max_IV"),
]


class PorcentajesMetal(BaseModel):
    I: float = Field(ge=0, le=100)
    II: float = Field(ge=0, le=100)
    III: float = Field(ge=0, le=100)
    IV: float = Field(ge=0, le=100)

    @model_validator(mode="after")
    def chequear_suma(self) -> PorcentajesMetal:
        s = self.I + self.II + self.III + self.IV
        if abs(s - 100.0) > 3.0:
            raise ValueError(
                f"Los porcentajes del mineral deben sumar ~100 (actual: {s:.2f})"
            )
        return self


class MatrizConstituyentes(BaseModel):
    mineral_1: PorcentajesMetal
    mineral_2: PorcentajesMetal
    mineral_3: PorcentajesMetal


class DisponibilidadMineral(BaseModel):
    mineral_id: int = Field(ge=1, le=3)
    cantidad_maxima: float = Field(ge=0)
    costo_por_tonelada: float = Field(ge=0)


class PreciosAleaciones(BaseModel):
    precio_a: float = Field(ge=0)
    precio_b: float = Field(ge=0)


class EspecificacionAleacion(BaseModel):
    min_I: float = Field(ge=0, le=100)
    max_I: float = Field(ge=0, le=100)
    min_II: float = Field(ge=0, le=100)
    max_II: float = Field(ge=0, le=100)
    min_III: float = Field(ge=0, le=100)
    max_III: float = Field(ge=0, le=100)
    min_IV: float = Field(ge=0, le=100)
    max_IV: float = Field(ge=0, le=100)

    @model_validator(mode="after")
    def orden_min_max(self) -> EspecificacionAleacion:
        pairs = [
            (self.min_I, self.max_I),
            (self.min_II, self.max_II),
            (self.min_III, self.max_III),
            (self.min_IV, self.max_IV),
        ]
        for mn, mx in pairs:
            if mn > mx:
                raise ValueError("Cada mínimo de pureza debe ser ≤ su máximo correspondiente.")
        return self


class RestriccionesEspecificaciones(BaseModel):
    aleacion_a: EspecificacionAleacion
    aleacion_b: EspecificacionAleacion


class OptimizarRequest(BaseModel):
    disponibilidad_minerales: list[DisponibilidadMineral]
    precios_aleaciones: PreciosAleaciones
    matriz_constituyentes: MatrizConstituyentes
    restricciones_especificaciones: RestriccionesEspecificaciones

    @model_validator(mode="after")
    def tres_minerales(self) -> OptimizarRequest:
        if len(self.disponibilidad_minerales) != 3:
            raise ValueError("Se requieren exactamente 3 registros en disponibilidad_minerales.")
        ids = sorted(d.mineral_id for d in self.disponibilidad_minerales)
        if ids != [1, 2, 3]:
            raise ValueError("Los mineral_id deben ser 1, 2 y 3 sin duplicados.")
        return self


def _estado_es(status: int) -> str:
    return {
        pulp.LpStatusOptimal: "Óptimo",
        pulp.LpStatusInfeasible: "Infactible",
        pulp.LpStatusUnbounded: "No acotado",
        pulp.LpStatusUndefined: "Indefinido",
        pulp.LpStatusNotSolved: "No resuelto",
    }.get(status, str(status))


def _fila_matriz(mat: MatrizConstituyentes, mineral_id: int) -> PorcentajesMetal:
    if mineral_id == 1:
        return mat.mineral_1
    if mineral_id == 2:
        return mat.mineral_2
    return mat.mineral_3


def _metal_pct_row(row: PorcentajesMetal, metal: str) -> float:
    return getattr(row, metal) / 100.0


def _leyes(
    x_tot: float,
    vec: dict[int, float],
    rows: dict[int, PorcentajesMetal],
    minerals: list[int],
) -> dict[str, float]:
    if x_tot <= 1e-9:
        return {k: 0.0 for k in METALES}
    out: dict[str, float] = {}
    for metal in METALES:
        masa = sum(_metal_pct_row(rows[m], metal) * vec[m] for m in minerals)
        out[metal] = round(100.0 * masa / x_tot, 4)
    return out


def _banda_radar(
    leyes: dict[str, float], spec: EspecificacionAleacion
) -> list[dict[str, float]]:
    rad: list[dict[str, float]] = []
    for metal, mn_f, mx_f in SPEC_FIELDS:
        mn_v = getattr(spec, mn_f)
        mx_v = getattr(spec, mx_f)
        rad.append(
            {
                "metal": metal,
                "actual": leyes[metal],
                "min_spec": mn_v,
                "max_spec": mx_v,
                "centro_banda": (mn_v + mx_v) / 2,
            }
        )
    return rad


def _resolver_relajacion(
    payload: OptimizarRequest,
) -> tuple[float, list[dict[str, Any]], dict[str, float], dict[str, float]]:
    """
    Minimiza Σ holguras en restricciones de pureza (goal programming).
    Devuelve violación total, sugerencias, y vectores a,b del plan relajado.
    """
    disp = {
        d.mineral_id: (d.cantidad_maxima, d.costo_por_tonelada)
        for d in payload.disponibilidad_minerales
    }
    minerals = [1, 2, 3]
    mat = payload.matriz_constituyentes
    rows = {m: _fila_matriz(mat, m) for m in minerals}
    spec_a = payload.restricciones_especificaciones.aleacion_a
    spec_b = payload.restricciones_especificaciones.aleacion_b

    prob = pulp.LpProblem("RelajacionPureza", pulp.LpMinimize)
    a = {m: pulp.LpVariable(f"ra_{m}", lowBound=0) for m in minerals}
    b = {m: pulp.LpVariable(f"rb_{m}", lowBound=0) for m in minerals}

    x_a = pulp.lpSum(a[m] for m in minerals)
    x_b = pulp.lpSum(b[m] for m in minerals)

    # Evita la solución trivial (todo cero): analizamos holguras con al menos 1 t de producción total.
    prob += x_a + x_b >= 1.0, "min_produccion_analisis"

    for m in minerals:
        prob += a[m] + b[m] <= disp[m][0], f"rsup_{m}"

    slacks: list[pulp.LpVariable] = []
    slack_meta: list[tuple[str, str, str, pulp.LpVariable]] = []

    for metal, mn_a, mx_a in SPEC_FIELDS:
        pct_m = [_metal_pct_row(rows[m], metal) for m in minerals]
        masa_a = pulp.lpSum(pct_m[i] * a[minerals[i]] for i in range(3))
        masa_b = pulp.lpSum(pct_m[i] * b[minerals[i]] for i in range(3))
        mn_spec_a = getattr(spec_a, mn_a) / 100.0
        mx_spec_a = getattr(spec_a, mx_a) / 100.0
        mn_spec_b = getattr(spec_b, mn_a) / 100.0
        mx_spec_b = getattr(spec_b, mx_a) / 100.0

        s_a_lo = pulp.LpVariable(f"sA_{metal}_lo", lowBound=0)
        s_a_hi = pulp.LpVariable(f"sA_{metal}_hi", lowBound=0)
        s_b_lo = pulp.LpVariable(f"sB_{metal}_lo", lowBound=0)
        s_b_hi = pulp.LpVariable(f"sB_{metal}_hi", lowBound=0)

        prob += masa_a + s_a_lo >= mn_spec_a * x_a, f"rA_{metal}_min"
        prob += masa_a <= mx_spec_a * x_a + s_a_hi, f"rA_{metal}_max"
        prob += masa_b + s_b_lo >= mn_spec_b * x_b, f"rB_{metal}_min"
        prob += masa_b <= mx_spec_b * x_b + s_b_hi, f"rB_{metal}_max"

        slacks.extend([s_a_lo, s_a_hi, s_b_lo, s_b_hi])
        slack_meta.extend(
            [
                ("A", metal, "min", s_a_lo),
                ("A", metal, "max", s_a_hi),
                ("B", metal, "min", s_b_lo),
                ("B", metal, "max", s_b_hi),
            ]
        )

    prob += pulp.lpSum(slacks)

    prob.solve(pulp.PULP_CBC_CMD(msg=0))

    av = {m: float(pulp.value(a[m]) or 0.0) for m in minerals}
    bv = {m: float(pulp.value(b[m]) or 0.0) for m in minerals}
    x_av = sum(av.values())
    x_bv = sum(bv.values())

    violacion = float(pulp.value(prob.objective) or 0.0)

    umbral = 1e-5
    sugerencias: list[dict[str, Any]] = []

    for alq, metal, tipo, var in slack_meta:
        sv = float(pulp.value(var) or 0.0)
        if sv <= umbral:
            continue
        spec = spec_a if alq == "A" else spec_b
        _, mn_field, mx_field = next(
            (x for x in SPEC_FIELDS if x[0] == metal), ("I", "min_I", "max_I")
        )
        valor_min = getattr(spec, mn_field)
        valor_max = getattr(spec, mx_field)
        x_line = x_av if alq == "A" else x_bv

        delta_pct = (sv / x_line * 100.0) if x_line > 1e-6 else 0.0

        if tipo == "min":
            valor_sugerido = round(max(0.0, valor_min - delta_pct), 2)
            msg = (
                f"Sugerencia: en Aleación {alq}, relaje el mínimo del metal {metal}: "
                f"pruebe **≥ {valor_sugerido}%** (actual {valor_min}%; holgura relativa ~{delta_pct:.2f} puntos sobre producción)."
            )
            sugerencias.append(
                {
                    "tipo": "relajar_minimo",
                    "aleacion": alq,
                    "metal": metal,
                    "limite": "min",
                    "valor_actual_pct": valor_min,
                    "valor_sugerido_pct": valor_sugerido,
                    "delta_puntos_pct": round(delta_pct, 4),
                    "holgura_masa": round(sv, 6),
                    "mensaje": msg,
                }
            )
        else:
            valor_sugerido = round(min(100.0, valor_max + delta_pct), 2)
            msg = (
                f"Sugerencia: en Aleación {alq}, amplíe el máximo del metal {metal}: "
                f"pruebe **≤ {valor_sugerido}%** (actual {valor_max}%)."
            )
            sugerencias.append(
                {
                    "tipo": "ampliar_maximo",
                    "aleacion": alq,
                    "metal": metal,
                    "limite": "max",
                    "valor_actual_pct": valor_max,
                    "valor_sugerido_pct": valor_sugerido,
                    "delta_puntos_pct": round(delta_pct, 4),
                    "holgura_masa": round(sv, 6),
                    "mensaje": msg,
                }
            )

    sugerencias.sort(key=lambda s: s["holgura_masa"], reverse=True)

    return violacion, sugerencias, av, bv


def construir_y_resolver(payload: OptimizarRequest) -> dict[str, Any]:
    disp = {
        d.mineral_id: (d.cantidad_maxima, d.costo_por_tonelada)
        for d in payload.disponibilidad_minerales
    }
    minerals = [1, 2, 3]
    pa = payload.precios_aleaciones.precio_a
    pb = payload.precios_aleaciones.precio_b

    prob = pulp.LpProblem("BlendingAleaciones", pulp.LpMaximize)
    a = {m: pulp.LpVariable(f"a_{m}", lowBound=0) for m in minerals}
    b = {m: pulp.LpVariable(f"b_{m}", lowBound=0) for m in minerals}

    ingreso = pa * pulp.lpSum(a[m] for m in minerals) + pb * pulp.lpSum(
        b[m] for m in minerals
    )
    costo = pulp.lpSum(disp[m][1] * (a[m] + b[m]) for m in minerals)
    prob += ingreso - costo

    for m in minerals:
        prob += a[m] + b[m] <= disp[m][0], f"suministro_{m}"

    mat = payload.matriz_constituyentes
    rows = {m: _fila_matriz(mat, m) for m in minerals}

    spec_a = payload.restricciones_especificaciones.aleacion_a
    spec_b = payload.restricciones_especificaciones.aleacion_b

    for metal, mn_a, mx_a in SPEC_FIELDS:
        pct_m = [_metal_pct_row(rows[m], metal) for m in minerals]
        masa_a = pulp.lpSum(pct_m[i] * a[minerals[i]] for i in range(3))
        masa_b = pulp.lpSum(pct_m[i] * b[minerals[i]] for i in range(3))
        mn_spec_a = getattr(spec_a, mn_a) / 100.0
        mx_spec_a = getattr(spec_a, mx_a) / 100.0
        mn_spec_b = getattr(spec_b, mn_a) / 100.0
        mx_spec_b = getattr(spec_b, mx_a) / 100.0

        prob += masa_a >= mn_spec_a * pulp.lpSum(a[m] for m in minerals), f"A_{metal}_min"
        prob += masa_a <= mx_spec_a * pulp.lpSum(a[m] for m in minerals), f"A_{metal}_max"
        prob += masa_b >= mn_spec_b * pulp.lpSum(b[m] for m in minerals), f"B_{metal}_min"
        prob += masa_b <= mx_spec_b * pulp.lpSum(b[m] for m in minerals), f"B_{metal}_max"

    prob.solve(pulp.PULP_CBC_CMD(msg=0))

    status = prob.status
    utilidad = float(pulp.value(prob.objective) or 0.0)

    av = {m: float(pulp.value(a[m]) or 0.0) for m in minerals}
    bv = {m: float(pulp.value(b[m]) or 0.0) for m in minerals}
    x_av = sum(av.values())
    x_bv = sum(bv.values())

    distribucion: list[dict[str, str | float]] = []
    for m in minerals:
        if av[m] > 1e-6:
            distribucion.append(
                {"Aleacion": "A", "Mineral": str(m), "Toneladas": round(av[m], 6)}
            )
        if bv[m] > 1e-6:
            distribucion.append(
                {"Aleacion": "B", "Mineral": str(m), "Toneladas": round(bv[m], 6)}
            )

    leyes_a = _leyes(x_av, av, rows, minerals)
    leyes_b = _leyes(x_bv, bv, rows, minerals)

    radar_a = _banda_radar(leyes_a, spec_a)
    radar_b = _banda_radar(leyes_b, spec_b)

    eps = 1e-4
    infactible_solver = status == pulp.LpStatusInfeasible
    utilidad_nula = utilidad <= eps
    sin_produccion = x_av <= eps and x_bv <= eps

    es_factible = (
        status == pulp.LpStatusOptimal
        and utilidad > eps
        and not infactible_solver
    )

    mensaje: str | None = None
    if infactible_solver:
        es_factible = False
        mensaje = (
            "El conjunto de restricciones es infactible: no existe una mezcla que cumpla "
            "simultáneamente las especificaciones y los inventarios."
        )
    elif status == pulp.LpStatusUnbounded:
        es_factible = False
        mensaje = "El modelo quedó no acotado; revise costos, precios y datos."
    elif status != pulp.LpStatusOptimal:
        es_factible = False
        mensaje = f"El solver no terminó en óptimo ({_estado_es(status)})."
    elif utilidad_nula or sin_produccion:
        es_factible = False
        mensaje = (
            "La utilidad óptima es cero o no se produce volumen: las restricciones de pureza "
            "y/o la estructura de costos/precios impiden un plan rentable. Relaje límites o "
            "ajuste la matriz de minerales."
        )

    sugerencias_cambio: list[dict[str, Any]] = []
    violacion_total_relajacion: float | None = None
    resumen_relajacion: str | None = None

    if not es_factible:
        vtot, sugs, _, _ = _resolver_relajacion(payload)
        violacion_total_relajacion = round(vtot, 8)
        sugerencias_cambio = sugs[:8]
        if vtot <= 1e-8:
            resumen_relajacion = (
                "El modelo auxiliar de holguras encontró violación nula: revise datos o "
                "estados numéricos del solver principal."
            )
        elif sugs:
            top = sugs[0]
            resumen_relajacion = (
                f"Inteligencia operativa: el cuello más fuerte está en Aleación {top['aleacion']}, "
                f"metal {top['metal']} ({top['limite']}). {top['mensaje']}"
            )
        else:
            resumen_relajacion = (
                "No se generaron sugerencias automáticas; revise inventarios y costos frente a precios."
            )

    out: dict[str, Any] = {
        "es_factible": es_factible,
        "mensaje": mensaje,
        "utilidad_maxima_usd": round(utilidad, 2),
        "estado_optimizacion": _estado_es(status),
        "estado_codigo": status,
        "toneladas_aleacion": {"A": round(x_av, 6), "B": round(x_bv, 6)},
        "distribucion_toneladas": distribucion,
        "leyes_porcentaje": {"A": leyes_a, "B": leyes_b},
        "radar": {"aleacion_a": radar_a, "aleacion_b": radar_b},
        "sugerencias_cambio": sugerencias_cambio,
        "violacion_total_relajacion": violacion_total_relajacion,
        "resumen_relajacion": resumen_relajacion,
    }

    return out


@app.get("/")
def read_root():
    return {"message": "API activa", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/optimizar")
def optimizar(body: OptimizarRequest):
    try:
        return construir_y_resolver(body)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
