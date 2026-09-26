/* Controles de formulario en estilo Material 3 del Design System de Transportes Chiclayo.
   El DS publica Button, TextField y Card; Select, DatePicker y Phone no existen todavía,
   así que se construyen sobre los mismos tokens y la misma caja outlined de 52 px. */
const { useState: uS, useRef: uR, useEffect: uE, useMemo: uM } = React;

const P_ICONS = {
  left: ['<path d="m15 18-6-6 6-6"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  down: ['<path d="m6 9 6 6 6-6"/>'],
  up: ['<path d="m18 15-6-6-6 6"/>'],
  alert: ['<path d="M12 8v5"/>', '<path d="M12 16.5h.01"/>', '<circle cx="12" cy="12" r="9"/>'],
  cal: ['<rect x="3" y="5" width="18" height="16" rx="2"/>', '<path d="M8 3v4"/>', '<path d="M16 3v4"/>', '<path d="M3 10h18"/>'],
  seat: ['<path d="M6 4h12v9H6z"/>', '<path d="M4 13h16v5H4z"/>', '<path d="M6 18v2"/>', '<path d="M18 18v2"/>'],
  mail: ['<rect x="3" y="5" width="18" height="14" rx="2"/>', '<path d="m3.5 6.5 8.5 6 8.5-6"/>'],
  phone: ['<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/>'],
  loader: ['<path d="M12 3a9 9 0 1 0 9 9"/>'],
  x: ['<path d="M18 6 6 18"/>', '<path d="M6 6l12 12"/>'],
  edit: ['<path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z"/>'],
  arrow: ['<path d="M5 12h14"/>', '<path d="m12 5 7 7-7 7"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5h.01"/>'],
  clock: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 7.5V12l3 2"/>'],
};

function PIcon({ name, size = 20, color = 'currentColor', className, style }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: P_ICONS[name].join('') }} aria-hidden="true" />;
}

/* Campo base: label + caja outlined + mensaje de ayuda/error/éxito.
   Un solo lugar decide los estados (vacío, focus, completo, error, disabled, loading). */
function Field({ label, hint, error, ok, loading, children, htmlFor, required }) {
  const msg = error || ok || hint;
  const tone = error ? 'err' : ok ? 'ok' : '';
  return (
    <div className="f">
      {label && <label className="f-lab" htmlFor={htmlFor}>{label}{required && <span className="f-req"> *</span>}</label>}
      {children}
      {msg && (
        <p className={'f-msg ' + tone} role={error ? 'alert' : undefined}>
          {error && <PIcon name="alert" size={13} />}
          {ok && !error && <PIcon name="check" size={13} />}
          {loading && !error && !ok && <PIcon name="loader" size={13} className="spin" />}
          <span>{msg}</span>
        </p>
      )}
    </div>
  );
}

function TextInput({ id, value, onChange, onBlur, placeholder, error, disabled, inputMode, maxLength, autoCapitalize, type = 'text', endSlot }) {
  return (
    <div className={'f-ctl' + (error ? ' err' : '') + (disabled ? ' dis' : '')}>
      <input id={id} className="f-in" type={type} value={value} disabled={disabled} inputMode={inputMode} maxLength={maxLength} autoCapitalize={autoCapitalize}
        placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} />
      {endSlot}
    </div>
  );
}

function Select({ id, value, onChange, options, error, disabled, compact }) {
  return (
    <div className={'f-ctl' + (error ? ' err' : '') + (disabled ? ' dis' : '') + (compact ? ' compact' : '')}>
      <select id={id} className="f-in f-sel" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <PIcon name="down" size={18} color="var(--text-secondary)" />
    </div>
  );
}

/* ---------------- DatePicker ----------------
   Hoja inferior dentro del teléfono: navegación por mes y selector de año,
   porque una fecha de nacimiento está lejos del mes actual. */
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const hoy = new Date();

function fmt(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function DatePicker({ id, value, onChange, error, disabled, placeholder = 'DD/MM/AAAA' }) {
  const [open, setOpen] = uS(false);
  const [anio, setAnio] = uS(() => (value ? +value.split('-')[0] : 1998));
  const [mes, setMes] = uS(() => (value ? +value.split('-')[1] - 1 : 0));
  const [vistaAnios, setVistaAnios] = uS(false);
  const host = document.getElementById('sheet-host');

  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const total = new Date(anio, mes + 1, 0).getDate();
  const anios = uM(() => Array.from({ length: 100 }, (_, i) => hoy.getFullYear() - i), []);
  const sel = value ? { y: +value.split('-')[0], m: +value.split('-')[1] - 1, d: +value.split('-')[2] } : null;

  const paso = (n) => {
    const t = new Date(anio, mes + n, 1);
    setAnio(t.getFullYear()); setMes(t.getMonth());
  };
  const elegir = (d) => {
    onChange(`${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    setOpen(false); setVistaAnios(false);
  };

  return (
    <>
      <button id={id} type="button" className={'f-ctl f-btn' + (error ? ' err' : '') + (disabled ? ' dis' : '')} disabled={disabled} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-invalid={!!error}>
        <PIcon name="cal" size={18} color="var(--text-secondary)" />
        <span className={value ? 'f-val' : 'f-ph'}>{value ? fmt(value) : placeholder}</span>
      </button>
      {open && host && ReactDOM.createPortal(
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Fecha de nacimiento">
          <div className="sheet-bg" onClick={() => { setOpen(false); setVistaAnios(false); }} />
          <div className="sheet">
            <div className="sheet-grab" />
            <div className="sheet-h">
              <h3>Fecha de nacimiento</h3>
              <button className="tc-icon-btn" onClick={() => { setOpen(false); setVistaAnios(false); }} aria-label="Cerrar"><PIcon name="x" size={20} color="var(--text-secondary)" /></button>
            </div>
            <div className="cal-nav">
              <button className="cal-mes" onClick={() => setVistaAnios((v) => !v)} aria-expanded={vistaAnios}>
                {MESES[mes]} {anio}<PIcon name={vistaAnios ? 'up' : 'down'} size={16} />
              </button>
              {!vistaAnios && (
                <span className="cal-arrows">
                  <button className="tc-icon-btn" onClick={() => paso(-1)} aria-label="Mes anterior"><PIcon name="left" size={20} /></button>
                  <button className="tc-icon-btn" onClick={() => paso(1)} aria-label="Mes siguiente"><PIcon name="left" size={20} style={{ transform: 'rotate(180deg)' }} /></button>
                </span>
              )}
            </div>
            {vistaAnios ? (
              <div className="cal-anios">
                {anios.map((a) => (
                  <button key={a} className={'cal-anio' + (a === anio ? ' on' : '')} onClick={() => { setAnio(a); setVistaAnios(false); }}>{a}</button>
                ))}
              </div>
            ) : (
              <>
                <div className="cal-dow">{DIAS.map((d, i) => <span key={i}>{d}</span>)}</div>
                <div className="cal-grid">
                  {Array.from({ length: primerDia }, (_, i) => <span key={'e' + i} />)}
                  {Array.from({ length: total }, (_, i) => {
                    const d = i + 1;
                    const futuro = new Date(anio, mes, d) > hoy;
                    const on = sel && sel.y === anio && sel.m === mes && sel.d === d;
                    return <button key={d} className={'cal-d' + (on ? ' on' : '')} disabled={futuro} onClick={() => elegir(d)}>{d}</button>;
                  })}
                </div>
              </>
            )}
            <span className="tc-safe" />
          </div>
        </div>, host)}
    </>
  );
}

/* Teléfono con prefijo internacional: un solo control, el prefijo no se puede
   confundir con el número porque van separados por un divisor. */
const PREFIJOS = [
  { v: '+51', l: '+51', pais: 'Perú', dig: 9, ej: '999 999 999' },
  { v: '+56', l: '+56', pais: 'Chile', dig: 9, ej: '9 9999 9999' },
  { v: '+593', l: '+593', pais: 'Ecuador', dig: 9, ej: '99 999 9999' },
  { v: '+57', l: '+57', pais: 'Colombia', dig: 10, ej: '300 000 0000' },
  { v: '+54', l: '+54', pais: 'Argentina', dig: 10, ej: '11 0000 0000' },
];

function PhoneInput({ id, prefijo, numero, onPrefijo, onNumero, onBlur, error, disabled }) {
  const cfg = PREFIJOS.find((p) => p.v === prefijo) || PREFIJOS[0];
  return (
    <div className={'f-ctl f-group' + (error ? ' err' : '') + (disabled ? ' dis' : '')}>
      <select className="f-in f-sel f-pref" value={prefijo} onChange={(e) => onPrefijo(e.target.value)} disabled={disabled} aria-label="Prefijo del país">
        {PREFIJOS.map((p) => <option key={p.v} value={p.v}>{p.l} {p.pais}</option>)}
      </select>
      <PIcon name="down" size={16} color="var(--text-secondary)" />
      <span className="f-div" />
      <input id={id} className="f-in" value={numero} disabled={disabled} inputMode="tel" maxLength={cfg.dig}
        placeholder={cfg.ej} onChange={(e) => onNumero(e.target.value.replace(/[^\d]/g, ''))} onBlur={onBlur} aria-invalid={!!error} />
    </div>
  );
}

Object.assign(window, { PIcon, Field, TextInput, Select, DatePicker, PhoneInput, PREFIJOS, fmt, MESES });
