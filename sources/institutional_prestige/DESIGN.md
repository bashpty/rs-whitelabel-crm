---
name: Institutional Prestige
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  divider: '#E2E8F0'
  surface-white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 2rem
  gutter: 1.5rem
  stack-compact: 0.5rem
  stack-default: 1rem
  section-padding: 3rem
---

## Brand & Style

The design system embodies **Institutional Luxury**, targeting high-net-worth real estate professionals and brokerage executives. The personality is authoritative, secure, and impeccably refined, prioritizing high-density information without compromising aesthetic elegance. 

The visual style is **Corporate / Modern** with a **Minimalist** foundation. It leverages vast white space to provide breathing room for complex data visualizations. Strategic use of **Glassmorphism** is applied to floating controls and spatial overlays to maintain a sense of depth and immersion within 3D environments, while sharp, technical borders emphasize precision and reliability.

## Colors

The palette is anchored by **Deep Navy (#0A192F)**, which serves as the structural foundation, conveying stability and institutional weight. **Gold (#D4AF37)** is reserved exclusively for high-value interactions, VIP indicators, and primary calls to action, acting as a luminous signal of prestige.

**Slate Gray (#64748B)** manages technical hierarchy, used for secondary metadata and inactive states to prevent visual clutter. The background remains a crisp **White (#FFFFFF)** to ensure maximum clarity for data grids, while **#F8FAFC** provides subtle tonal separation for sidebars and zebra-striping. High contrast (Navy on White or Navy on Gold) is strictly enforced to meet accessibility standards while maintaining a premium feel.

## Typography

The system utilizes a tri-font strategy to balance elegance with technical utility. **IBM Plex Sans** is used for headlines and display values, providing a structured, corporate authority. **Inter** handles the body copy, ensuring exceptional legibility in dense data environments. **JetBrains Mono** is introduced for technical labels, property IDs, and GIS coordinates, reinforcing the CRM's high-end engineering backbone.

For KPI values and large financial figures (e.g., property valuations), use the `display-lg` style with tighter letter spacing to create a high-impact, editorial appearance. Label styles should be used for all metadata headers in data grids to provide a clear distinction from the data itself.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for macro-layouts to maintain institutional order. Desktop views utilize a 12-column grid with a 1440px max-width. Core workspaces use a **Split-Pane Model**: 
- **Primary Viewport (70%)**: Immersive 3D tours and spatial maps.
- **Utility Panel (30%)**: High-density property data and lead management.

On tablet and mobile, the layout reflows into a single-column vertical stack where the 3D viewport remains sticky at the top of the screen (16:9 aspect ratio), while administrative data scrolls below. Spacing is tight (8px/16px increments) within data grids to maximize information density, while larger margins (32px+) define major architectural sections.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Glassmorphism**.
- **Level 0 (Base)**: White surfaces for primary content.
- **Level 1 (Sub-surface)**: #F8FAFC for sidebars and background containers.
- **Level 2 (Floating)**: Glassmorphic overlays with a 12px backdrop blur and 10% opacity white fill, used for 3D navigation controls and floating docks.
- **Level 3 (Priority)**: Modals and Lead Cards utilize a sharp 1px border in #E2E8F0 with a 4px Gold (#D4AF37) top border to signal high-priority items.

Shadows are used sparingly; when necessary, use long, low-opacity ambient shadows (0 20px 25px -5px rgba(10, 25, 47, 0.04)) to suggest depth without cluttering the interface.

## Shapes

The shape language is **Soft (0.25rem)**, emphasizing a precision-engineered aesthetic. Sharp corners are avoided to maintain a contemporary feel, but the radius is kept minimal to preserve a professional, institutional character. 

- **Interactive Elements**: Buttons and input fields use a consistent 4px radius.
- **Containers**: Large cards and modals use 6px (`rounded-lg`) to provide a subtle distinction from smaller components.
- **Spatial Markers**: Hotspots within 3D tours are the only exception, using full circles (`rounded-full`) to differentiate interactive spatial points from administrative UI elements.

## Components

### Buttons & CTAs
- **Primary**: Deep Navy background with White text. Bold and authoritative.
- **Accent**: Gold background with Navy text. Used for "Close Deal," "Schedule Tour," or "VIP Action."
- **Ghost**: Slate Gray outline. Used for secondary navigation.

### Cards
- Standard cards use a 1px border (#E2E8F0).
- **High-Value Property Cards**: Include a 4px Gold top border and a subtle glass effect on the price tag overlay.

### Input Fields
- Understated technical design: 1px Slate Gray border, 4px radius. 
- Focus state: Deep Navy border with a 2px Gold outer glow.

### Spatial Hotspots
- Circular, pulsating Gold markers. Use `btn-circle` with a semi-transparent Gold ripple effect to draw attention within 3D views.

### Data Visualization
- **Stats**: Use IBM Plex Sans for large numerical values.
- **Badges**: Success/Warning/Error states should use muted backgrounds with high-contrast text to maintain the luxury aesthetic without becoming garish.