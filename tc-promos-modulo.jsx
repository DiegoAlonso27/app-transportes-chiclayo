/* Módulo Promociones: raíz de la app (con bottom navigation) + detalle en pila.
   El contenido es de ejemplo para validar la jerarquía; las promociones reales las define marketing. */
const { useState: uS4 } = React;

const PROMOS = [
  {
    id: 'pr1', destacada: true, imagen: true, codigo: null,
    beneficio: '20% de descuento',
    titulo: 'Descuento en la ruta Chiclayo – Piura',
    desc: 'El descuento se aplica sobre la tarifa vigente en los servicios seleccionados de esta ruta.',
    desde: '2026-08-01', hasta: '2026-08-31',
    aplica: [{ ic: 'pin', t: 'Chiclayo → Piura y Piura → Chiclayo' }, { ic: 'bus', t: 'Servicios Semi cama' }, { ic: 'calendar', t: 'Salidas de lunes a jueves' }],
    condiciones: ['El descuento se muestra en el precio antes de pagar.', 'Sujeto a disponibilidad de asientos en los servicios incluidos.', 'No se acumula con otras promociones.'],
    terminos: 'Promoción válida solo para compras realizadas dentro del periodo de vigencia y en los servicios indicados. Transportes Chiclayo puede modificar o finalizar la promoción antes de la fecha de término informándolo en este mismo espacio. Los cambios y anulaciones se rigen por las condiciones del pasaje comprado.',
    ctaHint: 'Abrimos la búsqueda con la ruta de la promoción.',
  },
  {
    id: 'pr2', imagen: false, codigo: null,
    beneficio: 'Precio desde S/ 29',
    titulo: 'Tarifa promocional a Trujillo',
    desc: 'Precio especial en salidas de madrugada mientras dure el cupo asignado a la promoción.',
    desde: '2026-08-05', hasta: '2026-09-15',
    aplica: [{ ic: 'pin', t: 'Chiclayo → Trujillo' }, { ic: 'bus', t: 'Servicio Semi cama' }, { ic: 'calendar', t: 'Salidas de 00:00 a 06:00' }],
    condiciones: ['Cupo limitado por salida.', 'El precio mostrado ya incluye la promoción.', 'No aplica a pasajes comprados en terminal.'],
    terminos: 'La tarifa promocional se mantiene mientras existan asientos asignados a la promoción en cada salida. Al agotarse el cupo, la compra continúa con la tarifa vigente. Transportes Chiclayo informará en este espacio cualquier cambio en la vigencia.',
    ctaHint: 'Abrimos la búsqueda con la ruta de la promoción.',
  },
  {
    id: 'pr3', imagen: true, codigo: 'VERANO2026',
    beneficio: '10% de descuento con código',
    titulo: 'Campaña de temporada',
    desc: 'Ingresa el código al pagar y el descuento se aplica sobre el total de tu compra.',
    desde: '2026-08-01', hasta: '2026-08-25',
    aplica: [{ ic: 'pin', t: 'Todas las rutas' }, { ic: 'bus', t: 'Todos los servicios' }, { ic: 'user', t: 'Un uso por persona' }],
    condiciones: ['El código se ingresa en el paso de pago, antes de confirmar.', 'Válido para una compra por documento de identidad.', 'No aplica sobre pasajes ya comprados.'],
    terminos: 'El código es personal y de un solo uso. Si la compra se anula, el código no se restituye. Transportes Chiclayo puede desactivar el código antes del término de la vigencia informándolo en este espacio.',
    ctaHint: 'El código se aplica en el paso de pago.',
  },
  {
    id: 'pr4', imagen: false, codigo: null,
    beneficio: 'Descuento en el retorno',
    titulo: 'Ida y vuelta en la misma compra',
    desc: 'Al comprar ida y retorno en una sola operación, el descuento se aplica al tramo de vuelta.',
    desde: '2026-07-15', hasta: '2026-09-30',
    aplica: [{ ic: 'pin', t: 'Rutas con retorno disponible' }, { ic: 'bus', t: 'Todos los servicios' }],
    condiciones: ['Ambos tramos deben comprarse en la misma operación.', 'El descuento se muestra en el resumen antes de pagar.', 'Si se anula la ida, el retorno mantiene su tarifa original.'],
    terminos: 'La promoción se aplica automáticamente cuando la compra incluye ida y retorno. No requiere código. Las condiciones de cambio y anulación son las del pasaje adquirido.',
    ctaHint: 'Abrimos la búsqueda con ida y vuelta activadas.',
  },
];

const SIN_DESTACADA = PROMOS.map((p) => ({ ...p, destacada: false }));

const DEMO_P = [
  ['1. Promociones vigentes', { lista: 'planas' }],
  ['2. Destacada + otras', { lista: 'destacada' }],
  ['3. Sin promociones', { lista: 'vacia' }],
  ['4. Cargando', { lista: 'destacada', estado: 'loading' }],
  ['5. Error de carga', { lista: 'destacada', estado: 'error' }],
  ['6. Detalle sin código', { lista: 'destacada', ver: 'pr1' }],
  ['7. Detalle con código', { lista: 'destacada', ver: 'pr3' }],
  ['8. Home · card compacta', { lista: 'planas', home: true }],
];

function ModuloPromos() {
  const [modo, setModo] = uS4('planas');
  const [estado, setEstado] = uS4('ok');
  const [ver, setVer] = uS4(null);
  const [home, setHome] = uS4(false);
  const [demo, setDemo] = uS4('1. Promociones vigentes');

  const lista = modo === 'vacia' ? [] : modo === 'destacada' ? PROMOS : SIN_DESTACADA;
  const promo = ver ? PROMOS.find((p) => p.id === ver) : null;

  const aplicar = (nombre) => {
    const c = DEMO_P.find(([n]) => n === nombre)[1];
    setDemo(nombre); setModo(c.lista); setEstado(c.estado || 'ok'); setVer(c.ver || null); setHome(!!c.home);
  };

  const reintentar = () => { setEstado('loading'); setTimeout(() => setEstado('ok'), 1000); };

  const pantalla = () => {
    if (promo) return <DetallePromo p={promo} onBack={() => setVer(null)} onAprovechar={() => {}} />;
    if (home) return <HomeFragmento lista={lista} onAbrir={(p) => setVer(p.id)} onVerTodas={() => { setHome(false); setDemo('1. Promociones vigentes'); }} />;
    return <Promociones lista={lista} estado={estado} onAbrir={(p) => setVer(p.id)} onBuscar={() => {}} onReintentar={reintentar} />;
  };

  return (
    <>
      <div className="device"><div className="phone">{pantalla()}</div></div>
      <div className="demo">
        <div className="demo-grid" role="group" aria-label="Pantallas y estados del módulo">
          {DEMO_P.map(([n]) => (
            <button key={n} className={'demo-btn' + (demo === n ? ' on' : '')} onClick={() => aplicar(n)}>{n}</button>
          ))}
        </div>
      </div>
    </>
  );
}

if (!window.__TC_PROTO) ReactDOM.createRoot(document.getElementById('app')).render(<ModuloPromos />);
Object.assign(window, { PROMOS });
