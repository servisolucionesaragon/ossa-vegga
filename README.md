# OSSA & VEGA — Portal web

Portal de **OSSA & VEGA Seguros**, agencia de seguros con el lema *"Liderando con Sentido"*. El sitio tiene cuatro partes:

- **Landing principal** (`/`): presenta la agencia, su filosofía, los frentes de impacto, el Fondo de Impacto y los datos de contacto.
- **Calculadora del Fondo de Impacto** (`/calculadora/`): calcula el rubro de impacto de una o varias pólizas por empresa, y guarda el registro.
- **Acceso** (`/acceso/`): inicio de sesión del personal. El primer ingreso crea al administrador.
- **Panel de registros** (`/panel/`): para usuarios con sesión. Consulta registros, exporta a Excel y, para el administrador, gestiona usuarios y copias de seguridad.

## Enlaces

- Sitio publicado (Cloudflare Workers): https://ossa-vegga.servisolucionesti.workers.dev
- Repositorio: https://github.com/servisolucionesaragon/ossa-vegga

## Estructura del proyecto

```
index.html                       Landing principal
calculadora/index.html           Calculadora Fondo de Impacto
acceso/index.html                Inicio de sesión y creación del primer administrador
panel/index.html                 Panel de registros, usuarios y copias de seguridad
js/fondo-impacto.js              Lógica de cálculo (sin DOM)
src/worker.js                    API (Cloudflare Worker): usuarios, sesiones, registros, exportación y copias
migrations/0001_init.sql         Esquema de la base de datos D1
wrangler.jsonc                   Configuración del Worker, los archivos estáticos y la base D1
img/                             Logos, fotografía del equipo e iconos de redes
.assetsignore                    Archivos que no se publican (docs, documentos, src, migrations)
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
6. **Nuestra filosofía empresarial:** "Crecer juntos es crecer mejor." y cuatro compromisos.
7. **Contacto:** tarjeta de equipo en tres columnas (fundador, fotografía y cofundadora), Dirección con ícono de mapa, Horario y Redes sociales.
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

1. **Datos de la empresa:** empresa asegurada (texto libre).
2. **Pólizas de la empresa:** cada póliza tiene su propio número o cotización, compañía aseguradora, ramo, vigencia, prima (con separador de miles), % de comisión pactada y % de retefuente (entre 0 y 100, con botones rápidos). Se agregan con **"+ Agregar póliza"** y se quitan con **"Eliminar"**; siempre queda al menos una.
3. **Asignación al plan de trabajo anual** (una sola para todas las pólizas): frente de impacto (con la lista de proyectos sugeridos), tema de charla y actividad o destino del fondo.
4. **Enfoque de las charlas:** desplegable con la estructura de cinco pasos, duración y materiales.

Los campos de empresa, póliza y prima empiezan vacíos. El porcentaje de comisión empieza en 15% y el de retefuente en **11%**.

### Desglose en vivo

El panel de la derecha recalcula al escribir. Muestra los cinco pasos con el total de todas las pólizas, el fondo total, su equivalente sobre la prima total y el fondo de cada póliza.

### Simulador rápido

Botón **Simulador**: calcula con una prima de prueba, sin alterar el formulario. Tiene valores rápidos de prima y deslizadores de comisión e impuestos. El botón **Ir a registrar póliza** agrega una póliza nueva con esos valores.

### Generar reporte

Botón **Generar reporte**: valida los campos obligatorios y abre una vista con el logo, la empresa, una tabla de pólizas, el desglose total y la asignación. Se puede imprimir o guardar como PDF; al imprimir solo se imprime el reporte.

### Guardar registro

Botón **Guardar registro**: envía la empresa y sus pólizas al servidor, que vuelve a calcular los montos y los guarda a nombre del usuario con sesión iniciada. Si no hay sesión, redirige a `/acceso/`.

### Otros controles

- **Restablecer:** vacía empresa, actividad y tema, y deja una póliza nueva con los porcentajes iniciales.
- **Tema claro / oscuro:** botón con el símbolo ◐.
- **Panel:** enlace al panel de registros.
- **Logo y nombre de la agencia:** llevan a la landing.

### Pie de página

Cuatro tarjetas: **Contacto** (fundador y cofundadora), **Dirección** (con ícono de mapa), **Horario** y **Redes sociales**. Debajo, una banda delgada a todo el ancho con el crédito de desarrollo y el nombre de la agencia.

## Acceso y roles (`/acceso/` y `/panel/`)

Hay dos roles:

- **Administrador:** todo lo del asesor, más crear y desactivar usuarios, cambiar contraseñas de otros usuarios, descargar copias de seguridad, restaurar copias y borrar registros.
- **Asesor:** ve todos los registros, los exporta a Excel, consulta la simulación y genera reportes. No puede gestionar usuarios ni copias.

### Primer ingreso

En `/acceso/`, si todavía no hay usuarios, aparece el formulario **Crear administrador**. Pide el token de configuración (el secreto `SETUP_TOKEN` configurado en Cloudflare), el nombre, el correo y una contraseña de al menos 8 caracteres. Solo funciona mientras no exista ningún usuario.

### Iniciar y cerrar sesión

Con correo y contraseña en `/acceso/`. La sesión dura 12 horas y se guarda en una cookie `HttpOnly`. **Cerrar sesión** está en el panel.

### Panel de registros (`/panel/`)

- **Registros guardados:** tabla con fecha, asesor, empresa, pólizas, frente, prima total y fondo total. El botón **Ver simulación** muestra el desglose de cada póliza y los totales, con el botón **Generar reporte**.
- **Exportar a Excel (CSV):** descarga un archivo separado por punto y coma, con una fila por póliza. Se abre directamente en Excel.
- **Cambiar contraseña:** para cualquier usuario.
- **Usuarios (solo administrador):** crear un asesor o administrador con contraseña inicial, activar o desactivar y cambiar la contraseña de otro usuario. No se puede desactivar ni quitar el rol de administrador a uno mismo.
- **Copias de seguridad (solo administrador):**
  - **Descargar copia:** archivo JSON con todos los registros y pólizas. No incluye usuarios ni contraseñas.
  - **Restaurar desde copia:** reemplaza todos los registros por los de la copia, previa confirmación escribiendo `RESTAURAR`. Los registros se reasignan por correo de asesor; si el correo ya no existe, quedan a nombre del administrador que restaura.
  - **Borrar todos los registros:** ofrece descargar una copia antes y pide escribir `BORRAR`.

## Base de datos y API

- **Base de datos:** Cloudflare D1 (`ossa-vega-db`), con las tablas `usuarios`, `sesiones`, `registros` y `polizas`. El esquema está en `migrations/0001_init.sql`.
- **API:** `src/worker.js`, en las rutas `/api/*`. El resto de rutas se sirven como sitio estático.
- **Contraseñas:** PBKDF2-SHA256 con 100 000 iteraciones y sal aleatoria.
- **Cálculos:** el servidor recalcula los montos con la misma fórmula antes de guardar.

Rutas principales de la API:

| Método y ruta | Quién | Para qué |
|---|---|---|
| `GET /api/estado` | Público | Indica si ya existe un usuario |
| `POST /api/setup` | Público con token | Crea el primer administrador |
| `POST /api/login`, `POST /api/logout` | Público / sesión | Inicia y cierra sesión |
| `GET /api/me` | Sesión | Usuario actual |
| `POST /api/password` | Sesión | Cambia la contraseña propia |
| `GET /api/registros` | Sesión | Lista los últimos 500 registros con sus pólizas |
| `POST /api/registros` | Sesión | Guarda una empresa con sus pólizas |
| `GET /api/export.csv` | Sesión | Exporta a CSV para Excel |
| `GET/POST /api/usuarios`, `PATCH /api/usuarios/:id` | Administrador | Gestión de usuarios |
| `GET /api/admin/backup` | Administrador | Descarga la copia de seguridad |
| `POST /api/admin/restaurar` | Administrador | Restaura una copia |
| `POST /api/admin/borrar-registros` | Administrador | Borra todos los registros |

## Logos e imágenes

- `img/images.jpeg`: logo azul sobre fondo blanco, usado en el encabezado de las páginas y en el reporte. El hero de la landing también lo muestra en una tarjeta blanca.
- `img/790425311_18092511653243610_8166161408051306571_n.jpg`: logo blanco sobre fondo azul, usado como favicon.
- `img/personas.jpg`: fotografía del equipo.
- `img/facebook.png`, `img/instagram.png`, `img/whatapp.png`, `img/linkedin.png`, `img/linktree.png`: iconos de redes.
- `img/logo.jpeg`: versión anterior, sin uso.

## Identidad visual

- **Color principal:** azul del logo, `#0b6fc4`.
- **Enlace al desarrollador:** naranja, `#e85d04`.
- **Tipografía:** la del sistema.

## Uso local

El sitio es HTML, CSS y JavaScript estático. La landing y la calculadora funcionan abriéndolas en el navegador. El acceso, el panel y el guardado de registros necesitan la API, así que deben probarse con `wrangler dev` o en el sitio publicado.

Para ver la landing y la calculadora desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000 (landing) o http://localhost:8000/calculadora/ (calculadora).

## Configuración de Cloudflare

Necesita, en la cuenta de Cloudflare del proyecto:

1. La base D1 `ossa-vega-db` con el esquema aplicado (`migrations/0001_init.sql`).
2. El secreto `SETUP_TOKEN`, usado una sola vez para crear el primer administrador:

```bash
npx.cmd wrangler secret put SETUP_TOKEN --name ossa-vegga
```

En PowerShell use `npx.cmd`, porque `npx` bloquea scripts por la política de ejecución.

Para aplicar el esquema a la base remota, con la cuenta configurada en `CLOUDFLARE_ACCOUNT_ID`:

```bash
cf d1 migrations apply <id-de-la-base> --dir migrations
```

## Despliegue

El repositorio está conectado a **Cloudflare Workers** con archivos estáticos y el Worker de `src/worker.js`. Cada `push` a la rama `main` publica la nueva versión.

El archivo `.assetsignore` evita que se publiquen `docs/`, `documentos/`, `src/`, `migrations/` y `wrangler.jsonc`.

Flujo de trabajo:

1. Hacer los cambios en local.
2. Probarlos en el navegador (ver "Uso local").
3. `git add`, `git commit` y `git push origin main`.
4. Revisar el despliegue en el panel de Cloudflare y la URL publicada.

Al subir imágenes nuevas, agregarlas también con `git add`: el repositorio solo guarda lo que se añade explícitamente.

## Documentación interna

El contexto del negocio, el brief de la landing, el enfoque de charlas y la memoria de decisiones están en `docs/`, fuera del repositorio. Los documentos de origen están en `documentos/`.
