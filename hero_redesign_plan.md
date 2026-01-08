# Hero Section Redesign: "The Living Editorial"

To meet the requirement for a "more attractive, professional, and visually appealing" Hero, we will move from a static parallax image to a **Cinematic Split-Layout** with high-end motion choreography.

## Design Concept: "Asymmetrical Balance"
Instead of centered text (which can feel generic), we will use an editorial split-screen or overlapping layout often seen in luxury fashion (e.g., Vogue, Gucci).

### Key Features
1.  **Orchestrated Entrance**:
    *   The page loads with a full-screen solid color (Alabaster) that "curtains" open to reveal the image.
    *   Text elements stagger in *after* the image is stable.
2.  **Typography**:
    *   Massive `ROKOMFERI` watermark text in the background (very subtle opacity).
    *   Foreground headline using `Bodoni Moda` with extreme contrast (Light Italic + Bold Uppercase).
3.  **Visuals**:
    *   Use the generated "High Fashion" hero image.
    *   Add a "Grain" overlay to give it a film-photography texture.
    *   **Mouse Interaction**: The image creates a subtle "3D tilt" effect following the mouse.
4.  **Content**:
    *   Primary CTA: "Discover Collection" (Magnetic Button).
    *   Secondary: "Play Reel" (Circle button with pulsing border) - implies video content.

## Technical Implementation Steps

### 1. Component Architecture
*   Create `components/home/Hero.tsx` (Separating from page.tsx for cleanliness).
*   Use `framer-motion` for the "Curtain Reveal" and text staggering.

### 2. Layout Structure
```tsx
<section className="h-screen grid grid-cols-12 overflow-hidden">
  {/* Left: Typography & Story */}
  <div className="col-span-12 md:col-span-5 relative z-10 flex flex-col justify-center pl-12">
     {/* Content */}
  </div>

  {/* Right: Immersive Visual */}
  <div className="col-span-12 md:col-span-7 h-full relative">
     <ParallaxImage />
  </div>

  {/* Background Watermark */}
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
     <h1 className="text-[20vw] opacity-5">ROKOMFERI</h1>
  </div>
</section>
```

### 3. Verification
*   **Performance**: Ensure the grain overlay doesn't tank FPS.
*   **Mobile**: Collapse split-screen to stacked (Image Top 60vh, Text Bottom 40vh).
