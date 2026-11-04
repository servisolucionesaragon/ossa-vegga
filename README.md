# OSSA & VEGA — Portal web

Portal para el agente de seguros **OSSA & VEGA**. El primer módulo es la calculadora **Fondo de Impacto**: calcula, monitorea y registra el 40% de la comisión neta post-impuestos de cada póliza, para reinvertirlo en actividades de prevención, salud y bienestar de cada cliente.

## Demo

- Despliegue (Cloudflare Workers): https://ossa-vegga.servisolucionesti.workers.dev
- Repositorio: https://github.com/servisolucionesaragon/ossa-vegga

## Estructura

```
index.html            Página principal (calculadora Fondo de Impacto)
js/fondo-impacto.js   Lógica de cálculo pura (sin DOM)
docs/CONTEXTO.md      Contexto de negocio y reglas
docs/MEMORIA.md       Registro de decisiones y cambios
README.md             Este archivo
```

## Uso local

No requiere instalación ni compilación: es HTML, CSS y JavaScript estático.

Opción 1: abrir `index.html` directamente en el navegador.

Opción 2 (recomendada, para que la página se comporte como en producción):

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000

## Calculadora Fondo de Impacto

Fórmula (la regla es obligatoria: el fondo sale de la comisión neta, nunca de la prima):

| Paso | Concepto | Cálculo |
|---|---|---|
| 1 | Prima comercial | Valor facturado |
| 2 | Comisión bruta | Prima × % comisión |
| 3 | Retenciones / impuestos | Comisión bruta × % retefuente |
| 4 | Comisión neta agencia | Comisión bruta − retenciones |
| 5 | **Fondo de impacto** | Comisión neta × **40%** |
| — | Margen OSSA & VEGA | Comisión neta × 60% |

Funciones de la pantalla:

- **Datos de empresa y póliza:** empresa asegurada (editable), número de póliza o cotización, compañía aseguradora, ramo y vigencia.
- **Parámetros:** prima (con separador de miles) y porcentajes de comisión y retefuente entre 0 y 100, con botones rápidos.
- **Asignación:** eje de impacto (Prevención, Salud, Bienestar) y actividad.
- **Simulador:** cálculo rápido sin alterar los datos del formulario.
- **Generar reporte:** vista con todos los datos y el desglose, lista para imprimir o guardar como PDF.

## Despliegue

El repositorio está conectado a **Cloudflare Workers (Pages / Static Assets)**. Cada `push` a la rama `main` despliega automáticamente la versión nueva en https://ossa-vegga.servisolucionesti.workers.dev. No hay paso de build: se sirve la carpeta tal cual.

Flujo de trabajo:

1. Hacer los cambios en local.
2. Verificar en el navegador (ver "Uso local").
3. `git add`, `git commit` y `git push origin main`.
4. Esperar el despliegue en el panel de Cloudflare y revisar la URL pública.

## Próximos pasos

Ver la sección de pendientes en [docs/MEMORIA.md](docs/MEMORIA.md).
