/* Módulo Mis viajes: raíz de la app (con bottom navigation) + pantallas secundarias en pila. */
const { useState: uS3 } = React;

const BASE = {
  pasajero: 'Diego Ordoñez Ramírez', doc: 'DNI 72422111',
  term: 'T. Bolognesi', dir: 'Av. José Leonardo Ortiz 155, Chiclayo',
  termLl: 'T. Sánchez Cerro', dirLl: 'Av. Sánchez Cerro 1123, Piura',
};

const PROXIMOS = [
  { ...BASE, id: 'v1', estado: 'proximo', origen: 'Chiclayo', destino: 'Piura', fecha: '2026-08-15', sale: '16:30', llega: '20:00', dur: 210, asiento: '28', servicio: 'Cama VIP', tipo: 'Directo', codigo: 'TC-8471293', compra: '2026-08-02', precio: 43 },
  { ...BASE, id: 'v2', estado: 'proximo', origen: 'Piura', destino: 'Chiclayo', fecha: '2026-08-19', sale: '21:30', llega: '01:00', masDia: true, dur: 210, asiento: '12', servicio: 'Semi cama', tipo: 'Directo', codigo: 'TC-8471294', compra: '2026-08-02', precio: 31, term: 'T. Sánchez Cerro', dir: 'Av. Sánchez Cerro 1123, Piura', termLl: 'T. Bolognesi', dirLl: 'Av. José Leonardo Ortiz 155, Chiclayo' },
  { ...BASE, id: 'v3', estado: 'proximo', origen: 'Chiclayo', destino: 'Trujillo', fecha: '2026-09-05', sale: '08:15', llega: '11:45', dur: 210, asiento: '07', servicio: 'Semi cama', tipo: 'Directo', codigo: 'TC-8503118', compra: '2026-08-06', precio: 35, termLl: 'T. Salaverry', dirLl: 'Av. Salaverry 820, Trujillo' },
];

const PASADOS = [
  { ...BASE, id: 'p1', estado: 'completado', origen: 'Chiclayo', destino: 'Piura', fecha: '2026-08-09', sale: '16:30', llega: '20:00', dur: 210, asiento: '28', servicio: 'Semi cama', tipo: 'Directo', codigo: 'TC-8390442', compra: '2026-07-28', precio: 31 },
  { ...BASE, id: 'p2', estado: 'completado', origen: 'Trujillo', destino: 'Chiclayo', fecha: '2026-07-21', sale: '23:00', llega: '02:30', masDia: true, dur: 210, asiento: '15', servicio: 'Cama VIP', tipo: 'Directo', codigo: 'TC-8221907', compra: '2026-07-15', precio: 43, term: 'T. Salaverry', dir: 'Av. Salaverry 820, Trujillo', termLl: 'T. Bolognesi', dirLl: 'Av. José Leonardo Ortiz 155, Chiclayo' },
  { ...BASE, id: 'p3', estado: 'anulado', origen: 'Chiclayo', destino: 'Lima', fecha: '2026-07-02', sale: '20:00', llega: '06:30', masDia: true, dur: 630, asiento: '33', servicio: 'Cama VIP', tipo: 'Directo', codigo: 'TC-8104556', compra: '2026-06-20', precio: 89, anuladoEl: '2026-06-30', termLl: 'T. Javier Prado', dirLl: 'Av. Javier Prado Este 1155, Lima' },
];

const PASADOS_ANU = [PASADOS[2], PASADOS[0], PASADOS[1]];

const DEMO_V = [
  ['1. Próximos · un viaje', { tab: 'proximos', prox: 1 }],
  ['2. Próximos · varios', { tab: 'proximos', prox: 3 }],
  ['3. Próximos · vacío', { tab: 'proximos', prox: 0 }],
  ['4. Pasados · historial', { tab: 'pasados', pas: 'llena' }],
  ['5. Pasados · vacío', { tab: 'pasados', pas: 'vacia' }],
  ['6. Pasados · viaje anulado', { tab: 'pasados', pas: 'anulado' }],
  ['7. Cargando', { tab: 'proximos', prox: 3, estado: 'loading' }],
  ['8. Error de carga', { tab: 'proximos', prox: 3, estado: 'error' }],
  ['9. Actualizando', { tab: 'proximos', prox: 3, refresh: true }],
  ['10. Detalle · próximo', { tab: 'proximos', prox: 3, ver: ['v1'] }],
  ['11. Detalle · pasado', { tab: 'pasados', pas: 'llena', ver: ['p1'] }],
  ['12. Detalle · anulado', { tab: 'pasados', pas: 'anulado', ver: ['p3'] }],
  ['13. Boleto', { tab: 'proximos', prox: 3, ver: ['v1', 'boleto'] }],
];

function ModuloViajes() {
  const [tab, setTab] = uS3('proximos');
  const [nProx, setNProx] = uS3(3);
  const [pas, setPas] = uS3('llena');
  const [estado, setEstado] = uS3('ok');
  const [refrescando, setRefrescando] = uS3(false);
  const [pila, setPila] = uS3([]);
  const [demo, setDemo] = uS3('2. Próximos · varios');

  const proximos = PROXIMOS.slice(0, nProx);
  const pasados = pas === 'vacia' ? [] : pas === 'anulado' ? PASADOS_ANU : PASADOS;
  const todos = [...PROXIMOS, ...PASADOS];
  const viaje = pila.length ? todos.find((v) => v.id === pila[0]) : null;
  const enBoleto = pila[1] === 'boleto';

  const aplicar = (nombre) => {
    const c = DEMO_V.find(([n]) => n === nombre)[1];
    setDemo(nombre); setTab(c.tab);
    setNProx(c.prox === undefined ? 3 : c.prox);
    setPas(c.pas || 'llena');
    setEstado(c.estado || 'ok');
    setRefrescando(!!c.refresh);
    setPila(c.ver || []);
  };

  const reintentar = () => { setEstado('loading'); setTimeout(() => setEstado('ok'), 1000); };

  const pantalla = () => {
    if (viaje && enBoleto) return <Boleto v={viaje} onBack={() => setPila([viaje.id])} />;
    if (viaje) return <DetalleViaje v={viaje} onBack={() => setPila([])} onBoleto={() => setPila([viaje.id, 'boleto'])} />;
    return (
      <MisViajes
        tab={tab} setTab={setTab} proximos={proximos} pasados={pasados} estado={estado} refrescando={refrescando}
        onAbrir={(v) => setPila([v.id])} onBoleto={(v) => setPila([v.id, 'boleto'])}
        onBuscar={() => {}} onReintentar={reintentar}
      />
    );
  };

  return (
    <>
      <div className="device"><div className="phone">{pantalla()}</div></div>
      <div className="demo">
        <div className="demo-grid" role="group" aria-label="Pantallas y estados del módulo">
          {DEMO_V.map(([n]) => (
            <button key={n} className={'demo-btn' + (demo === n ? ' on' : '')} onClick={() => aplicar(n)}>{n}</button>
          ))}
        </div>
      </div>
    </>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('app')).render(<ModuloViajes />);
Object.assign(window, { PROXIMOS, PASADOS });
