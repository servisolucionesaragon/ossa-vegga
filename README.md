# OSSA & VEGA — Portal web

Portal para el agente de seguros **OSSA & VEGA**. El primer módulo es la calculadora **Fondo de Impacto**: calcula y registra el 40% de la comisión neta post-impuestos de cada póliza, para reinvertirlo en bienestar, prevención, sostenibilidad y crecimiento de las empresas aliadas.

## Demo

- Despliegue (Cloudflare Workers): https://ossa-vegga.servisolucionesti.workers.dev
- Repositorio: https://github.com/servisolucionesaragon/ossa-vegga

## Estructura

```
index.html            Landing principal (página de inicio)
calculadora/index.html Calculadora Fondo de Impacto (módulo)
js/fondo-impacto.js   Lógica de cálculo pura (sin DOM)
img/logo.jpeg         Logo (encabezado y favicon)
docs/                 Documentación interna (no se publica)
  CONTEXTO.md         Negocio, reglas y datos del Fondo de Impacto
  LANDING.md          Brief de la landing principal (pendiente)
  CHARLAS.md          Enfoque del plan de trabajo: charlas
  MEMORIA.md          Decisiones, cambios y pendientes
documentos/           Documentos comerciales fuente (local, no versionado)
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
- **Asignación:** frente de impacto (Bienestar, Prevención, Sostenibilidad, Crecimiento) y actividad.
- **Simulador:** cálculo rápido sin alterar los datos del formulario.
- **Generar reporte:** vista con todos los datos y el desglose, lista para imprimir o guardar como PDF.

## Despliegue

El repositorio está conectado a **Cloudflare Workers (Static Assets)**. Cada `push` a la rama `main` despliega automáticamente la versión nueva. No hay paso de build.

El archivo `.assetsignore` excluye de la publicación `docs/`, `documentos/` y los archivos de configuración. Así la documentación interna no queda accesible en la web.

Flujo de trabajo:

1. Hacer los cambios en local.
2. Verificar en el navegador (ver "Uso local").
3. `git add`, `git commit` y `git push origin main`.
4. Esperar el despliegue en el panel de Cloudflare y revisar la URL pública.

## Documentación

Empezar por [docs/CONTEXTO.md](docs/CONTEXTO.md) y revisar [docs/MEMORIA.md](docs/MEMORIA.md) para los pendientes.
