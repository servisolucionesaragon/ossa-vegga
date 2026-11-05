-- Usuarios del panel: rol 'admin' (gestiona usuarios) o 'asesor' (registra y exporta).
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'asesor')),
  activo INTEGER NOT NULL DEFAULT 1,
  salt TEXT NOT NULL,
  hash TEXT NOT NULL,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sesiones de inicio de sesión (token en cookie HttpOnly).
CREATE TABLE IF NOT EXISTS sesiones (
  token TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira INTEGER NOT NULL
);

-- Un registro por empresa y envío de la calculadora.
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  empresa TEXT NOT NULL,
  eje TEXT,
  tema TEXT,
  actividad TEXT,
  prima_total INTEGER NOT NULL DEFAULT 0,
  comision_neta_total INTEGER NOT NULL DEFAULT 0,
  fondo_total INTEGER NOT NULL DEFAULT 0
);

-- Pólizas de cada registro, con su cálculo (valores en pesos COP).
CREATE TABLE IF NOT EXISTS polizas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registro_id INTEGER NOT NULL REFERENCES registros(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  compania TEXT,
  ramo TEXT,
  vigencia_inicio TEXT,
  vigencia_fin TEXT,
  prima INTEGER NOT NULL,
  comision_pct REAL NOT NULL,
  retencion_pct REAL NOT NULL,
  comision_bruta INTEGER NOT NULL,
  retenciones INTEGER NOT NULL,
  comision_neta INTEGER NOT NULL,
  fondo INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_polizas_registro ON polizas(registro_id);
CREATE INDEX IF NOT EXISTS idx_registros_usuario ON registros(usuario_id);
