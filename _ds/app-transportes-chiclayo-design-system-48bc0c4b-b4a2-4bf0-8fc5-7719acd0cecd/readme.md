# Transportes Chiclayo Design System

Sistema de diseño para la aplicación móvil de venta de pasajes de buses interprovinciales de Transportes Chiclayo. Basado en **Material Design 3** con identidad visual propia.

---

## 1. Contexto de la empresa

**Transportes Chiclayo** es una empresa de transporte interprovincial de buses en Perú. Ofrece rutas conectando ciudades principales, con énfasis en comodidad, seguridad y servicio al cliente. Su aplicación móvil (Flutter) permite a los usuarios:

- Buscar y reservar pasajes entre ciudades
- Gestionar viajes activos y cancelaciones
- Acceder a historial de viajes
- Almacenar métodos de pago

### Productos referenciados

- **app-tc/** — Aplicación móvil Flutter (iOS/Android). Punto de verdad para componentes, flujos y comportamiento. Código fuente en Flutter con Material Design 3.

---

## 2. Identidad de marca

### Colores principales

- **Rojo Cinnabar (#e73b2b)** — Color primario, usado en CTAs, acciones principales e indicadores de alerta. Comunica urgencia y confianza.
- **Ámbar Selective Yellow (#faba08)** — Color secundario, usado en acentos, indicadores de progreso y estados positivos.
- **Gris Gunsmoke (escala #f9f9fa–#0a0b0b)** — Neutrales para fondos, texto, bordes y estructuras.

### Tipografía

- **Familia:** Aller (Google Fonts)
  - **Regular (400)** — Cuerpos de texto, descripciones
  - **Medium (500)** — Títulos medios, labels, énfasis moderado
  - **Bold (700)** — Títulos grandes, displays, máximo énfasis

- **Escala de tamaños:** Material Design 3 estándar, desde 11px (label pequeño) hasta 57px (display grande)

### Voz y tono

- **Cálido y de servicio.** Sin jerga técnica. Tuteo. Asume culpa en errores y ofrece solución siguiente.
- **Ejemplos:**
  - ✅ "Oops, algo salió mal. Intenta de nuevo."
  - ❌ "Error 422: Validación fallida"
  - ✅ "Reserva tu pasaje fácilmente en 3 pasos"
  - ❌ "Interfaz de reservación de pasajes"

- **Casing:** Oración normal en descripciones; título en botones y encabezados.
- **Emoji:** No se usa en UI de aplicación. Solo en contenido generado por usuarios.
- **Microcopy:** Siempre presente, en label-small gris (#7d8282), asumiendo el usuario prefiere claridad a adivinanzas.

---

## 3. Fundamentos visuales

### Paleta de colores

El sistema hereda Material Design 3 con adaptaciones para Transportes Chiclayo:

**Colores de marca:**
- Cinnabar: 11 tonos desde 50 (muy claro) a 950 (muy oscuro). Primario en 600 (#e73b2b).
- Selective Yellow: 11 tonos. Secundario en 500 (#faba08).
- Gunsmoke (grises): 11 tonos. Fondos en 50–100, texto en 700–900.

**Colores semánticos:**
- Success: Verde Atlantis 600 (#4a9f11)
- Error: Rojo MD3 (#b3261e)
- Warning: Ámbar Selective Yellow 600 (#dd8f02)
- Info: Azul estándar (#0066cc)

### Tipografía en detalle

| Rol | Tamaño | Peso | Alto de línea | Uso |
|-----|--------|------|---------------|-----|
| Display Large | 57px | 700 | 1.12 | Títulos de página principales |
| Headline Large | 32px | 700 | 1.25 | Secciones principales |
| Title Large | 22px | 500 | 1.27 | Encabezados de cards/modales |
| Body Large | 16px | 400 | 1.5 | Texto descriptivo principal |
| Body Medium | 14px | 400 | 1.43 | Cuerpo estándar en listas |
| Label Large | 14px | 500 | 1.43 | Etiquetas de botones, campos |
| Label Small | 11px | 500 | 1.45 | Ayuda, validación, contexto |

### Espaciado

Escala de espaciado Material Design 3:
- **xs:** 4px (gaps pequeños, bordes internos)
- **sm:** 8px (espacios entre elementos)
- **md:** 12px (espacios moderados)
- **lg:** 16px (padding estándar en cards/campos)
- **xl:** 24px (espacios entre secciones)
- **2xl:** 32px (grandes saltos)

**Toque mínimo:** 48×48px (Material Design 3 compliance).

### Radio (border-radius)

- **xs (4px)** — Botones, chips, inputs pequeños
- **sm (8px)** — Cards, dialogs, inputs
- **md (12px)** — Cards elevadas, superficies principales
- **lg (16px)** — Grandes superficies
- **full (999px)** — Avatares, badges, pills

### Sombras (elevación)

Material Design 3 elevation system:
- **Shadow 1:** Card base, dividers
- **Shadow 2:** Elevated buttons, FAB
- **Shadow 3:** Dialogs, bottom sheets
- **Shadow 4:** Modal dialogs
- **Shadow 5:** Floating search bar, dropdowns

### Animación

- **Duraciones estándar:**
  - 150ms — Cambios de color, opacidad
  - 300ms — Entrada/salida, cambios de estado
  - 500ms — Progreso largo

- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design 3 standard)

- **Respeta preferencia de usuario:** `prefers-reduced-motion` desactiva movimiento.

### Estados visuales

- **Hover (desktop):** Opacidad +8%, sin cambio de color base
- **Press/Active:** Color más oscuro (–2 tonos), sin escala
- **Focus:** Outline 2px rojo cinnabar con offset 2px
- **Disabled:** 50% opacidad, cursor no-drop
- **Error:** Rojo + ícono + descripción (nunca solo color)

### Superficies y fondos

- **Fondo principal:** Blanco off (#fffbfe) — Material Design 3 surface
- **Cards:** Blanco puro (#ffffff) con shadow-1, radio-sm
- **Inputs/Textfields:** Outlined style MD3, outline color #d3d4d4, focus outline color #e73b2b
- **Botones primarios:** Rojo cinnabar 600 (#e73b2b), texto blanco, radio-xs
- **Botones secundarios:** Outlined, color de outline #7d8282, color de texto #1f1f1f
- **Botones ghost:** Fondo transparente, texto rojo
- **Chips/Badges:** Radio-full, fondo color-primary-light, texto color-primary

### Componentes comunes

**Cards:** Fondo blanco, radio-sm (8px), shadow-1, padding 16px

**TextFields:** Outlined MD3, altura 52px, border color #d3d4d4, focus border color rojo, radio-sm

**Buttons:**
- FilledButton: altura 48px, width 100%, radio-xs, background rojo
- OutlinedButton: altura 48px, width 100%, border 1px gris, radio-xs
- TextButton: sin fondo, solo texto rojo, altura 48px

**Bottom Navigation:** altura 64px, 4–5 items, ícono + label, color activo rojo, inactivo gris

**Stepper:** Visual progress con ámbar para pasos completados, gris para pendientes

---

## 4. Componentes (reusables)

El sistema define componentes reusables listos para consumo en otras aplicaciones. Cada componente tiene:

- **Archivo JSX/TSX** — Componente React/Flutter equivalente
- **Archivo .d.ts** — Tipos e interfaz de props
- **Archivo .prompt.md** — Documentación y ejemplos
- **Card HTML** — Specimen visual en la pestaña Design System

### Componentes planeados

Los siguientes componentes se implementarán según necesidad:

#### Inputs & Forms
- TextField (outlined, con validación inline)
- DatePicker (selector de fecha)
- Select/Dropdown
- Radio Button
- Checkbox
- Search Bar

#### Navigation
- Bottom Navigation Bar (4–5 tabs)
- App Bar (con logo, back button)
- Breadcrumb

#### Feedback & Display
- Button (FilledButton, OutlinedButton, TextButton)
- Chip / Badge
- Dialog / Modal
- Toast / Snackbar
- Alert / Banner
- Progress Indicator (linear, circular)
- Stepper (pasos)

#### Lists & Cards
- Card
- ListTile
- Grid (seat grid, route grid)

#### Media
- CircleAvatar
- Image (con placeholder)

---

## 5. Visual Assets

Los siguientes assets están incluidos en `assets/`:

- **logotipo.svg** — Logotipo completo en color rojo
- **isotipo.svg** — Isotipo/marca aislada
- **logotipo-blanco.svg** — Logotipo en blanco para fondos oscuros
- **logotipo-rojo.svg** — Variante adicional en rojo

**Nota:** No se incluyen iconos personalizados; el sistema usa Lucide Icons (CDN) como estándar Material Design 3.

---

## 6. UI Kits

Se proporcionan recreaciones de pantallas reales de la aplicación. Cada UI kit es click-through, componibles, y usa los componentes definidos arriba.

### Aplicación Móvil (app-tc)

Ubicación: `ui_kits/mobile/`

**Pantallas incluidas:**

1. **Home / Search** — Búsqueda de rutas (origen, destino, fecha, botón buscar)
2. **Route List** — Listado de rutas disponibles con precio, asientos
3. **Route Detail** — Detalle completo: información del bus, mapa, grid de asientos, resumen
4. **Passenger Data** — Datos del pasajero (nombre, documento, email, teléfono, fecha nacimiento)
5. **Payment** — Selección de método de pago, resumen de costo
6. **Confirmation** — Resumen final, número de referencia, CTA para descargar pasaje
7. **Profile** — Perfil de usuario, historial, configuración

---

## 7. Estructura del proyecto

```
/
├── styles.css                    # Entry point, imports all tokens
├── tokens/
│   ├── colors.css              # Color tokens (primario, secundario, semánticos)
│   ├── typography.css          # Font family, sizes, weights, line-heights
│   ├── spacing.css             # Spacing scale
│   ├── radius.css              # Border radius
│   ├── shadows.css             # Shadow/elevation system
│   └── animation.css           # Durations, easing, transitions
├── assets/
│   ├── logotipo.svg
│   ├── isotipo.svg
│   ├── logotipo-blanco.svg
│   └── logotipo-rojo.svg
├── guidelines/
│   ├── colors-primary.html     # @dsCard: Primary color swatches
│   ├── colors-secondary.html   # @dsCard: Secondary color swatches
│   ├── colors-neutral.html     # @dsCard: Neutral color swatches
│   ├── colors-semantic.html    # @dsCard: Semantic color usage
│   ├── typography-display.html # @dsCard: Display & headline type
│   ├── typography-body.html    # @dsCard: Body & label type
│   ├── spacing.html            # @dsCard: Spacing scale visual
│   ├── radius.html             # @dsCard: Border radius options
│   ├── shadows.html            # @dsCard: Shadow/elevation system
│   └── brand.html              # @dsCard: Logo & mark usage
├── components/
│   ├── forms/
│   │   ├── TextField.jsx
│   │   ├── TextField.d.ts
│   │   ├── TextField.prompt.md
│   │   └── forms.card.html     # @dsCard
│   ├── buttons/
│   │   ├── Button.jsx
│   │   ├── Button.d.ts
│   │   ├── Button.prompt.md
│   │   └── buttons.card.html   # @dsCard
│   └── ...
├── ui_kits/
│   ├── mobile/
│   │   ├── index.html
│   │   ├── screens/
│   │   │   ├── SearchScreen.jsx
│   │   │   ├── RouteListScreen.jsx
│   │   │   └── ...
│   │   └── ...
└── readme.md                    # This file
```

---

## 8. Cómo usar este design system

### Para diseñadores

1. Abre la pestaña "Design System" en el navegador de diseño
2. Revisa las tarjetas de fundaciones (Colors, Type, Spacing, Shadows)
3. Mira los UI Kits completos en la sección "Screens"
4. Abre cualquier card individual para ver valores exactos, estilos, estados

### Para desarrolladores

1. Copia `styles.css` a tu proyecto
2. Define el namespace en tu bundler (e.g., `--ds-namespace: TC`)
3. Importa componentes desde `window.TC.<ComponentName>`
4. Usa variables CSS para colores, tipografía, espaciado:
   ```css
   button {
     background: var(--color-primary);
     font-size: var(--title-medium-size);
     padding: var(--space-lg);
     border-radius: var(--radius-xs);
   }
   ```
5. Respeta preferencias de usuario:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
   ```

---

## 9. Convenciones y reglas

### ✅ Permitido

- Componentes Material Design 3 (TextField, FilledButton, Card, etc.)
- Colores rojo/ámbar para acciones y acentos
- Animaciones suaves, duraciones cortas (150–500ms)
- Iconos Lucide vía CDN
- Micro-copy clara, tuteo, asunción de culpa en errores
- Justificación con valores de marca (cálido, servicio, confianza)

### ❌ Prohibido

- Otros UI kits (solo Material Design 3)
- Colores inventados fuera de paleta
- Gradientes o sombras de color
- Emoji en UI (solo en contenido)
- Hover effects en móvil (solo press/focus)
- Estados visuales por solo color (agregar icono o texto siempre)
- Tipografía diferente a Aller
- Radio > 12px en componentes pequeños (confunde el tamaño visual)

---

## 10. Intenciones y decisiones de diseño

### Por qué Material Design 3

Material Design 3 es:
- Probado y accesible (WCAG AA)
- Ampliamente documentado
- Familiar para desarrolladores
- Escalable a múltiples plataformas (Flutter, Web, Android)

### Por qué Aller

Aller es:
- Legible en pantallas pequeñas (14px body)
- Disponible en Google Fonts (sin costos)
- Con suficientes pesos (400, 500, 700)
- Moderna sin ser fría

### Por qué rojo/ámbar

- Rojo: color de urgencia + confianza. Perfecto para CTAs en viajes.
- Ámbar: color de progreso + entusiasmo. Diferencia de rojo sin alejarse.
- Ambos contrestan bien sobre blanco (WCAG AAA).

---

## 11. Roadmap y pendientes

- [ ] Implementación completa de componentes React/JSX
- [ ] Pruebas de accesibilidad (WCAG AA → AAA)
- [ ] Testing en dispositivos reales (6", 5.5", 6.7")
- [ ] Modo oscuro (apagado por ahora, no validado)
- [ ] Documentación de patrones (flujos de pago, manejo de errores, confirmaciones)
- [ ] Guía de copyrighting en profundidad

---

## 12. Referencias

**Documentos fuente:**
- `app-tc/flutter-design-system.md` — Especificación completa en Flutter
- `app-tc/palette/palette.json` — Paleta de colores en JSON
- `app-tc/wireframe/*.html` — Wireframes de pantallas clave
- `app-tc/LOGOTIPO/*.svg` — Archivos de identidad visual

**Estándares:**
- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 13. Contacto & Soporte

Este design system es mantenido por el equipo de diseño de Transportes Chiclayo. Para cambios, sugerencias o reportar inconsistencias, abre un issue o contacta al team lead.

---

**Última actualización:** Agosto 2026
