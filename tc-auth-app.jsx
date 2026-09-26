/* Prototipo navegable del flujo de autenticación + selector de estados.
   El teléfono navega de verdad; el panel de la derecha salta a cualquier vista o estado. */
const { useState: uSp } = React;

function Exito({ titulo, texto, cta, onCta }) {
  return (
    <div className="tc-screen">
      <div className="au-ok">
        <span className="au-ok-ic"><MIcon name="check" size={34} color="#fff" /></span>
        <h1>{titulo}</h1>
        <p>{texto}</p>
      </div>
      <footer className="au-cta" style={{ position: 'static', borderTop: 'none' }}>
        <AButton fullWidth onClick={onCta}>{cta}</AButton>
      </footer>
    </div>
  );
}

/* Muestra de estados de los controles del flujo, para revisión y handoff. */
function Estados() {
  return (
    <div className="tc-screen">
      <ABar titulo="Estados de los controles" />
      <main className="au-body">
        <AHead titulo="Campos y códigos">Los mismos controles del checkout y de Mi cuenta, en los estados que usa este flujo.</AHead>
        <div className="au-form">
          <Field label="Default" htmlFor="e1"><TextInput id="e1" value="" onChange={() => {}} placeholder="nombre@correo.com" /></Field>
          <Field label="Relleno" htmlFor="e2"><TextInput id="e2" value="diana.ramos@gmail.com" onChange={() => {}} /></Field>
          <Field label="Error" htmlFor="e3" error="Escribe un correo válido, por ejemplo nombre@correo.com."><TextInput id="e3" value="diana.ramos@" onChange={() => {}} error /></Field>
          <Field label="Correcto" htmlFor="e4" ok="Correo verificado."><TextInput id="e4" value="diana.ramos@gmail.com" onChange={() => {}} /></Field>
          <Field label="Deshabilitado" htmlFor="e5" hint="No se puede editar durante una verificación."><TextInput id="e5" value="diana.ramos@gmail.com" onChange={() => {}} disabled /></Field>
          <APass id="e6" label="Contraseña" value="Viajes2026" onChange={() => {}} />
        </div>
        <div className="au-form">
          <p className="f-lab">Código de verificación</p>
          <OTPInput id="e7" value="" onChange={() => {}} label="Ejemplo vacío" />
          <OTPInput id="e8" value="4082" onChange={() => {}} label="Ejemplo parcial" />
          <OTPInput id="e9" value="408213" onChange={() => {}} error label="Ejemplo con error" />
          <OtpMsg error="Código incorrecto. Inténtalo nuevamente." />
          <OTPInput id="e10" value="408213" onChange={() => {}} ok label="Ejemplo verificado" />
          <OtpMsg ok="Código verificado." />
          <OTPInput id="e11" value="408213" onChange={() => {}} disabled label="Ejemplo bloqueado" />
        </div>
        <div className="au-form">
          <p className="f-lab">Botones</p>
          <AButton fullWidth>Continuar</AButton>
          <AButton fullWidth disabled>Continuar</AButton>
          <AButton fullWidth disabled startIcon={<MIcon name="loader" size={18} color="#fff" className="spin" />}>Verificando…</AButton>
          <AButton variant="outlined" fullWidth>Solicitar nuevo código</AButton>
        </div>
        <div className="au-form">
          <p className="f-lab">Mensajes</p>
          <Alerta tono="err" titulo="No pudimos iniciar sesión con esos datos">Revisa tu correo y tu contraseña e inténtalo otra vez.</Alerta>
          <Alerta tono="warn" titulo="Sin conexión" accion="Reintentar">No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.</Alerta>
          <Alerta tono="info" titulo="Revisa tu correo">Si encontramos una cuenta asociada, te enviaremos las instrucciones para continuar.</Alerta>
        </div>
      </main>
    </div>
  );
}

const GRUPOS = [
  ['Acceso', [
    ['01 · Bienvenida', 'bienvenida'],
    ['02 · Iniciar sesión', 'login'],
    ['03 · Credenciales incorrectas', 'login', 'credenciales'],
    ['04 · Iniciando sesión', 'login', 'loading'],
    ['· Error de conexión', 'login', 'conexion'],
  ]],
  ['Registro', [
    ['05 · Datos de acceso', 'registro'],
    ['· Datos completos', 'registro', 'filled'],
    ['· Validación en error', 'registro', 'error'],
    ['06 · Verificación del registro', 'verificar'],
    ['07 · Código incorrecto', 'verificar', 'incorrecto'],
    ['· Verificando', 'verificar', 'loading'],
    ['08 · Datos personales', 'datos'],
    ['· Datos sin aceptar términos', 'datos', 'error'],
    ['09 · Cuenta creada', 'creada'],
  ]],
  ['Verificación en dos pasos', [
    ['10 · 2FA durante el login', 'dosfa'],
    ['11 · Código incorrecto', 'dosfa', 'incorrecto'],
    ['12 · Código expirado', 'dosfa', 'expirado'],
    ['13 · Reenviar código', 'dosfa', 'reenviar'],
  ]],
  ['Recuperar contraseña', [
    ['14 · Recuperar cuenta', 'recuperar'],
    ['· Instrucciones enviadas', 'recuperar', 'enviado'],
    ['15 · Verificación de recuperación', 'recuperar-otp'],
    ['· Código incorrecto', 'recuperar-otp', 'incorrecto'],
    ['16 · Nueva contraseña', 'nueva-pass'],
    ['· No coinciden', 'nueva-pass', 'error'],
    ['17 · Contraseña actualizada', 'pass-lista'],
  ]],
  ['Cuenta · Privacidad y seguridad', [
    ['18 · 2FA desactivada', 'seg-off'],
    ['19 · Activar: elegir método', 'metodo'],
    ['20 · Verificar activación', 'activar-otp'],
    ['21 · 2FA activada', 'seg-on'],
    ['22 · Desactivar con código', 'desactivar-otp'],
  ]],
  ['Sistema', [
    ['Estados de los controles', 'estados'],
  ]],
];

function AuthApp() {
  const [v, setV] = uSp('bienvenida');
  const [est, setEst] = uSp('default');
  const [met, setMet] = uSp('sms');
  const [doc, setDoc] = uSp(null);
  const [toast, setToast] = uSp(null);
  const ir = (nv, ne = 'default') => { setV(nv); setEst(ne); setDoc(null); };
  const avisar = (txt) => { setToast(txt); clearTimeout(avisar.id); avisar.id = setTimeout(() => setToast(null), 2400); };
  const k = v + ':' + est + ':' + met;

  const pantalla = () => {
    if (doc === 'terminos') return <TerminosConsulta secciones={window.SECCIONES_TC} onBack={() => setDoc(null)} />;
    if (doc === 'privacidad') return <PrivacidadDoc onBack={() => setDoc(null)} />;
    switch (v) {
      case 'bienvenida': return <Bienvenida onLogin={() => ir('login')} onCrear={() => ir('registro')} onInvitado={() => avisar('Puedes buscar rutas y ver precios sin cuenta')} />;
      case 'login': return <Login est={est} onBack={() => ir('bienvenida')} onCrear={() => ir('registro')} onOlvide={() => ir('recuperar')} onOk={() => ir('dosfa')} />;
      case 'registro': return <Registro est={est} onBack={() => ir('bienvenida')} onLogin={() => ir('login')} onContinuar={() => ir('verificar')} />;
      case 'verificar': return <VerificarRegistro est={est} onBack={() => ir('registro')} onOk={() => ir('datos')} />;
      case 'datos': return <DatosPersonales est={est} onBack={() => ir('verificar')} onOk={() => ir('creada')} onDoc={setDoc} />;
      case 'creada': return <CuentaCreada onContinuar={() => { ir('bienvenida'); avisar('Sesión iniciada'); }} />;
      case 'dosfa': return <Desafio2FA est={est} onBack={() => ir('login')} onOk={() => ir('sesion')} />;
      case 'sesion': return <Exito titulo="Sesión iniciada" texto="Volvemos a la app con tu cuenta lista." cta="Ir a la app" onCta={() => ir('bienvenida')} />;
      case 'recuperar': return <Recuperar est={est} onBack={() => ir('login')} onEnviado={() => ir('recuperar-otp')} />;
      case 'recuperar-otp': return <RecuperarOTP est={est} onBack={() => ir('recuperar')} onOk={() => ir('nueva-pass')} />;
      case 'nueva-pass': return <NuevaPass est={est} onBack={() => ir('recuperar-otp')} onOk={() => ir('pass-lista')} />;
      case 'pass-lista': return <PassActualizada onLogin={() => ir('login')} />;
      case 'seg-off': return <Seguridad2FA activo={false} onBack={() => avisar('Vuelve a Privacidad y seguridad')} onActivar={() => ir('metodo')} />;
      case 'metodo': return <ElegirMetodo2FA inicial={met} onBack={() => ir('seg-off')} onContinuar={(m) => { setMet(m); ir('activar-otp'); }} />;
      case 'activar-otp': return <OTP2FA modo="activar" metodo={met} est={est} onBack={() => ir('metodo')} onOk={() => ir('activada')} />;
      case 'activada': return <Activada2FA metodo={met} onListo={() => ir('seg-on')} />;
      case 'seg-on': return <Seguridad2FA activo metodo={met} onBack={() => avisar('Vuelve a Privacidad y seguridad')} onCambiar={() => ir('metodo')} onDesactivar={() => ir('desactivar-otp')} />;
      case 'desactivar-otp': return <OTP2FA modo="desactivar" metodo={met} est={est} onBack={() => ir('seg-on')} onOk={() => { ir('seg-off'); avisar('Verificación en dos pasos desactivada'); }} />;
      case 'estados': return <Estados />;
      default: return null;
    }
  };

  return (
    <>
      <aside className="panel">
        <header className="panel-h">
          <h1>Autenticación</h1>
          <p>App Transportes Chiclayo · 22 vistas y sus estados. El teléfono navega de verdad; usa la lista para saltar a un estado.</p>
        </header>
        {GRUPOS.map(([g, items]) => (
          <section key={g} className="panel-g">
            <h2>{g}</h2>
            {items.map(([label, nv, ne]) => {
              const on = v === nv && est === (ne || 'default');
              return <button key={label} className={'panel-b' + (on ? ' on' : '')} onClick={() => ir(nv, ne)}>{label}</button>;
            })}
          </section>
        ))}
        <p className="panel-nota"><b>Pendientes de backend:</b> política de contraseñas, vigencia del código, cooldown de reenvío, número de intentos, bloqueo temporal y la reautenticación exacta para desactivar la 2FA.</p>
      </aside>
      <div className="device">
        <div id="phone-root" className="scr-aut">
          <div key={k} style={{ height: '100%' }}>{pantalla()}</div>
          <div id="sheet-host" />
          {toast && <div className="toast" role="status"><MIcon name="check" size={16} color="#fff" />{toast}</div>}
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<AuthApp />);
