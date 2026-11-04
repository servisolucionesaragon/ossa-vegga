# Contexto del proyecto

## Qué es

**OSSA & VEGA** es un agente de seguros en Colombia. Este repositorio contiene su portal web. El primer módulo es el **Fondo de Impacto**.

## Propósito del Fondo de Impacto

Calcular, monitorear y ejecutar el rubro del **40% de la comisión neta post-impuestos** de cada póliza. Ese rubro se reinvierte directamente en actividades de **prevención, salud y bienestar** para cada cliente (empresa asegurada).

## Reglas de negocio

1. **Base de cálculo:** el fondo se calcula sobre la **comisión neta recibida por la agencia después de impuestos**. Nunca sobre el valor de la prima del seguro.
2. **Fórmula:**
   - Comisión bruta = prima × % comisión pactada
   - Retenciones = comisión bruta × % deducción de impuestos (retefuente)
   - Comisión neta = comisión bruta − retenciones
   - **Fondo de impacto = 40% × comisión neta**
   - Margen OSSA & VEGA = 60% × comisión neta
3. **Porcentajes válidos:** entre 0 y 100. Retefuente estándar 11%; exento 0%; 10% también aparece como opción.
4. **Moneda:** pesos colombianos (COP), con separador de miles en formato es-CO.

## Datos que captura la calculadora

- **Empresa asegurada** (texto editable, con sugerencias).
- **Número de póliza o cotización.**
- **Compañía aseguradora:** Suramericana de Seguros (Sura), Seguros Bolívar, Seguros del Estado, Liberty Seguros / HDI, Mapfre Seguros, Positiva Compañía de Seguros, Chubb Seguros Colombia, Allianz Colombia, Axa Colpatria, Equidad Seguros.
- **Ramo de seguro:** Riesgos Laborales (ARL), Vida Grupo, Salud Colectiva, Todo Riesgo Daño Material, Responsabilidad Civil, Autos y Flotas, Cumplimiento y Garantías, Transporte de Mercancías.
- **Periodo / vigencia.**
- **Prima comercial** (anual o mensual, en COP).
- **% comisión pactada agencia** y **% deducción de impuestos**.
- **Eje de impacto:** Prevención, Salud, Bienestar.
- **Actividad / destino del fondo.**

## Idioma y público

- Interfaz y textos en **español (Colombia)**.
- Usuarios: el agente y su equipo.

## Infraestructura

- **Código:** repositorio GitHub `servisolucionesaragon/ossa-vegga` (rama `main`).
- **Hosting:** Cloudflare Workers (Pages / Static Assets) conectado al repositorio. URL: `ossa-vegga.servisolucionesti.workers.dev`.
- **Stack:** HTML, CSS y JavaScript estático. Sin backend ni base de datos todavía.

## Referencias de diseño

- Capturas de la vista "Calculadora & Registro" y del "Simulador Rápido de Impacto" entregadas por el usuario. Incluyen también las vistas "Panel Principal", "Listado & Seguimiento" y el botón "Reporte", que aún no están implementadas.
