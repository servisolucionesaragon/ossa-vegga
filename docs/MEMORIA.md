# Memoria del proyecto

Registro de decisiones, cambios y pendientes. Las entradas van de la más antigua a la más reciente. Cada entrada incluye el **porqué** para que cualquiera pueda retomar el trabajo sin depender de la conversación original.

---

## Decisiones

### D-001 · Calculadora como página estática (2026-11-03)
- **Decisión:** la primera versión es HTML + CSS + JS sin frameworks ni build.
- **Por qué:** es un prototipo para validar la lógica con el agente, se despliega sin configuración y se puede abrir con doble clic.

### D-002 · Lógica de cálculo separada en `js/fondo-impacto.js` (2026-11-03)
- **Decisión:** la fórmula vive en un módulo sin acceso al DOM.
- **Por qué:** se puede probar con Node (`require`) y reutilizar cuando haya backend o reportes.

### D-003 · Fondo calculado sobre comisión neta, no sobre prima (2026-11-03)
- **Decisión:** fondo = 40% × (comisión bruta − retenciones).
- **Por qué:** regla mandatoria de OSSA & VEGA, indicada explícitamente por el dueño del negocio.
- **Verificación:** con prima $95.000.000, comisión 15% y retefuente 11% → fondo $5.073.000 (5,34% de la prima). Simulador: prima $10.000.000, 20% y 16% → $672.000.

### D-004 · Campos de empresa, póliza y prima sin valores por defecto (2026-11-03)
- **Decisión:** al abrir la página, empresa, póliza y prima están vacíos. Los porcentajes sí tienen valor inicial (15% y 11%).
- **Por qué:** cada uso es para una póliza distinta; un valor precargado puede terminar en un reporte por error.

### D-005 · Empresa asegurada como campo de texto con sugerencias (2026-11-03)
- **Decisión:** `<input>` con `<datalist>` en lugar de `<select>`.
- **Por qué:** el usuario necesita escribir empresas nuevas. Las sugerencias solo ayudan a elegir las ya conocidas.
- **Pendiente relacionado:** las empresas escritas no se guardan (ver P-02).

### D-006 · Reporte como vista imprimible, no como PDF generado (2026-11-03)
- **Decisión:** el botón "Generar reporte" muestra una vista con todos los datos y usa `window.print()` para imprimir o guardar como PDF.
- **Por qué:** no requiere librerías ni backend, y el navegador ya genera PDF de buena calidad.

### D-007 · Repositorio y despliegue (2026-11-03)
- **Decisión:** código en `servisolucionesaragon/ossa-vegga` (rama `main`), desplegado en Cloudflare Workers con conexión a Git.
- **Por qué:** el usuario quiere que cada cambio subido se publique solo. Por eso `main` debe estar siempre en estado funcional.

---

## Cambios realizados

| Fecha | Cambio |
|---|---|
| 2026-11-03 | Calculadora Fondo de Impacto: formulario de 3 secciones, desglose en vivo de 5 pasos, simulador rápido. |
| 2026-11-03 | Verificación de cálculos contra las capturas de referencia. |
| 2026-11-03 | Mover el proyecto a `Z:\SSA\Proyectos SSA\OSSA & VEGA`. |
| 2026-11-03 | Empresa asegurada editable; chips de porcentaje más visibles. |
| 2026-11-03 | Sin valores por defecto en empresa, póliza y prima. |
| 2026-11-03 | Botón "Generar reporte" con validación y vista imprimible. |
| 2026-11-03 | Repositorio Git inicial con README, CONTEXTO y MEMORIA. |

---

## Pendientes

- **P-01 · Vistas faltantes:** "Panel Principal" y "Listado & Seguimiento", que aparecen en las capturas de referencia.
- **P-02 · Persistencia:** hoy nada se guarda. Falta decidir dónde guardar pólizas y empresas (localStorage, Cloudflare D1/KV o un backend).
- **P-03 · Monitoreo:** seguimiento de la ejecución del fondo (gasto real vs. presupuestado por eje).
- **P-04 · Eje de impacto:** confirmar con el agente la lista oficial de ejes y actividades. Hoy es una lista de ejemplo.
- **P-05 · Simulador:** el valor inicial de la prima (10.000.000) y los rangos de los controles deslizantes deben confirmarse.
- **P-06 · Validación de retefuente:** confirmar si el 10% es una opción válida y si hay otros porcentajes.
- **P-07 · Verificación visual:** revisar en móvil y en modo oscuro antes de cada despliegue importante.

---

## Cómo mantener este archivo

- Al tomar una decisión que afecte cálculos, datos, despliegue o alcance, agregar una entrada `D-###`.
- Al cerrar un pendiente, moverlo a "Cambios realizados" con la fecha.
- No guardar contraseñas, tokens ni datos personales de clientes aquí.
