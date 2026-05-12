"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [resultados, setResultados] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  const optimizarModelo = async () => {
    setCargando(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/optimizar");
      setResultados(response.data);
    } catch (error) {
      console.error("Error al conectar con la API", error);
      alert("Hubo un error al conectar con el backend.");
    }
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Dashboard de Optimización
        </h1>
        <p className="text-gray-600 mb-8">
          Resolución del problema de Mezcla de Aleaciones mediante Programación Lineal (Python + Next.js)
        </p>

        <button
          onClick={optimizarModelo}
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors disabled:bg-gray-400"
        >
          {cargando ? "Procesando..." : "Ejecutar Optimización"}
        </button>

        {resultados && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              ✅ Resultados del Modelo: {resultados.estado_optimizacion}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Utilidad Máxima Proyectada</h3>
                <p className="text-5xl font-extrabold text-blue-600">
                  ${resultados.utilidad_maxima_usd.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">Dólares generados al día</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Minerales (Ton.)</h3>
                <ul className="space-y-2">
                  {resultados.distribucion_toneladas.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between border-b pb-1">
                      <span>Mineral {item.Mineral} ➔ Aleación {item.Aleacion}</span>
                      <span className="font-bold">{item.Toneladas.toFixed(2)} t</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 text-sm">
              <span className="font-bold">Info:</span> Se ha generado automáticamente un archivo Excel en el servidor listo para ser importado en Power BI.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}