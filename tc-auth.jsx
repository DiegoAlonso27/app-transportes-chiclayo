/* Flujo de autenticación · piezas comunes + acceso, login, registro y recuperación.
   Reutiliza los campos del checkout (tc-campos.jsx: Field, TextInput, PhoneInput, Select,
   DatePicker) y el lenguaje de Mi cuenta. No se crea un segundo sistema de formularios. */
const { useState: uSa, useEffect: uEa, useRef: uRa } = React;
const DSA = window.TransportesChiclayoDesignSystem_48bc0c;
const { Button: AButton } = DSA;

/* Valores que dependen del backend. Aquí solo hay marcadores para el prototipo. */
const AUTH_CFG = { cooldown: 60, largoOTP: 6 };
/* Pendiente: política real de contraseñas del backend. Estas tres reglas son las mismas
   que ya usa "Cambiar contraseña" para no mostrar dos criterios distintos. */
const AUTH_REGLAS = [
  { k: 'len', t: 'Al menos 8 caracteres', ok: (v) => v.length >= 8 },
  { k: 'letra', t: 'Una letra', ok: (v) => /[a-zá-ú]/i.test(v) },
  { k: 'num', t: 'Un número', ok: (v) => /\d/.test(v) },
];

const CONTACTO = { tel: '••• ••• 8017', correo: 'd••••@gmail.com' };
const esCorreo = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

function ABar({ titulo, onBack }) {
  return (
    <header className="au-bar">
      {onBack ? <button className="tc-icon-btn" onClick={onBack} aria-label="Volver"><MIcon name="left" size={22} color="var(--text-primary)" /></button> : <span style={{ width: 8 }} />}
      {titulo && <h1 className="au-bar-t">{titulo}</h1>}
    </header>
  );
}

function AHead({ paso, titulo, children }) {
  return (
    <div className="au-head">
      {paso && <p className="au-paso">{paso}</p>}
      <h2 className="au-t">{titulo}</h2>
      {children && <p className="au-d">{children}</p>}
    </div>
  );
}

function Pendiente({ children }) {
  return <p className="tc-tail"><b>Pendiente:</b> {children}</p>;
}

/* Contraseña con mostrar/ocultar, igual que en Mi cuenta. */
function APass({ id, label, value, onChange, error, hint, disabled, autoFocus }) {
  const [ver, setVer] = uSa(false);
  return (
    <Field label={label} htmlFor={id} required error={error} hint={hint}>
      <div className={'f-ctl' + (error ? ' err' : '') + (disabled ? ' dis' : '')}>
        <input id={id} className="f-in" type={ver ? 'text' : 'password'} value={value} disabled={disabled} autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
        <button className="tc-icon-btn" onClick={() => setVer(!ver)} disabled={disabled} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          <MIcon name={ver ? 'eyeoff' : 'eye'} size={18} color="var(--text-secondary)" />
        </button>
      </div>
    </Field>
  );
}

function Reglas({ valor, ver }) {
  return (
    <ul className="req" aria-label="Requisitos de la contraseña">
      {AUTH_REGLAS.map((r) => {
        const ok = r.ok(valor);
        return <li key={r.k} className={ok ? 'ok' : ver && valor ? 'no' : ''}><MIcon name={ok ? 'check' : 'info'} size={13} />{r.t}</li>;
      })}
    </ul>
  );
}

/* -------------------------------- OTPInput ---------------------------------
   Se ve segmentado pero es un único campo: permite pegar el código completo,
   borrar y retroceder, y se anuncia como un solo control. Sirve para registro,
   2FA y recuperación sin duplicar componentes. */
function OTPInput({ id, value, onChange, largo = AUTH_CFG.largoOTP, error, ok, disabled, autoFocus, label = 'Código de verificación' }) {
  const ref = uRa(null);
  const [foco, setFoco] = uSa(false);
  const activo = Math.min(value.length, largo - 1);
  return (
    <div className={'otp' + (error ? ' err' : '') + (ok ? ' ok' : '') + (disabled ? ' dis' : '')} onClick={() => ref.current && ref.current.focus()}>
      <input ref={ref} id={id} className="otp-in" value={value} disabled={disabled} autoFocus={autoFocus}
        inputMode="numeric" autoComplete="one-time-code" maxLength={largo} aria-label={`${label} de ${largo} dígitos`} aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, largo))}
        onFocus={() => setFoco(true)} onBlur={() => setFoco(false)} />
      {Array.from({ length: largo }).map((_, i) => (
        <span key={i} className={'otp-box' + (value[i] ? ' full' : '') + (foco && !disabled && i === activo ? ' on' : '')}>{value[i] || ''}</span>
      ))}
    </div>
  );
}

function OtpMsg({ error, ok, hint }) {
  const txt = error || ok || hint;
  if (!txt) return null;
  return (
    <p className={'otp-msg' + (error ? ' err' : ok ? ' ok' : '')} role={error ? 'alert' : undefined}>
      <MIcon name={error ? 'alertT' : ok ? 'check' : 'info'} size={13} /><span>{txt}</span>
    </p>
  );
}

/* Reenvío con cooldown. La duración real la define el backend. */
function Reenvio({ inicial = AUTH_CFG.cooldown, onReenviar, texto = '¿No recibiste el código?' }) {
  const [seg, setSeg] = uSa(inicial);
  uEa(() => {
    if (seg <= 0) return;
    const t = setTimeout(() => setSeg((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seg]);
  const mmss = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
  return (
    <div className="au-reenvio">
      <span>{texto}</span>
      {seg > 0
        ? <span className="espera" role="status">{`Reenviar código en ${mmss}`}</span>
        : <button onClick={() => { setSeg(inicial); onReenviar && onReenviar(); }}>Reenviar código</button>}
    </div>
  );
}

/* ------------------------------ 01 · Bienvenida ----------------------------- */
function Bienvenida({ onLogin, onCrear, onInvitado }) {
  return (
    <div className="tc-screen">
      <div className="au-welcome">
        <img src="assets/tc-logotipo.svg" alt="Transportes Chiclayo" />
        <div className="au-head">
          <h1 className="au-t">Tu cuenta, tus viajes</h1>
          <p className="au-d">Accede a tus pasajes y gestiona tus próximos viajes.</p>
        </div>
        <div className="au-acciones">
          <AButton fullWidth onClick={onLogin}>Iniciar sesión</AButton>
          <AButton variant="outlined" fullWidth onClick={onCrear}>Crear cuenta</AButton>
          <button className="au-lnk centro" onClick={onInvitado}>Continuar sin iniciar sesión</button>
        </div>
        <p className="tc-tail">Sin iniciar sesión puedes buscar rutas y ver precios. Para comprar y gestionar pasajes necesitas una cuenta.</p>
      </div>
    </div>
  );
}

/* ------------------------- 02–04 · Iniciar sesión --------------------------- */
function Login({ est = 'default', onBack, onOlvide, onCrear, onOk }) {
  const pre = est !== 'default';
  const [correo, setCorreo] = uSa(pre ? 'diana.ramos@gmail.com' : '');
  const [pass, setPass] = uSa(pre ? 'Viajes2026' : '');
  const [tocado, setTocado] = uSa(false);
  const [envio, setEnvio] = uSa(est === 'loading');
  const [fallo, setFallo] = uSa(est === 'credenciales' ? 'credenciales' : est === 'conexion' ? 'conexion' : null);

  const errCorreo = tocado && correo && !esCorreo(correo) ? 'Escribe un correo válido, por ejemplo nombre@correo.com.' : null;
  const listo = esCorreo(correo) && pass.length > 0;
  const enviar = () => {
    setFallo(null); setEnvio(true);
    setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1300);
  };

  return (
    <div className="tc-screen">
      <ABar titulo="Iniciar sesión" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead titulo="Hola de nuevo">Ingresa con el correo de tu cuenta.</AHead>
        {fallo === 'credenciales' && <Alerta tono="err" titulo="No pudimos iniciar sesión con esos datos">Revisa tu correo y tu contraseña e inténtalo otra vez.</Alerta>}
        {fallo === 'conexion' && <Alerta tono="warn" titulo="Sin conexión" accion="Reintentar" onAccion={enviar}>No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.</Alerta>}
        <div className="au-form">
          <Field label="Correo electrónico" htmlFor="lg-mail" required error={errCorreo}>
            <TextInput id="lg-mail" type="email" value={correo} disabled={envio} inputMode="email" error={!!errCorreo}
              onChange={(v) => { setCorreo(v); setFallo(null); }} onBlur={() => setTocado(true)} placeholder="nombre@correo.com" />
          </Field>
          <APass id="lg-pass" label="Contraseña" value={pass} disabled={envio} onChange={(v) => { setPass(v); setFallo(null); }} />
          <button className="au-lnk" onClick={onOlvide} disabled={envio}>¿Olvidaste tu contraseña?</button>
        </div>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={enviar}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Iniciando sesión…</span> : 'Iniciar sesión'}
        </AButton>
        <p className="au-foot">¿No tienes una cuenta?<button onClick={onCrear}>Crear cuenta</button></p>
      </footer>
    </div>
  );
}

/* ------------------------- 05 · Crear cuenta (paso 1) ----------------------- */
function Registro({ est = 'default', onBack, onLogin, onContinuar }) {
  const pre = est === 'filled' || est === 'error';
  const [correo, setCorreo] = uSa(pre ? 'diana.ramos@gmail.com' : '');
  const [prefijo, setPrefijo] = uSa('+51');
  const [tel, setTel] = uSa(pre ? '987128017' : '');
  const [pass, setPass] = uSa(pre ? 'Viajes2026' : '');
  const [rep, setRep] = uSa(est === 'error' ? 'Viajes20' : pre ? 'Viajes2026' : '');
  const [ver, setVer] = uSa(est === 'error');

  const cumple = AUTH_REGLAS.every((r) => r.ok(pass));
  const errRep = rep && rep !== pass ? 'Las contraseñas no coinciden.' : null;
  const errTel = tel && tel.length !== 9 ? 'El número de Perú tiene 9 dígitos.' : null;
  const listo = esCorreo(correo) && tel.length === 9 && cumple && rep === pass && rep.length > 0;

  return (
    <div className="tc-screen">
      <ABar titulo="Crear cuenta" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead paso="Paso 1 de 3" titulo="Crea tu cuenta">Usaremos estos datos para enviarte tus pasajes y avisos de viaje.</AHead>
        <div className="au-form">
          <Field label="Correo electrónico" htmlFor="rg-mail" required>
            <TextInput id="rg-mail" type="email" value={correo} inputMode="email" onChange={setCorreo} placeholder="nombre@correo.com" />
          </Field>
          <Field label="Teléfono" htmlFor="rg-tel" required error={errTel} hint={!errTel ? 'Te enviaremos un código para verificarlo.' : null}>
            <PhoneInput id="rg-tel" prefijo={prefijo} numero={tel} onPrefijo={setPrefijo} onNumero={setTel} error={!!errTel} />
          </Field>
          <APass id="rg-pass" label="Contraseña" value={pass} onChange={setPass} />
          <Reglas valor={pass} ver={ver} />
          <APass id="rg-rep" label="Confirmar contraseña" value={rep} onChange={setRep} error={errRep} />
        </div>
        <Pendiente>confirmar con backend la política real de contraseñas antes de publicar estos requisitos.</Pendiente>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo} onClick={() => { setVer(true); listo && onContinuar && onContinuar(); }}>Continuar</AButton>
        <p className="au-foot">¿Ya tienes una cuenta?<button onClick={onLogin}>Iniciar sesión</button></p>
      </footer>
    </div>
  );
}

/* --------------- 06–07 · Verificación del contacto en el registro -----------
   Confirma que el usuario controla ese teléfono o correo. No es 2FA. */
function VerificarRegistro({ est = 'default', canal: canalIni = 'sms', onBack, onOk }) {
  const [canal, setCanal] = uSa(canalIni);
  const [code, setCode] = uSa(est === 'incorrecto' ? '408213' : est === 'filled' || est === 'loading' ? '408213' : '');
  const [envio, setEnvio] = uSa(est === 'loading');
  const [err, setErr] = uSa(est === 'incorrecto' ? 'Código incorrecto. Inténtalo nuevamente.' : null);
  const destino = canal === 'sms' ? CONTACTO.tel : CONTACTO.correo;
  const listo = code.length === AUTH_CFG.largoOTP;

  const verificar = () => {
    setEnvio(true); setErr(null);
    setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1200);
  };

  return (
    <div className="tc-screen">
      <ABar titulo="Verificar contacto" onBack={onBack} />
      <main className="au-body with-cta">
        <span className="au-ic"><MIcon name="chat" size={26} color="var(--color-primary)" /></span>
        <AHead paso="Paso 2 de 3" titulo={canal === 'sms' ? 'Verifica tu número' : 'Verifica tu correo'}>
          Hemos enviado un código de 6 dígitos a <b>{destino}</b>.
        </AHead>
        <div className="au-form">
          <OTPInput id="rg-otp" value={code} onChange={(v) => { setCode(v); setErr(null); }} error={!!err} disabled={envio} autoFocus />
          <OtpMsg error={err} hint={!err ? 'Puedes pegar el código completo.' : null} />
        </div>
        <Reenvio onReenviar={() => setCode('')} />
        <button className="au-lnk centro" onClick={() => { setCanal(canal === 'sms' ? 'correo' : 'sms'); setCode(''); setErr(null); }}>
          {canal === 'sms' ? 'Enviar el código a mi correo' : 'Enviar el código por SMS'}
        </button>
        <Pendiente>definir si el registro exige verificar el teléfono y el correo, o solo uno. El diseño soporta ambos casos. El cooldown de reenvío usa la configuración del backend.</Pendiente>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={verificar}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Verificando…</span> : 'Verificar'}
        </AButton>
      </footer>
    </div>
  );
}

/* ---------------------- 08 · Datos personales del registro ------------------ */
const A_TIPOS = [{ v: 'DNI', l: 'DNI' }, { v: 'CE', l: 'Carné de extranjería' }, { v: 'PAS', l: 'Pasaporte' }];

function DatosPersonales({ est = 'default', onBack, onOk, onDoc }) {
  const pre = est === 'filled' || est === 'error';
  const [f, setF] = uSa({ tipo: 'DNI', num: pre ? '46281730' : '', nombres: pre ? 'Diana Lucía' : '', apellidos: pre ? 'Ramos Salazar' : '', nac: pre ? '1996-04-18' : '' });
  const [acepta, setAcepta] = uSa(false);
  const [ver, setVer] = uSa(est === 'error');
  const [envio, setEnvio] = uSa(est === 'loading');
  const set = (p) => setF({ ...f, ...p });

  const errNum = f.num && f.tipo === 'DNI' && f.num.length !== 8 ? 'El DNI tiene 8 dígitos.' : null;
  const completo = f.num && !errNum && f.nombres.trim() && f.apellidos.trim() && f.nac;
  const listo = completo && acepta;

  const crear = () => {
    if (!listo) { setVer(true); return; }
    setEnvio(true);
    setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1400);
  };

  return (
    <div className="tc-screen">
      <ABar titulo="Tus datos" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead paso="Paso 3 de 3" titulo="Cuéntanos sobre ti">Estos datos aparecen en tus pasajes, así que deben coincidir con tu documento.</AHead>
        <div className="au-form">
          <Field label="Tipo de documento" htmlFor="dp-tipo" required>
            <Select id="dp-tipo" value={f.tipo} onChange={(v) => set({ tipo: v })} options={A_TIPOS} disabled={envio} />
          </Field>
          <Field label="Número de documento" htmlFor="dp-num" required error={ver ? errNum || (!f.num ? 'Ingresa tu número de documento.' : null) : errNum}>
            <TextInput id="dp-num" value={f.num} inputMode="numeric" maxLength={f.tipo === 'DNI' ? 8 : 12} disabled={envio}
              onChange={(v) => set({ num: v.replace(/[^\dA-Za-z]/g, '') })} error={!!errNum} />
          </Field>
          <Field label="Nombres" htmlFor="dp-nom" required error={ver && !f.nombres.trim() ? 'Ingresa tus nombres.' : null}>
            <TextInput id="dp-nom" value={f.nombres} autoCapitalize="words" disabled={envio} onChange={(v) => set({ nombres: v })} />
          </Field>
          <Field label="Apellidos" htmlFor="dp-ape" required error={ver && !f.apellidos.trim() ? 'Ingresa tus apellidos.' : null}>
            <TextInput id="dp-ape" value={f.apellidos} autoCapitalize="words" disabled={envio} onChange={(v) => set({ apellidos: v })} />
          </Field>
          <Field label="Fecha de nacimiento" htmlFor="dp-nac" required error={ver && !f.nac ? 'Ingresa tu fecha de nacimiento.' : null}>
            <DatePicker id="dp-nac" value={f.nac} onChange={(v) => set({ nac: v })} disabled={envio} />
          </Field>
        </div>
        <div className="card-plain">
          <div className="chk-row">
            <button className={'chk' + (acepta ? ' on' : '') + (ver && !acepta ? ' err' : '')} role="checkbox" aria-checked={acepta}
              aria-label="Acepto los términos y condiciones y la política de privacidad" onClick={() => setAcepta(!acepta)}>
              {acepta && <MIcon name="check" size={16} color="#fff" />}
            </button>
            <p className="chk-tx">
              Acepto los <button onClick={() => onDoc && onDoc('terminos')}>Términos y condiciones</button> y la <button onClick={() => onDoc && onDoc('privacidad')}>Política de privacidad</button>.
            </p>
          </div>
          {ver && !acepta && <p className="otp-msg err" role="alert"><MIcon name="alertT" size={13} /><span>Necesitamos tu aceptación para crear la cuenta.</span></p>}
        </div>
        <p className="tc-tail">No volvemos a pedirte el correo ni el teléfono: ya los verificaste en el paso anterior.</p>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={envio} onClick={crear}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Creando cuenta…</span> : 'Crear cuenta'}
        </AButton>
        {!listo && !envio && <p className="cta-hint">Completa tus datos y acepta los términos para continuar.</p>}
      </footer>
    </div>
  );
}

/* ----------------------------- 09 · Cuenta creada --------------------------- */
function CuentaCreada({ onContinuar }) {
  return (
    <div className="tc-screen">
      <div className="au-ok">
        <span className="au-ok-ic"><MIcon name="check" size={34} color="#fff" /></span>
        <h1>Tu cuenta está lista</h1>
        <p>Ya puedes gestionar tus viajes desde Transportes Chiclayo.</p>
      </div>
      <footer className="au-cta" style={{ position: 'static', borderTop: 'none' }}>
        <AButton fullWidth onClick={onContinuar}>Continuar</AButton>
      </footer>
    </div>
  );
}

/* --------------------- 14–15 · Recuperar contraseña ------------------------- */
function Recuperar({ est = 'default', onBack, onEnviado }) {
  const [correo, setCorreo] = uSa(est === 'default' ? '' : 'diana.ramos@gmail.com');
  const [envio, setEnvio] = uSa(est === 'loading');
  const [enviado, setEnviado] = uSa(est === 'enviado');
  const listo = esCorreo(correo);

  const continuar = () => {
    setEnvio(true);
    setTimeout(() => { setEnvio(false); setEnviado(true); }, 1200);
  };

  return (
    <div className="tc-screen">
      <ABar titulo="Recuperar contraseña" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead titulo="Recupera tu cuenta">Ingresa el correo de tu cuenta y te enviaremos las instrucciones para continuar.</AHead>
        {enviado && <Alerta tono="info" titulo="Revisa tu correo">Si encontramos una cuenta asociada, te enviaremos las instrucciones para continuar.</Alerta>}
        <div className="au-form">
          <Field label="Correo electrónico" htmlFor="rc-mail" required>
            <TextInput id="rc-mail" type="email" value={correo} inputMode="email" disabled={envio} onChange={setCorreo} placeholder="nombre@correo.com" />
          </Field>
        </div>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={enviado ? onEnviado : continuar}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Enviando…</span> : enviado ? 'Ingresar el código' : 'Continuar'}
        </AButton>
      </footer>
    </div>
  );
}

function RecuperarOTP({ est = 'default', onBack, onOk }) {
  const [code, setCode] = uSa(est === 'default' ? '' : '408213');
  const [envio, setEnvio] = uSa(est === 'loading');
  const [err, setErr] = uSa(est === 'incorrecto' ? 'Código incorrecto. Inténtalo nuevamente.' : null);
  const listo = code.length === AUTH_CFG.largoOTP;
  return (
    <div className="tc-screen">
      <ABar titulo="Verificación" onBack={onBack} />
      <main className="au-body with-cta">
        <span className="au-ic"><MIcon name="lock" size={26} color="var(--color-primary)" /></span>
        <AHead titulo="Confirma que eres tú">Ingresa el código de 6 dígitos que enviamos a <b>{CONTACTO.correo}</b>.</AHead>
        <div className="au-form">
          <OTPInput id="rc-otp" value={code} onChange={(v) => { setCode(v); setErr(null); }} error={!!err} disabled={envio} autoFocus />
          <OtpMsg error={err} />
        </div>
        <Reenvio onReenviar={() => setCode('')} />
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={() => { setEnvio(true); setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1100); }}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Verificando…</span> : 'Verificar'}
        </AButton>
      </footer>
    </div>
  );
}

/* -------------------- 16–17 · Nueva contraseña y confirmación --------------- */
function NuevaPass({ est = 'default', onBack, onOk }) {
  const pre = est !== 'default' && est !== 'loading';
  const [pass, setPass] = uSa(pre ? 'Viajes2026' : '');
  const [rep, setRep] = uSa(est === 'error' ? 'Viajes20' : pre ? 'Viajes2026' : '');
  const [ver, setVer] = uSa(est === 'error');
  const [envio, setEnvio] = uSa(est === 'loading');
  const cumple = AUTH_REGLAS.every((r) => r.ok(pass));
  const errRep = rep && rep !== pass ? 'Las contraseñas no coinciden.' : null;
  const listo = cumple && rep === pass && rep.length > 0;
  return (
    <div className="tc-screen">
      <ABar titulo="Nueva contraseña" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead titulo="Crea una nueva contraseña">Usa una contraseña que no hayas utilizado antes en la app.</AHead>
        <div className="au-form">
          <APass id="np-pass" label="Nueva contraseña" value={pass} onChange={setPass} disabled={envio} autoFocus />
          <Reglas valor={pass} ver={ver} />
          <APass id="np-rep" label="Confirmar nueva contraseña" value={rep} onChange={setRep} error={errRep} disabled={envio} />
        </div>
        <Pendiente>usar la misma política de contraseñas del backend que en el registro.</Pendiente>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={() => { setVer(true); setEnvio(true); setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1200); }}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Guardando…</span> : 'Guardar contraseña'}
        </AButton>
      </footer>
    </div>
  );
}

function PassActualizada({ onLogin }) {
  return (
    <div className="tc-screen">
      <div className="au-ok">
        <span className="au-ok-ic"><MIcon name="check" size={34} color="#fff" /></span>
        <h1>Contraseña actualizada</h1>
        <p>Ya puedes ingresar con tu nueva contraseña.</p>
      </div>
      <footer className="au-cta" style={{ position: 'static', borderTop: 'none' }}>
        <AButton fullWidth onClick={onLogin}>Iniciar sesión</AButton>
      </footer>
    </div>
  );
}

Object.assign(window, {
  AUTH_CFG, AUTH_REGLAS, CONTACTO, esCorreo, ABar, AHead, Pendiente, APass, Reglas,
  OTPInput, OtpMsg, Reenvio, AButton, Bienvenida, Login, Registro, VerificarRegistro,
  DatosPersonales, CuentaCreada, Recuperar, RecuperarOTP, NuevaPass, PassActualizada,
});
