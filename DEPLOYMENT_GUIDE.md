# 🚀 AlloyLab Pro - Guía de Deployment

## 📋 Checklist Pre-Deployment

### 1. Dependencias Instaladas ✅
```bash
npm install
```

Verifica que tu `package.json` incluya:
- ✅ framer-motion 11.0.0
- ✅ @react-three/fiber 8.15.0
- ✅ @react-three/drei 9.100.0
- ✅ three r128
- ✅ lucide-react 0.263.0
- ✅ xlsx 0.18.5
- ✅ recharts 3.8.1

### 2. Variables de Entorno
Crea `.env.local`:
```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Backend Available
- Puerto: 8000
- Endpoint: `/optimizar` (POST)
- Respuesta esperada: `ApiResultados`

### 4. Archivos Creados ✅
```
frontend/
├── components/alloylab/
│   ├── TopBar.tsx
│   ├── MaterialsPanel.tsx
│   ├── EditableGrid.tsx
│   ├── TargetAlloyPanel.tsx
│   ├── ControlBar.tsx
│   ├── KPIsPanel.tsx
│   ├── SmartAdvisor.tsx
│   ├── CompositionChart.tsx
│   ├── Ingot3D.tsx
│   └── README.md (documentación)
├── lib/
│   ├── types.ts (actualizado)
│   └── alloylab-config.ts (nuevo)
├── app/
│   ├── globals.css (actualizado)
│   └── simulator/page.tsx (actualizado)
```

---

## 🏃 Ejecución Local

### Opción 1: Desarrollo
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Abre http://localhost:3000/simulator

# Terminal 2: Backend (debe estar en :8000)
# Asegúrate de que el backend esté en http://localhost:8000
```

### Opción 2: Build Producción
```bash
npm run build
npm start
```

---

## 🧪 Testing de Componentes

### Test Manual: EditableGrid (Fix "010")
1. Navega a `/simulator`
2. Mira el panel "Materiales Disponibles"
3. Click en una celda de costo
4. Escribe: `010`
5. Click afuera (blur)
6. **Esperado**: Se formatea a `10` sin el cero a la izquierda

### Test Manual: TargetAlloyPanel
1. Ajusta los sliders de %A, %B, %C
2. Observa la barra de progreso
3. Intenta sumar > 100%
4. **Esperado**: La barra se torna roja y muestra exceso

### Test Manual: Ingot3D
1. Simula un cálculo exitoso (error < 2%)
2. Observa el lingote en la esquina inferior derecha
3. **Esperado**: Tiene color dorado y brillo pulido
4. Click y arrastra para rotarlo manualmente

### Test Manual: SmartAdvisor
1. Simula un cálculo infactible
2. Observa el panel derecho arriba
3. **Esperado**: Muestra consejo rojo con recomendación

---

## 🐛 Troubleshooting

### Error: "Module not found: framer-motion"
```bash
npm install framer-motion
```

### Error: "Cannot find module @react-three/fiber"
```bash
npm install @react-three/fiber @react-three/drei three
```

### Error: "Backend not available"
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Comprueba la variable de entorno `NEXT_PUBLIC_API_BASE_URL`
- Usa la consola del navegador (F12) para ver el error

### 3D Canvas no renderiza
- Verifica que Three.js esté instalado: `npm ls three`
- Comprueba que el navegador soporta WebGL
- En Firefox, asegúrate que WebGL esté habilitado

### Los inputs "010" siguen siendo "010"
- Verifica que estés usando `NumericInputField` en EditableGrid
- Revisa que `onBlur` ejecute `parseFloat(value)`
- Abre DevTools → Console y busca errores

---

## 📊 Estructura de Datos API

La API debe retornar un objeto tipo `ApiResultados`:

```typescript
{
  es_factible: boolean;
  mensaje: string | null;
  utilidad_maxima_usd: number;
  costo_total_usd: number;          // Necesario para KPIs
  costo_por_kg: number;             // Necesario para KPIs
  precio_venta_usd: number;         // Necesario para KPIs
  error_vs_objetivo: number;        // Necesario para Ingot3D
  estado_optimizacion: string;
  composicion_lograda: {            // Necesario para CompositionChart
    A: number;
    B: number;
    C: number;
  };
  toneladas_aleacion: { A: number; B: number };
  distribucion_toneladas: Array<{
    Aleacion: string;
    Mineral: string;
    Toneladas: number;
  }>;
  leyes_porcentaje: {
    A: Record<string, number>;
    B: Record<string, number>;
  };
  radar: {
    aleacion_a: Array<{
      metal: string;
      actual: number;
      min_spec: number;
      max_spec: number;
      centro_banda: number;
    }>;
    aleacion_b: Array<{...}>;
  };
}
```

---

## 🎨 Customización de Colores

Edita `frontend/app/globals.css`:
```css
:root {
  --background: #111317;    /* Fondo global */
  --foreground: #e2e8f0;    /* Texto */
  --card-bg: #1a1d24;       /* Tarjetas */
  --border: #475569;        /* Bordes */
  --accent: #ea580c;        /* Acentos (naranja) */
}
```

O desde Tailwind en componentes:
```tsx
className="bg-[#111317]"  // Fondo custom
className="border-slate-800"  // Usar vars de Tailwind
```

---

## 📱 Responsive Design

Los componentes ya están optimizados:
- **Mobile**: TopBar se colapsa
- **Tablet**: Grid adapta a 2 columnas
- **Desktop**: 5 filas full layout

Para probar:
```bash
# Firefox DevTools: F12 → Responsive Design Mode (Ctrl+Shift+M)
# O simula en Chrome: F12 → Toggle device toolbar (Ctrl+Shift+C)
```

---

## 🔐 Seguridad & Performance

### Optimizaciones Incluidas
✅ Componentes memorizados (memo)  
✅ useMemo para cálculos pesados  
✅ useCallback para event handlers  
✅ Lazy loading con Suspense (3D)  
✅ CSS puro sin runtime  

### Recomendaciones
⚠️ Implementa CORS en backend si es necesario  
⚠️ Valida inputs en backend (no solo frontend)  
⚠️ Usa HTTPS en producción  
⚠️ Limita tamaño de archivos XLSX (max 10MB)  

---

## 📈 Métricas & Monitoreo

### Console Logs útiles
```typescript
// En SmartAdvisor.tsx
console.log("Recomendaciones:", advices);

// En Ingot3D.tsx
console.log("Material 3D:", { isFeasible, errorVsTarget });

// En EditableGrid.tsx
console.log("Material actualizado:", material);
```

### Errores que deberías vigilar
```
⚠️ Canvas context lost (WebGL)
⚠️ Memory leak (Three.js meshes)
⚠️ Infinite re-renders (React)
⚠️ CORS blocked (API calls)
```

---

## 🚢 Deployment a Producción

### Vercel (Recomendado)
```bash
# 1. Push a GitHub
git push origin main

# 2. Connect a Vercel
# https://vercel.com/new

# 3. Configure env vars en Vercel dashboard
NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com

# 4. Deploy automático en cada push
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t alloylab-pro .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=... alloylab-pro
```

### Self-Hosted
```bash
npm run build
npm start
# PM2 (recomendado)
pm2 start "npm start" --name alloylab
```

---

## 📞 Soporte & Preguntas

### Recursos
- [Next.js Docs](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [framer-motion](https://www.framer.com/motion)
- [react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- [recharts](https://recharts.org)

### Contacto Lead Frontend Architect
Para issues específicos de arquitectura, revisa:
1. `components/alloylab/README.md`
2. Console DevTools (F12)
3. Network tab para API calls

---

**AlloyLab Pro v1.0** | Última actualización: 2026-05-12
