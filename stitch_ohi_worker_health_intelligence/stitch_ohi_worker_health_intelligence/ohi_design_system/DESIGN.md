---
name: OHI Design System
colors:
  surface: '#f7fafb'
  surface-dim: '#d7dadb'
  surface-bright: '#f7fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f5'
  surface-container: '#ebeeef'
  surface-container-high: '#e5e9ea'
  surface-container-highest: '#e0e3e4'
  on-surface: '#181c1d'
  on-surface-variant: '#41484b'
  inverse-surface: '#2d3132'
  inverse-on-surface: '#eef1f2'
  outline: '#71787c'
  outline-variant: '#c1c7cb'
  surface-tint: '#3b6474'
  primary: '#002632'
  on-primary: '#ffffff'
  primary-container: '#0f3d4c'
  on-primary-container: '#7fa8b9'
  inverse-primary: '#a3cddf'
  secondary: '#28657a'
  on-secondary: '#ffffff'
  secondary-container: '#abe5fe'
  on-secondary-container: '#2b687d'
  tertiary: '#381b01'
  on-tertiary: '#ffffff'
  tertiary-container: '#523012'
  on-tertiary-container: '#c99771'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfe9fc'
  primary-fixed-dim: '#a3cddf'
  on-primary-fixed: '#001f29'
  on-primary-fixed-variant: '#224c5b'
  secondary-fixed: '#b9eaff'
  secondary-fixed-dim: '#95cfe7'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#004d61'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#f1bc93'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#633e1f'
  background: '#f7fafb'
  on-background: '#181c1d'
  surface-variant: '#e0e3e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  touch-target: 48px
  card-padding: 24px
---

## Brand & Style

The design system is engineered for **Occupational Health Intelligence (OHI)**, focusing on the intersection of industrial safety, medical precision, and human wellbeing. The brand personality is authoritative yet approachable, providing a sense of stability in high-stakes environments.

The visual style is **Corporate Modern with a Functional focus**. It prioritizes clarity and utility over decorative trends. By utilizing a "Quiet UI" approach—characterized by generous whitespace, structured layouts, and high-contrast information hierarchies—the system ensures that critical health data is digestible for both medical professionals and industrial workers. The aesthetic avoids distracting effects like heavy blurs or neon gradients, opting instead for solid surfaces and intentional color application to signal risk levels.

## Colors

The palette is anchored by **Deep Teal (#0F3D4C)**, chosen for its psychological association with medical trust and industrial reliability. 

- **Primary & Secondary:** Used for branding, navigation, and primary actions. They provide the "weight" to the UI.
- **Surface & Neutrals:** The background uses a very soft blue-grey (#F4F7F8) to reduce eye strain compared to pure white, maintaining a clean "clinical" feel.
- **Semantic Risk Spectrum:** 
    - **Green (Low):** Safe, within normal parameters.
    - **Yellow (Moderate):** Observation required.
    - **Orange (High):** Intervention recommended.
    - **Red (Critical):** Immediate danger or urgent health risk.

All color combinations must pass WCAG AA contrast ratios for accessibility, particularly when used for Tamil glyphs which can be more intricate than Latin characters.

## Typography

This design system uses **Inter** for all interfaces. Inter’s tall x-height and open counters make it exceptionally readable in both English and Tamil. 

### Bilingual Strategy
When rendering Tamil alongside English, ensure the line-height is increased by at least 10% compared to English-only settings to prevent descenders from clipping. 
- **Body-lg** is the default for chat interfaces and worker-facing instructions to ensure maximum legibility on mobile devices in industrial lighting conditions.
- **Labels** are used for metadata, status tags, and navigation elements.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile devices. 

- **Spacing Rhythm:** Based on an 8px base unit. 
- **Touch Targets:** A minimum height of 48px is enforced for all interactive elements to accommodate gloved hands or fast-paced industrial environments.
- **Density:** The layout favors "Low Density" to prevent cognitive overload. Generous padding (24px) is standard for all container elements.
- **Reflow:** On mobile, side-by-side cards must stack vertically to maintain the 48px minimum width for text readability.

## Elevation & Depth

This design system uses **Tonal Layering** supplemented by subtle ambient shadows to define hierarchy.

1.  **Level 0 (Base):** The neutral background (#F4F7F8).
2.  **Level 1 (Cards/Surfaces):** Pure white (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(15, 61, 76, 0.05)). This creates a clear distinction between the canvas and the content.
3.  **Level 2 (Modals/Popovers):** A slightly more defined shadow (0px 10px 30px rgba(15, 61, 76, 0.12)) to lift the element above the primary content.

**Borders:** Use a 1px solid stroke (#E0E7E9) on cards and input fields for structural definition instead of high-contrast borders.

## Shapes

The shape language is "Rounded-Soft," balancing industrial precision with human-centered care. 

- **Standard Components:** 8px (0.5rem) radius for buttons and input fields.
- **Containers/Cards:** Use `rounded-xl` (1.5rem / 24px) for primary information cards to create a friendly, modern appearance that softens the serious nature of health data.
- **Status Badges:** Use a full pill shape (999px) to distinguish them from interactive buttons.

## Components

### Buttons & Actions
- **Primary:** Solid Deep Teal with white text. 48px height.
- **Secondary:** Outlined Deep Teal. 
- **Large Action Buttons:** For critical worker flows, use 56px height with an icon prefix for immediate recognition.

### Status Badges
- Include a 16px icon (e.g., Check, Warning, Alert) alongside text.
- Backgrounds should be 10% opacity of the semantic color, with 100% opacity text for contrast.

### Bilingual Navigation
- Navigation items display English labels with a smaller Tamil translation immediately below or adjacent, ensuring both languages are always present.

### Worker ID Card Pattern
- A signature component using `rounded-xl` corners.
- Features a high-contrast photo area, clear name typography, and a prominent "Health Status" indicator using the semantic color spectrum.

### Chat Interface
- Bubble-style messages with 16px radius.
- User messages: Deep Teal background. 
- OHI Bot messages: White background with a subtle border.
- Suggestion chips: Outlined pills that appear above the input for quick responses.

### Health Trend Charts
- Minimalist line or bar charts. 
- Use the primary teal for data lines. 
- Avoid grids; use horizontal "Safe Zone" bands colored in 5% opacity Green/Yellow/Red to provide context for health metrics.