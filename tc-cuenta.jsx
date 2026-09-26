const { useState } = React;
const DSC = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button, Card } = DSC;

const CICONS = {
  user: ['<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>', '<circle cx="12" cy="7" r="4"/>'],
  users: ['<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>', '<circle cx="9" cy="7" r="4"/>', '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>', '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>'],
  bell: ['<path d="M10.268 21a2 2 0 0 0 3.464 0"/>', '<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'],
  lock: ['<rect width="18" height="11" x="3" y="11" rx="2"/>', '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
  headset: ['<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'],
  doc: ['<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>', '<path d="M14 2v5h5"/>', '<path d="M8 13h8"/>', '<path d="M8 17h5"/>'],
  logout: ['<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>', '<path d="m16 17 5-5-5-5"/>', '<path d="M21 12H9"/>'],
  chevron: ['<path d="m9 18 6-6-6-6"/>'],
  home: ['<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', '<path d="M9 22V12h6v10"/>'],
  ticket: ['<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>', '<path d="M13 5v2"/>', '<path d="M13 17v2"/>', '<path d="M13 11v2"/>'],
  promo: ['<path d="m3 11 18-5v12L3 14v-3z"/>', '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'],
  alert: ['<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>', '<path d="M12 9v4"/>', '<path d="M12 17h.01"/>'],
  close: ['<path d="M18 6 6 18"/>', '<path d="m6 6 12 12"/>'],
};

function CIcon({ name, size = 20, color = 'currentColor', style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: CICONS[name].join('') }} aria-hidden="true" />;
}

const USUARIO = { nombre: 'Diego Ordoñez', dni: '72422111', correo: 'ordonezdiego2724@gmail.com', telefono: '' };
const iniciales = (n) => n.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
const maskDni = (d) => '••••' + d.slice(-4);

function Fila({ icon, titulo, desc, badge, onClick, danger }) {
  return (
    <button className="ct-row" onClick={onClick}>
      <span className="ct-row-ic"><CIcon name={icon} size={20} color={danger ? 'var(--color-error)' : 'var(--color-primary)'} /></span>
      <span className="ct-row-tx">
        <span className="ct-row-t">{titulo}{badge && <i className="ct-dot" aria-label={badge} title={badge} />}</span>
        {desc && <span className="ct-row-d">{desc}</span>}
      </span>
      <CIcon name="chevron" size={18} color="var(--gray-400)" />
    </button>
  );
}

function Grupo({ titulo, children }) {
  return (
    <section className="ct-grupo">
      <h2 className="ct-grupo-t">{titulo}</h2>
      <Card padding="none"><div className="ct-lista">{children}</div></Card>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="ct-skel">
      <div className="ct-skel-perfil"><span className="sk sk-av" /><span style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}><span className="sk" style={{ width: '55%', height: 16 }} /><span className="sk" style={{ width: '38%', height: 12 }} /><span className="sk" style={{ width: '70%', height: 12 }} /></span></div>
      {[3, 3].map((n, g) => (
        <div key={g} style={{ marginTop: 24 }}>
          <span className="sk" style={{ width: 120, height: 11, margin: '0 4px 10px' }} />
          <div className="ct-skel-card">
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="ct-skel-row"><span className="sk sk-ic" /><span className="sk" style={{ width: `${52 - i * 8}%`, height: 13 }} /></div>
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only" role="status">Cargando tu cuenta</span>
    </div>
  );
}

function Confirmacion({ open, onClose, onConfirm }) {
  return (
    <div className={'ct-modal' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="ct-scrim" onClick={onClose} />
      <div className="ct-dialog" role="alertdialog" aria-modal="true" aria-label="Cerrar sesión">
        <h3 className="title-medium" style={{ margin: 0 }}>¿Cerrar sesión?</h3>
        <p className="body-medium" style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Tendrás que ingresar de nuevo para ver tus viajes y comprar más rápido. Tus pasajes seguirán activos.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
          <Button variant="outlined" fullWidth onClick={onClose}>Quedarme en mi cuenta</Button>
          <button className="ct-danger-btn" onClick={onConfirm}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

function Cuenta() {
  const [estado, setEstado] = useState('normal');
  const [tab, setTab] = useState('cuenta');
  const [salir, setSalir] = useState(false);
  const incompleto = estado === 'incompleto';
  const u = incompleto ? { ...USUARIO, correo: '' } : USUARIO;

  return (
    <>
      <div className="device"><div className="tc-screen">
        <header className="ct-appbar">
          <h1 className="ct-appbar-t">Mi cuenta</h1>
        </header>

        <main className="ct-content">
          {estado === 'loading' ? <Skeleton /> : (
            <>
              <section className="ct-perfil">
                <button className="ct-perfil-btn" onClick={() => {}}>
                  <span className="ct-avatar" aria-hidden="true">{iniciales(u.nombre)}</span>
                  <span className="ct-perfil-tx">
                    <span className="ct-nombre">{u.nombre}</span>
                    <span className="ct-meta">DNI {maskDni(u.dni)}</span>
                    {u.correo
                      ? <span className="ct-meta ct-mail">{u.correo}</span>
                      : <span className="ct-meta ct-falta"><CIcon name="alert" size={13} color="var(--yellow-800)" />Falta tu correo</span>}
                  </span>
                  <CIcon name="chevron" size={18} color="var(--gray-400)" />
                </button>
              </section>

              {incompleto && (
                <div className="ct-aviso" role="status">
                  <CIcon name="alert" size={18} color="var(--yellow-800)" />
                  <span>
                    <b>Agrega tu correo</b>
                    <span>Ahí te enviamos el pasaje y los avisos de cambio de horario.</span>
                    <button className="ct-aviso-lnk">Completar mis datos</button>
                  </span>
                </div>
              )}

              <Grupo titulo="Mi información">
                <Fila icon="user" titulo="Mis datos" desc="Nombre, documento y contacto" badge={incompleto ? 'Datos incompletos' : null} />
                <Fila icon="users" titulo="Pasajeros frecuentes" desc="Guarda con quién sueles viajar y compra más rápido" />
                <Fila icon="bell" titulo="Notificaciones" desc="Avisos de viaje y promociones" />
              </Grupo>

              <Grupo titulo="Configuración y ayuda">
                <Fila icon="lock" titulo="Privacidad y seguridad" desc="Contraseña y datos de tu cuenta" />
                <Fila icon="headset" titulo="Ayuda y contacto" desc="Preguntas frecuentes, WhatsApp y agencias" />
                <Fila icon="doc" titulo="Términos y condiciones" />
              </Grupo>

              <div className="ct-salir">
                <button className="ct-salir-btn" onClick={() => setSalir(true)}>
                  <CIcon name="logout" size={18} color="var(--text-secondary)" />
                  Cerrar sesión
                </button>
                <p className="ct-version">Transportes Chiclayo · Versión 3.1.0</p>
              </div>
            </>
          )}
        </main>

        <nav className="tc-nav" aria-label="Navegación principal">
          {[['inicio', 'home', 'Inicio'], ['viajes', 'ticket', 'Mis viajes'], ['promos', 'promo', 'Promos'], ['cuenta', 'user', 'Cuenta']].map(([id, ic, l]) => (
            <button key={id} className={'tc-nav-item' + (tab === id ? ' on' : '')} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
              <CIcon name={ic} size={22} />
              <span className="label-small">{l}</span>
            </button>
          ))}
        </nav>

        <Confirmacion open={salir} onClose={() => setSalir(false)} onConfirm={() => setSalir(false)} />
      </div></div>

      <div className="ct-demo" role="group" aria-label="Estados de la pantalla">
        {[['normal', 'Cuenta completa'], ['incompleto', 'Datos incompletos'], ['loading', 'Cargando']].map(([id, l]) => (
          <button key={id} className={'ct-demo-btn' + (estado === id ? ' on' : '')} onClick={() => setEstado(id)}>{l}</button>
        ))}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<Cuenta />);
