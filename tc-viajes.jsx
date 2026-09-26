/* Módulo Mis viajes — piezas y pantallas.
   Continuidad con Home, Resultados y Mi cuenta: mismos terminales, servicios y lenguaje de tarjetas.
   Solo se muestran datos que el sistema ya maneja en la compra (ruta, fecha, horario, asiento,
   terminal, servicio, código de compra, pasajero). */
const { useState: uSv, useEffect: uEv, useRef: uRv } = React;
const DSV = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button: VButton } = DSV;

const V_ICONS = {
  left: ['<path d="m15 18-6-6 6-6"/>'],
  chevron: ['<path d="m9 18 6-6-6-6"/>'],
  clock: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 7v5l3 2"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  x: ['<path d="M18 6 6 18"/>', '<path d="m6 6 12 12"/>'],
  pin: ['<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>', '<circle cx="12" cy="10" r="3"/>'],
  seat: ['<path d="M6 4h3a2 2 0 0 1 2 2v6H8a2 2 0 0 1-2-2z"/>', '<path d="M11 12h5a2 2 0 0 1 2 2v3H9"/>', '<path d="M5 17h14"/>', '<path d="M6 20v-3"/>', '<path d="M18 20v-3"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  user: ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  moon: ['<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5h.01"/>'],
  alertT: ['<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>', '<path d="M12 9v4"/>', '<path d="M12 17h.01"/>'],
  wifioff: ['<path d="m2 2 20 20"/>', '<path d="M8.5 16.5a5 5 0 0 1 7 0"/>', '<path d="M2 8.82a15 15 0 0 1 4.17-2.65"/>', '<path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/>', '<path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/>', '<path d="M5 12.86a10 10 0 0 1 3-1.87"/>', '<path d="M12 20h.01"/>'],
  loader: ['<path d="M12 3a9 9 0 1 0 9 9"/>'],
  refresh: ['<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/>', '<path d="M21 3v5h-5"/>', '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/>', '<path d="M3 21v-5h5"/>'],
  search: ['<circle cx="11" cy="11" r="7"/>', '<path d="m20 20-3.5-3.5"/>'],
  home: ['<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', '<path d="M9 22V12h6v10"/>'],
  promo: ['<path d="m3 11 18-5v12L3 14v-3z"/>', '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'],
  bus: ['<path d="M4 17V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11"/>', '<path d="M4 11h16"/>', '<path d="M4 17h16"/>', '<path d="M7 20v-3"/>', '<path d="M17 20v-3"/>'],
  doc: ['<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>', '<path d="M14 2v5h5"/>', '<path d="M8 13h8"/>', '<path d="M8 17h5"/>'],
};

function VIcon({ name, size = 20, color = 'currentColor', className, style }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: V_ICONS[name].join('') }} aria-hidden="true" />;
}

/* ------------------------------- Formato -------------------------------- */
const V_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const V_DIAS_L = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const V_MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const V_MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
const dObj = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const fCorta = (iso) => { const d = dObj(iso); return `${V_DIAS[d.getDay()]}. ${String(d.getDate()).padStart(2, '0')} ${V_MESES[d.getMonth()]}`; };
const fLista = (iso) => { const d = dObj(iso); return `${String(d.getDate()).padStart(2, '0')} ${V_MESES[d.getMonth()]} ${d.getFullYear()}`; };
const fLarga = (iso) => { const d = dObj(iso); return `${V_DIAS_L[d.getDay()]}, ${d.getDate()} de ${V_MESES_L[d.getMonth()]} de ${d.getFullYear()}`; };
const vjDur = (m) => `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`;

/* -------------------------------- Estado -------------------------------- */
const ESTADOS = {
  proximo: { t: 'Próximo', ic: 'clock', cls: 'prox' },
  completado: { t: 'Completado', ic: 'check', cls: 'ok' },
  anulado: { t: 'Anulado', ic: 'x', cls: 'no' },
};

/* Badge de estado: siempre icono + texto, nunca solo color. */
function Estado({ estado, size }) {
  const e = ESTADOS[estado];
  return (
    <span className={'vj-badge ' + e.cls + (size === 'sm' ? ' sm' : '')}>
      <VIcon name={e.ic} size={size === 'sm' ? 12 : 14} />{e.t}
    </span>
  );
}

/* ---------------------------- Piezas comunes ---------------------------- */
function VBar({ titulo, onBack }) {
  return (
    <header className="mb-bar">
      <button className="tc-icon-btn light" onClick={onBack} aria-label="Volver"><VIcon name="left" size={22} color="#fff" /></button>
      <h1 className="mb-t">{titulo}</h1>
      <span style={{ width: 44, flexShrink: 0 }} />
    </header>
  );
}

function VNav({ activo = 'viajes', onIr }) {
  return (
    <nav className="tc-nav" aria-label="Navegación principal">
      {[['inicio', 'home', 'Inicio'], ['viajes', 'ticket', 'Mis viajes'], ['promos', 'promo', 'Promos'], ['cuenta', 'user', 'Cuenta']].map(([id, ic, l]) => (
        <button key={id} className={'tc-nav-item' + (activo === id ? ' on' : '')} onClick={() => onIr && onIr(id)} aria-current={activo === id ? 'page' : undefined}>
          <VIcon name={ic} size={22} /><span className="label-small">{l}</span>
        </button>
      ))}
    </nav>
  );
}

function Tabs({ valor, onChange, cuentas }) {
  return (
    <div className="vj-tabs" role="tablist" aria-label="Tipo de viaje">
      {[['proximos', 'Próximos'], ['pasados', 'Pasados']].map(([id, l]) => (
        <button key={id} role="tab" aria-selected={valor === id} className={'vj-tab' + (valor === id ? ' on' : '')} onClick={() => onChange(id)}>
          {l}{cuentas && cuentas[id] > 0 && <span className="vj-tab-n">{cuentas[id]}</span>}
        </button>
      ))}
    </div>
  );
}

/* Horario de un extremo de la ruta. */
function Punto({ ciudad, hora, term, masDia, fin, grande }) {
  return (
    <div className={'vj-punto' + (fin ? ' fin' : '') + (grande ? ' g' : '')}>
      <span className="vj-ciudad">{ciudad}</span>
      <span className="vj-hora">{hora}{masDia && <span className="vj-mas1"><VIcon name="moon" size={11} />+1 día</span>}</span>
      {term && <span className="vj-term">{term}</span>}
    </div>
  );
}

function Linea({ dur }) {
  return (
    <div className="vj-linea" aria-hidden="true">
      <span className="vj-dot" /><span className="vj-riel" /><span className="vj-dot fin" />
      {dur && <span className="vj-dur">{dur}</span>}
    </div>
  );
}

/* ------------------------------- Tarjetas -------------------------------- */
/* Tarjeta destacada: solo para el viaje más cercano. */
function TarjetaProxima({ v, onAbrir, onBoleto }) {
  return (
    <article className="vj-card hero" role="button" tabIndex="0" onClick={onAbrir}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAbrir(); } }}
      aria-label={`${v.origen} a ${v.destino}, ${fCorta(v.fecha)}, sale ${v.sale}, asiento ${v.asiento}`}>
      <header className="vj-card-top">
        <span className="vj-fecha">{fCorta(v.fecha)}</span>
        <Estado estado={v.estado} />
      </header>
      <div className="vj-ruta">
        <Punto grande ciudad={v.origen} hora={v.sale} term={v.term} />
        <Linea dur={vjDur(v.dur)} />
        <Punto grande fin ciudad={v.destino} hora={v.llega} term={v.termLl} masDia={v.masDia} />
      </div>
      <div className="vj-embarque">
        <VIcon name="pin" size={16} color="var(--text-tertiary)" />
        <span><b>Embarque</b> {v.dir}</span>
      </div>
      <div className="vj-datos">
        <span className="vj-chip"><VIcon name="seat" size={14} />Asiento {v.asiento}</span>
        <span className="vj-svc">{v.servicio} · {v.tipo}</span>
      </div>
      <div className="vj-cta" onClick={(e) => e.stopPropagation()}>
        <VButton fullWidth onClick={onBoleto} startIcon={<VIcon name="ticket" size={18} />}>Ver boleto</VButton>
      </div>
    </article>
  );
}

/* Tarjeta compacta: resto de próximos e historial. */
function TarjetaCompacta({ v, onAbrir }) {
  return (
    <button className={'vj-card mini' + (v.estado === 'anulado' ? ' anu' : '')} onClick={onAbrir}
      aria-label={`${v.origen} a ${v.destino}, ${fLista(v.fecha)}, ${ESTADOS[v.estado].t}`}>
      <span className="vj-mini-tx">
        <span className="vj-mini-ruta">{v.origen} <VIcon name="chevron" size={14} color="var(--text-muted)" style={{ margin: '0 2px' }} /> {v.destino}</span>
        <span className="vj-mini-meta">{fLista(v.fecha)} · {v.sale} → {v.llega}{v.masDia ? ' +1 día' : ''}</span>
        <span className="vj-mini-fila">
          <Estado estado={v.estado} size="sm" />
          <span className="vj-mini-asiento">Asiento {v.asiento}</span>
        </span>
      </span>
      <VIcon name="chevron" size={18} color="var(--gray-400)" />
    </button>
  );
}

/* ----------------------------- Estados vacíos ---------------------------- */
function VjVacio({ icon, titulo, texto, cta, onCta }) {
  return (
    <div className="vj-vacio">
      <span className="vj-vacio-ic"><VIcon name={icon} size={22} color="var(--color-primary)" /></span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {cta && <div className="vj-vacio-cta"><VButton onClick={onCta} startIcon={<VIcon name="search" size={18} />}>{cta}</VButton></div>}
    </div>
  );
}

function ErrorCarga({ onReintentar }) {
  return (
    <div className="vj-vacio" role="alert">
      <span className="vj-vacio-ic err"><VIcon name="wifioff" size={22} color="var(--color-error)" /></span>
      <h3>No pudimos cargar tus viajes.</h3>
      <p>Revisa tu conexión e inténtalo otra vez. Tus pasajes siguen registrados.</p>
      <div className="vj-vacio-cta"><VButton variant="outlined" onClick={onReintentar} startIcon={<VIcon name="refresh" size={18} />}>Reintentar</VButton></div>
    </div>
  );
}

/* Skeleton con la misma estructura de las tarjetas: sin salto al llegar los datos. */
function VjCargando() {
  return (
    <div aria-busy="true" aria-label="VjCargando tus viajes">
      <h2 className="sec-lab">Próximo viaje</h2>
      <div className="vj-card sk-card">
        <div className="vj-card-top"><span className="sk" style={{ width: 92, height: 14 }} /><span className="sk" style={{ width: 74, height: 22, borderRadius: 999 }} /></div>
        <div className="vj-ruta sk-ruta">
          <div><span className="sk" style={{ width: 78, height: 18 }} /><span className="sk" style={{ width: 60, height: 24, marginTop: 8 }} /><span className="sk" style={{ width: 66, height: 11, marginTop: 8 }} /></div>
          <span className="sk" style={{ flex: 1, height: 2, margin: '0 12px' }} />
          <div style={{ textAlign: 'right' }}><span className="sk" style={{ width: 64, height: 18, marginLeft: 'auto' }} /><span className="sk" style={{ width: 60, height: 24, marginTop: 8, marginLeft: 'auto' }} /><span className="sk" style={{ width: 78, height: 11, marginTop: 8, marginLeft: 'auto' }} /></div>
        </div>
        <span className="sk" style={{ width: '100%', height: 40, marginTop: 16, borderRadius: 'var(--radius-sm)' }} />
        <span className="sk" style={{ width: '100%', height: 48, marginTop: 14, borderRadius: 'var(--radius-xs)' }} />
      </div>
      <h2 className="sec-lab" style={{ marginTop: 22 }}>Más viajes</h2>
      <div className="vj-lista">
        {[0, 1].map((i) => (
          <div key={i} className="vj-card sk-card mini-sk">
            <span className="sk" style={{ width: 132, height: 16 }} />
            <span className="sk" style={{ width: 168, height: 12, marginTop: 8 }} />
            <span className="sk" style={{ width: 148, height: 20, marginTop: 10, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Lista (raíz) ----------------------------- */
function MisViajes({ tab, setTab, proximos, pasados, estado, onAbrir, onBoleto, onBuscar, onReintentar, refrescando, onRefrescar, onIr }) {
  const lista = tab === 'proximos' ? proximos : pasados;
  const [destacado, ...resto] = lista;
  const cuerpo = () => {
    if (estado === 'loading') return <VjCargando />;
    if (estado === 'error') return <ErrorCarga onReintentar={onReintentar} />;
    if (!lista.length) {
      return tab === 'proximos'
        ? <VjVacio icon="ticket" titulo="No tienes próximos viajes" texto="Cuando compres un pasaje, aparecerá aquí." cta="Buscar pasajes" onCta={onBuscar} />
        : <VjVacio icon="doc" titulo="Aún no tienes viajes anteriores" texto="Aquí queda el historial de los viajes que ya realizaste." />;
    }
    if (tab === 'proximos') {
      return (
        <>
          <h2 className="sec-lab">Próximo viaje</h2>
          <TarjetaProxima v={destacado} onAbrir={() => onAbrir(destacado)} onBoleto={() => onBoleto(destacado)} />
          {resto.length > 0 && (
            <>
              <h2 className="sec-lab" style={{ marginTop: 22 }}>Más viajes</h2>
              <div className="vj-lista">{resto.map((v) => <TarjetaCompacta key={v.id} v={v} onAbrir={() => onAbrir(v)} />)}</div>
            </>
          )}
          <p className="tc-tail">Puedes ver tu boleto hasta la hora de salida. Preséntate 30 minutos antes con tu documento.</p>
        </>
      );
    }
    return (
      <>
        <h2 className="sec-lab">Historial</h2>
        <div className="vj-lista">{lista.map((v) => <TarjetaCompacta key={v.id} v={v} onAbrir={() => onAbrir(v)} />)}</div>
        <p className="tc-tail">Guardamos tus viajes de los últimos 12 meses.</p>
      </>
    );
  };
  return (
    <div className="tc-screen">
      <header className="ct-appbar"><h1 className="ct-appbar-t">Mis viajes</h1></header>
      <div className="vj-tabs-wrap"><Tabs valor={tab} onChange={setTab} cuentas={{ proximos: proximos.length, pasados: pasados.length }} /></div>
      <main className="vj-content" onScroll={onRefrescar}>
        {refrescando && <div className="vj-refresh" role="status"><VIcon name="loader" size={16} color="var(--color-primary)" className="spin" />Actualizando…</div>}
        {cuerpo()}
      </main>
      <VNav onIr={onIr} />
    </div>
  );
}

/* ---------------------------- Detalle del viaje --------------------------- */
function Dato({ k, v }) {
  return <div className="vj-dato"><span>{k}</span><b>{v}</b></div>;
}

function DetalleViaje({ v, onBack, onBoleto }) {
  const proximo = v.estado === 'proximo';
  return (
    <div className="tc-screen">
      <VBar titulo="Detalle del viaje" onBack={onBack} />
      <main className={'mb-content' + (proximo ? ' with-cta' : '')}>
        <section className="vj-det-head">
          <Estado estado={v.estado} />
          <h2>{v.origen} <VIcon name="chevron" size={20} color="var(--text-muted)" /> {v.destino}</h2>
          <p>{fLarga(v.fecha)}</p>
        </section>

        {v.estado === 'anulado' && (
          <div className="alerta err" role="status">
            <VIcon name="alertT" size={18} />
            <span className="alerta-tx">
              <b>Viaje anulado</b>
              <span>Se anuló el {fLista(v.anuladoEl)}. Este viaje ya no permite embarque; queda en tu historial como respaldo de la compra.</span>
            </span>
          </div>
        )}

        <section className="sec">
          <h3 className="sec-lab">Itinerario</h3>
          <div className="vj-tl">
            <div className="vj-tl-fila">
              <span className="vj-tl-eje"><span className="vj-tl-dot" /><span className="vj-tl-riel" /></span>
              <span className="vj-tl-tx">
                <span className="vj-tl-lab">Salida</span>
                <b className="vj-tl-hora">{v.sale}</b>
                <span className="vj-tl-term">{v.term}</span>
                <span className="vj-tl-dir">{v.dir}</span>
              </span>
            </div>
            <div className="vj-tl-fila">
              <span className="vj-tl-eje"><span className="vj-tl-dot fin" /></span>
              <span className="vj-tl-tx">
                <span className="vj-tl-lab">Llegada estimada</span>
                <b className="vj-tl-hora">{v.llega}{v.masDia && <span className="vj-mas1"><VIcon name="moon" size={11} />+1 día</span>}</b>
                <span className="vj-tl-term">{v.termLl}</span>
                <span className="vj-tl-dir">{v.dirLl}</span>
              </span>
            </div>
            <div className="vj-tl-pie">
              <span><VIcon name="clock" size={15} color="var(--text-tertiary)" />{vjDur(v.dur)}</span>
              <span><VIcon name="bus" size={15} color="var(--text-tertiary)" />{v.servicio} · {v.tipo}</span>
            </div>
          </div>
        </section>

        <section className="sec">
          <h3 className="sec-lab">Pasajero</h3>
          <div className="card-plain vj-pax">
            <span className="vj-pax-av"><VIcon name="user" size={20} color="var(--color-primary)" /></span>
            <span className="vj-pax-tx">
              <b>{v.pasajero}</b>
              <span>{v.doc}</span>
            </span>
            <span className="vj-chip"><VIcon name="seat" size={14} />Asiento {v.asiento}</span>
          </div>
        </section>

        <section className="sec">
          <h3 className="sec-lab">Compra</h3>
          <div className="card-plain vj-datos-lista">
            <Dato k="Código de compra" v={v.codigo} />
            <Dato k="Fecha de compra" v={fLista(v.compra)} />
            <Dato k="Total pagado" v={`S/ ${v.precio.toFixed(2)}`} />
          </div>
        </section>

        {proximo && <p className="tc-tail">Para cambios o anulaciones, escríbenos desde <b>Cuenta → Ayuda y contacto</b>.</p>}
      </main>
      {proximo && (
        <footer className="mb-cta">
          <VButton fullWidth onClick={onBoleto} startIcon={<VIcon name="ticket" size={18} />}>Ver boleto</VButton>
          <p className="cta-hint">Preséntate 30 minutos antes en {v.term}.</p>
        </footer>
      )}
      <div className="tc-safe" />
    </div>
  );
}

/* --------------------------------- Boleto -------------------------------- */
function Boleto({ v, onBack }) {
  return (
    <div className="tc-screen">
      <VBar titulo="Boleto" onBack={onBack} />
      <main className="mb-content">
        <article className="vj-boleto">
          <header className="vj-bol-top">
            <span className="vj-bol-marca">Transportes Chiclayo</span>
            <span className="vj-bol-tipo">Boleto electrónico</span>
          </header>
          <div className="vj-bol-ruta">
            <Punto ciudad={v.origen} hora={v.sale} term={v.term} />
            <Linea dur={vjDur(v.dur)} />
            <Punto fin ciudad={v.destino} hora={v.llega} term={v.termLl} masDia={v.masDia} />
          </div>
          <p className="vj-bol-fecha">{fLarga(v.fecha)}</p>
          <div className="vj-bol-corte" aria-hidden="true"><span /><i /><span /></div>
          <div className="vj-datos-lista">
            <Dato k="Pasajero" v={v.pasajero} />
            <Dato k="Documento" v={v.doc} />
            <Dato k="Asiento" v={v.asiento} />
            <Dato k="Servicio" v={`${v.servicio} · ${v.tipo}`} />
            <Dato k="Código de compra" v={v.codigo} />
          </div>
          <div className="vj-bol-pend">
            <span className="vj-bol-pend-caja" aria-hidden="true" />
            <span className="vj-bol-pend-tx">
              <b>Validación en terminal: pendiente</b>
              <span>Reservamos este espacio para el mecanismo de validación al embarcar. Falta confirmar con operaciones si se valida con código, QR o con el documento del pasajero.</span>
            </span>
          </div>
        </article>
        <p className="tc-tail">Presenta tu documento de identidad al embarcar. El boleto es personal e intransferible.</p>
      </main>
      <div className="tc-safe" />
    </div>
  );
}

Object.assign(window, { VIcon, VBar, VNav, Tabs, Estado, TarjetaProxima, TarjetaCompacta, Vacio: VjVacio, ErrorCarga, Cargando: VjCargando, MisViajes, DetalleViaje, Boleto, fCorta, fLista, fLarga, durTxt: vjDur });
