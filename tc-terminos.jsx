/* Aceptación de Términos y Condiciones en "Datos de la compra".
   El resto del checkout se muestra abreviado: solo el contexto necesario para
   validar el bloque de términos, el modal de lectura y el botón de pago. */
const { useState, useRef, useEffect, useCallback } = React;
const { Button } = window.TransportesChiclayoDesignSystem_48bc0c;

/* Texto de muestra. El contenido definitivo lo entrega el área legal junto con
   el identificador y la versión del documento. */
const SECCIONES = [
  { n: '1', t: 'Condiciones generales', p: [
    'Estas condiciones regulan la compra de pasajes a través de los canales digitales de Transportes Chiclayo. Al comprar aceptas las reglas de servicio, embarque y equipaje descritas a continuación.',
    'Transportes Chiclayo puede actualizar este documento. La versión aplicable a tu compra es la que aparece en pantalla al momento de aceptar.'] },
  { n: '2', t: 'Compra de pasajes', p: [
    'El pasaje se emite a nombre del pasajero registrado y con el documento de identidad declarado en la compra. Ese documento se solicita al momento de embarcar.',
    'La compra queda confirmada cuando se aprueba el pago. Si el pago no se completa, los asientos vuelven a estar disponibles.'] },
  { n: '3', t: 'Embarque y presentación', p: [
    'Debes presentarte en el terminal al menos 30 minutos antes de la hora de salida. Pasada la hora de salida el pasaje pierde validez y no genera devolución.'] },
  { n: '4', t: 'Equipaje', p: [
    'Cada pasajero puede llevar equipaje en bodega dentro del peso permitido para su tarifa, además de un bolso de mano. El equipaje de mano viaja bajo responsabilidad del pasajero.',
    'No se transportan objetos frágiles, dinero, joyas ni documentos de valor en bodega.'] },
  { n: '5', t: 'Cambios y anulaciones', p: [
    'Los cambios de fecha u hora se solicitan con la anticipación indicada para la tarifa comprada y pueden estar sujetos a diferencia de precio.',
    'Las anulaciones se atienden según la tarifa y el canal de compra. Algunas tarifas promocionales no admiten devolución.'] },
  { n: '6', t: 'Menores de edad', p: [
    'Los menores de edad viajan acompañados de un adulto responsable o con la autorización de viaje que exige la normativa vigente. Sin esa documentación no se autoriza el embarque.'] },
  { n: '7', t: 'Datos personales', p: [
    'Los datos que registras se usan para emitir el pasaje, contactarte por cambios en el viaje y cumplir obligaciones legales. Puedes ejercer tus derechos sobre ellos por los canales de atención.'] },
  { n: '8', t: 'Atención al cliente', p: [
    'Ante cualquier incidencia puedes escribirnos por los canales de atención publicados en la aplicación. Te respondemos con el número de tu compra a la mano.'] },
  { n: '9', t: 'Vigencia', p: [
    'Estas condiciones rigen desde su publicación y se aplican a las compras realizadas mientras estén vigentes.'] },
];

const METODOS = [
  { v: 'yape', l: 'Yape o Plin', d: 'Pagas desde tu app' },
  { v: 'tarjeta', l: 'Tarjeta de crédito o débito', d: 'Visa, Mastercard, Amex' },
  { v: 'agencia', l: 'Efectivo en agencia', d: 'Reservamos por 2 horas' },
];

const fechaHora = (d) => d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '') +
  ', ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

/* ---------- Modal de lectura (full-screen dialog) ---------- */
function ModalTerminos({ yaAceptado, aceptadoEn, onAceptar, onCerrar }) {
  const bodyRef = useRef(null);
  const cerrarRef = useRef(null);
  const finRef = useRef(null);
  const [pct, setPct] = useState(0);
  const [alFinal, setAlFinal] = useState(false);

  useEffect(() => { cerrarRef.current && cerrarRef.current.focus(); }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCerrar]);

  const onScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max <= 0 ? 1 : el.scrollTop / max;
    setPct(Math.min(1, Math.max(0, p)));
    setAlFinal(max - el.scrollTop < 120);
  }, []);
  useEffect(() => { onScroll(); }, [onScroll]);

  const irAlFinal = () => { const el = bodyRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); };

  return (
    <div className="tcm" role="dialog" aria-modal="true" aria-labelledby="tcm-titulo">
      <header className="tcm-head">
        <button ref={cerrarRef} className="tc-icon-btn" onClick={onCerrar} aria-label="Cerrar sin aceptar">
          <PIcon name="x" size={22} color="var(--text-primary)" />
        </button>
        <h2 id="tcm-titulo">Términos y condiciones</h2>
      </header>
      <div className="tcm-prog" aria-hidden="true"><span style={{ width: (pct * 100).toFixed(1) + '%' }} /></div>
      <div className="tcm-body" ref={bodyRef} onScroll={onScroll} tabIndex={0}>
        <h3 className="tcm-h1">Condiciones de compra y viaje</h3>
        <p className="tcm-meta">Documento vigente para esta compra. Guardamos qué versión aceptaste y cuándo.</p>
        {SECCIONES.map((s) => (
          <section className="tcm-sec" key={s.n}>
            <h4><span>{s.n}.</span> {s.t}</h4>
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}
        <p className="tcm-fin" ref={finRef}>Fin del documento</p>
        <div className="tcm-cta">
          {yaAceptado ? (
            <>
              <p className="tcm-ok"><PIcon name="check" size={16} color="var(--color-success)" />Aceptaste estos términos el {aceptadoEn}.</p>
              <Button variant="outlined" fullWidth onClick={onCerrar}>Cerrar</Button>
            </>
          ) : (
            <>
              <p className="tcm-nota">Al aceptar registramos la versión de este documento y la fecha de aceptación.</p>
              <Button fullWidth onClick={onAceptar}>Aceptar términos y condiciones</Button>
              <Button variant="text" fullWidth onClick={onCerrar}>Volver sin aceptar</Button>
            </>
          )}
        </div>
        <span className="tc-safe" />
      </div>
      {!alFinal && (
        <button className="tcm-hint" onClick={irAlFinal}>
          {yaAceptado ? 'Ir al final' : 'Baja para aceptar'}<PIcon name="down" size={15} />
        </button>
      )}
    </div>
  );
}

/* ---------- Comprobante de pago (boleta / factura con RUC) ---------- */
/* Solo empresas peruanas: el RUC de persona jurídica empieza en 20 (15 y 17 son
   inscripciones antiguas que siguen vigentes). Un RUC 10 es persona natural y va con boleta. */
const RUC_EMPRESA = /^(20|15|17)\d{9}$/;
const PADRON = {
  '20601030013': 'Servicios Logísticos del Norte S.A.C.',
  '20100047218': 'Comercial Lambayeque S.A.',
  '20512333179': 'Agroindustrias La Merced S.R.L.',
};

function validarRuc(ruc) {
  if (!ruc) return 'Ingresa el RUC de la empresa.';
  if (ruc.length < 11) return 'El RUC tiene 11 dígitos.';
  if (/^10/.test(ruc)) return 'Ese RUC es de persona natural. La factura con RUC es solo para empresas.';
  if (!RUC_EMPRESA.test(ruc)) return 'RUC no válido. Los RUC de empresas peruanas empiezan en 20.';
  return null;
}

function BloqueComprobante({ estado, set }) {
  const { tipo, ruc, razon, dir, buscando, tocado, error } = estado;
  const quiere = tipo === 'factura';

  /* Consulta simulada del padrón: al completar 11 dígitos válidos se trae la razón social. */
  useEffect(() => {
    if (!quiere || ruc.length !== 11 || validarRuc(ruc)) return;
    set({ buscando: true });
    const t = setTimeout(() => set({ buscando: false, razon: PADRON[ruc] || 'Empresa registrada en SUNAT S.A.C.' }), 900);
    return () => clearTimeout(t);
  }, [ruc, quiere]);

  const alternar = () => {
    if (quiere) set({ tipo: 'boleta', ruc: '', razon: '', dir: '', tocado: false, error: null, buscando: false });
    else { set({ tipo: 'factura' }); setTimeout(() => { const el = document.getElementById('ruc'); if (el) el.focus(); }, 260); }
  };

  return (
    <section className={'comp' + (quiere ? ' on' : '')}>
      <div className="comp-row" onClick={alternar}>
        <span className="comp-hit">
          <span className={'terms-box' + (quiere ? ' on' : '')} role="checkbox" tabIndex={0} aria-checked={quiere}
            aria-label="Quiero factura con RUC"
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); alternar(); } }}>
            {quiere && <PIcon name="check" size={15} color="#fff" />}
          </span>
        </span>
        <p className="comp-txt">Factura con RUC <span>(Solo para empresas peruanas)</span></p>
      </div>
      {quiere && (
        <div className="comp-form">
          <Field label="RUC de la empresa" htmlFor="ruc" required
            error={tocado ? error : null}
            ok={!error && razon && !buscando ? 'RUC válido' : null}
            loading={buscando}
            hint={buscando ? 'Buscando la razón social…' : 'Solo RUC de empresas peruanas: 11 dígitos que empiezan en 20.'}>
            <TextInput id="ruc" value={ruc} inputMode="numeric" maxLength={11} placeholder="20123456789"
              error={tocado && !!error}
              onChange={(v) => { const n = v.replace(/\D/g, ''); set({ ruc: n, error: validarRuc(n), razon: n.length === 11 ? razon : '' }); }}
              onBlur={() => set({ tocado: true })} />
          </Field>
          <Field label="Razón social" htmlFor="razon" required
            error={tocado && !razon.trim() ? 'Ingresa la razón social de la empresa.' : null}
            hint={buscando ? 'La traemos del padrón de SUNAT…' : 'Si no coincide con SUNAT, corrígela.'}>
            <TextInput id="razon" value={razon} disabled={buscando} placeholder="Razón social"
              error={tocado && !razon.trim()}
              onChange={(v) => set({ razon: v })} onBlur={() => set({ tocado: true })} />
          </Field>
          <Field label="Dirección fiscal" htmlFor="dir" required
            error={tocado && !dir.trim() ? 'Ingresa la dirección fiscal de la empresa.' : null}
            hint="Aparecerá en la factura electrónica.">
            <TextInput id="dir" value={dir} placeholder="Av. Bolognesi 536, Chiclayo"
              error={tocado && !dir.trim()}
              onChange={(v) => set({ dir: v })} onBlur={() => set({ tocado: true })} />
          </Field>
          <p className="comp-nota"><PIcon name="info" size={13} />Enviaremos la factura electrónica al correo registrado dentro de las 24 horas siguientes al pago.</p>
        </div>
      )}
    </section>
  );
}

/* ---------- Bloque de aceptación en el checkout ---------- */
function BloqueTerminos({ aceptado, aceptadoEn, caduco, onAbrir, onRetirar }) {
  const tocarFila = () => { if (aceptado) onRetirar(); else onAbrir(); };
  return (
    <section className={'terms' + (aceptado ? ' on' : '') + (caduco ? ' warn' : '')} aria-labelledby="terms-t">
      <h2 className="sec-t" id="terms-t" style={{ padding: '0 2px 2px' }}>Términos y condiciones</h2>
      {caduco && (
        <p className="terms-warn" role="status">
          <PIcon name="alert" size={15} color="var(--yellow-700)" />
          Actualizamos el documento. Revísalo y acéptalo otra vez para continuar.
        </p>
      )}
      <div className="terms-row" onClick={tocarFila}>
        <span className="terms-hit">
          <span className={'terms-box' + (aceptado ? ' on' : '')} role="checkbox" tabIndex={0} aria-checked={aceptado}
            aria-label="He leído y acepto los términos y condiciones"
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tocarFila(); } }}>
            {aceptado && <PIcon name="check" size={15} color="#fff" />}
          </span>
        </span>
        <p className="terms-txt">
          He leído y acepto los{' '}
          <button className="terms-link" onClick={(e) => { e.stopPropagation(); onAbrir(); }}>Términos y Condiciones</button>
        </p>
      </div>
      <p className={'terms-help' + (aceptado ? ' ok' : '')}>
        {aceptado
          ? <><PIcon name="check" size={13} />Aceptado el {aceptadoEn}. Desmarca la casilla si quieres retirar tu aceptación.</>
          : <><PIcon name="info" size={13} />Abriremos el documento para que lo revises antes de registrar tu aceptación.</>}
      </p>
    </section>
  );
}

/* ---------- Pantalla ---------- */
function AppTerminos({ resumen, onBack, onPagar } = {}) {
  const R = { ruta: 'Chiclayo → Piura', sub: 'Dom 09 ago, 23:00 · 4 asientos', total: 124, titular: 'Rosa Vásquez Gonzáles', correo: 'rosa.vasquez@correo.com', tel: '+51 987 654 321', pax: '4 · asientos 12, 13, 14 y 15', nPax: 4, ...(resumen || {}) };
  const [aceptado, setAceptado] = useState(false);
  const [aceptadoEn, setAceptadoEn] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [caduco, setCaduco] = useState(false);
  const [metodo, setMetodo] = useState(null);
  const [toast, setToast] = useState(null);
  const [pagado, setPagado] = useState(false);
  const [comp, setComp] = useState({ tipo: 'boleta', ruc: '', razon: '', dir: '', buscando: false, tocado: false, error: null });
  const setC = useCallback((p) => setComp((c) => ({ ...c, ...p })), []);
  const disparador = useRef(null);
  const scrollRef = useRef(null);
  const guardado = useRef(0);

  const avisar = (t) => { setToast(t); clearTimeout(avisar.id); avisar.id = setTimeout(() => setToast(null), 2600); };

  const abrir = () => {
    disparador.current = document.activeElement;
    guardado.current = scrollRef.current ? scrollRef.current.scrollTop : 0;
    setAbierto(true);
  };
  const cerrar = useCallback(() => setAbierto(false), []);
  /* Tras desmontar el modal: se recupera la posición del checkout y el foco del disparador. */
  useEffect(() => {
    if (abierto) return;
    const t = setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = guardado.current;
      const el = disparador.current;
      if (el && el.isConnected && el.focus) el.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [abierto]);
  const aceptar = () => {
    const ahora = new Date();
    setAceptado(true);
    setCaduco(false);
    setAceptadoEn(fechaHora(ahora));
    window.__tcTerms = { termsAccepted: true, termsDocumentId: '‹id del documento vigente›', termsVersion: '‹versión vigente›', acceptedAt: ahora.toISOString() };
    window.__tcComprobante = comp.tipo === 'factura'
      ? { tipo: 'factura', ruc: comp.ruc, razonSocial: comp.razon, direccionFiscal: comp.dir }
      : { tipo: 'boleta' };
    cerrar();
    avisar('Términos aceptados');
  };
  const retirar = () => { setAceptado(false); setAceptadoEn(null); window.__tcTerms = { termsAccepted: false }; avisar('Retiraste tu aceptación'); };

  const facturaOk = comp.tipo === 'boleta' || (!validarRuc(comp.ruc) && !!comp.razon.trim() && !!comp.dir.trim() && !comp.buscando);
  const listo = aceptado && !caduco && !!metodo && facturaOk;
  const falta = [!metodo && 'elegir el método de pago', !facturaOk && 'completar los datos de la factura', (!aceptado || caduco) && 'aceptar los términos'].filter(Boolean);
  const listaFalta = falta.length > 1 ? falta.slice(0, -1).join(', ') + ' y ' + falta[falta.length - 1] : falta[0];

  /* Controles de demostración, fuera del teléfono */
  const demoHost = document.getElementById('demo-bar');
  const demo = !demoHost ? null : ReactDOM.createPortal(
    <>
      <span className="demo-l">Estados</span>
      <button className={!aceptado && !abierto && !caduco ? 'on' : ''} onClick={() => { setAbierto(false); setAceptado(false); setCaduco(false); setAceptadoEn(null); }}>Sin aceptar</button>
      <button className={abierto ? 'on' : ''} onClick={() => setAbierto(true)}>Documento abierto</button>
      <button className={aceptado && !caduco ? 'on' : ''} onClick={() => { setAbierto(false); setAceptado(true); setCaduco(false); setAceptadoEn(fechaHora(new Date())); }}>Ya aceptado</button>
      <button className={caduco ? 'on' : ''} onClick={() => { setAbierto(false); setAceptado(false); setAceptadoEn(null); setCaduco(true); }}>Nueva versión publicada</button>
      <button className={comp.tipo === 'factura' ? 'on' : ''} onClick={() => { setAbierto(false); setC({ tipo: 'factura' }); setTimeout(() => { const c = scrollRef.current; if (c) c.scrollTop = c.scrollHeight; }, 60); }}>Factura con RUC</button>
    </>, demoHost);

  return (
    <div className="tc-screen">
      {demo}
      <header className="tc-appbar">
        <div className="tc-appbar-top">
          <button className="tc-icon-btn light" aria-label="Volver a datos de pasajeros" onClick={() => onBack && onBack()}><PIcon name="left" size={22} color="#fff" /></button>
          <h1 className="tc-title">Datos de la compra</h1>
          <span className="tc-timer"><PIcon name="clock" size={14} color="#fff" />08:48</span>
        </div>
      </header>

      <div className="tc-content" ref={scrollRef}>
        <div className="tc-list">
          <section className="card-plain resumen">
            <div className="res-top">
              <div><b>{R.ruta}</b><span>{R.sub}</span></div>
              <b className="res-total">S/ {R.total}</b>
            </div>
            <button className="lnk res-ver">Ver detalle de la compra<PIcon name="down" size={15} /></button>
          </section>

          <section className="card-plain datos">
            <div className="dato"><span>Titular de la compra</span><b>{R.titular}</b></div>
            <div className="dato"><span>Correo</span><b>{R.correo}</b></div>
            <div className="dato"><span>Teléfono</span><b>{R.tel}</b></div>
            <div className="dato"><span>Pasajeros</span><b>{R.pax}</b></div>
          </section>

          <h2 className="sec-t" style={{ paddingTop: 6 }}>Opciones de pago</h2>
          <div className="card-plain pagos">
            {METODOS.map((m) => (
              <button key={m.v} className={'pago' + (metodo === m.v ? ' on' : '')} role="radio" aria-checked={metodo === m.v} onClick={() => setMetodo(m.v)}>
                <span className="pago-rd">{metodo === m.v && <i />}</span>
                <span className="pago-t"><b>{m.l}</b><span>{m.d}</span></span>
              </button>
            ))}
          </div>

          <BloqueComprobante estado={comp} set={setC} />

          <BloqueTerminos aceptado={aceptado} aceptadoEn={aceptadoEn} caduco={caduco} onAbrir={abrir} onRetirar={retirar} />

          <p className="tc-tail">El cobro se realiza en soles. Recibirás tus pasajes en el correo registrado.</p>
        </div>
      </div>

      <footer className="tc-cta">
        <div className="tc-resumen">
          <div className="tc-resumen-l"><b>Total a pagar</b><span>{R.nPax} {R.nPax === 1 ? 'pasaje' : 'pasajes'} · impuestos incluidos</span></div>
          <span className="tc-resumen-r">S/ {R.total}</span>
        </div>
        {!listo && falta.length > 0 && (
          <p className="tc-aviso" role="status"><PIcon name="alert" size={14} />Falta {listaFalta}.</p>
        )}
        {pagado && <p className="tc-aviso ok" role="status"><PIcon name="check" size={14} />Procesando el pago.</p>}
        <Button fullWidth disabled={!listo} onClick={() => { setPagado(true); setTimeout(() => onPagar && onPagar({ metodo }), 1500); }}>Realizar pago</Button>
        <span className="tc-safe" />
      </footer>

      {abierto && <ModalTerminos yaAceptado={aceptado && !caduco} aceptadoEn={aceptadoEn} onAceptar={aceptar} onCerrar={cerrar} />}
      {toast && <div className="tc-toast" role="status"><PIcon name="check" size={15} color="#fff" />{toast}</div>}
    </div>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('phone-root')).render(<AppTerminos />);
Object.assign(window, { Checkout: AppTerminos, METODOS });
