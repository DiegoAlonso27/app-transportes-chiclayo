const { useState, useRef, useEffect } = React;
const DS = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button, TextField, Card } = DS;

const ICONS = {
  origen: ['<circle cx="12" cy="12" r="9"/>', '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>'],
  destino: ['<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>', '<circle cx="12" cy="10" r="3"/>'],
  swap: ['<path d="m21 16-4 4-4-4"/>', '<path d="M17 20V4"/>', '<path d="m3 8 4-4 4 4"/>', '<path d="M7 4v16"/>'],
  calendar: ['<rect width="18" height="18" x="3" y="4" rx="2"/>', '<path d="M16 2v4"/>', '<path d="M8 2v4"/>', '<path d="M3 10h18"/>'],
  search: ['<circle cx="11" cy="11" r="8"/>', '<path d="m21 21-4.3-4.3"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  cancel: ['<circle cx="12" cy="12" r="10"/>', '<path d="m15 9-6 6"/>', '<path d="m9 9 6 6"/>'],
  home: ['<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', '<path d="M9 22V12h6v10"/>'],
  user: ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  promo: ['<path d="m3 11 18-5v12L3 14v-3z"/>', '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'],
  help: ['<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'],
  chevron: ['<path d="m9 18 6-6-6-6"/>'],
  left: ['<path d="m15 18-6-6 6-6"/>'],
  alert: ['<circle cx="12" cy="12" r="10"/>', '<path d="M12 8v4"/>', '<path d="M12 16h.01"/>'],
  arrow: ['<path d="M5 12h14"/>', '<path d="m12 5 7 7-7 7"/>'],
  close: ['<path d="M18 6 6 18"/>', '<path d="m6 6 12 12"/>'],
};

function Icon({ name, size = 20, color = 'currentColor', style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: ICONS[name].join('') }} aria-hidden="true" />;
}

const CIUDADES = [
  { n: 'Chiclayo', t: 'Terminal Terrestre · Av. Bolognesi' },
  { n: 'Lima', t: 'Terminal Terrestre · La Victoria' },
  { n: 'Trujillo', t: 'Terminal Terrestre · Av. Ejército' },
  { n: 'Piura', t: 'Terminal Terrestre · Av. Sánchez Cerro' },
  { n: 'Jaén', t: 'Terminal Terrestre · Av. Mesones Muro' },
  { n: 'Cajamarca', t: 'Terminal Terrestre · Av. Atahualpa' },
  { n: 'Tumbes', t: 'Terminal Terrestre · Av. Tumbes Norte' },
  { n: 'Chachapoyas', t: 'Terminal Terrestre · Av. Libertad' },
];
const RECIENTES = ['Lima', 'Trujillo', 'Piura'];
const H_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const H_MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const HOY = new Date(2026, 7, 9);
const hFmt = (d) => `${H_DIAS[d.getDay()]} ${d.getDate()} ${H_MESES[d.getMonth()]}`;
const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

function HField({ icon, label, value, placeholder, onClick, error }) {
  return (
    <button onClick={onClick} className="tc-row" style={{ borderColor: error ? 'var(--color-error)' : 'transparent' }}>
      <Icon name={icon} size={20} color={value ? 'var(--color-primary)' : 'var(--gray-400)'} />
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
        <span className="label-small" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
        <span style={{ fontSize: 'var(--body-large-size)', fontWeight: 500, color: value ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || placeholder}</span>
      </span>
    </button>
  );
}

function DateField({ label, value, placeholder, onClick, half }) {
  return (
    <button onClick={onClick} className="tc-date" style={{ flex: half ? '1 1 0' : '1 1 100%' }}>
      <Icon name="calendar" size={20} color={value ? 'var(--color-primary)' : 'var(--gray-400)'} />
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span className="label-small" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
        <span style={{ fontSize: 'var(--title-small-size)', fontWeight: 500, color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>{value ? hFmt(value) : placeholder}</span>
      </span>
    </button>
  );
}

function Sheet({ open, title, onClose, children }) {
  return (
    <div className={'tc-sheet-wrap' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="tc-scrim" onClick={onClose} />
      <div className="tc-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="tc-sheet-head">
          <span className="title-large" style={{ fontSize: 18 }}>{title}</span>
          <button className="tc-icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="close" size={20} color="var(--text-secondary)" /></button>
        </div>
        <div className="tc-sheet-body">{children}</div>
      </div>
    </div>
  );
}

function CitySheet({ open, title, exclude, onPick, onClose }) {
  const [q, setQ] = useState('');
  useEffect(() => { if (open) setQ(''); }, [open]);
  const list = CIUDADES.filter((c) => c.n !== exclude && c.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <Sheet open={open} title={title} onClose={onClose}>
      <TextField placeholder="Busca una ciudad o terminal" value={q} onChange={setQ} startIcon={<Icon name="search" size={18} color="var(--gray-500)" />} />
      {!q && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {RECIENTES.filter((c) => c !== exclude).map((c) => (
            <button key={c} className="tc-chip" onClick={() => onPick(c)}>{c}</button>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
        {list.map((c) => (
          <button key={c.n} className="tc-tile" onClick={() => onPick(c.n)}>
            <Icon name="destino" size={20} color="var(--gray-500)" />
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 'var(--body-large-size)', fontWeight: 500, color: 'var(--text-primary)' }}>{c.n}</span>
              <span className="label-small" style={{ color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>{c.t}</span>
            </span>
          </button>
        ))}
        {!list.length && <p className="body-medium" style={{ color: 'var(--text-tertiary)', padding: '16px 4px' }}>No encontramos esa ciudad. Prueba con otro nombre.</p>}
      </div>
    </Sheet>
  );
}

function DateSheet({ open, title, value, min, onPick, onClose, onClear, clearLabel }) {
  const base = value || min || HOY;
  const [cursor, setCursor] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  useEffect(() => { if (open) setCursor(new Date(base.getFullYear(), base.getMonth(), 1)); }, [open]);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const limit = min || HOY;
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  const canPrev = cursor > new Date(limit.getFullYear(), limit.getMonth(), 1);
  return (
    <Sheet open={open} title={title} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button className="tc-icon-btn" disabled={!canPrev} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Mes anterior"><Icon name="left" size={20} color={canPrev ? 'var(--text-secondary)' : 'var(--gray-300)'} /></button>
        <span className="title-small">{MESES_L[cursor.getMonth()]} {cursor.getFullYear()}</span>
        <button className="tc-icon-btn" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Mes siguiente"><Icon name="chevron" size={20} color="var(--text-secondary)" /></button>
      </div>
      <div className="tc-cal-head">{H_DIAS.map((d) => <span key={d}>{d[0]}</span>)}</div>
      <div className="tc-cal">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const disabled = d < new Date(limit.getFullYear(), limit.getMonth(), limit.getDate());
          const sel = sameDay(d, value);
          return (
            <button key={i} disabled={disabled} onClick={() => onPick(d)} className={'tc-day' + (sel ? ' sel' : '')} aria-current={sel ? 'date' : undefined}>{d.getDate()}</button>
          );
        })}
      </div>
      {onClear && <div style={{ marginTop: 8 }}><Button variant="text" fullWidth onClick={onClear}>{clearLabel}</Button></div>}
    </Sheet>
  );
}

function Home({ onBuscar, onIr, onAyuda } = {}) {
  const [tipo, setTipo] = useState('ida');
  const [origen, setOrigen] = useState('Chiclayo');
  const [destino, setDestino] = useState(null);
  const [ida, setIda] = useState(new Date(2026, 7, 15));
  const [vuelta, setVuelta] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [spin, setSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('inicio');
  const listo = origen && destino && ida && (tipo === 'ida' || vuelta);

  const swap = () => {
    if (!origen && !destino) return;
    setSpin(true); setTimeout(() => setSpin(false), 320);
    setOrigen(destino); setDestino(origen);
  };
  const buscar = () => { setLoading(true); setTimeout(() => { setLoading(false); onBuscar && onBuscar({ origen, destino, ida, vuelta, tipo }); }, 1200); };
  const setTipoViaje = (t) => { setTipo(t); if (t === 'ida') setVuelta(null); else if (!vuelta) setSheet('vuelta'); };
  const usarRuta = (o, d) => { setOrigen(o); setDestino(d); };

  return (
    <div className="tc-screen">
      <header className="tc-appbar">
        <img src="assets/tc-logotipo-blanco.svg" alt="Transportes Chiclayo" style={{ height: 44 }} />
        <button className="tc-icon-btn" aria-label="Ayuda y contacto" onClick={() => onAyuda && onAyuda()}><Icon name="help" size={22} color="#ffffff" /></button>
      </header>

      <main className="tc-content">
        <section style={{ padding: '24px 16px 12px' }}>
          <h1 className="headline-small" style={{ margin: 0, color: 'var(--text-primary)' }}>¿A dónde viajas?</h1>
          <p className="body-medium" style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>Compra tu pasaje en menos de un minuto.</p>
        </section>

        <div style={{ padding: '0 16px' }}>
          <Card padding="lg">
            <div className="tc-seg" role="radiogroup" aria-label="Tipo de viaje">
              <button role="radio" aria-checked={tipo === 'ida'} className={'tc-seg-btn' + (tipo === 'ida' ? ' on' : '')} onClick={() => setTipoViaje('ida')}>Solo ida</button>
              <button role="radio" aria-checked={tipo === 'ida-vuelta'} className={'tc-seg-btn' + (tipo === 'ida-vuelta' ? ' on' : '')} onClick={() => setTipoViaje('ida-vuelta')}>Ida y vuelta</button>
            </div>

            <div className="tc-route" style={{ marginTop: 16 }}>
              <div className={'tc-route-inner' + (spin ? ' spin' : '')}>
                <HField icon="origen" label="Origen" value={origen} placeholder="Elige tu ciudad" onClick={() => setSheet('origen')} />
                <div className="tc-divider" />
                <HField icon="destino" label="Destino" value={destino} placeholder="¿A dónde vas?" onClick={() => setSheet('destino')} />
              </div>
              <button className="tc-swap" onClick={swap} aria-label="Intercambiar origen y destino">
                <Icon name="swap" size={18} color="var(--color-primary)" style={{ transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)', transform: spin ? 'rotate(180deg)' : 'none' }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <DateField label="Ida" value={ida} onClick={() => setSheet('ida')} half={tipo === 'ida-vuelta'} />
              {tipo === 'ida-vuelta' && <DateField label="Vuelta" value={vuelta} placeholder="Elige fecha" onClick={() => setSheet('vuelta')} half />}
            </div>

            <div style={{ marginTop: 16 }}>
              <Button fullWidth disabled={!listo || loading} onClick={buscar}>
                {loading ? <span className="tc-spinner" aria-label="Buscando" /> : 'Buscar pasajes'}
              </Button>
              {!listo && (
                <p className="label-small tc-hint">
                  <Icon name="alert" size={14} color="var(--text-tertiary)" />
                  {destino ? 'Elige la fecha de vuelta para continuar.' : 'Elige tu destino para ver horarios y precios.'}
                </p>
              )}
            </div>
          </Card>
        </div>

        <section className="tc-section">
          <div className="tc-section-head"><h2 className="title-small" style={{ margin: 0 }}>Rutas frecuentes</h2></div>
          <div className="tc-scroller">
            {[['Chiclayo', 'Lima', 'S/ 70', '9 salidas diarias'], ['Chiclayo', 'Trujillo', 'S/ 35', '12 salidas diarias'], ['Chiclayo', 'Jaén', 'S/ 45', '6 salidas diarias']].map(([o, d, p, s]) => (
              <button key={d} className="tc-route-card" onClick={() => usarRuta(o, d)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--title-small-size)', fontWeight: 500, color: 'var(--text-primary)' }}>{o} <Icon name="arrow" size={14} color="var(--gray-400)" /> {d}</span>
                <span className="label-small" style={{ color: 'var(--text-tertiary)' }}>{s}</span>
                <span style={{ marginTop: 'auto', fontSize: 'var(--title-medium-size)', fontWeight: 700, color: 'var(--color-primary)' }}>{p} <span className="label-small" style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>desde</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="tc-section">
          <div className="tc-section-head"><h2 className="title-small" style={{ margin: 0 }}>Tus pasajes</h2></div>
          <div style={{ padding: '0 16px' }}>
            <Card padding="none">
              <button className="tc-list" onClick={() => onIr && onIr('viajes')}>
                <Icon name="ticket" size={20} color="var(--color-primary)" />
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: 'var(--title-small-size)', fontWeight: 500 }}>Ver mi pasaje</span>
                  <span className="label-small" style={{ color: 'var(--text-tertiary)' }}>Chiclayo → Lima · Sáb 15 ago, 21:30</span>
                </span>
                <Icon name="chevron" size={18} color="var(--gray-400)" />
              </button>
              <div className="tc-divider" />
              <button className="tc-list" onClick={() => onIr && onIr('viajes')}>
                <Icon name="cancel" size={20} color="var(--text-secondary)" />
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: 'var(--title-small-size)', fontWeight: 500 }}>Anular pasaje</span>
                  <span className="label-small" style={{ color: 'var(--text-tertiary)' }}>Con tu código de reserva o DNI</span>
                </span>
                <Icon name="chevron" size={18} color="var(--gray-400)" />
              </button>
            </Card>
          </div>
        </section>

        <section className="tc-section" style={{ paddingBottom: 24 }}>
          <div className="tc-section-head">
            <h2 className="title-small" style={{ margin: 0 }}>Promociones</h2>
            <button className="tc-link" onClick={() => onIr && onIr('promos')}>Ver todas</button>
          </div>
          <div style={{ padding: '0 16px' }}>
            <Card padding="lg">
              <span className="tc-badge">Promo</span>
              <p style={{ margin: '8px 0 4px', fontSize: 'var(--title-small-size)', fontWeight: 500, color: 'var(--text-primary)' }}>10% de descuento en tu retorno</p>
              <p className="body-small" style={{ margin: 0, color: 'var(--text-secondary)' }}>Compra ida y vuelta en la misma operación y el descuento se aplica solo. Válido hasta el 31 de agosto.</p>
              <div style={{ marginTop: 8, marginLeft: -16 }}><Button variant="text" size="small" onClick={() => setTipoViaje('ida-vuelta')}>Comprar ida y vuelta</Button></div>
            </Card>
          </div>
        </section>
      </main>

      <nav className="tc-nav" aria-label="Navegación principal">
        {[['inicio', 'home', 'Inicio'], ['viajes', 'ticket', 'Mis viajes'], ['promos', 'promo', 'Promos'], ['cuenta', 'user', 'Cuenta']].map(([id, ic, l]) => (
          <button key={id} className={'tc-nav-item' + (tab === id ? ' on' : '')} onClick={() => (id === 'inicio' ? setTab('inicio') : onIr && onIr(id))} aria-current={tab === id ? 'page' : undefined}>
            <Icon name={ic} size={22} />
            <span className="label-small">{l}</span>
          </button>
        ))}
      </nav>

      <CitySheet open={sheet === 'origen'} title="¿Desde dónde viajas?" exclude={destino} onPick={(c) => { setOrigen(c); setSheet(null); }} onClose={() => setSheet(null)} />
      <CitySheet open={sheet === 'destino'} title="¿A dónde viajas?" exclude={origen} onPick={(c) => { setDestino(c); setSheet(null); }} onClose={() => setSheet(null)} />
      <DateSheet open={sheet === 'ida'} title="Fecha de ida" value={ida} onPick={(d) => { setIda(d); if (vuelta && vuelta < d) setVuelta(null); setSheet(null); }} onClose={() => setSheet(null)} />
      <DateSheet open={sheet === 'vuelta'} title="Fecha de vuelta" value={vuelta} min={ida} onPick={(d) => { setVuelta(d); setSheet(null); }} onClose={() => setSheet(null)} onClear={() => { setVuelta(null); setTipo('ida'); setSheet(null); }} clearLabel="Viajo solo de ida" />
    </div>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('phone-root')).render(<Home />);
Object.assign(window, { Home, CIUDADES });
