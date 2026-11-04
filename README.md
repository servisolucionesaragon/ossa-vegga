# OSSA & VEGA — Portal web

Portal de **OSSA & VEGA Seguros**, agencia de seguros en Bello, Antioquia. El sitio tiene dos páginas:

- **Landing principal** (`/`): presenta la agencia y el Fondo de Impacto a las empresas aliadas.
- **Calculadora del Fondo de Impacto** (`/calculadora/`): calcula y registra el rubro de impacto de cada póliza.

## Enlaces

- Sitio publicado (Cloudflare Workers): https://ossa-vegga.servisolucionesti.workers.dev
- Repositorio: https://github.com/servisolucionesaragon/ossa-vegga

## Estructura del proyecto

```
index.html                       Landing principal
calculadora/index.html           Calculadora Fondo de Impacto
js/fondo-impacto.js              Lógica de cálculo (sin DOM)
img/                             Logos e iconos de redes sociales
.assetsignore                    Archivos que no se publican (docs, documentos)
.gitignore                       Archivos que no se versionan
README.md                        Este archivo
```

Carpetas que **no se versionan ni se publican** (documentación interna y documentos comerciales):

- `docs/`: contexto del negocio, brief de la landing, enfoque de charlas y memoria del proyecto.
- `documentos/`: documentos fuente del modelo (PDF y Word).

## Landing principal (`index.html`)

Secciones, en orden:

1. **Inicio:** propuesta de valor, botones para simular y contactar, y el logo animado a la derecha (sobre fondo blanco).
2. **El Fondo de Impacto:** cómo se financia, flujo en cuatro pasos y la cifra de referencia del 40%, con una aclaración de que no es garantía.
3. **Frentes de impacto:** Bienestar, Prevención, Sostenibilidad y Crecimiento.
4. **Módulo de Crecimiento:** el "Shark Tank de impacto".
5. **Por qué OSSA & VEGA:** inversión estructurada, proyectos medidos y atención personalizada.
6. **Contacto:** asesora, oficina, horario, botón de WhatsApp, redes sociales y enlace a la calculadora.
7. **Pie de página:** derechos y créditos de desarrollo.

Menú superior: Calculadora, Fondo de Impacto, Frentes, Crecimiento y Contacto. En pantallas de hasta 760 px el menú se muestra como **hamburguesa**; se cierra al elegir una opción o con la tecla Escape.

El logo y el nombre de la agencia llevan al inicio.

## Calculadora del Fondo de Impacto (`calculadora/index.html`)

### Regla de negocio

El fondo se calcula sobre la **comisión neta recibida por la agencia después de impuestos**, nunca sobre la prima del seguro.

| Paso | Concepto | Cálculo |
|---|---|---|
| 1 | Prima comercial | Valor facturado |
| 2 | Comisión bruta | Prima × % comisión |
| 3 | Retenciones / impuestos | Comisión bruta × % retefuente |
| 4 | Comisión neta agencia | Comisión bruta − retenciones |
| 5 | **Fondo de impacto** | Comisión neta × **40%** |
| — | Margen OSSA & VEGA | Comisión neta × 60% |

### Formulario

1. **Datos de la empresa y la póliza:** empresa asegurada (texto libre), número de póliza o cotización, compañía aseguradora, ramo de seguro y vigencia.
2. **Parámetros financieros:** prima en pesos colombianos (con separador de miles), % de comisión pactada y % de retefuente, entre 0 y 100, con botones rápidos.
3. **Asignación al plan de trabajo anual:**
   - Frente de impacto (Bienestar, Prevención, Sostenibilidad o Crecimiento), con la lista de proyectos sugeridos para ese frente.
   - Tema de charla, agrupado en personales, organizacionales y sociales y de impacto.
   - Actividad o destino del fondo (texto libre).
   - Desplegable con el enfoque de las charlas: estructura de cinco pasos, duración y materiales.

Los campos de empresa, póliza y prima empiezan vacíos. Los porcentajes empiezan en 15% de comisión y 11% de retefuente.

### Desglose en vivo

El panel de la derecha recalcula al escribir y muestra los cinco pasos, el fondo de impacto, su equivalente sobre la prima y el margen de la agencia.

### Simulador rápido

Botón **Simulador**: calcula con una prima de prueba, sin alterar el formulario. Tiene valores rápidos de prima y deslizadores de comisión e impuestos. El botón **Ir a registrar póliza** copia los valores al formulario.

### Generar reporte

Botón **Generar reporte**: valida los campos obligatorios (empresa, póliza y prima) y abre una vista con todos los datos, el desglose y el tema de charla. Se puede imprimir o guardar como PDF desde el navegador.

### Otros controles

- **Restablecer:** vacía empresa, póliza, prima, actividad y tema, y devuelve los porcentajes a sus valores iniciales.
- **Tema claro / oscuro:** botón con el símbolo ◐.
- **Logo y nombre de la agencia:** vuelven a la landing.

## Contacto y redes

Los datos de contacto aparecen en la landing y en el pie de la calculadora:

- Asesora: Paula Andrea Arias, con teléfono y correo.
- Oficina: Carrera 45 #26-162, Interior 2164, Conjunto Puerta Madera, La Gabriela, Bello, Antioquia.
- Horario: lunes a viernes de 7:00 a.m. a 6:00 p.m.; sábados de 8:00 a.m. a 12:00 p.m.; domingos y festivos cerrado.
- Enlace de Linktree de la agencia.

Iconos de redes sociales (cada uno abre la red en una pestaña nueva): Facebook, Instagram, WhatsApp y LinkedIn. Las imágenes están en `img/`.

## Logos

- `img/images.jpeg`: logo azul sobre fondo blanco, usado en el encabezado.
- `img/790425311_18092511653243610_8166161408051306571_n.jpg`: logo blanco sobre fondo azul, usado como favicon.
- `img/logo.jpeg`: versión anterior, sin uso.

## Uso local

El sitio es HTML, CSS y JavaScript estático. No requiere instalación ni compilación.

Opción 1: abrir `index.html` en el navegador.

Opción 2 (recomendada, para que las rutas se comporten como en producción), desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000 (landing) o http://localhost:8000/calculadora/ (calculadora).

## Despliegue

El repositorio está conectado a **Cloudflare Workers (Static Assets)**. Cada `push` a la rama `main` publica la nueva versión. No hay paso de compilación.

El archivo `.assetsignore` evita que se publiquen `docs/`, `documentos/` y los archivos de configuración del repositorio.

Flujo de trabajo:

1. Hacer los cambios en local.
2. Probarlos en el navegador (ver "Uso local").
3. `git add`, `git commit` y `git push origin main`.
4. Revisar el despliegue en el panel de Cloudflare y la URL publicada.

Al subir imágenes nuevas, agregarlas también con `git add`: el repositorio solo guarda lo que se añade explícitamente.

## Documentación interna

El contexto del negocio, el brief de la landing, el enfoque de charlas y la memoria de decisiones están en `docs/`, fuera del repositorio. Ver los documentos de origen en `documentos/`.
