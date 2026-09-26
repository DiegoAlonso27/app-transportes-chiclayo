const { useState, useMemo, useRef, useEffect } = React;
const DSA = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button, Card } = DSA;

const A_ICONS = {
  left: ['<path d="m15 18-6-6 6-6"/>'],
  arrow: ['<path d="M5 12h14"/>', '<path d="m12 5 7 7-7 7"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  down: ['<path d="m6 9 6 6 6-6"/>'],
  wheel: ['<circle cx="12" cy="12" r="9"/>', '<circle cx="12" cy="12" r="3.2"/>', '<path d="M12 3v5.8"/>', '<path d="m4.2 16.5 5-2.9"/>', '<path d="m19.8 16.5-5-2.9"/>'],
  stairs: ['<path d="M4 20h4v-4h4v-4h4V8h4"/>'],
  wc: ['<path d="M6 21v-6"/>', '<path d="M4 15h4l-1-6H5l-1 6Z"/>', '<circle cx="6" cy="5" r="2"/>', '<circle cx="17" cy="5" r="2"/>', '<path d="M17 21v-5"/>', '<path d="m13.5 15 1.5-6h4l1.5 6"/>'],
  door: ['<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/>', '<path d="M3 21h16"/>', '<path d="M12 12h.01"/>'],
  moon: ['<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'],
  seatIcon: ['<path d="M6 4h12v9H6z"/>', '<path d="M4 13h16v5H4z"/>', '<path d="M6 18v2"/>', '<path d="M18 18v2"/>'],
  pin: ['<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/>', '<circle cx="12" cy="10" r="2.5"/>'],
};

function AIcon({ name, size = 20, color = 'currentColor', style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: A_ICONS[name].join('') }} aria-hidden="true" />;
}

/* ------------------------------------------------------------------
   Datos del plano. Simulan la respuesta del backend para el servicio:
   el layout es una matriz de celdas y la disponibilidad viene aparte.
   Tokens: "12" asiento · "." pasillo · "_" vacío
           CD conductor · WC baño · ES escalera · PT puerta
   Celdas especiales contiguas iguales se fusionan (span).
-------------------------------------------------------------------*/
const BUSES = {
  cama: {
    nombre: 'Bus Cama',
    viaje: { origen: 'Chiclayo', destino: 'Piura', sale: '18:45', llega: '22:15', dur: '3 h 30 min', diaSiguiente: false, embarque: 'Av. José Leonardo Ortiz 1520, Terminal Bolognesi', desembarque: 'Av. Sánchez Cerro 1180, Terminal Piura' },
    pisos: [
      {
        id: 'p1', nombre: 'Piso 1', clase: 'Cama 160°', precio: 65,
        plano: [
          'CD CD . PT',
          '01 02 . 03',
          '04 05 . 06',
          '07 08 . 09',
          '10 11 . 12',
          'WC WC . ES',
        ],
        ocupados: [1, 2, 4, 5, 6, 7, 8, 10, 11],
      },
      {
        id: 'p2', nombre: 'Piso 2', clase: 'Semi cama 140°', precio: 43,
        plano: [
          'ES ES . _ _',
          '13 14 . 16 15',
          '17 18 . 19 20',
          '21 22 . _ _',
          '24 23 . 26 25',
          '27 28 . 30 29',
          '31 32 . 34 33',
          '35 36 . 38 37',
          '39 40 . 42 41',
          '43 44 . 46 45',
        ],
        ocupados: [21, 22, 27, 31, 45, 46],
        precios: { 13: 49, 14: 49, 16: 49, 15: 49 },
      },
    ],
  },
  semi: {
    nombre: 'Bus Semi cama',
    viaje: { origen: 'Chiclayo', destino: 'Piura', sale: '23:30', llega: '03:00', dur: '3 h 30 min', diaSiguiente: true, embarque: 'Av. José Leonardo Ortiz 1520, Terminal Bolognesi', desembarque: 'Av. Sánchez Cerro 1180, Terminal Piura' },
    pisos: [
      {
        id: 'u', nombre: 'Piso único', clase: 'Semi cama 140°', precio: 31,
        plano: [
          'CD CD . _ PT',
          '01 02 . 04 03',
          '05 06 . 08 07',
          '09 10 . 12 11',
          '13 14 . 16 15',
          'WC WC . 18 17',
          '19 20 . 22 21',
          '23 24 . 26 25',
          '27 28 . 30 29',
          '31 32 34 33 35',
        ],
        ocupados: [2, 6, 9, 12, 17, 20, 25, 26, 33],
        precios: { 1: 38, 2: 38, 3: 38, 4: 38 },
      },
    ],
  },
};
// Caso: todos los asientos ocupados
BUSES.lleno = {
  ...BUSES.semi,
  nombre: 'Bus Semi cama (sin cupos)',
  pisos: [{ ...BUSES.semi.pisos[0], ocupados: Array.from({ length: 35 }, (_, i) => i + 1) }],
};

const ESPECIALES = { CD: { icon: 'wheel', label: 'Conductor' }, WC: { icon: 'wc', label: 'Baño' }, ES: { icon: 'stairs', label: 'Escalera' }, PT: { icon: 'door', label: 'Puerta' } };

// Convierte el plano en celdas con span; no depende de un bus concreto.
function parsePiso(piso) {
  const filas = piso.plano.map((f) => f.trim().split(/\s+/));
  const nCols = Math.max(...filas.map((f) => f.length));
  const pasillos = Array.from({ length: nCols }, (_, c) => filas.every((f) => (f[c] || '_') === '.'));
  const celdas = filas.map((f, r) => {
    const out = [];
    for (let c = 0; c < nCols; c++) {
      const t = f[c] || '_';
      const prev = out[out.length - 1];
      if (ESPECIALES[t] && prev && prev.tipo === t) { prev.span++; continue; }
      if (t === '.') out.push({ tipo: 'pasillo', span: 1, key: `${r}-${c}` });
      else if (t === '_') out.push({ tipo: 'vacio', span: 1, key: `${r}-${c}` });
      else if (ESPECIALES[t]) out.push({ tipo: t, span: 1, key: `${r}-${c}` });
      else {
        const n = parseInt(t, 10);
        out.push({ tipo: 'asiento', span: 1, key: `${r}-${c}`, n, estado: piso.ocupados.includes(n) ? 'ocupado' : 'libre', precio: (piso.precios && piso.precios[n]) || piso.precio });
      }
    }
    return out;
  });
  const totales = celdas.flat().filter((c) => c.tipo === 'asiento');
  return { celdas, pasillos, nCols, libres: totales.filter((c) => c.estado === 'libre').length, total: totales.length, minPrecio: Math.min(...totales.map((c) => c.precio)) };
}

function Asiento({ c, sel, onToggle, bloqueado }) {
  const estado = sel ? 'sel' : c.estado;
  const label = `Asiento ${c.n}, ${estado === 'sel' ? 'seleccionado' : estado === 'ocupado' ? 'ocupado, no disponible' : `disponible, S/ ${c.precio}`}`;
  return (
    <button
      className={'seat seat-' + estado}
      onClick={() => onToggle(c)}
      disabled={c.estado === 'ocupado' || (bloqueado && !sel)}
      aria-pressed={estado === 'sel'}
      aria-label={label}
    >
      <span className="seat-num">{c.n}</span>
      {estado === 'sel' && <span className="seat-mark"><AIcon name="check" size={11} color="var(--color-primary)" /></span>}
      {estado === 'ocupado' && <span className="seat-x" aria-hidden="true" />}
    </button>
  );
}

function Croquis({ piso, datos, seleccion, onToggle, bloqueado }) {
  const cols = datos.pasillos.map((p) => (p ? 'minmax(14px,0.45fr)' : 'minmax(40px,1fr)')).join(' ');
  return (
    <div className="croquis" role="group" aria-label={`Croquis del ${piso.nombre}`}>
      <div className="croquis-front"><span /><span className="croquis-front-l"><AIcon name="arrow" size={13} style={{ transform: 'rotate(-90deg)' }} />Frente del bus</span><span /></div>
      <div className="croquis-grid" style={{ gridTemplateColumns: cols }}>
        {datos.celdas.map((fila, r) => fila.map((c) => {
          if (c.tipo === 'pasillo') return <span key={c.key} className="cell-aisle" style={{ gridColumn: `span ${c.span}` }} />;
          if (c.tipo === 'vacio') return <span key={c.key} style={{ gridColumn: `span ${c.span}` }} />;
          if (ESPECIALES[c.tipo]) {
            const e = ESPECIALES[c.tipo];
            return (
              <span key={c.key} className="cell-fix" style={{ gridColumn: `span ${c.span}` }}>
                <AIcon name={e.icon} size={16} color="var(--gray-500)" />
                <span>{e.label}</span>
              </span>
            );
          }
          return <Asiento key={c.key} c={c} sel={seleccion.some((s) => s.piso === piso.id && s.n === c.n)} onToggle={onToggle} bloqueado={bloqueado} />;
        }))}
      </div>
    </div>
  );
}

const MAX = 4;

function Asientos({ busKey, viaje, onBack, onContinuar } = {}) {
  const bus = BUSES[busKey];
  const vj = { ...bus.viaje, ...(viaje || {}) };
  const [pisoIdx, setPisoIdx] = useState(0);
  const [seleccion, setSeleccion] = useState([]);
  const [aviso, setAviso] = useState('');

  const idx = Math.min(pisoIdx, bus.pisos.length - 1);
  const piso = bus.pisos[idx];
  const datosPorPiso = useMemo(() => bus.pisos.map(parsePiso), [busKey]);
  const datos = datosPorPiso[idx];
  const agotado = datosPorPiso.every((d) => d.libres === 0);

  const total = seleccion.reduce((a, s) => a + s.precio, 0);
  const bloqueado = seleccion.length >= MAX;

  const toggle = (c) => {
    setSeleccion((prev) => {
      const i = prev.findIndex((s) => s.piso === piso.id && s.n === c.n);
      if (i >= 0) { setAviso(''); return prev.filter((_, k) => k !== i); }
      if (prev.length >= MAX) { setAviso(`Puedes elegir hasta ${MAX} asientos por compra.`); return prev; }
      setAviso('');
      return [...prev, { piso: piso.id, pisoNombre: bus.pisos.length > 1 ? piso.nombre : null, n: c.n, precio: c.precio }];
    });
  };

  const orden = [...seleccion].sort((a, b) => a.n - b.n);

  return (
    <div className="tc-screen">
      <header className="tc-appbar">
        <div className="tc-appbar-top">
          <button className="tc-icon-btn light" aria-label="Volver a los servicios" onClick={() => onBack && onBack()}><AIcon name="left" size={22} color="#fff" /></button>
          <h1 className="tc-title">Selecciona tu asiento</h1>
          <span style={{ width: 44 }} />
        </div>
        <div className="tc-trip">
          <div className="tc-trip-main">
            <span className="tc-trip-ruta">{vj.origen} <AIcon name="arrow" size={14} color="rgba(255,255,255,.7)" /> {vj.destino}</span>
            <span className="tc-trip-horas">
              {vj.sale} – {vj.llega}
              {vj.diaSiguiente && <span className="tc-nextday"><AIcon name="moon" size={10} />+1 día</span>}
              <span className="tc-dot">·</span>{vj.dur}
            </span>
          </div>
          <details className="tc-puntos">
            <summary>Puntos de embarque<AIcon name="down" size={14} /></summary>
            <div className="tc-punto"><AIcon name="pin" size={14} color="rgba(255,255,255,.75)" /><span><b>Salida {vj.sale}</b>{vj.embarque}</span></div>
            <div className="tc-punto"><AIcon name="pin" size={14} color="rgba(255,255,255,.75)" /><span><b>Llegada {vj.llega}</b>{vj.desembarque}</span></div>
          </details>
        </div>
      </header>

      <main className="tc-content">
        <div className="tc-stick">
          {bus.pisos.length > 1 && (
            <div className="tc-tabs" role="tablist" aria-label="Piso del bus">
              {bus.pisos.map((p, i) => (
                <button key={p.id} role="tab" aria-selected={i === idx} className={'tc-tab' + (i === idx ? ' on' : '')} onClick={() => setPisoIdx(i)}>
                  {p.nombre}
                  <span className="tc-tab-sub">{datosPorPiso[i].libres > 0 ? `${datosPorPiso[i].libres} libres` : 'Sin cupos'}</span>
                </button>
              ))}
            </div>
          )}
          <div className="tc-planoinfo">
            <span>{piso.clase} · desde <b>S/ {datos.minPrecio}</b></span>
            <span>{datos.libres} de {datos.total} disponibles</span>
          </div>
          <ul className="tc-leyenda">
            <li><span className="lg lg-libre" />Disponible</li>
            <li><span className="lg lg-sel"><AIcon name="check" size={9} color="#fff" /></span>Seleccionado</li>
            <li><span className="lg lg-occ" />Ocupado</li>
          </ul>
        </div>

        {agotado && (
          <div className="tc-agotado" role="status"><AIcon name="seatIcon" size={18} color="var(--yellow-900)" /><span><b>No quedan asientos en este servicio.</b> Vuelve a los resultados y elige otra salida.</span></div>
        )}

        <div className="tc-croquis-wrap">
          <Card padding="md">
            <Croquis piso={piso} datos={datos} seleccion={seleccion} onToggle={toggle} bloqueado={bloqueado} />
          </Card>
        </div>
        <p className="tc-tail">El número de asiento aparecerá en tu boleto. Los menores de 5 años viajan sin asiento asignado.</p>
      </main>

      <footer className="tc-cta">
        <div className="tc-resumen" aria-live="polite">
          {orden.length === 0 ? (
            <span className="tc-resumen-empty">Toca un asiento disponible para continuar</span>
          ) : (
            <>
              <span className="tc-resumen-l">
                <b>{orden.length === 1 ? `Asiento ${orden[0].n}` : `${orden.length} asientos`}</b>
                <span>{orden.length === 1 ? (orden[0].pisoNombre || piso.clase) : orden.map((s) => s.n).join(', ')}</span>
              </span>
              <span className="tc-resumen-r">S/ {total}</span>
            </>
          )}
        </div>
        {aviso && <p className="tc-aviso">{aviso}</p>}
        <Button fullWidth disabled={orden.length === 0} onClick={() => onContinuar && onContinuar(orden, total)}>
          {orden.length === 0 ? 'Continuar' : `Continuar · S/ ${total}`}
        </Button>
        <span className="tc-safe" />
      </footer>
    </div>
  );
}

function App() {
  const [busKey, setBusKey] = useState('cama');
  // Cada configuración de bus remonta la pantalla: sin selección ni piso heredados.
  useEffect(() => {
    const bar = document.getElementById('demo-bar');
    if (!bar) return;
    const h = (e) => { const b = e.target.closest('button[data-bus]'); if (!b) return; setBusKey(b.dataset.bus); [...bar.querySelectorAll('button')].forEach((x) => x.classList.toggle('on', x === b)); };
    bar.addEventListener('click', h);
    return () => bar.removeEventListener('click', h);
  }, []);
  return <Asientos key={busKey} busKey={busKey} />;
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('phone-root')).render(<App />);
Object.assign(window, { Asientos, BUSES });
