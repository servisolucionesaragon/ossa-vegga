# OSSA & VEGA — Portal web

Portal de **OSSA & VEGA Seguros**, agencia de seguros con el lema *"Liderando con Sentido"*. El sitio tiene dos páginas:

- **Landing principal** (`/`): presenta la agencia, su filosofía, los frentes de impacto, el Fondo de Impacto y los datos de contacto.
- **Calculadora del Fondo de Impacto** (`/calculadora/`): calcula y registra el rubro de impacto de cada póliza.

## Enlaces

- Sitio publicado (Cloudflare Workers): https://ossa-vegga.servisolucionesti.workers.dev
- Repositorio: https://github.com/servisolucionesaragon/ossa-vegga

## Estructura del proyecto

```
index.html                       Landing principal
calculadora/index.html           Calculadora Fondo de Impacto
js/fondo-impacto.js              Lógica de cálculo (sin DOM)
img/                             Logos, fotografía del equipo e iconos de redes
.assetsignore                    Archivos que no se publican (docs, documentos)
.gitignore                       Archivos que no se versionan
README.md                        Este archivo
```

Carpetas que **no se versionan ni se publican** (documentación interna y documentos comerciales):

- `docs/`: contexto del negocio, brief de la landing, enfoque de charlas y memoria del proyecto.
- `documentos/`: documentos fuente del modelo (PDF y Word).

## Landing principal (`index.html`)

Secciones, en orden:

1. **Inicio (hero):** "Agencia de Seguros", el lema *"Seguros con propósito. Bienestar que transforma."*, una presentación breve de la agencia, botones para simular y contactar, y el logo animado sobre fondo blanco.
2. **El Fondo de Impacto:** título "Convertimos oportunidades comerciales en bienestar y desarrollo.", tres párrafos explicativos y el flujo de cuatro pasos.
3. **Frentes de impacto:** Bienestar humano, Prevención y protección, Sostenibilidad y medio ambiente, y Crecimiento y desarrollo, con una nota de que cada empresa prioriza según su realidad.
4. **Módulo de Crecimiento:** el "Shark Tank de impacto".
5. **Por qué OSSA & VEGA:** dos tarjetas, *Impacto estructurado* y *Compromiso con el futuro*.
6. **Nuestra filosofía empresarial:** "Crecer juntos es crecer mejor." y cuatro compromisos: propósito que trasciende, relaciones que construyen valor, liderazgo con sentido y cultura de impacto.
7. **Contacto:**
   - Tarjeta de equipo en tres columnas: fundador, fotografía del equipo y cofundadora.
   - Tarjetas de Dirección (con ícono de mapa), Horario y Redes sociales (iconos de WhatsApp, Facebook, Instagram, LinkedIn y Linktree).
8. **Pie de página:** nombre de la agencia y créditos de desarrollo.

### Menú y navegación

Menú superior: Calculadora, Fondo de Impacto, Frentes, Crecimiento y Contacto. En pantallas de hasta 760 px el menú se muestra como **hamburguesa**; se cierra al elegir una opción o con la tecla Escape.

El logo y el nombre de la agencia llevan al inicio.

### Animaciones

Los textos, tarjetas, pasos y la fotografía aparecen al hacer scroll, con un efecto de subida suave (fade up) o de aparición (fade in), con retardos escalonados entre tarjetas. Si el usuario tiene activado "reducir movimiento" en su sistema, las animaciones no se aplican.

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

1. **Datos de la empresa y la póliza:** empresa asegurada (texto libre, sin sugerencias precargadas), número de póliza o cotización, compañía aseguradora, ramo de seguro y vigencia.
2. **Parámetros financieros:** prima en pesos colombianos (con separador de miles), % de comisión pactada y % de retefuente, entre 0 y 100, con botones rápidos.
3. **Asignación al plan de trabajo anual:**
   - Frente de impacto (Bienestar, Prevención, Sostenibilidad o Crecimiento), con la lista de proyectos sugeridos para ese frente.
   - Tema de charla, agrupado en personales, organizacionales y sociales y de impacto.
   - Actividad o destino del fondo (texto libre).
   - Desplegable con el enfoque de las charlas: estructura de cinco pasos, duración y materiales.

Los campos de empresa, póliza y prima empiezan vacíos. El porcentaje de comisión empieza en 15% y el de retefuente en **11%**.

### Desglose en vivo

El panel de la derecha recalcula al escribir y muestra los cinco pasos, el fondo de impacto, su equivalente sobre la prima y el margen de la agencia.

### Simulador rápido

Botón **Simulador**: calcula con una prima de prueba, sin alterar el formulario. Tiene valores rápidos de prima y deslizadores de comisión e impuestos. El botón **Ir a registrar póliza** copia los valores al formulario.

### Generar reporte

Botón **Generar reporte**: valida los campos obligatorios (empresa, póliza y prima) y abre una vista con el logo, todos los datos, el desglose y el tema de charla. Se puede imprimir o guardar como PDF desde el navegador. Al imprimir solo se imprime el reporte, sin hojas en blanco.

### Otros controles

- **Restablecer:** vacía empresa, póliza, prima, actividad y tema, y devuelve los porcentajes a sus valores iniciales.
- **Tema claro / oscuro:** botón con el símbolo ◐.
- **Logo y nombre de la agencia:** llevan a la landing.

### Pie de página

Cuatro tarjetas: **Contacto** (fundador y cofundadora), **Dirección** (con ícono de mapa), **Horario** y **Redes sociales** (iconos de WhatsApp, Facebook, Instagram, LinkedIn y Linktree). Debajo, una banda delgada a todo el ancho con el crédito de desarrollo y el nombre de la agencia.

## Contacto y redes

- **Fundador:** Mateo Ossa Vega, WhatsApp 310 548 6395, mateo@ossavega.com.
- **Cofundadora:** Paula Andrea Arias, WhatsApp 301 685 6861, paula@ossavega.com.
- **Dirección:** Carrera 84F # 3C-40, Barrio Belén, Medellín, Antioquia, Colombia. El ícono de mapa abre la ubicación en Google Maps.
- **Horario:** lunes a jueves de 9:00 a.m. a 5:00 p.m.; viernes de 9:00 a.m. a 2:00 p.m.; sábados, domingos y festivos cerrado.
- **Redes:** Facebook, Instagram, WhatsApp, LinkedIn y Linktree, cada una en una pestaña nueva.

## Logos e imágenes

- `img/images.jpeg`: logo azul sobre fondo blanco, usado en el encabezado de ambas páginas y en el reporte. El hero de la landing también lo muestra en una tarjeta blanca.
- `img/790425311_18092511653243610_8166161408051306571_n.jpg`: logo blanco sobre fondo azul, usado como favicon.
- `img/personas.jpg`: fotografía del equipo.
- `img/facebook.png`, `img/instagram.png`, `img/whatapp.png`, `img/linkedin.png`, `img/linktree.png`: iconos de redes.
- `img/logo.jpeg`: versión anterior, sin uso.

## Identidad visual

- **Color principal:** azul del logo, `#0b6fc4`.
- **Enlace al desarrollador:** naranja, `#e85d04`.
- **Tipografía:** la del sistema.

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

El contexto del negocio, el brief de la landing, el enfoque de charlas y la memoria de decisiones están en `docs/`, fuera del repositorio. Los documentos de origen están en `documentos/`.
