# AlloyLab Pro - Arquitectura de Componentes

## 📊 Estructura de 5 Filas

### **FILA 1: TopBar.tsx**
Header sticky con:
- Logo "AlloyLab" con ícono naranja
- Navegación (Simulador, Historial)
- Indicador de conexión
- Responsive en mobile

```
Ubicación: /components/alloylab/TopBar.tsx
Estilos: bg-[#1A1D24] border-slate-800
```

---

### **FILA 2: Inputs Dinámicos (Layout 70/30)**

#### **Left (Col-span-8): MaterialsPanel.tsx + EditableGrid.tsx**
Panel editable para gestionar materiales:
- **Grid interactivo** de materiales con columnas dinámicas
- **Columnas**: Material, $/kg, %A, %B, %C, etc.
- **FIX CRÍTICO**: Inputs numéricos sin bug "010"
  - Inputs controlados de texto
  - En focus: permite vaciar
  - En blur: formatea con `parseFloat()` para quitar ceros

```typescript
// Ejemplo de uso
<NumericInputField
  value={material.costPerKg}
  onChange={(v) => setField(v)}  // Permite "010", "1", etc
  onBlur={(v) => setField(parseFloat(v) || 0)}  // Formatea al salir
/>
```

**Botones**:
- "+ Elemento" - agregar material
- "+ Material" - agregar elemento químico

#### **Right (Col-span-4): TargetAlloyPanel.tsx**
Aleación objetivo con UI mejorada:
- **3 Sliders interactivos** (framer-motion):
  - % A (0-100)
  - % B (0-100)
  - % C (0-100)
- **Barra de progreso dinámica**:
  - Verde si suma ≤ 100%
  - Roja si suma > 100%
  - Muestra exceso
- **Card resumen** con valores actuales

---

### **FILA 3: ControlBar.tsx**
Panel de control con inputs y exportación:

**Inputs** (4 campos):
1. Nombre Simulación (texto)
2. Margen % (0-100)
3. Notas (texto largo)
4. Botón "Simular" (bg-orange-500)

**Dropdown Excel**:
- Exportar XLSX (genera archivo con simulación)
- Importar XLSX (lee datos de archivo)

---

### **FILA 4: Motor Guía + KPIs**

#### **Left (Col-span-8): KPIsPanel.tsx**
4 tarjetas KPI animadas con:
- **Costo Total Lote** (USD)
- **Costo por kg** (USD/kg)
- **Precio Venta** (USD)
- **Error vs Objetivo** (%)

Cada card tiene:
- Ícono de estado (check/alert)
- Animación de entrada (stagger)
- Color verde si factible, rojo si no

#### **Right (Col-span-4): SmartAdvisor.tsx**
Panel asesor inteligente prescriptivo:

**Lógica de recomendaciones**:
1. **Infactibilidad** ❌: "Imposible alcanzar pureza. Sugiera: Aumente %C o importe Material con mayor pureza"
2. **Costo Alto** 💡: "El Material 2 es caro. Intente relajar restricciones %B"
3. **Error Alto** 🔧: "Error alto vs objetivo. Ajuste límites de composición"
4. **Exitoso** ✅: "Excelente optimización, dentro de especificaciones"

---

### **FILA 5: Visualización Avanzada**

#### **Left (Col-span-6): CompositionChart.tsx**
Gráfico recharts de barras apiladas:
- Series: "Objetivo" vs "Logrado"
- Composición: %A (naranja), %B (verde), %C (azul)
- Leyenda con colores
- Tooltips oscuros

#### **Right (Col-span-6): Ingot3D.tsx**
Visualización 3D React Three Fiber:
- **Lingote cilíndrico 3D** (CylinderGeometry)
- **Material reactivo** según resultados:
  - ✅ **Exitoso** (error < 2%): Metal pulido dorado, metalness 0.95, roughness 0.1
  - ⚠️ **Advertencia** (2-10% error): Gris oscuro, metalness 0.6, roughness 0.7
  - ❌ **Infactible** (error > 10% o no factible): Rojo oscuro, metalness 0.3, roughness 0.95

**Interactividad**:
- OrbitControls: rotación manual con mouse
- AutoRotate: rotación automática 2 deg/s
- PresentationControls: zoom y pan preconfigurados
- Luces: Ambient + 2 Point lights (blanca y naranja)

---

## 🎨 Paleta de Colores

| Elemento | Color | HEX |
|----------|-------|-----|
| Fondo global | Muy oscuro | `#111317` |
| Cards | Oscuro | `#1A1D24` |
| Bordes | Slate | `#475569` (slate-700) |
| Texto principal | Claro | `#e2e8f0` (slate-200) |
| Acentos | Naranja | `#ea580c` (orange-500) |
| Éxito | Verde | `#10b981` (green-500) |
| Error | Rojo | `#dc2626` (red-600) |
| Metal pulido | Oro | `#c0a080` |
| Metal defectuoso | Rojo oscuro | `#8b0000` |

---

## 🔧 Stack Tecnológico

```json
{
  "framework": "Next.js 16.2.6 (App Router)",
  "ui": "Tailwind CSS 4",
  "animations": "framer-motion 11.0.0",
  "charts": "recharts 3.8.1",
  "3d": ["three r128", "@react-three/fiber 8.15.0", "@react-three/drei 9.100.0"],
  "icons": "lucide-react 0.263.0",
  "excel": "xlsx 0.18.5",
  "http": "axios 1.16.0"
}
```

---

## 📝 Guía de Uso por Componente

### EditableGrid.tsx
```typescript
<EditableGrid
  materials={materials}  // Array de {id, name, costPerKg, composition}
  onMaterialsChange={handleMaterialsUpdate}
  elements={['A', 'B', 'C']}  // Elementos químicos
  onElementsChange={handleElementsUpdate}
/>
```

**Fix crítico de "010"**:
- `NumericInputField` es un componente memo
- Input type="text" con inputMode="decimal"
- onChange: permite cualquier valor
- onBlur: formatea con parseFloat

### TargetAlloyPanel.tsx
- Sliders con step 0.1 (precisión 0.1%)
- Animación al cambiar valor (scale 1 → 1.1 → 1)
- Progress bar anima con spring damping 15

### SmartAdvisor.tsx
- Actualiza automáticamente cuando `resultados` cambia
- Máximo 3-4 recomendaciones simultáneas
- useMemo para optimizar cálculos

### Ingot3D.tsx
- Wrapped en Suspense con fallback "Cargando 3D..."
- Canvas fijo 380px de altura
- AutoRotate siempre ON, click-drag para control manual

---

## 🚀 Instalación de Dependencias

```bash
npm install framer-motion @react-three/fiber @react-three/drei three lucide-react xlsx
```

O usar el `package.json` actualizado incluido.

---

## 💡 Clean Code Practices Aplicadas

✅ **Componentes memorizados** para inputs pesados  
✅ **useMemo/useCallback** para optimización  
✅ **Type safety** con TypeScript e interfaces explícitas  
✅ **Separación de responsabilidades** por componente  
✅ **Patrón de composición** (panel → subcomponents)  
✅ **Nombres descriptivos** en español/inglés claro  
✅ **JSDoc comments** en funciones críticas  
✅ **Tailwind utilities** en lugar de CSS custom  
✅ **No props drilling** - usa context si necesita  

---

## 📌 Próximos Pasos

1. Instalar dependencias: `npm install`
2. Verificar que backend en :8000 esté disponible
3. Revisar types en `/lib/types.ts` coincidan con API
4. Ejecutar: `npm run dev`
5. Navegar a `/simulator`

---

*Generado por AlloyLab Pro Architect - v1.0*
