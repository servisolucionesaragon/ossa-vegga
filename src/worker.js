// OSSA & VEGA — API del panel: usuarios (admin / asesor), sesiones, registros y exportación CSV.
// Todo lo que no sea /api/* se sirve como sitio estático (env.ASSETS).

const SESION_MS = 12 * 60 * 60 * 1000; // 12 horas
const PBKDF2_ITER = 100000;            // máximo soportado en Workers
const FONDO_PCT = 40;

const enc = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

function hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randHex(bytes) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return hex(a);
}

async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = Uint8Array.from(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-256' }, key, 256);
  return hex(bits);
}

function iguales(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function leerCookie(request, nombre) {
  const c = request.headers.get('cookie') || '';
  const m = c.match(new RegExp('(?:^|; )' + nombre + '=([^;]+)'));
  return m ? m[1] : null;
}

function cookieSesion(token, maxAgeSeg) {
  return `sid=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeg}`;
}

async function usuarioActual(env, request) {
  const token = leerCookie(request, 'sid');
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT u.id, u.email, u.nombre, u.rol, u.activo, s.expira FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ?'
  ).bind(token).first();
  if (!row || row.expira < Date.now() || !row.activo) return null;
  return row;
}

async function leerJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function crearUsuario(env, body, rolPorDefecto) {
  const email = String(body.email || '').trim().toLowerCase();
  const nombre = String(body.nombre || '').trim();
  const password = String(body.password || '');
  const rol = body.rol || rolPorDefecto;
  if (!EMAIL_RE.test(email)) return json({ error: 'Correo no válido.' }, 400);
  if (!nombre) return json({ error: 'Escriba el nombre.' }, 400);
  if (password.length < 8) return json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, 400);
  if (rol !== 'admin' && rol !== 'asesor') return json({ error: 'Rol no válido.' }, 400);
  const salt = randHex(16);
  const hash = await hashPassword(password, salt);
  try {
    const res = await env.DB.prepare(
      'INSERT INTO usuarios (email, nombre, rol, activo, salt, hash) VALUES (?, ?, ?, 1, ?, ?)'
    ).bind(email, nombre, rol, salt, hash).run();
    return json({ id: res.meta.last_row_id }, 201);
  } catch {
    return json({ error: 'Ya existe un usuario con ese correo.' }, 409);
  }
}

// Cálculo igual al de js/fondo-impacto.js (se recalcula en el servidor para no confiar en el cliente)
function calcular(prima, comisionPct, retencionPct) {
  const bruta = Math.round((prima * comisionPct) / 100);
  const retenciones = Math.round((bruta * retencionPct) / 100);
  const neta = bruta - retenciones;
  const fondo = Math.round((neta * FONDO_PCT) / 100);
  return { bruta, retenciones, neta, fondo };
}

function csvCelda(v) {
  let s = v === null || v === undefined ? '' : String(v);
  // Evita que Excel interprete una celda como fórmula
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[;"\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

async function api(request, env, url) {
  const p = url.pathname;
  const m = request.method;

  // ----- Públicas -----
  if (p === '/api/estado' && m === 'GET') {
    const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM usuarios').first();
    return json({ hayUsuarios: r.n > 0 });
  }

  if (p === '/api/setup' && m === 'POST') {
    const body = await leerJson(request);
    if (!body) return json({ error: 'Solicitud no válida.' }, 400);
    if (!env.SETUP_TOKEN || !iguales(String(request.headers.get('x-setup-token') || ''), env.SETUP_TOKEN)) {
      return json({ error: 'Token de configuración incorrecto.' }, 403);
    }
    const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM usuarios').first();
    if (r.n > 0) return json({ error: 'Ya existe un administrador.' }, 409);
    return crearUsuario(env, { ...body, rol: 'admin' }, 'admin');
  }

  if (p === '/api/login' && m === 'POST') {
    const body = await leerJson(request);
    if (!body) return json({ error: 'Solicitud no válida.' }, 400);
    const email = String(body.email || '').trim().toLowerCase();
    const row = await env.DB.prepare('SELECT * FROM usuarios WHERE email = ?').bind(email).first();
    const generico = json({ error: 'Correo o contraseña incorrectos.' }, 401);
    if (!row || !row.activo) return generico;
    const hash = await hashPassword(String(body.password || ''), row.salt);
    if (!iguales(hash, row.hash)) return generico;
    await env.DB.prepare('DELETE FROM sesiones WHERE expira < ?').bind(Date.now()).run();
    const token = randHex(32);
    await env.DB.prepare('INSERT INTO sesiones (token, usuario_id, expira) VALUES (?, ?, ?)')
      .bind(token, row.id, Date.now() + SESION_MS).run();
    return json(
      { usuario: { id: row.id, email: row.email, nombre: row.nombre, rol: row.rol } },
      200,
      { 'set-cookie': cookieSesion(token, SESION_MS / 1000) }
    );
  }

  if (p === '/api/logout' && m === 'POST') {
    const token = leerCookie(request, 'sid');
    if (token) await env.DB.prepare('DELETE FROM sesiones WHERE token = ?').bind(token).run();
    return json({ ok: true }, 200, { 'set-cookie': cookieSesion('', 0) });
  }

  // ----- Requieren sesión -----
  const u = await usuarioActual(env, request);
  if (p === '/api/me' && m === 'GET') {
    if (!u) return json({ error: 'No autenticado.' }, 401);
    return json({ usuario: { id: u.id, email: u.email, nombre: u.nombre, rol: u.rol } });
  }
  if (!u) return json({ error: 'Inicie sesión para continuar.' }, 401);

  if (p === '/api/password' && m === 'POST') {
    const body = await leerJson(request);
    if (!body) return json({ error: 'Solicitud no válida.' }, 400);
    const row = await env.DB.prepare('SELECT salt, hash FROM usuarios WHERE id = ?').bind(u.id).first();
    const actual = await hashPassword(String(body.actual || ''), row.salt);
    if (!iguales(actual, row.hash)) return json({ error: 'La contraseña actual no es correcta.' }, 400);
    const nueva = String(body.nueva || '');
    if (nueva.length < 8) return json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' }, 400);
    const salt = randHex(16);
    const hash = await hashPassword(nueva, salt);
    await env.DB.prepare('UPDATE usuarios SET salt = ?, hash = ? WHERE id = ?').bind(salt, hash, u.id).run();
    return json({ ok: true });
  }

  // ----- Administración de usuarios (solo admin) -----
  if (p === '/api/usuarios') {
    if (u.rol !== 'admin') return json({ error: 'Solo el administrador puede gestionar usuarios.' }, 403);
    if (m === 'GET') {
      const rs = await env.DB.prepare('SELECT id, email, nombre, rol, activo, creado FROM usuarios ORDER BY nombre').all();
      return json({ usuarios: rs.results });
    }
    if (m === 'POST') {
      const body = await leerJson(request);
      if (!body) return json({ error: 'Solicitud no válida.' }, 400);
      return crearUsuario(env, body, 'asesor');
    }
  }

  const mUsuario = p.match(/^\/api\/usuarios\/(\d+)$/);
  if (mUsuario && m === 'PATCH') {
    if (u.rol !== 'admin') return json({ error: 'Solo el administrador puede gestionar usuarios.' }, 403);
    const id = parseInt(mUsuario[1], 10);
    const body = await leerJson(request);
    if (!body) return json({ error: 'Solicitud no válida.' }, 400);
    if (id === u.id && body.activo === false) return json({ error: 'No puede desactivar su propio usuario.' }, 400);
    if (id === u.id && body.rol && body.rol !== 'admin') return json({ error: 'No puede quitarse el rol de administrador.' }, 400);
    const sets = [];
    const vals = [];
    if (typeof body.activo === 'boolean') { sets.push('activo = ?'); vals.push(body.activo ? 1 : 0); }
    if (body.rol === 'admin' || body.rol === 'asesor') { sets.push('rol = ?'); vals.push(body.rol); }
    if (body.nombre && String(body.nombre).trim()) { sets.push('nombre = ?'); vals.push(String(body.nombre).trim()); }
    if (body.password) {
      if (String(body.password).length < 8) return json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, 400);
      const salt = randHex(16);
      sets.push('salt = ?', 'hash = ?');
      vals.push(salt, await hashPassword(String(body.password), salt));
    }
    if (!sets.length) return json({ error: 'Nada que actualizar.' }, 400);
    vals.push(id);
    await env.DB.prepare(`UPDATE usuarios SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
    if (typeof body.activo === 'boolean' && !body.activo) {
      await env.DB.prepare('DELETE FROM sesiones WHERE usuario_id = ?').bind(id).run();
    }
    return json({ ok: true });
  }

  // ----- Registros (admin y asesor ven todos) -----
  if (p === '/api/registros' && m === 'GET') {
    const rs = await env.DB.prepare(
      `SELECT r.id, r.creado, r.empresa, r.eje, r.tema, r.actividad, r.prima_total, r.comision_neta_total, r.fondo_total, us.nombre AS asesor
       FROM registros r JOIN usuarios us ON us.id = r.usuario_id ORDER BY r.id DESC LIMIT 500`
    ).all();
    const ps = await env.DB.prepare(
      'SELECT registro_id, numero, compania, ramo, vigencia_inicio, vigencia_fin, prima, comision_pct, retencion_pct, fondo FROM polizas ORDER BY id'
    ).all();
    const porRegistro = new Map();
    for (const pol of ps.results) {
      if (!porRegistro.has(pol.registro_id)) porRegistro.set(pol.registro_id, []);
      porRegistro.get(pol.registro_id).push(pol);
    }
    const registros = rs.results.map((r) => ({ ...r, polizas: porRegistro.get(r.id) || [] }));
    return json({ registros });
  }

  if (p === '/api/registros' && m === 'POST') {
    const body = await leerJson(request);
    if (!body) return json({ error: 'Solicitud no válida.' }, 400);
    const empresa = String(body.empresa || '').trim();
    if (!empresa) return json({ error: 'Falta el nombre de la empresa.' }, 400);
    if (!Array.isArray(body.polizas) || body.polizas.length === 0 || body.polizas.length > 50) {
      return json({ error: 'Debe registrar entre 1 y 50 pólizas.' }, 400);
    }
    const filas = [];
    let tPrima = 0, tNeta = 0, tFondo = 0;
    for (const pol of body.polizas) {
      const numero = String(pol.numero || '').trim();
      const prima = Math.round(Number(pol.prima));
      const c = Number(pol.comisionPct);
      const r = Number(pol.retencionPct);
      if (!numero) return json({ error: 'Cada póliza necesita número o cotización.' }, 400);
      if (!Number.isFinite(prima) || prima <= 0) return json({ error: 'Cada póliza necesita una prima mayor a cero.' }, 400);
      if (!Number.isFinite(c) || c < 0 || c > 100 || !Number.isFinite(r) || r < 0 || r > 100) {
        return json({ error: 'Los porcentajes deben estar entre 0 y 100.' }, 400);
      }
      const x = calcular(prima, c, r);
      tPrima += prima; tNeta += x.neta; tFondo += x.fondo;
      filas.push({ numero, compania: String(pol.compania || ''), ramo: String(pol.ramo || ''),
        vigIni: String(pol.vigIni || ''), vigFin: String(pol.vigFin || ''), prima, c, r, x });
    }
    const res = await env.DB.prepare(
      'INSERT INTO registros (usuario_id, empresa, eje, tema, actividad, prima_total, comision_neta_total, fondo_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(u.id, empresa, String(body.eje || ''), String(body.tema || ''), String(body.actividad || ''), tPrima, tNeta, tFondo).run();
    const registroId = res.meta.last_row_id;
    await env.DB.batch(filas.map((f) => env.DB.prepare(
      `INSERT INTO polizas (registro_id, numero, compania, ramo, vigencia_inicio, vigencia_fin, prima, comision_pct, retencion_pct, comision_bruta, retenciones, comision_neta, fondo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(registroId, f.numero, f.compania, f.ramo, f.vigIni, f.vigFin, f.prima, f.c, f.r, f.x.bruta, f.x.retenciones, f.x.neta, f.x.fondo)));
    return json({ id: registroId }, 201);
  }

  if (p === '/api/export.csv' && m === 'GET') {
    const rs = await env.DB.prepare(
      `SELECT r.id, r.creado, us.nombre AS asesor, r.empresa, r.eje, r.tema, r.actividad,
              p.numero, p.compania, p.ramo, p.vigencia_inicio, p.vigencia_fin, p.prima, p.comision_pct, p.retencion_pct,
              p.comision_bruta, p.retenciones, p.comision_neta, p.fondo
       FROM polizas p JOIN registros r ON r.id = p.registro_id JOIN usuarios us ON us.id = r.usuario_id
       ORDER BY r.id, p.id`
    ).all();
    const cab = ['Registro', 'Fecha', 'Asesor', 'Empresa', 'Frente', 'Tema de charla', 'Actividad',
      'Póliza', 'Compañía', 'Ramo', 'Vigencia inicio', 'Vigencia fin', 'Prima (COP)', '% Comisión',
      '% Retefuente', 'Comisión bruta (COP)', 'Retenciones (COP)', 'Comisión neta (COP)', 'Fondo de impacto (COP)'];
    const lineas = [cab.map(csvCelda).join(';')];
    for (const f of rs.results) {
      lineas.push([f.id, f.creado, f.asesor, f.empresa, f.eje, f.tema, f.actividad, f.numero, f.compania, f.ramo,
        f.vigencia_inicio, f.vigencia_fin, f.prima, f.comision_pct, f.retencion_pct, f.comision_bruta,
        f.retenciones, f.comision_neta, f.fondo].map(csvCelda).join(';'));
    }
    const fecha = new Date().toISOString().slice(0, 10);
    return new Response('﻿' + lineas.join('\r\n'), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="registros-ossa-vega-${fecha}.csv"`,
        'cache-control': 'no-store',
      },
    });
  }

  return json({ error: 'No encontrado.' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await api(request, env, url);
    } catch (e) {
      return json({ error: 'Error interno del servidor.' }, 500);
    }
  },
};
