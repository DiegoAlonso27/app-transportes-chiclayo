const { useState, useMemo, useRef, useEffect, useCallback } = React;
const DSP = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button } = DSP;

const VIAJE = { origen: 'Chiclayo', destino: 'Piura', sale: '18:45', llega: '22:15', fecha: 'Sáb 15 ago' };
const ASIENTOS = [28, 27, 30, 18];
const PRECIO = 43;

const PAISES = [
  { v: 'PE', l: 'Perú' }, { v: 'CL', l: 'Chile' }, { v: 'EC', l: 'Ecuador' },
  { v: 'CO', l: 'Colombia' }, { v: 'AR', l: 'Argentina' }, { v: 'OT', l: 'Otro país' },
];
const DOCS = {
  PE: [{ v: 'DNI', l: 'DNI' }, { v: 'CE', l: 'Carné de extranjería' }, { v: 'PAS', l: 'Pasaporte' }],
  OT: [{ v: 'PAS', l: 'Pasaporte' }, { v: 'ID', l: 'Documento de identidad' }],
};
const docsDe = (pais) => DOCS[pais] || DOCS.OT;

const nuevoPax = (asiento, i) => ({
  uid: 'p' + i, asiento, pais: 'PE', tipo: 'DNI', num: '', nombres: '', apellidos: '', fnac: '',
  lookup: null, manual: false, listo: false, verErrores: false, tocado: {},
});

/* Padrón simulado. Solo se usa cuando la búsqueda por documento está disponible:
   la pantalla nunca depende de ella para poder completarse. */
const PADRON = { '72422111': { nombres: 'Diego Alonso', apellidos: 'Ordoñez Ramírez', fnac: '2003-09-27' } };

function erroresPax(p) {
  const e = {};
  const doc = docsDe(p.pais).find((d) => d.v === p.tipo) ? p.tipo : docsDe(p.pais)[0].v;
  if (!p.num.trim()) e.num = 'Ingresa tu número de documento.';
  else if (doc === 'DNI' && !/^\d{8}$/.test(p.num)) e.num = 'El DNI tiene 8 dígitos, sin puntos ni espacios.';
  else if (doc !== 'DNI' && p.num.trim().length < 5) e.num = 'Revisa el número: parece incompleto.';
  if (!p.nombres.trim()) e.nombres = 'Ingresa los nombres tal como figuran en el documento.';
  if (!p.apellidos.trim()) e.apellidos = 'Ingresa los apellidos tal como figuran en el documento.';
  if (!p.fnac) e.fnac = 'Ingresa una fecha de nacimiento válida.';
  return e;
}
const paxCompleto = (p) => Object.keys(erroresPax(p)).length === 0;
const nombreCorto = (p) => [p.nombres.trim().split(' ')[0], p.apellidos.trim().split(' ')[0]].filter(Boolean).join(' ');

function erroresContacto(c) {
  const e = {};
  if (!c.email.trim()) e.email = 'Ingresa tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(c.email.trim())) e.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
  if (!c.email2.trim()) e.email2 = 'Repite tu correo electrónico.';
  else if (c.email.trim().toLowerCase() !== c.email2.trim().toLowerCase()) e.email2 = 'Los correos electrónicos no coinciden.';
  const dig = (PREFIJOS.find((p) => p.v === c.prefijo) || PREFIJOS[0]).dig;
  if (!c.tel.trim()) e.tel = 'Ingresa un número de contacto.';
  else if (c.tel.length !== dig) e.tel = `El número de ${(PREFIJOS.find((p) => p.v === c.prefijo) || PREFIJOS[0]).pais} tiene ${dig} dígitos.`;
  return e;
}

/* ------------------------- Formulario de un pasajero ------------------------- */
function FormPax({ p, set, onGuardar, ultimo, busqueda }) {
  const errs = erroresPax(p);
  const ver = (campo) => (p.verErrores || p.tocado[campo]) && errs[campo];
  const tocar = (campo) => set({ tocado: { ...p.tocado, [campo]: true } });
  const opciones = docsDe(p.pais);
  const bloqueado = p.lookup === 'loading';
  const auto = busqueda && p.lookup === 'ok' && !p.manual;

  // Búsqueda por documento: solo DNI peruano y solo si el servicio está disponible.
  useEffect(() => {
    if (!busqueda || p.tipo !== 'DNI' || !/^\d{8}$/.test(p.num)) { if (p.lookup) set({ lookup: null, manual: false }); return; }
    set({ lookup: 'loading' });
    const t = setTimeout(() => {
      if (p.num === '00000000') { set({ lookup: 'error' }); return; }
      const hit = PADRON[p.num];
      if (hit) set({ lookup: 'ok', manual: false, nombres: hit.nombres, apellidos: hit.apellidos, fnac: hit.fnac });
      else set({ lookup: 'vacio', manual: true });
    }, 1100);
    return () => clearTimeout(t);
  }, [p.num, p.tipo, busqueda]);

  const msgDoc = () => {
    if (ver('num')) return { error: errs.num };
    if (!busqueda) return {};
    if (p.lookup === 'loading') return { hint: 'Buscando tus datos…', loading: true };
    if (p.lookup === 'ok') return { ok: 'Encontramos tus datos. Revísalos antes de continuar.' };
    if (p.lookup === 'vacio') return { hint: 'No encontramos ese documento. Completa los datos a mano.' };
    if (p.lookup === 'error') return { hint: 'No pudimos consultar el documento ahora. Puedes escribir tus datos igual.' };
    return {};
  };

  return (
    <div className="pax-body">
      <Field label="País de emisión del documento" htmlFor={p.uid + '-pais'}>
        <Select id={p.uid + '-pais'} value={p.pais} options={PAISES}
          onChange={(v) => set({ pais: v, tipo: docsDe(v).some((d) => d.v === p.tipo) ? p.tipo : docsDe(v)[0].v, lookup: null })} />
      </Field>

      <Field label="Documento" htmlFor={p.uid + '-num'} required {...msgDoc()}>
        <div className="f-doc">
          <Select id={p.uid + '-tipo'} value={p.tipo} options={opciones} onChange={(v) => set({ tipo: v, lookup: null, manual: false })} compact />
          <TextInput id={p.uid + '-num'} value={p.num} error={ver('num')} disabled={bloqueado}
            inputMode="numeric" maxLength={p.tipo === 'DNI' ? 8 : 15} placeholder={p.tipo === 'DNI' ? '72422111' : 'Número'}
            onChange={(v) => set({ num: p.tipo === 'DNI' ? v.replace(/\D/g, '') : v })} onBlur={() => tocar('num')}
            endSlot={p.lookup === 'loading' ? <PIcon name="loader" size={17} color="var(--color-primary)" className="spin" />
              : p.lookup === 'ok' ? <PIcon name="check" size={17} color="var(--color-success)" /> : null} />
        </div>
      </Field>

      {auto && (
        <div className="pax-auto">
          <PIcon name="info" size={15} color="var(--text-secondary)" />
          <span>Datos traídos de tu documento.</span>
          <button className="lnk" onClick={() => set({ manual: true })}><PIcon name="edit" size={14} />Editar</button>
        </div>
      )}

      <Field label="Nombres" htmlFor={p.uid + '-nom'} required error={ver('nombres')}>
        <TextInput id={p.uid + '-nom'} value={p.nombres} error={ver('nombres')} disabled={auto || bloqueado} autoCapitalize="words"
          placeholder="Como figura en el documento" onChange={(v) => set({ nombres: v })} onBlur={() => tocar('nombres')} />
      </Field>

      <Field label="Apellidos" htmlFor={p.uid + '-ape'} required error={ver('apellidos')}>
        <TextInput id={p.uid + '-ape'} value={p.apellidos} error={ver('apellidos')} disabled={auto || bloqueado} autoCapitalize="words"
          placeholder="Como figura en el documento" onChange={(v) => set({ apellidos: v })} onBlur={() => tocar('apellidos')} />
      </Field>

      <Field label="Fecha de nacimiento" htmlFor={p.uid + '-fnac'} required error={ver('fnac')}
        hint={!p.fnac ? 'La usamos para aplicar descuentos de menores y adultos mayores.' : null}>
        <DatePicker id={p.uid + '-fnac'} value={p.fnac} error={ver('fnac')} disabled={auto || bloqueado} onChange={(v) => set({ fnac: v, tocado: { ...p.tocado, fnac: true } })} />
      </Field>

      <Button variant="outlined" fullWidth onClick={onGuardar}
        endIcon={!ultimo ? <PIcon name="arrow" size={17} /> : null}>
        {ultimo ? 'Guardar pasajero' : 'Guardar y pasar al siguiente'}
      </Button>
    </div>
  );
}

/* ------------------------------- Pantalla ------------------------------- */
function Pasajeros({ nPax, busqueda, viaje, asientos: asientosProp, precio, onBack, onContinuar } = {}) {
  const V = { ...VIAJE, ...(viaje || {}) };
  const pu = precio || PRECIO;
  const asientos = (asientosProp && asientosProp.length ? [...asientosProp] : ASIENTOS.slice(0, nPax)).sort((a, b) => a - b);
  const [paxes, setPaxes] = useState(() => asientos.map(nuevoPax));
  const [contacto, setContacto] = useState({ email: '', email2: '', prefijo: '+51', tel: '', verErrores: false, tocado: {} });
  const [abierto, setAbierto] = useState(paxes[0].uid);
  const [aviso, setAviso] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const scroller = useRef(null);
  const refs = useRef({});

  const unico = asientos.length === 1;
  const setPax = (uid, patch) => setPaxes((prev) => prev.map((p) => (p.uid === uid ? { ...p, ...patch } : p)));
  const completos = paxes.filter((p) => p.listo && paxCompleto(p)).length;
  const errsContacto = erroresContacto(contacto);
  const verC = (campo) => (contacto.verErrores || contacto.tocado[campo]) && errsContacto[campo];
  const tocarC = (campo) => setContacto((c) => ({ ...c, tocado: { ...c.tocado, [campo]: true } }));

  const irA = useCallback((key) => {
    const el = refs.current[key];
    const cont = scroller.current;
    if (el && cont) cont.scrollTo({ top: Math.max(0, el.offsetTop - 96), behavior: 'smooth' });
  }, []);

  const guardar = (p) => {
    if (!paxCompleto(p)) { setPax(p.uid, { verErrores: true, listo: false }); setAviso({ tono: 'err', txt: 'Revisa los datos marcados en rojo.' }); return; }
    setPax(p.uid, { listo: true, verErrores: false });
    setAviso(null);
    const siguiente = paxes.find((o) => o.uid !== p.uid && !(o.listo && paxCompleto(o)));
    if (siguiente && !unico) { setAbierto(siguiente.uid); setTimeout(() => irA(siguiente.uid), 60); }
    else { setAbierto(null); setTimeout(() => irA('contacto'), 60); }
  };

  const continuar = () => {
    const pendiente = paxes.find((p) => !paxCompleto(p));
    if (pendiente) {
      setPax(pendiente.uid, { verErrores: true });
      setAbierto(pendiente.uid);
      setAviso({ tono: 'err', txt: `Faltan datos del ${unico ? 'pasajero' : 'Pasajero ' + (paxes.indexOf(pendiente) + 1)}.` });
      setTimeout(() => irA(pendiente.uid), 60);
      return;
    }
    if (Object.keys(errsContacto).length) {
      setContacto((c) => ({ ...c, verErrores: true }));
      setAviso({ tono: 'err', txt: 'Revisa tus datos de contacto.' });
      setTimeout(() => irA('contacto'), 60);
      return;
    }
    setAviso(null); setEnviado(true);
    setTimeout(() => onContinuar && onContinuar({ paxes, contacto, total }), 900);
  };

  const total = asientos.length * pu;

  return (
    <div className="tc-screen">
      <header className="tc-appbar">
        <div className="tc-appbar-top">
          <button className="tc-icon-btn light" aria-label="Volver a la selección de asiento" onClick={() => onBack && onBack()}><PIcon name="left" size={22} color="#fff" /></button>
          <h1 className="tc-title">Datos de pasajeros</h1>
          <span style={{ width: 44 }} />
        </div>
        <div className="tc-trip">
          <span className="tc-trip-ruta">{V.origen} <PIcon name="arrow" size={14} color="rgba(255,255,255,.7)" /> {V.destino}</span>
          <span className="tc-trip-horas">{V.fecha} <span className="tc-dot">·</span> {V.sale}–{V.llega} <span className="tc-dot">·</span> {asientos.length === 1 ? `Asiento ${asientos[0]}` : `Asientos ${asientos.join(', ')}`}</span>
        </div>
      </header>

      <main className="tc-content" ref={scroller}>
        {!unico && (
          <div className="tc-stick">
            <div className="tc-prog-top">
              <b>{completos} de {paxes.length} pasajeros completos</b>
              <span>{completos === paxes.length ? 'Solo falta el contacto' : `Faltan ${paxes.length - completos}`}</span>
            </div>
            <div className="tc-bar" role="progressbar" aria-valuenow={completos} aria-valuemin={0} aria-valuemax={paxes.length}>
              <span style={{ width: `${(completos / paxes.length) * 100}%` }} />
            </div>
          </div>
        )}

        <section className="tc-list" aria-label="Pasajeros">
          {!unico && <h2 className="sec-t">Pasajeros</h2>}
          {paxes.map((p, i) => {
            const errs = erroresPax(p);
            const conError = p.verErrores && Object.keys(errs).length > 0;
            const ok = p.listo && paxCompleto(p);
            const open = unico || abierto === p.uid;
            const estado = conError ? 'err' : ok ? 'ok' : 'todo';
            return (
              <article key={p.uid} className={'pax' + (open ? ' on' : '') + (conError ? ' bad' : '')} ref={(el) => { refs.current[p.uid] = el; }}>
                <button className="pax-head" aria-expanded={open} aria-controls={p.uid + '-body'} disabled={unico}
                  onClick={() => setAbierto(open ? null : p.uid)}>
                  <span className={'pax-badge st-' + estado}>
                    {estado === 'ok' ? <PIcon name="check" size={14} color="#fff" /> : estado === 'err' ? <PIcon name="alert" size={15} color="#fff" /> : i + 1}
                  </span>
                  <span className="pax-h-txt">
                    <b>{unico ? 'Pasajero' : `Pasajero ${i + 1}`}</b>
                    <span className={'pax-sub' + (conError ? ' err' : ok ? ' ok' : '')}>
                      {conError ? 'Revisa los datos marcados' : ok ? nombreCorto(p) : open ? 'Completa los datos del documento' : 'Faltan datos'}
                    </span>
                  </span>
                  <span className="seat-chip"><PIcon name="seat" size={13} color="var(--text-secondary)" />Asiento {p.asiento}</span>
                  {!unico && <PIcon name={open ? 'up' : 'down'} size={18} color="var(--text-tertiary)" />}
                </button>
                {open && (
                  <div id={p.uid + '-body'}>
                    <FormPax p={p} set={(patch) => setPax(p.uid, patch)} busqueda={busqueda} ultimo={unico || i === paxes.length - 1}
                      onGuardar={() => guardar(paxes.find((x) => x.uid === p.uid))} />
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="tc-list" aria-label="Datos de contacto" ref={(el) => { refs.current.contacto = el; }}>
          <div className="sec-h">
            <h2 className="sec-t">Datos de contacto</h2>
            <p className="sec-d">Enviaremos aquí los boletos y los avisos del viaje. Se piden una sola vez para toda la compra.</p>
          </div>
          <div className="card-plain">
            <Field label="Correo electrónico" htmlFor="mail" required error={verC('email')}>
              <TextInput id="mail" type="email" inputMode="email" value={contacto.email} error={verC('email')} placeholder="nombre@correo.com"
                onChange={(v) => setContacto((c) => ({ ...c, email: v }))} onBlur={() => tocarC('email')}
                endSlot={<PIcon name="mail" size={17} color="var(--text-tertiary)" />} />
            </Field>
            <Field label="Confirmar correo electrónico" htmlFor="mail2" required error={verC('email2')}
              ok={!verC('email2') && contacto.email2 && !errsContacto.email && !errsContacto.email2 ? 'Los correos coinciden.' : null}>
              <TextInput id="mail2" type="email" inputMode="email" value={contacto.email2} error={verC('email2')} placeholder="Repite tu correo"
                onChange={(v) => setContacto((c) => ({ ...c, email2: v }))} onBlur={() => tocarC('email2')} />
            </Field>
            <Field label="Teléfono" htmlFor="tel" required error={verC('tel')} hint={!contacto.tel ? 'Te escribimos solo si hay un cambio en tu salida.' : null}>
              <PhoneInput id="tel" prefijo={contacto.prefijo} numero={contacto.tel} error={verC('tel')}
                onPrefijo={(v) => setContacto((c) => ({ ...c, prefijo: v }))} onNumero={(v) => setContacto((c) => ({ ...c, tel: v }))} onBlur={() => tocarC('tel')} />
            </Field>
          </div>
          <p className="tc-tail">Los datos deben coincidir con el documento del pasajero. Puedes corregirlos hasta 2 horas antes de la salida.</p>
        </section>
      </main>

      <footer className="tc-cta">
        <div className="tc-resumen">
          <span className="tc-resumen-l">
            <b>{asientos.length} {asientos.length === 1 ? 'pasaje' : 'pasajes'}</b>
            <span>{asientos.length === 1 ? `Asiento ${asientos[0]}` : `Asientos ${asientos.join(', ')}`}</span>
          </span>
          <span className="tc-resumen-r">S/ {total}</span>
        </div>
        {aviso && <p className="tc-aviso" role="alert"><PIcon name="alert" size={14} />{aviso.txt}</p>}
        {enviado && <p className="tc-aviso ok" role="status"><PIcon name="check" size={14} />Datos listos. Continuamos con el pago.</p>}
        <Button fullWidth onClick={continuar}>Continuar al pago</Button>
        <span className="tc-safe" />
      </footer>
      <div id="sheet-host" />
    </div>
  );
}

function AppPax() {
  const [nPax, setNPax] = useState(4);
  const [busqueda, setBusqueda] = useState(true);
  useEffect(() => {
    const bar = document.getElementById('demo-bar');
    if (!bar) return;
    const h = (e) => {
      const b = e.target.closest('button[data-pax],button[data-busq]');
      if (!b) return;
      if (b.dataset.pax) {
        setNPax(+b.dataset.pax);
        [...bar.querySelectorAll('button[data-pax]')].forEach((x) => x.classList.toggle('on', x === b));
      } else {
        setBusqueda((v) => { b.classList.toggle('on', !v); return !v; });
      }
    };
    bar.addEventListener('click', h);
    return () => bar.removeEventListener('click', h);
  }, []);
  return <Pasajeros key={nPax} nPax={nPax} busqueda={busqueda} />;
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('phone-root')).render(<AppPax />);
Object.assign(window, { Pasajeros });
