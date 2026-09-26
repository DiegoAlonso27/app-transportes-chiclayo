/* Módulo Mi cuenta: navegación en pila sobre el hub ya aprobado.
   El hub conserva bottom navigation; las pantallas secundarias no la muestran. */
const { useState: uS2, useEffect: uE2 } = React;
const DSH = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button: HButton, Card: HCard } = DSH;

const PERFIL = { nombres: 'Diego Alonso', apellidos: 'Ordoñez Ramírez', tipoDoc: 'DNI', doc: '72422111', fnac: '2003-09-27', correo: 'ordonezdiego2724@gmail.com', prefijo: '+51', tel: '987654321' };
const PAX_INICIALES = [
  { id: 'p1', alias: 'Yo', pais: 'PE', tipoDoc: 'DNI', doc: '72422111', nombres: 'Diego', apellidos: 'Ordoñez Ramírez', fnac: '2003-09-27' },
  { id: 'p2', alias: 'Mamá', pais: 'PE', tipoDoc: 'DNI', doc: '41231234', nombres: 'María', apellidos: 'Ramírez Vega', fnac: '1974-03-11' },
  { id: 'p3', alias: '', pais: 'PE', tipoDoc: 'DNI', doc: '76540987', nombres: 'Luis', apellidos: 'Ordoñez Ramírez', fnac: '2008-12-02' },
];
const PAX_NUEVO = { id: null, alias: '', pais: 'PE', tipoDoc: 'DNI', doc: '', nombres: '', apellidos: '', fnac: '' };

const SECCIONES_TC = [
  { n: '1', t: 'Condiciones generales', p: ['Estas condiciones regulan la compra de pasajes a través de los canales digitales de Transportes Chiclayo. Al comprar aceptas las reglas de servicio, embarque y equipaje descritas a continuación.', 'Transportes Chiclayo puede actualizar este documento. La versión aplicable a tu compra es la que aparece en pantalla al momento de aceptar.'] },
  { n: '2', t: 'Compra de pasajes', p: ['El pasaje se emite a nombre del pasajero registrado y con el documento de identidad declarado en la compra. Ese documento se solicita al momento de embarcar.', 'La compra queda confirmada cuando se aprueba el pago. Si el pago no se completa, los asientos vuelven a estar disponibles.'] },
  { n: '3', t: 'Embarque y presentación', p: ['Debes presentarte en el terminal al menos 30 minutos antes de la hora de salida. Pasada la hora de salida el pasaje pierde validez y no genera devolución.'] },
  { n: '4', t: 'Equipaje', p: ['Cada pasajero puede llevar equipaje en bodega dentro del peso permitido para su tarifa, además de un bolso de mano. El equipaje de mano viaja bajo responsabilidad del pasajero.', 'No se transportan objetos frágiles, dinero, joyas ni documentos de valor en bodega.'] },
  { n: '5', t: 'Cambios y anulaciones', p: ['Los cambios de fecha u hora se solicitan con la anticipación indicada para la tarifa comprada y pueden estar sujetos a diferencia de precio.', 'Las anulaciones se atienden según la tarifa y el canal de compra. Algunas tarifas promocionales no admiten devolución.'] },
  { n: '6', t: 'Menores de edad', p: ['Los menores de edad viajan acompañados de un adulto responsable o con la autorización de viaje que exige la normativa vigente. Sin esa documentación no se autoriza el embarque.'] },
  { n: '7', t: 'Datos personales', p: ['Los datos que registras se usan para emitir el pasaje, contactarte por cambios en el viaje y cumplir obligaciones legales. Puedes ejercer tus derechos sobre ellos por los canales de atención.'] },
  { n: '8', t: 'Atención al cliente', p: ['Ante cualquier incidencia puedes escribirnos por los canales de atención publicados en la aplicación. Te respondemos con el número de tu compra a la mano.'] },
  { n: '9', t: 'Vigencia', p: ['Estas condiciones rigen desde su publicación y se aplican a las compras realizadas mientras estén vigentes.'] },
];

const iniciales2 = (n, a) => (n.trim()[0] || '') + (a.trim()[0] || '');
const mask = (d) => '••••' + d.slice(-4);

/* --------------------------------- Hub ---------------------------------- */
function HubCuenta({ perfil, estado, ir, onSalir, onTab }) {
  const [tab, setTab] = uS2('cuenta');
  const incompleto = !perfil.correo;
  return (
    <div className="tc-screen">
      <header className="ct-appbar"><h1 className="ct-appbar-t">Mi cuenta</h1></header>
      <main className="ct-content">
        {estado === 'loading' ? <Cargando filas={3} perfil /> : (
          <>
            <section className="ct-perfil">
              <button className="ct-perfil-btn" onClick={() => ir('datos')}>
                <span className="ct-avatar" aria-hidden="true">{iniciales2(perfil.nombres, perfil.apellidos).toUpperCase()}</span>
                <span className="ct-perfil-tx">
                  <span className="ct-nombre">{perfil.nombres.split(' ')[0]} {perfil.apellidos.split(' ')[0]}</span>
                  <span className="ct-meta">DNI {mask(perfil.doc)}</span>
                  {perfil.correo
                    ? <span className="ct-meta ct-mail">{perfil.correo}</span>
                    : <span className="ct-meta ct-falta"><MIcon name="alertT" size={13} color="var(--yellow-800)" />Falta tu correo</span>}
                </span>
                <MIcon name="chevron" size={18} color="var(--gray-400)" />
              </button>
            </section>

            {incompleto && (
              <div className="ct-aviso" role="status">
                <MIcon name="alertT" size={18} color="var(--yellow-800)" />
                <span>
                  <b>Completa tus datos</b>
                  <span>Con tu correo te enviamos el pasaje y los avisos de cambio de horario.</span>
                  <button className="ct-aviso-lnk" onClick={() => ir('datos')}>Completar datos</button>
                </span>
              </div>
            )}

            <section className="ct-grupo">
              <h2 className="ct-grupo-t">Mi información</h2>
              <HCard padding="none"><div className="ct-lista">
                <Row icon="user" titulo="Mis datos" desc="Nombre, documento y contacto" onClick={() => ir('datos')}
                  end={incompleto ? <i className="ct-dot" aria-label="Datos incompletos" /> : null} />
                <Row icon="users" titulo="Pasajeros frecuentes" desc="Guarda con quién sueles viajar y compra más rápido" onClick={() => ir('pasajeros')} />
                <Row icon="bell" titulo="Notificaciones" desc="Avisos de viaje y promociones" onClick={() => ir('notificaciones')} />
              </div></HCard>
            </section>

            <section className="ct-grupo">
              <h2 className="ct-grupo-t">Configuración y ayuda</h2>
              <HCard padding="none"><div className="ct-lista">
                <Row icon="lock" titulo="Privacidad y seguridad" desc="Contraseña y datos de tu cuenta" onClick={() => ir('privacidad')} />
                <Row icon="headset" titulo="Ayuda y contacto" desc="Preguntas frecuentes, WhatsApp y agencias" onClick={() => ir('ayuda')} />
                <Row icon="doc" titulo="Términos y condiciones" onClick={() => ir('terminos')} />
              </div></HCard>
            </section>

            <div className="ct-salir">
              <button className="ct-salir-btn" onClick={onSalir}><MIcon name="logout" size={18} color="var(--text-secondary)" />Cerrar sesión</button>
              <p className="ct-version">Transportes Chiclayo · Versión 3.1.0</p>
            </div>
          </>
        )}
      </main>
      <nav className="tc-nav" aria-label="Navegación principal">
        {[['inicio', 'home', 'Inicio'], ['viajes', 'ticket', 'Mis viajes'], ['promos', 'promo', 'Promos'], ['cuenta', 'user', 'Cuenta']].map(([id, ic, l]) => (
          <button key={id} className={'tc-nav-item' + (tab === id ? ' on' : '')} onClick={() => (id === 'cuenta' ? setTab('cuenta') : onTab && onTab(id))} aria-current={tab === id ? 'page' : undefined}>
            <MIcon name={ic} size={22} /><span className="label-small">{l}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* -------------------------------- Módulo -------------------------------- */
const DEMO = [
  ['1. Mi cuenta', { ruta: ['cuenta'], hub: 'normal' }],
  ['2. Mis datos', { ruta: ['cuenta', 'datos'] }],
  ['3. Pasajeros (con datos)', { ruta: ['cuenta', 'pasajeros'], pax: 'llena' }],
  ['4. Pasajeros (vacío)', { ruta: ['cuenta', 'pasajeros'], pax: 'vacia' }],
  ['5. Agregar pasajero', { ruta: ['cuenta', 'pasajeros', 'pax-nuevo'], pax: 'llena' }],
  ['6. Editar pasajero', { ruta: ['cuenta', 'pasajeros', 'pax-editar'], pax: 'llena', editar: 'p2' }],
  ['7. Notificaciones', { ruta: ['cuenta', 'notificaciones'] }],
  ['8. Privacidad y seguridad', { ruta: ['cuenta', 'privacidad'] }],
  ['9. Cambiar contraseña', { ruta: ['cuenta', 'privacidad', 'password'] }],
  ['10. Gestión de cuenta', { ruta: ['cuenta', 'privacidad', 'gestion'] }],
  ['11. Ayuda y contacto', { ruta: ['cuenta', 'ayuda'] }],
  ['12. Términos y condiciones', { ruta: ['cuenta', 'terminos'] }],
  ['13. Modal cerrar sesión', { ruta: ['cuenta'], salir: true }],
  ['14. Mi cuenta · datos incompletos', { ruta: ['cuenta'], hub: 'incompleto' }],
  ['15. Mi cuenta · cargando', { ruta: ['cuenta'], hub: 'loading' }],
];

function Modulo() {
  const [ruta, setRuta] = uS2(['cuenta']);
  const [hub, setHub] = uS2('normal');
  const [perfil, setPerfil] = uS2(PERFIL);
  const [pasajeros, setPasajeros] = uS2(PAX_INICIALES);
  const [editando, setEditando] = uS2(null);
  const [prefs, setPrefs] = uS2({ recordatorios: true, compras: true, promos: false });
  const [salir, setSalir] = uS2(false);
  const [toast, setToast] = uS2(null);
  const [fallar, setFallar] = uS2(false);
  const [cargandoPax, setCargandoPax] = uS2(false);
  const [demo, setDemo] = uS2('1. Mi cuenta');

  const actual = ruta[ruta.length - 1];
  const ir = (id) => setRuta((r) => [...r, id]);
  const volver = () => setRuta((r) => (r.length > 1 ? r.slice(0, -1) : r));
  const avisar = (t) => { setToast(t); clearTimeout(avisar.id); avisar.id = setTimeout(() => setToast(null), 2400); };

  /* La lista de pasajeros muestra su skeleton la primera vez que se abre. */
  uE2(() => {
    if (actual !== 'pasajeros') return;
    setCargandoPax(true);
    const t = setTimeout(() => setCargandoPax(false), 900);
    return () => clearTimeout(t);
  }, [actual]);

  const aplicarDemo = (nombre) => {
    const cfg = DEMO.find(([n]) => n === nombre)[1];
    setDemo(nombre);
    setSalir(!!cfg.salir);
    setHub(cfg.hub === 'incompleto' ? 'normal' : cfg.hub || 'normal');
    setPerfil(cfg.hub === 'incompleto' ? { ...PERFIL, correo: '' } : PERFIL);
    if (cfg.pax) setPasajeros(cfg.pax === 'vacia' ? [] : PAX_INICIALES);
    setEditando(cfg.editar || null);
    setRuta(cfg.ruta);
  };

  const guardarPerfil = (f, msg) => { setPerfil(f); avisar({ txt: msg }); volver(); };
  const guardarPax = (p, msg) => {
    setPasajeros((prev) => (p.id ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, { ...p, id: 'p' + Date.now() }]));
    avisar({ txt: msg }); volver();
  };
  const eliminarPax = (id) => { setPasajeros((prev) => prev.filter((x) => x.id !== id)); avisar({ txt: 'Pasajero eliminado' }); volver(); };

  const pantalla = () => {
    switch (actual) {
      case 'datos': return <MisDatos perfil={perfil} guardar={guardarPerfil} onBack={volver} fallar={fallar} />;
      case 'pasajeros': return <ListaPasajeros pasajeros={pasajeros} cargando={cargandoPax} onBack={volver}
        onNuevo={() => { setEditando(null); ir('pax-nuevo'); }} onEditar={(id) => { setEditando(id); ir('pax-editar'); }} />;
      case 'pax-nuevo': return <FormPasajero key="nuevo" inicial={PAX_NUEVO} modo="nuevo" onBack={volver} onGuardar={guardarPax} fallar={fallar} />;
      case 'pax-editar': return <FormPasajero key={editando} inicial={pasajeros.find((p) => p.id === editando) || pasajeros[0] || PAX_NUEVO} modo="editar"
        onBack={volver} onGuardar={guardarPax} onEliminar={eliminarPax} fallar={fallar} />;
      case 'notificaciones': return <Notificaciones prefs={prefs} setPrefs={setPrefs} onBack={volver} avisar={avisar} />;
      case 'privacidad': return <Privacidad onBack={volver} ir={ir} />;
      case 'password': return <Password onBack={volver} avisar={avisar} fallar={fallar} />;
      case 'gestion': return <Gestion onBack={volver} onEliminar={() => { setRuta(['cuenta']); avisar({ txt: 'Cuenta eliminada. Cerramos tu sesión.' }); }} />;
      case 'ayuda': return <Ayuda onBack={volver} ir={ir} />;
      case 'terminos': return <TerminosConsulta secciones={SECCIONES_TC} onBack={volver} />;
      case 'privacidad-doc': return <PrivacidadDoc onBack={volver} />;
      default: return <HubCuenta perfil={perfil} estado={hub} ir={ir} onSalir={() => setSalir(true)} />;
    }
  };

  return (
    <>
      <div className="device">
        <div className="phone">
          {pantalla()}
          <Toast toast={toast} />
          <Dialogo open={salir} titulo="Cerrar sesión"
            texto="¿Quieres cerrar tu sesión en este dispositivo? Tus pasajes seguirán activos."
            confirmar="Cerrar sesión" onClose={() => setSalir(false)}
            onConfirm={() => { setSalir(false); avisar({ txt: 'Cerraste sesión' }); }} />
        </div>
      </div>

      <div className="demo">
        <div className="demo-grid" role="group" aria-label="Pantallas del módulo">
          {DEMO.map(([n]) => (
            <button key={n} className={'demo-btn' + (demo === n ? ' on' : '')} onClick={() => aplicarDemo(n)}>{n}</button>
          ))}
        </div>
        <label className="demo-sw">
          <Switch on={fallar} onChange={setFallar} label="Simular error de red" />
          <span>Simular error de red al guardar</span>
        </label>
      </div>
    </>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('app')).render(<Modulo />);
Object.assign(window, { HubCuenta, PERFIL, PAX_INICIALES, PAX_NUEVO, SECCIONES_TC });
