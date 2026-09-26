const { useState, useEffect, useMemo } = React;
const DSR = window.TransportesChiclayoDesignSystem_48bc0c;
const { Card } = DSR;

const R_ICONS = {
  left: ['<path d="m15 18-6-6 6-6"/>'],
  right: ['<path d="m9 18 6-6-6-6"/>'],
  arrow: ['<path d="M5 12h14"/>', '<path d="m12 5 7 7-7 7"/>'],
  clock: ['<circle cx="12" cy="12" r="10"/>', '<path d="M12 6v6l4 2"/>'],
  coin: ['<circle cx="12" cy="12" r="9"/>', '<path d="M14.5 9.5h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4"/>', '<path d="M12 7.5v9"/>'],
  down: ['<path d="M12 5v14"/>', '<path d="m19 12-7 7-7-7"/>'],
  alert: ['<path d="M12 3 2 20h20L12 3z"/>', '<path d="M12 10v4"/>', '<path d="M12 17h.01"/>'],
  block: ['<circle cx="12" cy="12" r="9"/>', '<path d="m6 6 12 12"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  moon: ['<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'],
};

function RIcon({ name, size = 20, color = 'currentColor', style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: R_ICONS[name].join('') }} aria-hidden="true" />;
}

const R_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const R_MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const HOY_R = new Date(2026, 7, 9);
const fmtLargo = (d) => `${R_DIAS[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${R_MESES[d.getMonth()]}`;

// min desde medianoche del día de salida
const SERVICIOS = [
  { id: 's1', sale: 315, dur: 210, precio: 31, tipo: 'Directo', servicio: 'Semi cama', term: 'T. Bolognesi', termLlegada: 'T. Sánchez Cerro', asientos: 22 },
  { id: 's2', sale: 780, dur: 225, precio: 35, tipo: 'Directo', servicio: 'Semi cama', term: 'T. Bolognesi', termLlegada: 'T. Sánchez Cerro', asientos: 14 },
  { id: 's3', sale: 990, dur: 210, precio: 43, tipo: 'Directo', servicio: 'Cama VIP', term: 'T. Bolognesi', termLlegada: 'T. Sánchez Cerro', asientos: 3 },
  { id: 's4', sale: 1020, dur: 210, precio: 31, tipo: '1 escala', servicio: 'Semi cama', term: 'T. Bolognesi', termLlegada: 'T. Sánchez Cerro', asientos: 0 },
  { id: 's5', sale: 1050, dur: 210, precio: 43, tipo: 'Directo', servicio: 'Cama VIP', term: 'T. Vicente de la Vega', termLlegada: 'T. Sánchez Cerro', asientos: 0 },
  { id: 's6', sale: 1290, dur: 210, precio: 43, tipo: 'Directo', servicio: 'Cama VIP', term: 'T. Bolognesi', termLlegada: 'T. Sánchez Cerro', asientos: 9 },
  { id: 's7', sale: 1380, dur: 210, precio: 31, tipo: 'Directo', servicio: 'Semi cama', term: 'T. Vicente de la Vega', termLlegada: 'T. Sánchez Cerro', asientos: 2 },
];

const hhmm = (m) => `${String(Math.floor((m % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const durTxt = (m) => `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim();

// Variación determinista por fecha: mismas salidas, distinta disponibilidad y precio.
function serviciosDe(offset) {
  return SERVICIOS.map((s, i) => {
    if (offset === 0) return s;
    const k = (i * 7 + offset * 5) % 9;
    return { ...s, asientos: k === 0 ? 0 : k <= 2 ? k + 1 : 6 + k, precio: s.precio + (offset % 2 ? 4 : 0) };
  });
}

function Chip({ tone, icon, children }) {
  return (
    <span className={'tc-flag tc-flag-' + tone}>
      <RIcon name={icon} size={13} />
      {children}
    </span>
  );
}

function Servicio({ s, estado, onSelect }) {
  const agotado = s.asientos === 0;
  const pocos = !agotado && s.asientos <= 4;
  const llega = s.sale + s.dur;
  const siguienteDia = llega >= 1440;
  const sel = estado === 'sel';
  const load = estado === 'load';
  return (
    <div className={'tc-svc-card' + (sel ? ' sel' : '') + (agotado ? ' off' : '')}><Card padding="none">
      <button
        className="tc-svc"
        disabled={agotado || load}
        aria-disabled={agotado}
        aria-pressed={sel}
        onClick={() => onSelect(s.id)}
        aria-label={`Salida ${hhmm(s.sale)}, llegada ${hhmm(llega)}${siguienteDia ? ' del día siguiente' : ''}, ${durTxt(s.dur)}, ${agotado ? 'agotado' : `S/ ${s.precio}`}`}
      >
        <div className="tc-times">
          <span className="tc-col">
            <span className="tc-hour">{hhmm(s.sale)}</span>
            <span className="tc-term">{s.term}</span>
          </span>
          <span className="tc-line"><span /><RIcon name="arrow" size={15} color="var(--gray-400)" /></span>
          <span className="tc-col end">
            <span className="tc-hour arr">
              {hhmm(llega)}
              {siguienteDia && <span className="tc-nextday"><RIcon name="moon" size={11} />+1 día</span>}
            </span>
            <span className="tc-term">{s.termLlegada}</span>
          </span>
        </div>
        <div className="tc-svc-div" />
        <div className="tc-foot">
          <span className="tc-meta">{durTxt(s.dur)} · {s.tipo} · {s.servicio}</span>
          {agotado ? (
            <span className="tc-price off">S/ {s.precio}</span>
          ) : (
            <span className="tc-price"><span className="tc-desde">desde</span> S/ {s.precio}</span>
          )}
        </div>
        {(agotado || pocos || sel || load) && (
          <div className="tc-flags">
            {agotado && <Chip tone="off" icon="block">Agotado</Chip>}
            {pocos && <Chip tone="warn" icon="alert">Últimos {s.asientos} asientos</Chip>}
            {load && <span className="tc-flag tc-flag-load"><span className="tc-mini-spin" />Cargando asientos…</span>}
            {sel && <Chip tone="sel" icon="check">Servicio elegido</Chip>}
          </div>
        )}
      </button>
    </Card></div>
  );
}

function Skeleton() {
  return (
    <div className="tc-svc-card"><Card padding="none">
      <div className="tc-svc sk">
        <div className="tc-times">
          <span className="tc-col"><span className="sk-bar w72 h26" /><span className="sk-bar w88 h11" /></span>
          <span className="tc-line"><span /></span>
          <span className="tc-col end"><span className="sk-bar w72 h26" /><span className="sk-bar w88 h11" /></span>
        </div>
        <div className="tc-svc-div" />
        <div className="tc-foot"><span className="sk-bar w140 h12" /><span className="sk-bar w72 h20" /></div>
      </div>
    </Card></div>
  );
}

function Resultados({ ruta, base, onBack, onSelect } = {}) {
  const [offset, setOffset] = useState(0);
  const [orden, setOrden] = useState('hora');
  const [dir, setDir] = useState('asc');
  const [sel, setSel] = useState(null);
  const [load, setLoad] = useState(null);
  const [buscando, setBuscando] = useState(true);

  const inicio = base || HOY_R;
  const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + offset);
  const esHoy = fecha.toDateString() === HOY_R.toDateString();
  const puedeAntes = offset > 0;

  useEffect(() => {
    setBuscando(true);
    const t = setTimeout(() => setBuscando(false), 900);
    return () => clearTimeout(t);
  }, [offset]);

  const lista = useMemo(() => {
    const base = serviciosDe(offset);
    const k = orden === 'hora' ? (a, b) => a.sale - b.sale : (a, b) => a.precio - b.precio || a.sale - b.sale;
    const out = [...base].sort(k);
    return dir === 'asc' ? out : out.reverse();
  }, [offset, orden, dir]);

  const disponibles = lista.filter((s) => s.asientos > 0);
  const minimo = disponibles.length ? Math.min(...disponibles.map((s) => s.precio)) : null;

  const cambiarFecha = (d) => { setOffset((o) => Math.max(0, o + d)); setSel(null); setLoad(null); };
  const tocarOrden = (o) => {
    if (o === orden) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setOrden(o); setDir('asc'); }
  };
  const elegir = (id) => {
    setLoad(id); setSel(null);
    setTimeout(() => { setLoad(null); setSel(id); setTimeout(() => onSelect && onSelect(lista.find((s) => s.id === id)), 520); }, 1100);
  };

  return (
    <div className="tc-screen">
      <header className="tc-appbar-res">
        <div className="tc-appbar-top">
          <button className="tc-icon-btn light" aria-label="Volver a la búsqueda" onClick={() => onBack && onBack()}><RIcon name="left" size={22} color="#fff" /></button>
          <h1 className="tc-ruta">{(ruta && ruta.origen) || 'Chiclayo'} <RIcon name="arrow" size={18} color="rgba(255,255,255,.75)" style={{ margin: '0 2px' }} /> {(ruta && ruta.destino) || 'Piura'}</h1>
          <span style={{ width: 44 }} />
        </div>
        <div className="tc-datenav">
          <button className="tc-date-arrow" onClick={() => cambiarFecha(-1)} disabled={!puedeAntes} aria-label="Día anterior"><RIcon name="left" size={18} /></button>
          <span className="tc-date-val" aria-live="polite">{fmtLargo(fecha)}{esHoy && <span className="tc-date-tag">Hoy</span>}</span>
          <button className="tc-date-arrow" onClick={() => cambiarFecha(1)} aria-label="Día siguiente"><RIcon name="right" size={18} /></button>
        </div>
      </header>

      <main className="tc-content">
        <div className="tc-sortbar">
          <div className="tc-sorts" role="group" aria-label="Ordenar resultados">
            <span className="tc-sort-label">Ordenar por</span>
            <button className={'tc-sort' + (orden === 'hora' ? ' on' : '')} onClick={() => tocarOrden('hora')} aria-pressed={orden === 'hora'}>
              <RIcon name="clock" size={16} />Horarios
              {orden === 'hora' && <RIcon name="down" size={14} style={{ transition: 'transform 150ms cubic-bezier(0.4,0,0.2,1)', transform: dir === 'asc' ? 'none' : 'rotate(180deg)' }} />}
            </button>
            <button className={'tc-sort' + (orden === 'precio' ? ' on' : '')} onClick={() => tocarOrden('precio')} aria-pressed={orden === 'precio'}>
              <RIcon name="coin" size={16} />Precio
              {orden === 'precio' && <RIcon name="down" size={14} style={{ transition: 'transform 150ms cubic-bezier(0.4,0,0.2,1)', transform: dir === 'asc' ? 'none' : 'rotate(180deg)' }} />}
            </button>
          </div>
          <p className="tc-count">
            {buscando ? 'Buscando salidas…' : <>{lista.length} salidas · {disponibles.length} con asientos · desde <b>S/ {minimo}</b></>}
          </p>
        </div>

        <div className="tc-svc-list">
          {buscando
            ? [0, 1, 2, 3].map((i) => <Skeleton key={i} />)
            : lista.map((s) => <Servicio key={s.id} s={s} estado={sel === s.id ? 'sel' : load === s.id ? 'load' : null} onSelect={elegir} />)}
        </div>
        <p className="tc-tail">Los precios pueden variar según el asiento que elijas.</p>
      </main>
    </div>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('phone-root')).render(<Resultados />);
Object.assign(window, { Resultados });
