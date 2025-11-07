# Retro Sprite Creator

A pixel art sprite generator for retro-style games. Generate 8-32px pixel characters with animations, ready for immediate use in your game projects.

🎮 **[Live Demo](https://fukaishi.github.io/retro-create/)** | 📖 [Deployment Guide](.github/DEPLOY.md)

## Features

### 🎮 Retro Console Presets
- **NES/Famicom** - 16x16 sprites with 4 colors (3 + transparent)
- **Game Boy** - 16x16 sprites with 4-shade green palette
- **PICO-8** - 8x8 sprites with 16-color palette
- **PC-98** - 16x16 sprites with 8-color palette
- **Commodore 64** - 24x24 sprites with 4 simultaneous colors
- **Custom** - Flexible settings with DawnBringer 16 palette

### 🎨 Character Generation
- **Body Types**: Chibi, Standard, Tall
- **Classes**: Warrior, Mage, Archer, Rogue, Robot, Monster
- **Elements**: Neutral, Fire, Ice, Poison, Lightning, Holy, Dark
- **Seeded Random**: Reproducible results with seed-based generation

### 🎬 Animation System
Auto-generate 7 animation states:
- **Idle** - Subtle breathing/bobbing (4 frames)
- **Walk** - Leg movement cycle (4 frames)
- **Run** - Fast movement with lean (4 frames)
- **Jump** - Jump arc (3 frames)
- **Attack** - Forward thrust (3 frames)
- **Hurt** - Recoil animation (2 frames)
- **Dead** - Collapse state (1 frame)

### 📦 Export Formats
- **Sprite Sheet** - PNG with JSON atlas (Phaser/Pixi.js compatible)
- **Phaser 3** - Complete animation config
- **Aseprite JSON** - Layer and frame data
- **Unity 2D** - Sprite metadata with pivot points
- **Metadata** - JSON with hitbox, origin, states

### ⌨️ Keyboard Shortcuts
- **←/→** - Previous/Next frame
- **P** - Play/Pause animation
- **R** - Regenerate with new seed
- **1-9** - Zoom levels (2x-18x)
- **G** - Toggle pixel grid

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages:

1. Enable GitHub Pages in **Settings** → **Pages** → Source: **GitHub Actions**
2. Push to `main`/`master` branch or manually trigger the workflow
3. Your site will be live at `https://[username].github.io/retro-create/`

See [Deployment Guide](.github/DEPLOY.md) for detailed instructions.

## Usage

### 1. Configure Specifications (Left Panel)
- Choose a retro preset (NES, Game Boy, PICO-8, etc.)
- Set sprite size (8-32px)
- Select body type, class, and element
- Use a custom seed or click "Randomize"

### 2. Preview Canvas (Center)
- Adjust zoom level with slider or number keys (1-9)
- Toggle pixel grid with checkbox or 'G' key
- View real-time preview of current animation frame

### 3. Animation Controls (Right Panel)
- Select animation state (idle, walk, run, etc.)
- Play/pause animation
- Navigate frames manually with slider
- Adjust export scale
- Choose export format
- Click "Export" to download

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Canvas API** - Pixel rendering
- **file-saver** - File downloads

## Project Structure

```
src/
├── types/           # TypeScript type definitions
├── lib/             # Core logic
│   ├── palettes.ts  # Retro color palettes
│   ├── presets.ts   # Console presets
│   ├── spriteGenerator.ts  # Sprite generation
│   ├── animator.ts  # Animation system
│   ├── canvas.ts    # Canvas rendering
│   ├── export.ts    # Export functionality
│   └── random.ts    # Seeded RNG
├── components/      # React components
│   ├── SpecPanel.tsx
│   ├── SpriteCanvas.tsx
│   └── AnimationPanel.tsx
├── hooks/           # Custom React hooks
│   └── useSprite.ts
└── App.tsx          # Main application
```

## Technical Details

### Palette System
- Floyd-Steinberg dithering for color reduction
- Euclidean distance color matching
- Support for transparent colors
- Classic retro palettes (GB, NES, PICO-8, C64, etc.)

### Sprite Generation
- Template-based body generation
- Procedural character customization
- Symmetric sprite support
- Optional outline rendering

### Animation
- Physics-based movement (sine wave oscillation)
- Frame interpolation
- Configurable FPS per state
- Loop/one-shot animation modes

### Export
- TexturePacker-compatible atlases
- Phaser 3 animation configuration
- Aseprite layer/frame data
- Unity sprite metadata
- Customizable scale and padding

## Roadmap

- [ ] AI-assisted generation (optional mode)
- [ ] Custom part library
- [ ] More character classes
- [ ] GIF export (currently uses gif.js.optimized)
- [ ] More animation states
- [ ] Color palette editor
- [ ] Sprite editor mode
- [ ] Batch export

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Author

Created with Claude Code
