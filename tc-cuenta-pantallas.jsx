/* Pantallas secundarias del módulo Mi cuenta.
   Reutiliza los campos de formulario del checkout (tc-campos.jsx): Field, TextInput,
   Select, DatePicker, PhoneInput. No se crea un segundo lenguaje de formularios. */
const { useState: uSt, useEffect: uEf, useRef: uRf } = React;
const DSM = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button: MButton } = DSM;

const M_ICONS = {
  user: ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  users: ['<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>', '<circle cx="9" cy="7" r="4"/>', '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>', '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>'],
  bell: ['<path d="M10.268 21a2 2 0 0 0 3.464 0"/>', '<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'],
  lock: ['<rect width="18" height="11" x="3" y="11" rx="2"/>', '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
  key: ['<path d="m15.5 7.5 3 3L22 7l-3-3"/>', '<path d="m21 2-9.6 9.6"/>', '<circle cx="7.5" cy="15.5" r="5.5"/>'],
  shield: ['<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'],
  cog: ['<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>', '<circle cx="12" cy="12" r="3"/>'],
  headset: ['<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'],
  doc: ['<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>', '<path d="M14 2v5h5"/>', '<path d="M8 13h8"/>', '<path d="M8 17h5"/>'],
  chat: ['<path d="M12 20a8 8 0 1 0-6.9-3.95L4 21l4.2-1a8 8 0 0 0 3.8 1"/>'],
  pin: ['<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>', '<circle cx="12" cy="10" r="3"/>'],
  faq: ['<circle cx="12" cy="12" r="10"/>', '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>', '<path d="M12 17h.01"/>'],
  trash: ['<path d="M3 6h18"/>', '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>', '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'],
  plus: ['<path d="M5 12h14"/>', '<path d="M12 5v14"/>'],
  chevron: ['<path d="m9 18 6-6-6-6"/>'],
  left: ['<path d="m15 18-6-6 6-6"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  alertT: ['<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>', '<path d="M12 9v4"/>', '<path d="M12 17h.01"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5h.01"/>'],
  eye: ['<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/>', '<circle cx="12" cy="12" r="3"/>'],
  eyeoff: ['<path d="M10.73 5.08a10.74 10.74 0 0 1 11.2 6.57 1 1 0 0 1 0 .7 10.8 10.8 0 0 1-1.44 2.49"/>', '<path d="M14.08 14.16a3 3 0 0 1-4.24-4.24"/>', '<path d="M17.48 17.5a10.75 10.75 0 0 1-15.42-5.15 1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14"/>', '<path d="m2 2 20 20"/>'],
  loader: ['<path d="M12 3a9 9 0 1 0 9 9"/>'],
  logout: ['<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>', '<path d="m16 17 5-5-5-5"/>', '<path d="M21 12H9"/>'],
  home: ['<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', '<path d="M9 22V12h6v10"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  promo: ['<path d="m3 11 18-5v12L3 14v-3z"/>', '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'],
};

function MIcon({ name, size = 20, color = 'currentColor', className, style }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: M_ICONS[name].join('') }} aria-hidden="true" />;
}

/* ------------------------------ Piezas comunes ------------------------------ */
function Bar({ titulo, onBack, accion }) {
  return (
    <header className="mb-bar">
      <button className="tc-icon-btn light" onClick={onBack} aria-label="Volver"><MIcon name="left" size={22} color="#fff" /></button>
      <h1 className="mb-t">{titulo}</h1>
      {accion || <span style={{ width: 44, flexShrink: 0 }} />}
    </header>
  );
}

function Sec({ label, children, desc }) {
  return (
    <section className="sec">
      {label && <h2 className="sec-lab">{label}</h2>}
      {desc && <p className="sec-desc">{desc}</p>}
      {children}
    </section>
  );
}

function Row({ icon, titulo, desc, onClick, danger, chevron = true, end }) {
  return (
    <button className="ct-row" onClick={onClick}>
      {icon && <span className={'ct-row-ic' + (danger ? ' dz' : '')}><MIcon name={icon} size={20} color={danger ? 'var(--color-error)' : 'var(--color-primary)'} /></span>}
      <span className="ct-row-tx">
        <span className="ct-row-t" style={danger ? { color: 'var(--color-error)' } : null}>{titulo}</span>
        {desc && <span className="ct-row-d">{desc}</span>}
      </span>
      {end}
      {chevron && <MIcon name="chevron" size={18} color="var(--gray-400)" />}
    </button>
  );
}

function Alerta({ tono = 'info', titulo, children, accion, onAccion }) {
  const ic = tono === 'err' ? 'alertT' : tono === 'warn' ? 'alertT' : 'info';
  return (
    <div className={'alerta ' + tono} role={tono === 'err' ? 'alert' : 'status'}>
      <MIcon name={ic} size={18} />
      <span className="alerta-tx">
        {titulo && <b>{titulo}</b>}
        <span>{children}</span>
        {accion && <button className="alerta-lnk" onClick={onAccion}>{accion}</button>}
      </span>
    </div>
  );
}

function Switch({ id, on, onChange, disabled, label }) {
  return (
    <button id={id} role="switch" aria-checked={on} aria-label={label} disabled={disabled}
      className={'sw' + (on ? ' on' : '') + (disabled ? ' dis' : '')} onClick={() => !disabled && onChange(!on)}>
      <span className="sw-knob" />
    </button>
  );
}

function SwitchRow({ titulo, desc, on, onChange, disabled, nota }) {
  const id = 'sw-' + titulo.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="sw-row">
      <label className="sw-tx" htmlFor={id}>
        <b>{titulo}</b>
        {desc && <span>{desc}</span>}
        {nota && <span className="sw-nota"><MIcon name="lock" size={12} />{nota}</span>}
      </label>
      <Switch id={id} on={on} onChange={onChange} disabled={disabled} label={titulo} />
    </div>
  );
}

function Vacio({ icon, titulo, texto, cta, onCta }) {
  return (
    <div className="empty">
      <span className="empty-ic"><MIcon name={icon} size={26} color="var(--color-primary)" /></span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {cta && <div className="empty-cta"><MButton fullWidth onClick={onCta} startIcon={<MIcon name="plus" size={18} />}>{cta}</MButton></div>}
    </div>
  );
}

function Dialogo({ open, titulo, texto, confirmar, cancelar = 'Cancelar', destructivo, onConfirm, onClose }) {
  return (
    <div className={'ct-modal' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="ct-scrim" onClick={onClose} />
      <div className="ct-dialog" role="alertdialog" aria-modal="true" aria-label={titulo}>
        <h3 className="title-medium" style={{ margin: 0 }}>{titulo}</h3>
        <p className="body-medium" style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>{texto}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
          <MButton variant="outlined" fullWidth onClick={onClose}>{cancelar}</MButton>
          <button className={'ct-danger-btn' + (destructivo ? ' fuerte' : '')} onClick={onConfirm}>{confirmar}</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={'toast' + (toast.tono === 'err' ? ' err' : '')} role="status">
      <MIcon name={toast.tono === 'err' ? 'alertT' : 'check'} size={16} color="#fff" />
      {toast.txt}
    </div>
  );
}

function Cta({ children }) { return <footer className="mb-cta">{children}</footer>; }

function Cargando({ filas = 4, perfil }) {
  return (
    <div>
      {perfil && <div className="ct-skel-perfil"><span className="sk sk-av" /><span style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}><span className="sk" style={{ width: '55%', height: 16 }} /><span className="sk" style={{ width: '38%', height: 12 }} /></span></div>}
      <div className="ct-skel-card" style={{ marginTop: perfil ? 20 : 0 }}>
        {Array.from({ length: filas }).map((_, i) => (
          <div key={i} className="ct-skel-row"><span className="sk sk-ic" /><span className="sk" style={{ width: `${54 - i * 7}%`, height: 13 }} /></div>
        ))}
      </div>
      <span className="sr-only" role="status">Cargando</span>
    </div>
  );
}

/* --------------------------------- Mis datos -------------------------------- */
const TIPOS_DOC = [{ v: 'DNI', l: 'DNI' }, { v: 'CE', l: 'Carné de extranjería' }, { v: 'PAS', l: 'Pasaporte' }];

function MisDatos({ perfil, guardar, onBack, fallar }) {
  const [f, setF] = uSt(perfil);
  const [estado, setEstado] = uSt('idle');
  const [tocado, setTocado] = uSt({});
  const [verErr, setVerErr] = uSt(false);
  const set = (patch) => { setF({ ...f, ...patch }); setEstado('idle'); };
  const sucio = JSON.stringify(f) !== JSON.stringify(perfil);

  const errs = {};
  if (!f.correo.trim()) errs.correo = 'Ingresa tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.correo.trim())) errs.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
  if (f.tel && f.tel.length !== 9) errs.tel = 'El número de Perú tiene 9 dígitos.';
  const ver = (c) => (verErr || tocado[c]) && errs[c];

  const enviar = () => {
    if (Object.keys(errs).length) { setVerErr(true); setEstado('idle'); return; }
    setEstado('saving');
    setTimeout(() => {
      if (fallar) { setEstado('error'); return; }
      setEstado('idle'); guardar(f, 'Datos actualizados');
    }, 1200);
  };

  return (
    <div className="tc-screen">
      <Bar titulo="Mis datos" onBack={onBack} />
      <main className="mb-content with-cta">
        <Sec label="Datos de tu documento">
          <div className="card-plain">
            <div className="ro-head"><MIcon name="lock" size={15} color="var(--text-tertiary)" /><span>Solo lectura. Son los datos con los que viajas y deben coincidir con tu documento.</span></div>
            <div className="f-doc">
              <Field label="Tipo"><Select value={f.tipoDoc} options={TIPOS_DOC} onChange={() => {}} disabled /></Field>
              <Field label="Número"><TextInput value={f.doc} onChange={() => {}} disabled /></Field>
            </div>
            <Field label="Nombres"><TextInput value={f.nombres} onChange={() => {}} disabled /></Field>
            <Field label="Apellidos"><TextInput value={f.apellidos} onChange={() => {}} disabled /></Field>
            <Field label="Fecha de nacimiento"><DatePicker value={f.fnac} onChange={() => {}} disabled /></Field>
            <p className="tc-tail">Si algún dato no coincide con tu documento, escríbenos desde Ayuda y contacto. <b>Pendiente:</b> definir si la corrección se hace en la app o en agencia.</p>
          </div>
        </Sec>

        <Sec label="Contacto" desc="Aquí te enviamos el pasaje y los avisos de cambio de horario.">
          <div className="card-plain">
            <Field label="Correo electrónico" htmlFor="d-mail" required error={ver('correo')}>
              <TextInput id="d-mail" type="email" inputMode="email" value={f.correo} error={ver('correo')} placeholder="nombre@correo.com"
                onChange={(v) => set({ correo: v })} onBlur={() => setTocado({ ...tocado, correo: true })} />
            </Field>
            <Field label="Teléfono" htmlFor="d-tel" error={ver('tel')} hint={!f.tel ? 'Opcional. Te escribimos solo si hay un cambio en tu salida.' : null}>
              <PhoneInput id="d-tel" prefijo={f.prefijo} numero={f.tel} error={ver('tel')}
                onPrefijo={(v) => set({ prefijo: v })} onNumero={(v) => set({ tel: v })} onBlur={() => setTocado({ ...tocado, tel: true })} />
            </Field>
          </div>
        </Sec>

        {estado === 'error' && (
          <div style={{ marginTop: 16 }}>
            <Alerta tono="err" titulo="No pudimos guardar tus cambios">Revisa tu conexión e inténtalo otra vez. No perdimos lo que escribiste.</Alerta>
          </div>
        )}
      </main>
      <Cta>
        <MButton fullWidth disabled={!sucio || estado === 'saving'} onClick={enviar}>
          {estado === 'saving' ? <MIcon name="loader" size={18} color="#fff" className="spin" /> : estado === 'error' ? 'Reintentar' : 'Guardar cambios'}
        </MButton>
        {!sucio && estado !== 'saving' && <p className="cta-hint">Aún no hay cambios por guardar.</p>}
      </Cta>
    </div>
  );
}

/* ---------------------------- Pasajeros frecuentes --------------------------- */
function ListaPasajeros({ pasajeros, cargando, onBack, onNuevo, onEditar }) {
  return (
    <div className="tc-screen">
      <Bar titulo="Pasajeros frecuentes" onBack={onBack} />
      <main className={'mb-content' + (pasajeros.length ? ' with-cta' : '')}>
        {cargando ? <Cargando filas={3} /> : pasajeros.length === 0 ? (
          <Vacio icon="users" titulo="Todavía no tienes pasajeros guardados"
            texto="Guarda los datos de las personas con las que viajas para completar tus compras más rápido."
            cta="Agregar pasajero" onCta={onNuevo} />
        ) : (
          <>
            <p className="mb-desc">Guarda los datos de las personas con las que viajas para completar tus compras más rápido.</p>
            <div className="pax-list">
              {pasajeros.map((p) => (
                <button key={p.id} className="pax-item" onClick={() => onEditar(p.id)}>
                  <span className="pax-av">{(p.nombres[0] || '') + (p.apellidos[0] || '')}</span>
                  <span className="pax-tx">
                    <span className="pax-n">{p.nombres} {p.apellidos}{p.alias && <i className="pax-tag">{p.alias}</i>}</span>
                    <span className="pax-d">{p.tipoDoc} ••••{p.doc.slice(-4)}</span>
                  </span>
                  <MIcon name="chevron" size={18} color="var(--gray-400)" />
                </button>
              ))}
            </div>
            <p className="tc-tail">Al comprar podrás elegir a cualquiera de ellos y los datos se completan solos.</p>
          </>
        )}
      </main>
      {!cargando && pasajeros.length > 0 && (
        <Cta><MButton fullWidth variant="outlined" onClick={onNuevo} startIcon={<MIcon name="plus" size={18} />}>Agregar pasajero</MButton></Cta>
      )}
    </div>
  );
}

const PAISES_M = [{ v: 'PE', l: 'Perú' }, { v: 'CL', l: 'Chile' }, { v: 'EC', l: 'Ecuador' }, { v: 'CO', l: 'Colombia' }, { v: 'AR', l: 'Argentina' }, { v: 'OT', l: 'Otro país' }];
const docsM = (pais) => (pais === 'PE' ? TIPOS_DOC : [{ v: 'PAS', l: 'Pasaporte' }, { v: 'ID', l: 'Documento de identidad' }]);

function FormPasajero({ inicial, modo, onBack, onGuardar, onEliminar, fallar }) {
  const [p, setP] = uSt(inicial);
  const [tocado, setTocado] = uSt({});
  const [verErr, setVerErr] = uSt(false);
  const [estado, setEstado] = uSt('idle');
  const [confirmar, setConfirmar] = uSt(false);
  const set = (patch) => { setP({ ...p, ...patch }); setEstado('idle'); };

  const errs = {};
  if (!p.doc.trim()) errs.doc = 'Ingresa el número de documento.';
  else if (p.tipoDoc === 'DNI' && !/^\d{8}$/.test(p.doc)) errs.doc = 'El DNI tiene 8 dígitos, sin puntos ni espacios.';
  if (!p.nombres.trim()) errs.nombres = 'Ingresa los nombres tal como figuran en el documento.';
  if (!p.apellidos.trim()) errs.apellidos = 'Ingresa los apellidos tal como figuran en el documento.';
  if (!p.fnac) errs.fnac = 'Ingresa una fecha de nacimiento válida.';
  const ver = (c) => (verErr || tocado[c]) && errs[c];
  const tocar = (c) => setTocado({ ...tocado, [c]: true });

  const enviar = () => {
    if (Object.keys(errs).length) { setVerErr(true); return; }
    setEstado('saving');
    setTimeout(() => {
      if (fallar) { setEstado('error'); return; }
      setEstado('idle');
      onGuardar(p, modo === 'nuevo' ? 'Pasajero guardado' : 'Cambios guardados');
    }, 1100);
  };

  return (
    <div className="tc-screen">
      <Bar titulo={modo === 'nuevo' ? 'Agregar pasajero' : 'Editar pasajero'} onBack={onBack} />
      <main className="mb-content with-cta">
        <div className="card-plain">
          <Field label="País de emisión del documento" htmlFor="p-pais">
            <Select id="p-pais" value={p.pais} options={PAISES_M}
              onChange={(v) => set({ pais: v, tipoDoc: docsM(v).some((d) => d.v === p.tipoDoc) ? p.tipoDoc : docsM(v)[0].v })} />
          </Field>
          <Field label="Documento" htmlFor="p-doc" required error={ver('doc')}>
            <div className="f-doc">
              <Select id="p-tipo" value={p.tipoDoc} options={docsM(p.pais)} onChange={(v) => set({ tipoDoc: v })} compact />
              <TextInput id="p-doc" value={p.doc} error={ver('doc')} inputMode="numeric" maxLength={p.tipoDoc === 'DNI' ? 8 : 15}
                placeholder={p.tipoDoc === 'DNI' ? '72422111' : 'Número'}
                onChange={(v) => set({ doc: p.tipoDoc === 'DNI' ? v.replace(/\D/g, '') : v })} onBlur={() => tocar('doc')} />
            </div>
          </Field>
          <Field label="Nombres" htmlFor="p-nom" required error={ver('nombres')}>
            <TextInput id="p-nom" value={p.nombres} error={ver('nombres')} autoCapitalize="words" placeholder="Como figura en el documento"
              onChange={(v) => set({ nombres: v })} onBlur={() => tocar('nombres')} />
          </Field>
          <Field label="Apellidos" htmlFor="p-ape" required error={ver('apellidos')}>
            <TextInput id="p-ape" value={p.apellidos} error={ver('apellidos')} autoCapitalize="words" placeholder="Como figura en el documento"
              onChange={(v) => set({ apellidos: v })} onBlur={() => tocar('apellidos')} />
          </Field>
          <Field label="Fecha de nacimiento" htmlFor="p-fnac" required error={ver('fnac')}
            hint={!p.fnac ? 'La usamos para aplicar descuentos de menores y adultos mayores.' : null}>
            <DatePicker id="p-fnac" value={p.fnac} error={ver('fnac')} onChange={(v) => { set({ fnac: v }); tocar('fnac'); }} />
          </Field>
          <Field label="Etiqueta" htmlFor="p-alias" hint="Opcional. Te ayuda a reconocerlo al comprar: Mamá, Pareja, Hijo.">
            <TextInput id="p-alias" value={p.alias} maxLength={16} placeholder="Mamá" onChange={(v) => set({ alias: v })} />
          </Field>
        </div>

        {estado === 'error' && (
          <div style={{ marginTop: 16 }}><Alerta tono="err" titulo="No pudimos guardar el pasajero">Revisa tu conexión e inténtalo otra vez.</Alerta></div>
        )}

        {modo === 'editar' && (
          <div className="dz">
            <button className="dz-btn" onClick={() => setConfirmar(true)}>
              <MIcon name="trash" size={18} color="var(--color-error)" />Eliminar pasajero
            </button>
          </div>
        )}
      </main>
      <Cta>
        <MButton fullWidth disabled={estado === 'saving'} onClick={enviar}>
          {estado === 'saving' ? <MIcon name="loader" size={18} color="#fff" className="spin" /> : modo === 'nuevo' ? 'Guardar pasajero' : 'Guardar cambios'}
        </MButton>
      </Cta>
      <Dialogo open={confirmar} titulo="¿Eliminar este pasajero?"
        texto={`Se borrarán los datos guardados de ${p.nombres || 'este pasajero'}. Los pasajes ya comprados a su nombre no cambian.`}
        confirmar="Eliminar pasajero" destructivo onClose={() => setConfirmar(false)}
        onConfirm={() => { setConfirmar(false); onEliminar(p.id); }} />
      <div id="sheet-host" />
    </div>
  );
}

/* ------------------------------- Notificaciones ------------------------------ */
function Notificaciones({ prefs, setPrefs, onBack, avisar }) {
  const cambiar = (k) => (v) => { setPrefs({ ...prefs, [k]: v }); avisar({ txt: 'Preferencia guardada' }); };
  return (
    <div className="tc-screen">
      <Bar titulo="Notificaciones" onBack={onBack} />
      <main className="mb-content">
        <p className="mb-desc">Elige qué avisos quieres recibir. Los cambios se guardan solos.</p>
        <Sec label="Viajes">
          <div className="card-plain sw-card">
            <SwitchRow titulo="Recordatorios de viaje" desc="Aviso el día anterior y horas antes de la salida." on={prefs.recordatorios} onChange={cambiar('recordatorios')} />
            <SwitchRow titulo="Información de mi servicio" desc="Cambios de horario, andén o cancelaciones." on disabled nota="Siempre activo" onChange={() => {}} />
          </div>
        </Sec>
        <Sec label="Compras">
          <div className="card-plain sw-card">
            <SwitchRow titulo="Confirmaciones y cambios de compra" desc="Pago aprobado, anulaciones y devoluciones." on={prefs.compras} onChange={cambiar('compras')} />
          </div>
        </Sec>
        <Sec label="Promociones">
          <div className="card-plain sw-card">
            <SwitchRow titulo="Promociones y novedades" desc="Descuentos y nuevas rutas. Como máximo una vez por semana." on={prefs.promos} onChange={cambiar('promos')} />
          </div>
        </Sec>
        <p className="tc-tail"><b>Pendiente:</b> confirmar con backend qué canales soporta cada preferencia (push, correo o ambos) antes de mostrarlos por separado.</p>
      </main>
    </div>
  );
}

/* --------------------------- Privacidad y seguridad -------------------------- */
function Privacidad({ onBack, ir }) {
  return (
    <div className="tc-screen">
      <Bar titulo="Privacidad y seguridad" onBack={onBack} />
      <main className="mb-content">
        <Sec label="Seguridad">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="key" titulo="Cambiar contraseña" desc="Actualiza la contraseña de tu cuenta" onClick={() => ir('password')} />
            <Row icon="shield" titulo="Verificación en dos pasos" desc="Un código adicional al iniciar sesión" onClick={() => ir('seg2fa')} />
          </div></div>
        </Sec>
        <Sec label="Privacidad">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="shield" titulo="Información sobre privacidad" desc="Qué datos usamos y para qué" onClick={() => ir('privacidad-doc')} />
          </div></div>
        </Sec>
        <Sec label="Cuenta">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="cog" titulo="Gestión de cuenta" desc="Acciones sobre tu cuenta" onClick={() => ir('gestion')} />
          </div></div>
        </Sec>
      </main>
    </div>
  );
}

/* ---------------------------- Cambiar contraseña ----------------------------- */
/* Pendiente: confirmar la política real de contraseñas del backend. */
const REGLAS = [
  { k: 'len', t: 'Al menos 8 caracteres', ok: (v) => v.length >= 8 },
  { k: 'letra', t: 'Una letra', ok: (v) => /[a-zá-ú]/i.test(v) },
  { k: 'num', t: 'Un número', ok: (v) => /\d/.test(v) },
];

function PassField({ id, label, value, onChange, error, hint, autoFocus }) {
  const [ver, setVer] = uSt(false);
  return (
    <Field label={label} htmlFor={id} required error={error} hint={hint}>
      <div className={'f-ctl' + (error ? ' err' : '')}>
        <input id={id} className="f-in" type={ver ? 'text' : 'password'} value={value} autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
        <button className="tc-icon-btn" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          <MIcon name={ver ? 'eyeoff' : 'eye'} size={18} color="var(--text-secondary)" />
        </button>
      </div>
    </Field>
  );
}

function Password({ onBack, avisar, fallar }) {
  const [actual, setActual] = uSt('');
  const [nueva, setNueva] = uSt('');
  const [rep, setRep] = uSt('');
  const [estado, setEstado] = uSt('idle');
  const [errActual, setErrActual] = uSt(null);
  const [verErr, setVerErr] = uSt(false);

  const cumple = REGLAS.every((r) => r.ok(nueva));
  const errRep = rep && rep !== nueva ? 'Las contraseñas no coinciden.' : null;
  const listo = actual && cumple && rep === nueva && rep.length > 0;

  const enviar = () => {
    if (!listo) { setVerErr(true); return; }
    setEstado('saving'); setErrActual(null);
    setTimeout(() => {
      if (fallar) { setEstado('idle'); setErrActual('La contraseña actual no es correcta.'); return; }
      setEstado('idle'); avisar({ txt: 'Contraseña actualizada' }); onBack();
    }, 1200);
  };

  return (
    <div className="tc-screen">
      <Bar titulo="Cambiar contraseña" onBack={onBack} />
      <main className="mb-content with-cta">
        <div className="card-plain">
          <PassField id="p-act" label="Contraseña actual" value={actual} onChange={(v) => { setActual(v); setErrActual(null); }} error={errActual} />
          <PassField id="p-new" label="Nueva contraseña" value={nueva} onChange={setNueva} />
          <ul className="req" aria-label="Requisitos de la contraseña">
            {REGLAS.map((r) => {
              const ok = r.ok(nueva);
              return (
                <li key={r.k} className={ok ? 'ok' : verErr && nueva ? 'no' : ''}>
                  <MIcon name={ok ? 'check' : 'info'} size={13} />{r.t}
                </li>
              );
            })}
          </ul>
          <PassField id="p-rep" label="Confirmar nueva contraseña" value={rep} onChange={setRep} error={errRep} />
        </div>
        <p className="tc-tail"><b>Pendiente:</b> confirmar con backend la política real de contraseñas antes de publicar estos requisitos.</p>
      </main>
      <Cta>
        <MButton fullWidth disabled={!listo || estado === 'saving'} onClick={enviar}>
          {estado === 'saving' ? <MIcon name="loader" size={18} color="#fff" className="spin" /> : 'Cambiar contraseña'}
        </MButton>
        {!listo && estado !== 'saving' && <p className="cta-hint">Completa los tres campos para continuar.</p>}
      </Cta>
    </div>
  );
}

/* ----------------------------- Gestión de cuenta ----------------------------- */
function Gestion({ onBack, onEliminar }) {
  const [paso, setPaso] = uSt(0);
  return (
    <div className="tc-screen">
      <Bar titulo="Gestión de cuenta" onBack={onBack} />
      <main className="mb-content">
        <p className="mb-desc">Acciones sobre tu cuenta de Transportes Chiclayo.</p>
        <div className="card-plain">
          <h3 className="title-small" style={{ margin: 0 }}>Eliminar mi cuenta</h3>
          <p className="body-small" style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Al eliminar tu cuenta borramos tu perfil, tus pasajeros frecuentes y tus preferencias. No podrás ingresar con este correo otra vez.
          </p>
          <ul className="consec">
            <li>Los pasajes ya comprados siguen siendo válidos y viajan a nombre del pasajero, no de la cuenta.</li>
            <li>El historial de compras deja de estar disponible en la app.</li>
            <li>La acción no se puede deshacer.</li>
          </ul>
          <div className="dz" style={{ marginTop: 4 }}>
            <button className="dz-btn" onClick={() => setPaso(1)}><MIcon name="trash" size={18} color="var(--color-error)" />Eliminar mi cuenta</button>
          </div>
        </div>
        <p className="tc-tail"><b>Pendiente:</b> definir con legal y backend el plazo de conservación de datos y si la eliminación es inmediata o programada.</p>
      </main>
      <Dialogo open={paso === 1} titulo="¿Eliminar tu cuenta?"
        texto="Perderás tu perfil, tus pasajeros frecuentes y el historial de compras en la app. No se puede deshacer."
        confirmar="Sí, eliminar mi cuenta" destructivo onClose={() => setPaso(0)} onConfirm={() => setPaso(2)} />
      <Dialogo open={paso === 2} titulo="Confirma una vez más"
        texto="Esta es la última confirmación. Al continuar eliminamos tu cuenta y cerramos tu sesión en este dispositivo."
        confirmar="Eliminar definitivamente" cancelar="Mejor no" destructivo onClose={() => setPaso(0)}
        onConfirm={() => { setPaso(0); onEliminar(); }} />
    </div>
  );
}

/* ------------------------------ Ayuda y contacto ----------------------------- */
function Ayuda({ onBack, ir }) {
  return (
    <div className="tc-screen">
      <Bar titulo="Ayuda y contacto" onBack={onBack} />
      <main className="mb-content">
        <p className="mb-desc">Cuéntanos qué necesitas y te llevamos al canal correcto.</p>
        <Sec label="Centro de ayuda">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="faq" titulo="Preguntas frecuentes" desc="Cambios, anulaciones, equipaje y embarque" onClick={() => {}} />
          </div></div>
        </Sec>
        <Sec label="Contacto">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="chat" titulo="Escríbenos por WhatsApp" desc="Respondemos en horario de atención" onClick={() => {}} />
            <Row icon="headset" titulo="Canales de atención" desc="Teléfonos y correos publicados por la empresa" onClick={() => {}} />
            <Row icon="pin" titulo="Agencias" desc="Direcciones y horarios de nuestros terminales" onClick={() => {}} />
          </div></div>
        </Sec>
        <Sec label="Documentos">
          <div className="card-plain p0"><div className="ct-lista">
            <Row icon="doc" titulo="Términos y condiciones" onClick={() => ir('terminos')} />
          </div></div>
        </Sec>
        <p className="tc-tail"><b>Pendiente:</b> confirmar números, horarios y si el libro de reclamaciones se atiende dentro de la app.</p>
      </main>
    </div>
  );
}

/* --------------------------- Términos (consulta) ----------------------------- */
function TerminosConsulta({ secciones, onBack }) {
  return (
    <div className="tc-screen">
      <Bar titulo="Términos y condiciones" onBack={onBack} />
      <main className="mb-content lectura">
        <h2 className="lec-h1">Condiciones de compra y viaje</h2>
        <p className="lec-meta">Versión y fecha de publicación pendientes del área legal. Aquí solo consultas el documento; la aceptación se hace al comprar.</p>
        {secciones.map((s) => (
          <section className="lec-sec" key={s.n}>
            <h3><span>{s.n}.</span> {s.t}</h3>
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}
        <p className="tc-tail">Documento de muestra. El texto definitivo lo entrega el área legal.</p>
      </main>
    </div>
  );
}

/* -------------------------- Información de privacidad ------------------------ */
function PrivacidadDoc({ onBack }) {
  return (
    <div className="tc-screen">
      <Bar titulo="Información sobre privacidad" onBack={onBack} />
      <main className="mb-content lectura">
        <h2 className="lec-h1">Cómo tratamos tus datos</h2>
        <p className="lec-meta">Resumen de consulta. El documento completo lo entrega el área legal.</p>
        <section className="lec-sec">
          <h3><span>1.</span> Qué datos guardamos</h3>
          <p>Tu nombre, documento de identidad, correo y teléfono, además de los pasajes que compras y los pasajeros que guardas.</p>
        </section>
        <section className="lec-sec">
          <h3><span>2.</span> Para qué los usamos</h3>
          <p>Para emitir tus pasajes, avisarte de cambios en tu viaje y cumplir las obligaciones legales del transporte de pasajeros.</p>
        </section>
        <section className="lec-sec">
          <h3><span>3.</span> Tus derechos</h3>
          <p>Puedes pedir acceso, corrección o eliminación de tus datos por los canales de atención publicados en la aplicación.</p>
        </section>
        <p className="tc-tail"><b>Pendiente:</b> enlazar la política de privacidad oficial cuando el área legal la publique.</p>
      </main>
    </div>
  );
}

Object.assign(window, { MIcon, Bar, Sec, Row, Alerta, Switch, SwitchRow, Vacio, Dialogo, Toast, Cta, Cargando, MisDatos, ListaPasajeros, FormPasajero, Notificaciones, Privacidad, Password, Gestion, Ayuda, TerminosConsulta, PrivacidadDoc, TIPOS_DOC });
