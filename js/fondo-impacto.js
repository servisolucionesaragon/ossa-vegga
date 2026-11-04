/*
 * OSSA & VEGA — Fondo de Impacto
 * Lógica de cálculo pura (sin DOM). Regla de negocio:
 *   El fondo se calcula sobre la COMISIÓN NETA recibida por la agencia
 *   (después de retenciones/impuestos), nunca sobre la prima.
 *
 *   1. Comisión bruta      = Prima × % comisión
 *   2. Retenciones         = Comisión bruta × % retefuente
 *   3. Comisión neta       = Comisión bruta − Retenciones
 *   4. Fondo de impacto    = Comisión neta × 40%
 *   5. Margen OSSA & VEGA  = Comisión neta × 60%
 */
(function (root) {
  'use strict';

  var FONDO_PCT = 40;
  var MARGEN_PCT = 60;

  function redondear(n) {
    return Math.round(n);
  }

  function validarPorcentaje(valor, nombre) {
    if (typeof valor !== 'number' || !isFinite(valor) || valor < 0 || valor > 100) {
      throw new RangeError(nombre + ' debe estar entre 0 y 100.');
    }
  }

  /**
   * @param {{prima:number, comisionPct:number, retencionPct:number}} datos
   * @returns {object} desglose completo en pesos COP
   */
  function calcular(datos) {
    var prima = Number(datos.prima);
    var comisionPct = Number(datos.comisionPct);
    var retencionPct = Number(datos.retencionPct);

    if (!isFinite(prima) || prima < 0) {
      throw new RangeError('La prima debe ser un número mayor o igual a 0.');
    }
    validarPorcentaje(comisionPct, '% Comisión pactada');
    validarPorcentaje(retencionPct, '% Deducción de impuestos');

    var comisionBruta = redondear(prima * comisionPct / 100);
    var retenciones = redondear(comisionBruta * retencionPct / 100);
    var comisionNeta = comisionBruta - retenciones;
    var fondoImpacto = redondear(comisionNeta * FONDO_PCT / 100);
    var margenOperacion = comisionNeta - fondoImpacto;
    var equivalentePrima = prima > 0
      ? Math.round(fondoImpacto / prima * 10000) / 100
      : 0;

    return {
      prima: prima,
      comisionPct: comisionPct,
      retencionPct: retencionPct,
      comisionBruta: comisionBruta,
      retenciones: retenciones,
      comisionNeta: comisionNeta,
      fondoPct: FONDO_PCT,
      fondoImpacto: fondoImpacto,
      margenPct: MARGEN_PCT,
      margenOperacion: margenOperacion,
      equivalentePrima: equivalentePrima
    };
  }

  var api = {
    calcular: calcular,
    FONDO_PCT: FONDO_PCT,
    MARGEN_PCT: MARGEN_PCT
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.FondoImpacto = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
