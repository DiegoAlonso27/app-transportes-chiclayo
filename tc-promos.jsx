/* Módulo Promociones — piezas y pantallas.
   PromotionCard tiene tres variantes del mismo componente: compacta (Home), estándar (Promos)
   y destacada. El detalle (PromotionDetail) es la única pantalla que muestra condiciones
   completas, términos y código promocional. Continuidad con Home, Resultados y Mis viajes. */
const { useState: uSp } = React;
const DSP = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button: PButton } = DSP;

const PR_ICONS = {
  left: ['<path d="m15 18-6-6 6-6"/>'],
  chevron: ['<path d="m9 18 6-6-6-6"/>'],
  calendar: ['<rect width="18" height="18" x="3" y="4" rx="2"/>', '<path d="M16 2v4"/>', '<path d="M8 2v4"/>', '<path d="M3 10h18"/>'],
  tag: ['<path d="M12.6 2.7a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.5 8.5a2 2 0 0 0 2.8 0l6.9-6.9a2 2 0 0 0 0-2.8z"/>', '<path d="M7 7h.01"/>'],
  star: ['<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9L6.6 20l1-6.1-4.4-4.3 6.1-.9z"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  copy: ['<rect width="12" height="12" x="9" y="9" rx="2"/>', '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5h.01"/>'],
  pin: ['<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>', '<circle cx="12" cy="10" r="3"/>'],
  image: ['<rect width="18" height="18" x="3" y="3" rx="2"/>', '<circle cx="9" cy="9" r="1.6"/>', '<path d="m21 15-4.5-4.5L6 21"/>'],
  wifioff: ['<path d="m2 2 20 20"/>', '<path d="M8.5 16.5a5 5 0 0 1 7 0"/>', '<path d="M2 8.82a15 15 0 0 1 4.17-2.65"/>', '<path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/>', '<path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/>', '<path d="M5 12.86a10 10 0 0 1 3-1.87"/>', '<path d="M12 20h.01"/>'],
  refresh: ['<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/>', '<path d="M21 3v5h-5"/>', '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/>', '<path d="M3 21v-5h5"/>'],
  search: ['<circle cx="11" cy="11" r="7"/>', '<path d="m20 20-3.5-3.5"/>'],
  home: ['<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', '<path d="M9 22V12h6v10"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  promo: ['<path d="m3 11 18-5v12L3 14v-3z"/>', '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'],
  user: ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  bus: ['<path d="M4 17V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11"/>', '<path d="M4 11h16"/>', '<path d="M4 17h16"/>', '<path d="M7 20v-3"/>', '<path d="M17 20v-3"/>'],
  doc: ['<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>', '<path d="M14 2v5h5"/>', '<path d="M8 13h8"/>', '<path d="M8 17h5"/>'],
};

function PrIcon({ name, size = 20, color = 'currentColor', className, style }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: PR_ICONS[name].join('') }} aria-hidden="true" />;
}

const P_MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
const pDia = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${P_MESES[m - 1]}`; };
const pVig = (p) => `Hasta el ${pDia(p.hasta)}`;

/* ------------------------------ Piezas base ------------------------------ */
function PBar({ titulo, onBack }) {
  return (
    <header className="mb-bar">
      <button className="tc-icon-btn light" onClick={onBack} aria-label="Volver"><PrIcon name="left" size={22} color="#fff" /></button>
      <h1 className="mb-t">{titulo}</h1>
      <span style={{ width: 44, flexShrink: 0 }} />
    </header>
  );
}

function PNav({ activo = 'promos', onIr }) {
  return (
    <nav className="tc-nav" aria-label="Navegación principal">
      {[['inicio', 'home', 'Inicio'], ['viajes', 'ticket', 'Mis viajes'], ['promos', 'promo', 'Promos'], ['cuenta', 'user', 'Cuenta']].map(([id, ic, l]) => (
        <button key={id} className={'tc-nav-item' + (activo === id ? ' on' : '')} onClick={() => onIr && onIr(id)} aria-current={activo === id ? 'page' : undefined}>
          <PrIcon name={ic} size={22} /><span className="label-small">{l}</span>
        </button>
      ))}
    </nav>
  );
}

/* El beneficio se comunica con etiqueta + icono, nunca solo con color. */
function Beneficio({ texto, grande }) {
  return (
    <span className={'pm-benef' + (grande ? ' g' : '')}>
      <PrIcon name="tag" size={grande ? 15 : 13} />{texto}
    </span>
  );
}

/* Banner opcional. La tarjeta nunca depende de que la promoción tenga imagen. */
function Banner({ alto }) {
  return (
    <div className={'pm-img' + (alto ? ' alto' : '')} role="img" aria-label="Imagen de la promoción">
      <PrIcon name="image" size={18} color="var(--text-muted)" />
      <span>Imagen de la promoción</span>
    </div>
  );
}

/* ----------------------------- PromotionCard ----------------------------- */
/* variante: 'compact' (Home) · 'standard' (Promos) · 'featured' (destacada) */
function PromotionCard({ p, variante = 'standard', onAbrir }) {
  const etiqueta = `${p.beneficio}. ${p.titulo}. Vigente hasta el ${pDia(p.hasta)}.`;

  if (variante === 'compact') {
    return (
      <button className="pm-card compact" onClick={onAbrir} aria-label={etiqueta}>
        <span className="pm-mini-img" aria-hidden="true">{p.imagen ? <PrIcon name="image" size={18} color="var(--text-muted)" /> : <PrIcon name="tag" size={18} color="var(--color-primary)" />}</span>
        <span className="pm-mini-tx">
          <Beneficio texto={p.beneficio} />
          <span className="pm-mini-tit">{p.titulo}</span>
          <span className="pm-mini-vig">{pVig(p)}</span>
        </span>
        <PrIcon name="chevron" size={18} color="var(--gray-400)" />
      </button>
    );
  }

  const destacada = variante === 'featured';
  return (
    <article className={'pm-card' + (destacada ? ' featured' : '')} role="button" tabIndex="0" onClick={onAbrir}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAbrir(); } }} aria-label={etiqueta}>
      {p.imagen && <Banner alto={destacada} />}
      <div className="pm-body">
        <Beneficio texto={p.beneficio} grande={destacada} />
        <h3 className="pm-tit">{p.titulo}</h3>
        <p className="pm-desc">{p.desc}</p>
        <div className="pm-pie">
          <span className="pm-vig"><PrIcon name="calendar" size={14} color="var(--text-tertiary)" />{pVig(p)}</span>
          <span className="pm-ver">Ver promoción <PrIcon name="chevron" size={16} /></span>
        </div>
      </div>
    </article>
  );
}

/* --------------------------- Estados de pantalla -------------------------- */
function PVacio({ onBuscar }) {
  return (
    <div className="vj-vacio">
      <span className="vj-vacio-ic"><PrIcon name="promo" size={22} color="var(--color-primary)" /></span>
      <h3>No hay promociones disponibles por ahora</h3>
      <p>Cuando tengamos nuevas ofertas, las encontrarás aquí.</p>
      <div className="vj-vacio-cta"><PButton variant="outlined" onClick={onBuscar} startIcon={<PrIcon name="search" size={18} />}>Buscar pasajes</PButton></div>
    </div>
  );
}

function PError({ onReintentar }) {
  return (
    <div className="vj-vacio" role="alert">
      <span className="vj-vacio-ic err"><PrIcon name="wifioff" size={22} color="var(--color-error)" /></span>
      <h3>No pudimos cargar las promociones.</h3>
      <p>Revisa tu conexión e inténtalo otra vez.</p>
      <div className="vj-vacio-cta"><PButton variant="outlined" onClick={onReintentar} startIcon={<PrIcon name="refresh" size={18} />}>Reintentar</PButton></div>
    </div>
  );
}

/* Skeleton con la forma de las PromotionCards: sin promociones falsas ni salto de layout. */
function PCargando() {
  return (
    <div aria-busy="true" aria-label="Cargando promociones">
      <div className="pm-lista">
        {[0, 1, 2].map((i) => (
          <div key={i} className="pm-card sk-pm">
            <span className="sk" style={{ display: 'block', width: '100%', height: i === 0 ? 132 : 108, borderRadius: 0 }} />
            <span className="pm-body" style={{ display: 'block' }}>
              <span className="sk" style={{ width: 118, height: 22, borderRadius: 999 }} />
              <span className="sk" style={{ width: '72%', height: 18, marginTop: 10 }} />
              <span className="sk" style={{ width: '92%', height: 12, marginTop: 10 }} />
              <span className="sk" style={{ width: '58%', height: 12, marginTop: 6 }} />
              <span className="sk" style={{ width: '100%', height: 12, marginTop: 16 }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Lista (raíz) ------------------------------ */
function Promociones({ lista, estado, onAbrir, onBuscar, onReintentar, onIr }) {
  const destacada = lista.find((p) => p.destacada);
  const otras = lista.filter((p) => p !== destacada);

  const cuerpo = () => {
    if (estado === 'loading') return <PCargando />;
    if (estado === 'error') return <PError onReintentar={onReintentar} />;
    if (!lista.length) return <PVacio onBuscar={onBuscar} />;
    return (
      <>
        {destacada && (
          <>
            <h2 className="sec-lab" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><PrIcon name="star" size={13} color="var(--color-secondary)" />Destacada</h2>
            <PromotionCard p={destacada} variante="featured" onAbrir={() => onAbrir(destacada)} />
            <h2 className="sec-lab" style={{ marginTop: 22 }}>Otras promociones</h2>
          </>
        )}
        <div className="pm-lista">
          {otras.map((p) => <PromotionCard key={p.id} p={p} onAbrir={() => onAbrir(p)} />)}
        </div>
        <p className="tc-tail">Cada promoción tiene sus propias condiciones. Revísalas antes de comprar.</p>
      </>
    );
  };

  return (
    <div className="tc-screen">
      <header className="ct-appbar"><h1 className="ct-appbar-t">Promociones</h1></header>
      <main className="pm-content">
        <p className="pm-intro">Aprovecha nuestras promociones vigentes para tu próximo viaje.</p>
        {cuerpo()}
      </main>
      <PNav onIr={onIr} />
    </div>
  );
}

/* --------------------------- Detalle de promoción ------------------------- */
function CodigoPromo({ codigo }) {
  const [copiado, setCopiado] = uSp(false);
  return (
    <div className="pm-cod">
      <div className="pm-cod-row">
        <span className="pm-cod-tx">
          <span className="pm-cod-lab">Código promocional</span>
          <b>{codigo}</b>
        </span>
        <button className={'pm-cod-btn' + (copiado ? ' ok' : '')} onClick={() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); }} aria-live="polite">
          <PrIcon name={copiado ? 'check' : 'copy'} size={16} />{copiado ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <p className="pm-cod-hint">Ingrésalo en el campo de código promocional al momento de pagar.</p>
    </div>
  );
}

function DetallePromo({ p, onBack, onAprovechar }) {
  return (
    <div className="tc-screen">
      <PBar titulo="Detalle de promoción" onBack={onBack} />
      <main className="mb-content with-cta">
        {p.imagen && <Banner alto />}
        <section className="pm-det-head">
          <Beneficio texto={p.beneficio} grande />
          <h2>{p.titulo}</h2>
          <p>{p.desc}</p>
        </section>

        {p.codigo && <CodigoPromo codigo={p.codigo} />}

        <section className="sec">
          <h3 className="sec-lab">Vigencia</h3>
          <div className="card-plain vj-datos-lista">
            <div className="vj-dato"><span>Desde</span><b>{pDia(p.desde)}</b></div>
            <div className="vj-dato"><span>Hasta</span><b>{pDia(p.hasta)}</b></div>
          </div>
        </section>

        <section className="sec">
          <h3 className="sec-lab">Aplica para</h3>
          <div className="card-plain pm-aplica">
            {p.aplica.map((a, i) => (
              <span key={i} className="pm-aplica-it"><PrIcon name={a.ic} size={16} color="var(--text-tertiary)" />{a.t}</span>
            ))}
          </div>
        </section>

        <section className="sec">
          <h3 className="sec-lab">Condiciones</h3>
          <ul className="pm-cond">
            {p.condiciones.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>

        <section className="sec">
          <h3 className="sec-lab">Términos de la promoción</h3>
          <p className="pm-terminos">{p.terminos}</p>
        </section>
      </main>
      <footer className="mb-cta">
        <PButton fullWidth onClick={onAprovechar} startIcon={<PrIcon name="search" size={18} />}>Aprovechar promoción</PButton>
        <p className="cta-hint">{p.ctaHint}</p>
      </footer>
      <div className="tc-safe" />
    </div>
  );
}

/* ------------- Fragmento de Home: variante compacta en contexto ----------- */
function HomeFragmento({ lista, onAbrir, onVerTodas }) {
  return (
    <div className="tc-screen">
      <header className="ct-appbar"><h1 className="ct-appbar-t">Inicio</h1></header>
      <main className="pm-content">
        <div className="pm-nota"><PrIcon name="info" size={16} color="var(--text-tertiary)" />Fragmento del Home. Solo se muestra el bloque de promociones para revisar la variante compacta.</div>
        <div className="tc-section-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 2px 10px' }}>
          <h2 className="title-small" style={{ margin: 0 }}>Promociones</h2>
          <button className="tc-link" onClick={onVerTodas}>Ver todas</button>
        </div>
        <div className="pm-lista">
          {lista.slice(0, 2).map((p) => <PromotionCard key={p.id} p={p} variante="compact" onAbrir={() => onAbrir(p)} />)}
        </div>
        <p className="tc-tail">El Home muestra como máximo dos promociones vigentes; el resto vive en Promos.</p>
      </main>
      <PNav activo="inicio" />
    </div>
  );
}

Object.assign(window, { PrIcon, PBar, PNav, Beneficio, Banner, PromotionCard, PVacio, PError, PCargando, Promociones, DetallePromo, HomeFragmento, CodigoPromo, pDia, pVig });
