# 🎨 Image Editor & Precision Splitter

> A modern, browser-based studio darkroom application built with React 19, TypeScript, and Tailwind CSS. Seamlessly adjust lighting, apply cinematic film presets, crop with golden ratio guides, and interactively slice images into multi-panel carousels and grids for social media with instant ZIP downloads.

---

## ✨ Features at a Glance

### ✂️ Precision Image Splitter & Grid Slicer
- **Custom Grids**: Split images into custom column × row matrices (1×2, 1×3, 2×2, 3×3, etc.).
- **Social Media Presets**:
  - 📸 **Instagram Seamless Carousel** (1×3 panoramic swipe)
  - 🖼️ **Instagram Profile 3×3 Grid Banner** (9-tile mosaic layout)
  - 📌 **Pinterest Pin Split** & **Story Panoramas**
- **Interactive Cut Guides**: Visual overlay showing exact cut lines with tile numbering.
- **Batch Export**: Download all generated tiles packaged into a single `.zip` archive (powered by JSZip) or save individual segments in PNG, JPEG, or WebP.

### 🎛️ Darkroom Adjustment Suite
- **Exposure & Brightness**: Fine exposure compensations from deep shadows to crisp highlights.
- **Contrast & Tone**: Dynamic curve adjustments for punchy shadows and highlights.
- **Saturation & Vibrance**: Rich color control without skin-tone blowouts.
- **Color Temperature & Tint**: Dial in Kelvin warmth or cool cyan tones with magenta/green tint balance.
- **Vignette & Focus**: Custom lens falloff vignette with radius and feather control.
- **One-Click Auto-Enhance**: Instant balanced lighting and contrast boost.
- **Before / After Comparison**: Hold-to-compare instant toggle between the original and edited photo.

### 🎞️ Cinematic Filters & Color Presets
- Curated presets categorized by style:
  - **Standard**: Natural Tone, Clean Pop, Soft Matte
  - **Color**: Vibrant Sunset, Emerald Lush, Golden Amber
  - **Atmosphere**: Moody Forest, Nordic Fog, Warm Sepia, Midnight Blue
  - **Artistic**: Noir Black & White, Cinematic Teal & Orange, Cyberpunk Glow, Vintage Film 35mm
- **Intensity Control**: Smooth 0–100% preset blend slider.

### 📐 Framing, Crop & Transform
- **Aspect Ratio Presets**:
  - `Freeform`
  - `1:1 Square` (Avatars, Instagram feed)
  - `4:3 Standard` (Classic photo prints, tablets)
  - `16:9 Cinema` (Widescreen displays, video thumbnails)
  - `3:2 Classic` (35mm film photography)
  - `9:16 Story` (TikTok, Reels, Shorts)
  - `2:3 Portrait` (Vertical prints and editorial posters)
- **Transform Tools**: 90° clockwise/counter-clockwise rotation, horizontal & vertical flip.
- **Fine Angle Straightening**: ±45° fine-rotation slider with degree readouts.

### 📱 Responsive & Mobile-First Darkroom
- **Adaptive Workspace**: Desktop sidebar workflow and compact mobile bottom dock.
- **Mobile Tool Drawer**: Smooth bottom sheet with contextual tool panels.
- **Touch-Optimized Peek Button**: Hold the dedicated **Peek** button on mobile to temporarily ghost the tool panel and view the unblocked canvas with long-press callout prevention.
- **Dark Studio Theme**: High-contrast, eye-friendly `#0A0A0A` workspace with warm gold accents.

### 💾 Pro Export Engine
- **Multiple Formats**: Lossless PNG, compressed JPEG, and modern high-efficiency WebP.
- **Variable Compression Quality**: Configurable 1–100% export quality.
- **Resolution Upscaling & Downscaling**: 0.5×, 1×, 2×, and 4× scale exports.
- **Instant File Size Estimation**: Real-time calculated file weight prior to saving.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Motion](https://motion.dev/) |
| **Archiving & ZIP** | [JSZip](https://stuk.github.io/jszip/) |
| **Canvas FX** | [Canvas Confetti](https://github.com/catdad/canvas-confetti) |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher recommended) and `npm` installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/image-editor-and-splitter.git
   cd image-editor-and-splitter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` to start editing.

---

## 📦 Build & Production

To create a production-ready optimized build:

```bash
# Type check and build static files into /dist
npm run build

# Preview the production build locally
npm run preview
```

---

## 📖 How to Use the App

### 1. Uploading an Image
- **Drag and Drop**: Simply drop any JPEG, PNG, WebP, or SVG onto the workspace canvas.
- **Browse Files**: Click the **Upload Photo** button to open your device's file picker.
- **Sample Gallery**: If you don't have an image ready, select one of the built-in sample photos (Architecture, Nature, Street, or Portrait).

### 2. Adjusting Colors & Lighting
- Select **Adjust** in the sidebar (or bottom dock on mobile).
- Slide any of the controls (**Brightness**, **Contrast**, **Saturation**, **Temperature**, **Vignette**).
- Click **Auto-Enhance** for a balanced adjustment preset or **Reset** to return to defaults.

### 3. Applying Creative Filters
- Select **Filters** in the tool menu.
- Browse categories (**All**, **Standard**, **Color**, **Atmosphere**, **Artistic**).
- Click any preset card to apply it. Use the **Strength** slider to blend the filter to your taste.

### 4. Cropping & Straightening
- Select **Crop** to activate the interactive crop box.
- Choose a fixed ratio (e.g. `16:9`, `1:1`, `9:16`) or drag the bounding corners freely.
- Click **Apply Crop** to lock in your framing.
- Use the **Rotate** tool to flip axes or fine-tune horizon alignment.

### 5. Slicing with the Precision Splitter
- Click **Split** in the tool panel.
- Choose a grid template (e.g., 3-Piece Instagram Carousel, 9-Piece Grid, or custom Columns × Rows).
- Review the cut overlay on your image.
- Click **Generate Split** — the app will process the tiles and show the preview modal with an option to **Download All (.ZIP)** or download individual pieces.

### 6. Exporting Your Work
- Click the **Export** button in the top header.
- Choose format (`PNG`, `JPEG`, `WEBP`), set your desired quality, and pick an output scale.
- Click **Save Image** to immediately trigger a browser download.

---

## 📁 Project Structure

```text
├── public/                     # Static assets and icons
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── tools/              # Specialized tool control panels
│   │   │   ├── AdjustPanel.tsx # Lighting & color adjustment sliders
│   │   │   ├── CropPanel.tsx   # Ratio selection and crop actions
│   │   │   ├── FilterPanel.tsx # Presets grid & intensity slider
│   │   │   ├── RotatePanel.tsx # Rotation, flip, and angle controls
│   │   │   └── SplitPanel.tsx  # Grid matrix and carousel presets
│   │   ├── CanvasWorkspace.tsx # Zoomable image display canvas
│   │   ├── CropOverlay.tsx     # Draggable crop box overlay
│   │   ├── EmptyState.tsx      # Dropzone & sample photo selector
│   │   ├── ExportModal.tsx     # Quality, format, and resolution dialog
│   │   ├── Header.tsx          # Top bar with undo/redo, compare & export
│   │   ├── MobileBottomDock.tsx# Bottom navigation for mobile viewports
│   │   ├── MobileToolDrawer.tsx# Expandable sheet with Peek & Hide controls
│   │   ├── OffCanvasAppMenu.tsx# Settings & shortcuts drawer
│   │   ├── SplitOverlay.tsx    # Visual cut line guide overlay
│   │   ├── SplitResultModal.tsx# Sliced tiles preview & ZIP download
│   │   └── ToolSidebar.tsx     # Desktop darkroom tool panel
│   ├── utils/
│   │   ├── canvasUtils.ts      # Canvas 2D image processing & filters
│   │   └── sampleImages.ts     # Pre-curated sample photography
│   ├── types.ts                # TypeScript interfaces and type definitions
│   ├── App.tsx                 # Main application state and orchestration
│   ├── index.css               # Tailwind CSS entry & darkroom typography
│   └── main.tsx                # React DOM root entry point
├── index.html                  # HTML entry point with web fonts & metadata
├── metadata.json               # App metadata and configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration with Tailwind CSS plugin
```

---

## 💡 Pro Tips & Shortcuts

- **Hold to Compare**: Click and hold the **Compare** button (or `Spacebar`) to instantly preview the unedited original photo against your edits.
- **Mobile Peek**: When adjusting on a phone, tap and hold the **Peek** button in the top-right of the drawer to see the entire canvas unobstructed.
- **Fast Resets**: Double-click or tap the reset icon next to any slider to instantly snap it back to 0.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and build upon it!
