/* Verificación en dos pasos. Dos contextos distintos que comparten OTPInput:
   A) el desafío 2FA durante el inicio de sesión;
   B) la configuración de 2FA dentro de Cuenta → Privacidad y seguridad. */
const { useState: uS2 } = React;

/* Solo métodos realmente soportados y ya verificados por la persona. */
const METODOS_2FA = [
  { v: 'sms', t: 'SMS', d: '••• ••• 8017', ic: 'chat' },
  { v: 'correo', t: 'Correo electrónico', d: 'd••••@gmail.com', ic: 'doc' },
  { v: 'app', t: 'App autenticadora', d: 'Código de tu app de seguridad', ic: 'lock' },
];
const metodo2fa = (v) => METODOS_2FA.find((m) => m.v === v) || METODOS_2FA[0];

function HojaMetodos({ open, valor, onElegir, onClose, titulo = 'Verificar mediante' }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <div className="sheet-h">
          <h3>{titulo}</h3>
          <button className="tc-icon-btn" onClick={onClose} aria-label="Cerrar"><MIcon name="chevron" size={20} color="var(--text-secondary)" style={{ transform: 'rotate(90deg)' }} /></button>
        </div>
        <div className="met">
          {METODOS_2FA.map((m) => (
            <button key={m.v} className="met-row" onClick={() => onElegir(m.v)} role="radio" aria-checked={valor === m.v}>
              <span className="ct-row-ic"><MIcon name={m.ic} size={20} color="var(--color-primary)" /></span>
              <span className="met-tx"><b>{m.t}</b><span>{m.d}</span></span>
              <span className={'radio' + (valor === m.v ? ' on' : '')} />
            </button>
          ))}
        </div>
        <p className="tc-tail">Solo mostramos métodos que ya verificaste. Durante una verificación no puedes registrar un teléfono o correo nuevo.</p>
        <span className="tc-safe" />
      </div>
    </div>
  );
}

/* ------------------ 10–13 · Verificación en dos pasos (login) --------------- */
function Desafio2FA({ est = 'default', onBack, onOk }) {
  const [met, setMet] = uS2('sms');
  const [hoja, setHoja] = uS2(false);
  const [code, setCode] = uS2(est === 'default' || est === 'reenviar' ? '' : '408213');
  const [envio, setEnvio] = uS2(est === 'loading');
  const [err, setErr] = uS2(est === 'incorrecto' ? 'incorrecto' : est === 'expirado' ? 'expirado' : null);
  const m = metodo2fa(met);
  const listo = code.length === AUTH_CFG.largoOTP;
  const expirado = err === 'expirado';

  const verificar = () => {
    setEnvio(true); setErr(null);
    setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1200);
  };
  const nuevoCodigo = () => { setErr(null); setCode(''); };

  return (
    <div className="tc-screen">
      <ABar titulo="Verificación" onBack={onBack} />
      <main className="au-body with-cta">
        <span className="au-ic"><MIcon name="shield" size={26} color="var(--color-primary)" /></span>
        <AHead titulo="Verifica que eres tú">
          {met === 'app'
            ? <>Ingresa el código de 6 dígitos que muestra tu <b>app autenticadora</b>.</>
            : <>Ingresa el código de 6 dígitos que enviamos a <b>{m.d}</b>.</>}
        </AHead>
        <div className="au-form">
          <OTPInput id="fa-otp" value={code} onChange={(v) => { setCode(v); if (err !== 'expirado') setErr(null); }}
            error={!!err} disabled={envio || expirado} autoFocus />
          <OtpMsg
            error={err === 'incorrecto' ? 'Código incorrecto. Inténtalo nuevamente.' : expirado ? 'Este código ha vencido.' : null}
            hint={!err ? 'El código llega en unos segundos.' : null} />
        </div>
        {expirado
          ? <AButton variant="outlined" fullWidth onClick={nuevoCodigo} startIcon={<MIcon name="loader" size={18} />}>Solicitar nuevo código</AButton>
          : met !== 'app' && <Reenvio onReenviar={nuevoCodigo} />}
        <button className="au-lnk centro" onClick={() => setHoja(true)}>Usar otro método</button>
        <Pendiente>la vigencia del código, el cooldown de reenvío y el número de intentos permitidos vienen de la configuración del backend.</Pendiente>
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio || expirado} onClick={verificar}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Verificando…</span> : 'Verificar'}
        </AButton>
      </footer>
      <HojaMetodos open={hoja} valor={met} onClose={() => setHoja(false)}
        onElegir={(v) => { setMet(v); setCode(''); setErr(null); setHoja(false); }} />
    </div>
  );
}

/* ------------- 18 / 21–22 · Privacidad y seguridad → 2FA -------------------- */
function Seguridad2FA({ activo, metodo = 'sms', onBack, onActivar, onCambiar, onDesactivar }) {
  const m = metodo2fa(metodo);
  return (
    <div className="tc-screen">
      <ABar titulo="Verificación en dos pasos" onBack={onBack} />
      <main className="au-body with-cta">
        <span className="au-ic"><MIcon name="shield" size={26} color="var(--color-primary)" /></span>
        <AHead titulo="Verificación en dos pasos">Añade una capa adicional de seguridad a tu cuenta. Te pediremos un código cada vez que inicies sesión.</AHead>
        <div className="card-plain">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span className="f-lab">Estado</span>
            <span className={'estado-pill ' + (activo ? 'on' : 'off')}>
              <MIcon name={activo ? 'check' : 'info'} size={14} />{activo ? 'Activada' : 'Desactivada'}
            </span>
          </div>
          {activo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-light)', paddingTop: 14 }}>
              <span className="f-lab">Método</span>
              <span className="met-tx" style={{ alignItems: 'flex-end' }}><b>{m.t}</b><span>{m.d}</span></span>
            </div>
          )}
        </div>
        {activo && (
          <div className="card-plain p0">
            <div className="ct-lista">
              <Row icon="cog" titulo="Cambiar método" desc="Elige por dónde recibes el código" onClick={onCambiar} />
              <Row icon="lock" titulo="Desactivar verificación en dos pasos" desc="Te pediremos un código para confirmarlo" danger onClick={onDesactivar} />
            </div>
          </div>
        )}
        <Pendiente>confirmar con seguridad qué reautenticación exige desactivar la 2FA. En este prototipo se pide un código de verificación.</Pendiente>
      </main>
      {!activo && <footer className="au-cta"><AButton fullWidth onClick={onActivar}>Activar</AButton></footer>}
    </div>
  );
}

/* ------------------------- 19 · Elegir método de 2FA ------------------------ */
function ElegirMetodo2FA({ inicial = 'sms', onBack, onContinuar, titulo = 'Activar verificación en dos pasos', texto = 'Elige por dónde quieres recibir el código cada vez que inicies sesión.' }) {
  const [met, setMet] = uS2(inicial);
  return (
    <div className="tc-screen">
      <ABar titulo="Verificación en dos pasos" onBack={onBack} />
      <main className="au-body with-cta">
        <AHead titulo={titulo}>{texto}</AHead>
        <div className="card-plain p0">
          <div className="met" role="radiogroup" aria-label="Método de verificación">
            {METODOS_2FA.map((m) => (
              <button key={m.v} className="met-row" role="radio" aria-checked={met === m.v} onClick={() => setMet(m.v)}>
                <span className="ct-row-ic"><MIcon name={m.ic} size={20} color="var(--color-primary)" /></span>
                <span className="met-tx"><b>{m.t}</b><span>{m.d}</span></span>
                <span className={'radio' + (met === m.v ? ' on' : '')} />
              </button>
            ))}
          </div>
        </div>
        <p className="tc-tail">Solo aparecen los métodos que ya verificaste. Si el backend soporta un único método, esta pantalla no se muestra.</p>
      </main>
      <footer className="au-cta">
        <AButton fullWidth onClick={() => onContinuar && onContinuar(met)}>Enviar código</AButton>
      </footer>
    </div>
  );
}

/* --------- 20 · Verificar activación · y reautenticación para desactivar ---- */
function OTP2FA({ modo = 'activar', metodo = 'sms', est = 'default', onBack, onOk }) {
  const m = metodo2fa(metodo);
  const [code, setCode] = uS2(est === 'default' ? '' : '408213');
  const [envio, setEnvio] = uS2(est === 'loading');
  const [err, setErr] = uS2(est === 'incorrecto' ? 'Código incorrecto. Inténtalo nuevamente.' : null);
  const listo = code.length === AUTH_CFG.largoOTP;
  const desact = modo === 'desactivar';
  return (
    <div className="tc-screen">
      <ABar titulo={desact ? 'Confirmar' : 'Verificación'} onBack={onBack} />
      <main className="au-body with-cta">
        <span className="au-ic"><MIcon name={desact ? 'lock' : 'shield'} size={26} color="var(--color-primary)" /></span>
        <AHead titulo={desact ? 'Confirma que eres tú' : 'Confirma tu método'}>
          {desact
            ? <>Para desactivar la verificación en dos pasos, ingresa el código que enviamos a <b>{m.d}</b>.</>
            : m.v === 'app'
              ? <>Ingresa el código de 6 dígitos que muestra tu <b>app autenticadora</b> para terminar de activarla.</>
              : <>Ingresa el código de 6 dígitos que enviamos a <b>{m.d}</b> para terminar de activarla.</>}
        </AHead>
        <div className="au-form">
          <OTPInput id="ac-otp" value={code} onChange={(v) => { setCode(v); setErr(null); }} error={!!err} disabled={envio} autoFocus />
          <OtpMsg error={err} />
        </div>
        {m.v !== 'app' && <Reenvio onReenviar={() => setCode('')} />}
      </main>
      <footer className="au-cta">
        <AButton fullWidth disabled={!listo || envio} onClick={() => { setEnvio(true); setTimeout(() => { setEnvio(false); onOk && onOk(); }, 1200); }}>
          {envio ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MIcon name="loader" size={18} color="#fff" className="spin" />Verificando…</span> : desact ? 'Desactivar' : 'Activar'}
        </AButton>
      </footer>
    </div>
  );
}

function Activada2FA({ metodo = 'sms', onListo }) {
  const m = metodo2fa(metodo);
  return (
    <div className="tc-screen">
      <div className="au-ok">
        <span className="au-ok-ic"><MIcon name="check" size={34} color="#fff" /></span>
        <h1>Verificación activada</h1>
        <p>Te pediremos un código por {m.t.toLowerCase()} cada vez que inicies sesión.</p>
      </div>
      <footer className="au-cta" style={{ position: 'static', borderTop: 'none' }}>
        <AButton fullWidth onClick={onListo}>Listo</AButton>
      </footer>
    </div>
  );
}

Object.assign(window, { METODOS_2FA, metodo2fa, HojaMetodos, Desafio2FA, Seguridad2FA, ElegirMetodo2FA, OTP2FA, Activada2FA });
