/* Prototipo navegable: une las pantallas ya diseñadas en una sola app.
   Cada pantalla vive en su archivo; aquí solo está la navegación y el estado
   que se arrastra entre pasos (ruta, fecha, servicio, asientos, pasajeros). */
const { useState: ptS } = React;
const PtDS = window.TransportesChiclayoDesignSystem_48bc0c;

const PT_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const PT_MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const PT_MES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
const ptHhmm = (m) => `${String(Math.floor((m % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const ptDur = (m) => `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`;
const ptCorta = (d) => `${PT_DIAS[d.getDay()]} ${d.getDate()} ${PT_MES[d.getMonth()]}`;
const ptLarga = (d) => `${PT_DIAS[d.getDay()]}, ${d.getDate()} de ${PT_MES_L[d.getMonth()]}`;
const ptIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const PT_TERM = {
  Chiclayo: { t: 'T. Bolognesi', dir: 'Av. José Leonardo Ortiz 155, Chiclayo' },
  Piura: { t: 'T. Sánchez Cerro', dir: 'Av. Sánchez Cerro 1123, Piura' },
  Lima: { t: 'T. Javier Prado', dir: 'Av. Javier Prado Este 1155, Lima' },
  Trujillo: { t: 'T. Salaverry', dir: 'Av. Salaverry 820, Trujillo' },
};
const ptTerm = (c) => PT_TERM[c] || { t: 'Terminal Terrestre', dir: `Terminal Terrestre de ${c}` };
const PT_METODO = { yape: 'Yape o Plin', tarjeta: 'Tarjeta de crédito o débito', agencia: 'Efectivo en agencia' };

function Proto() {
  const [tab, setTab] = ptS('inicio');
  const [stack, setStack] = ptS([]);
  const [vTab, setVTab] = ptS('proximos');

  /* Compra en curso */
  const [busqueda, setBusqueda] = ptS(null);
  const [servicio, setServicio] = ptS(null);
  const [asientos, setAsientos] = ptS(null);
  const [datos, setDatos] = ptS(null);
  const [compra, setCompra] = ptS(null);
  const [comprados, setComprados] = ptS([]);

  /* Mi cuenta */
  const [perfil, setPerfil] = ptS(window.PERFIL);
  const [pasajeros, setPasajeros] = ptS(window.PAX_INICIALES);
  const [editando, setEditando] = ptS(null);
  const [prefs, setPrefs] = ptS({ recordatorios: true, compras: true, promos: false });
  const [salir, setSalir] = ptS(false);
  const [toast, setToast] = ptS(null);
  const [cargandoPax, setCargandoPax] = ptS(false);

  /* Sesión y verificación en dos pasos */
  const [sesion, setSesion] = ptS(true);
  const [authV, setAuthV] = ptS('bienvenida');
  const [dosfa, setDosfa] = ptS({ activo: false, metodo: 'sms' });

  const top = stack[stack.length - 1] || null;
  const ir = (id, data) => setStack((s) => [...s, { id, data }]);
  const volver = () => setStack((s) => s.slice(0, -1));
  const irTab = (t) => { setTab(t); setStack([]); };
  const avisar = (txt) => { setToast({ txt }); clearTimeout(avisar.id); avisar.id = setTimeout(() => setToast(null), 2400); };

  const abrirPasajeros = () => {
    ir('pasajeros'); setCargandoPax(true);
    setTimeout(() => setCargandoPax(false), 900);
  };

  /* ---------------- Flujo de compra ---------------- */
  const enBusqueda = (b) => { setBusqueda(b); setServicio(null); setAsientos(null); ir('res'); };

  const elegirServicio = (s) => { setServicio(s); ir('asi'); };

  const viajeDeServicio = () => {
    const o = busqueda.origen, d = busqueda.destino;
    const llega = servicio.sale + servicio.dur;
    return {
      origen: o, destino: d, sale: ptHhmm(servicio.sale), llega: ptHhmm(llega),
      dur: ptDur(servicio.dur), diaSiguiente: llega >= 1440,
      embarque: ptTerm(o).dir, desembarque: ptTerm(d).dir,
    };
  };

  const elegirAsientos = (orden, total) => {
    setAsientos({ nums: orden.map((s) => s.n), total });
    ir('pax');
  };

  const guardarDatos = (d) => { setDatos(d); ir('chk'); };

  const pagar = ({ metodo }) => {
    const v = viajeDeServicio();
    const p0 = datos.paxes[0];
    const c = {
      origen: v.origen, destino: v.destino, sale: v.sale, llega: v.llega, masDia: v.diaSiguiente,
      fecha: ptLarga(busqueda.ida), fechaIso: ptIso(busqueda.ida), dur: servicio.dur,
      term: ptTerm(v.origen).t, termLl: ptTerm(v.destino).t,
      dir: ptTerm(v.origen).dir, dirLl: ptTerm(v.destino).dir,
      asientos: asientos.nums, servicio: `${servicio.servicio} · ${servicio.tipo}`,
      tipoServicio: servicio.servicio, tipo: servicio.tipo,
      codigo: 'TC-' + String(8500000 + Math.floor(Math.random() * 99999)),
      metodo: PT_METODO[metodo] || 'Tarjeta', total: asientos.total,
      correo: datos.contacto.email, pasajero: `${p0.nombres} ${p0.apellidos}`.trim() || 'Pasajero',
      doc: `${p0.tipo} ${p0.num}`,
    };
    setCompra(c);
    setComprados((prev) => [{
      id: 'nueva-' + c.codigo, estado: 'proximo', origen: c.origen, destino: c.destino, fecha: c.fechaIso,
      sale: c.sale, llega: c.llega, masDia: c.masDia, dur: c.dur, asiento: String(c.asientos[0]),
      servicio: c.tipoServicio, tipo: c.tipo, codigo: c.codigo, compra: '2026-08-09', precio: c.total,
      term: c.term, dir: c.dir, termLl: c.termLl, dirLl: c.dirLl, pasajero: c.pasajero, doc: c.doc,
    }, ...prev]);
    setStack([{ id: 'cfm' }]);
  };

  const boletoDeCompra = () => {
    const v = comprados[0];
    setTab('viajes'); setStack([{ id: 'boleto', data: v }]);
  };

  /* ---------------- Resolución de pantalla ---------------- */
  const proximos = [...comprados, ...window.PROXIMOS];
  const pasados = window.PASADOS;

  const pantalla = () => {
    const id = top && top.id;

    /* Compra */
    if (id === 'res') return ['scr-res', <Resultados ruta={busqueda} base={busqueda.ida} onBack={volver} onSelect={elegirServicio} />];
    if (id === 'asi') return ['scr-asi', <Asientos busKey={servicio.servicio === 'Cama VIP' ? 'cama' : 'semi'} viaje={viajeDeServicio()} onBack={volver} onContinuar={elegirAsientos} />];
    if (id === 'pax') {
      const v = viajeDeServicio();
      return ['scr-pax', <Pasajeros
        viaje={{ origen: v.origen, destino: v.destino, sale: v.sale, llega: v.llega, fecha: ptCorta(busqueda.ida) }}
        asientos={asientos.nums} precio={Math.round(asientos.total / asientos.nums.length)}
        busqueda nPax={asientos.nums.length} onBack={volver} onContinuar={guardarDatos} />];
    }
    if (id === 'chk') {
      const n = asientos.nums.length;
      const p0 = datos.paxes[0];
      return ['scr-chk', <Checkout onBack={volver} onPagar={pagar} resumen={{
        ruta: `${busqueda.origen} → ${busqueda.destino}`,
        sub: `${ptCorta(busqueda.ida)}, ${ptHhmm(servicio.sale)} · ${n} ${n === 1 ? 'asiento' : 'asientos'}`,
        total: asientos.total, nPax: n,
        titular: `${p0.nombres} ${p0.apellidos}`.trim(),
        correo: datos.contacto.email, tel: `${datos.contacto.prefijo} ${datos.contacto.tel}`,
        pax: `${n} · ${n === 1 ? 'asiento' : 'asientos'} ${asientos.nums.join(', ')}`,
      }} />];
    }
    if (id === 'cfm') return ['scr-cfm', <Confirmacion c={compra} onBoleto={boletoDeCompra} onInicio={() => irTab('inicio')} />];

    /* Mis viajes */
    if (id === 'boleto') return ['scr-via', <Boleto v={top.data} onBack={() => setStack([{ id: 'viaje', data: top.data }])} />];
    if (id === 'viaje') return ['scr-via', <DetalleViaje v={top.data} onBack={volver} onBoleto={() => ir('boleto', top.data)} />];

    /* Promociones */
    if (id === 'promo') return ['scr-pro', <DetallePromo p={top.data} onBack={volver} onAprovechar={() => irTab('inicio')} />];

    /* Mi cuenta */
    if (id === 'datos') return ['scr-cta', <MisDatos perfil={perfil} onBack={volver} guardar={(f, m) => { setPerfil(f); avisar(m); volver(); }} />];
    if (id === 'pasajeros') return ['scr-cta', <ListaPasajeros pasajeros={pasajeros} cargando={cargandoPax} onBack={volver}
      onNuevo={() => { setEditando(null); ir('pax-nuevo'); }} onEditar={(pid) => { setEditando(pid); ir('pax-editar'); }} />];
    if (id === 'pax-nuevo') return ['scr-cta', <FormPasajero key="nuevo" inicial={window.PAX_NUEVO} modo="nuevo" onBack={volver}
      onGuardar={(p, m) => { setPasajeros((prev) => [...prev, { ...p, id: 'p' + Date.now() }]); avisar(m); volver(); }} />];
    if (id === 'pax-editar') return ['scr-cta', <FormPasajero key={editando} modo="editar" onBack={volver}
      inicial={pasajeros.find((p) => p.id === editando) || window.PAX_NUEVO}
      onGuardar={(p, m) => { setPasajeros((prev) => prev.map((x) => (x.id === p.id ? p : x))); avisar(m); volver(); }}
      onEliminar={(pid) => { setPasajeros((prev) => prev.filter((x) => x.id !== pid)); avisar('Pasajero eliminado'); volver(); }} />];
    if (id === 'notificaciones') return ['scr-cta', <Notificaciones prefs={prefs} setPrefs={setPrefs} onBack={volver} avisar={(t) => avisar(t.txt || t)} />];
    if (id === 'privacidad') return ['scr-cta', <Privacidad onBack={volver} ir={ir} />];
    if (id === 'password') return ['scr-cta', <Password onBack={volver} avisar={(t) => avisar(t.txt || t)} />];
    if (id === 'gestion') return ['scr-cta', <Gestion onBack={volver} onEliminar={() => { setStack([]); avisar('Cuenta eliminada. Cerramos tu sesión.'); }} />];

    /* Verificación en dos pasos, dentro de Privacidad y seguridad */
    if (id === 'seg2fa') return ['scr-aut', <Seguridad2FA activo={dosfa.activo} metodo={dosfa.metodo} onBack={volver}
      onActivar={() => ir('metodo2fa')} onCambiar={() => ir('metodo2fa')} onDesactivar={() => ir('off2fa')} />];
    if (id === 'metodo2fa') return ['scr-aut', <ElegirMetodo2FA inicial={dosfa.metodo} onBack={volver}
      onContinuar={(m) => { setDosfa({ ...dosfa, metodo: m }); ir('otp2fa'); }} />];
    if (id === 'otp2fa') return ['scr-aut', <OTP2FA modo="activar" metodo={dosfa.metodo} onBack={volver}
      onOk={() => { setDosfa({ activo: true, metodo: dosfa.metodo }); setStack((s) => [...s.slice(0, -2), { id: 'ok2fa' }]); }} />];
    if (id === 'ok2fa') return ['scr-aut', <Activada2FA metodo={dosfa.metodo} onListo={volver} />];
    if (id === 'off2fa') return ['scr-aut', <OTP2FA modo="desactivar" metodo={dosfa.metodo} onBack={volver}
      onOk={() => { setDosfa({ ...dosfa, activo: false }); volver(); avisar('Verificación en dos pasos desactivada'); }} />];
    if (id === 'ayuda') return ['scr-cta', <Ayuda onBack={volver} ir={ir} />];
    if (id === 'terminos') return ['scr-cta', <TerminosConsulta secciones={window.SECCIONES_TC} onBack={volver} />];
    if (id === 'privacidad-doc') return ['scr-cta', <PrivacidadDoc onBack={volver} />];

    /* Raíces */
    if (tab === 'viajes') return ['scr-via', <MisViajes tab={vTab} setTab={setVTab} proximos={proximos} pasados={pasados} estado="ok"
      onAbrir={(v) => ir('viaje', v)} onBoleto={(v) => ir('boleto', v)} onBuscar={() => irTab('inicio')} onIr={irTab} />];
    if (tab === 'promos') return ['scr-pro', <Promociones lista={window.PROMOS} estado="ok" onAbrir={(p) => ir('promo', p)}
      onBuscar={() => irTab('inicio')} onIr={irTab} />];
    if (tab === 'cuenta') return ['scr-cta', <HubCuenta perfil={perfil} estado="ok" onTab={irTab} onSalir={() => setSalir(true)}
      ir={(x) => (x === 'pasajeros' ? abrirPasajeros() : ir(x))} />];
    return null;
  };

  const actual = pantalla();
  const enInicio = tab === 'inicio' && !stack.length;

  /* Flujo de acceso: se muestra sobre la app cuando no hay sesión. */
  const entrar = () => { setSesion(true); setAuthV('bienvenida'); irTab('cuenta'); avisar('Sesión iniciada'); };
  const authPantalla = () => {
    switch (authV) {
      case 'login': return <Login onBack={() => setAuthV('bienvenida')} onCrear={() => setAuthV('registro')} onOlvide={() => setAuthV('recuperar')}
        onOk={() => setAuthV(dosfa.activo ? 'dosfa' : 'entrar')} />;
      case 'dosfa': return <Desafio2FA onBack={() => setAuthV('login')} onOk={() => setAuthV('entrar')} />;
      case 'registro': return <Registro onBack={() => setAuthV('bienvenida')} onLogin={() => setAuthV('login')} onContinuar={() => setAuthV('verificar')} />;
      case 'verificar': return <VerificarRegistro onBack={() => setAuthV('registro')} onOk={() => setAuthV('datos')} />;
      case 'datos': return <DatosPersonales onBack={() => setAuthV('verificar')} onOk={() => setAuthV('creada')} onDoc={() => avisar('Abre el documento completo')} />;
      case 'creada': return <CuentaCreada onContinuar={entrar} />;
      case 'recuperar': return <Recuperar onBack={() => setAuthV('login')} onEnviado={() => setAuthV('recuperar-otp')} />;
      case 'recuperar-otp': return <RecuperarOTP onBack={() => setAuthV('recuperar')} onOk={() => setAuthV('nueva-pass')} />;
      case 'nueva-pass': return <NuevaPass onBack={() => setAuthV('recuperar-otp')} onOk={() => setAuthV('pass-lista')} />;
      case 'pass-lista': return <PassActualizada onLogin={() => setAuthV('login')} />;
      case 'entrar': entrar(); return null;
      default: return <Bienvenida onLogin={() => setAuthV('login')} onCrear={() => setAuthV('registro')}
        onInvitado={() => { setSesion(true); irTab('inicio'); }} />;
    }
  };

  if (!sesion) {
    return (
      <>
        <div className="scr scr-aut" key={authV}>{authPantalla()}</div>
        <div id="sheet-host" />
      </>
    );
  }

  return (
    <>
      <div className="scr scr-home" style={{ display: enInicio ? 'block' : 'none' }}>
        <Home onIr={irTab} onBuscar={enBusqueda} onAyuda={() => { setTab('cuenta'); setStack([{ id: 'ayuda' }]); }} />
      </div>
      {actual && <div className={'scr ' + actual[0]} key={(top && top.id) || tab}>{actual[1]}</div>}
      <div className="scr-cta scr-overlay">
        <Toast toast={toast} />
        <Dialogo open={salir} titulo="Cerrar sesión"
          texto="¿Quieres cerrar tu sesión en este dispositivo? Tus pasajes seguirán activos."
          confirmar="Cerrar sesión" onClose={() => setSalir(false)}
          onConfirm={() => { setSalir(false); setStack([]); setSesion(false); setAuthV('bienvenida'); }} />
      </div>
      <div id="sheet-host" />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('phone-root')).render(<Proto />);
