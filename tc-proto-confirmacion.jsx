/* Compra confirmada. Cierra el flujo de compra: qué se compró, con qué código
   y qué hacer ahora. No repite el detalle completo; el boleto vive en Mis viajes. */
const { Button: CBtn } = window.TransportesChiclayoDesignSystem_48bc0c;

const C_ICONS = {
  check: ['<path d="M20 6 9 17l-5-5"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  mail: ['<rect width="18" height="14" x="3" y="5" rx="2"/>', '<path d="m3 8 9 6 9-6"/>'],
  arrow: ['<path d="M5 12h14"/>', '<path d="m12 5 7 7-7 7"/>'],
  moon: ['<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5h.01"/>'],
};
function CIcon({ name, size = 20, color = 'currentColor', style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: C_ICONS[name].join('') }} aria-hidden="true" />;
}

function Confirmacion({ c, onBoleto, onInicio }) {
  return (
    <div className="tc-screen">
      <main className="cf-content">
        <section className="cf-hero">
          <span className="cf-ok" aria-hidden="true"><CIcon name="check" size={30} color="#fff" /></span>
          <h1>Compra confirmada</h1>
          <p>Tu pago se aprobó y ya reservamos {c.asientos.length === 1 ? 'tu asiento' : 'tus asientos'}.</p>
        </section>

        <div className="cf-mail" role="status">
          <CIcon name="mail" size={17} color="var(--color-primary)" />
          <span>Enviamos {c.asientos.length === 1 ? 'el boleto' : 'los boletos'} a <b>{c.correo}</b></span>
        </div>

        <article className="cf-card">
          <header className="cf-card-top">
            <span className="cf-ruta">{c.origen} <CIcon name="arrow" size={15} color="var(--text-muted)" /> {c.destino}</span>
            <span className="cf-fecha">{c.fecha}</span>
          </header>
          <div className="cf-horas">
            <span className="cf-h"><b>{c.sale}</b><span>{c.term}</span></span>
            <span className="cf-riel" aria-hidden="true"><i /></span>
            <span className="cf-h fin"><b>{c.llega}{c.masDia && <span className="cf-mas1"><CIcon name="moon" size={11} />+1</span>}</b><span>{c.termLl}</span></span>
          </div>
          <div className="cf-datos">
            <div><span>{c.asientos.length === 1 ? 'Asiento' : 'Asientos'}</span><b>{c.asientos.join(', ')}</b></div>
            <div><span>Servicio</span><b>{c.servicio}</b></div>
            <div><span>Código de compra</span><b>{c.codigo}</b></div>
            <div><span>Método de pago</span><b>{c.metodo}</b></div>
            <div className="cf-total"><span>Total pagado</span><b>S/ {c.total}</b></div>
          </div>
        </article>

        <p className="cf-nota"><CIcon name="info" size={15} color="var(--text-tertiary)" />Preséntate 30 minutos antes en {c.term} con el documento de cada pasajero.</p>
      </main>

      <footer className="cf-cta">
        <CBtn fullWidth onClick={onBoleto} startIcon={<CIcon name="ticket" size={18} />}>Ver mi boleto</CBtn>
        <CBtn variant="text" fullWidth onClick={onInicio}>Volver al inicio</CBtn>
        <span className="tc-safe" />
      </footer>
    </div>
  );
}

Object.assign(window, { Confirmacion, CIcon });
