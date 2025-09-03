# Donkey Kong Arcade

A faithful, browser-based reinterpretation of the classic 1981 Donkey Kong arcade platformer built with React, TypeScript, and HTML5 Canvas.

![Donkey Kong Arcade](https://img.shields.io/badge/Status-In%20Development-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## 🎮 Features

- **Authentic Arcade Feel**: Faithful recreation of the original 1981 arcade game mechanics
- **Deterministic Logic**: Fixed timestep and seeded RNG for fair, repeatable gameplay
- **Crisp Pixel Art**: Integer scaling with pixel-perfect rendering
- **Multi-Stage Progression**: Four distinct stages (25m, 50m, 75m, 100m) with increasing difficulty
- **Classic Controls**: Keyboard controls with optional gamepad support
- **Performance Optimized**: Steady 60 FPS with spatial hash collision detection
- **Replay System**: Record and share gameplay sessions
- **PWA Ready**: Installable web app with offline capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/joshovinga/donkey-kong-arcade.git
cd donkey-kong-arcade

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Game Controls

### Default Controls
- **Move**: Arrow Keys (Left/Right) or A/D
- **Climb**: Arrow Keys (Up/Down)
- **Jump**: Space or Z
- **Start/Confirm**: Enter
- **Pause**: P
- **Mute**: M
- **Fullscreen**: F

### Accessibility Options
- Coyote time (configurable)
- Jump buffer (configurable)
- Key remapping
- CRT effect toggle

## 🏗️ Architecture

The game uses a hybrid architecture that keeps React out of the hot rendering loop:

```
┌─────────────────────┐    ┌─────────────────────┐
│ React App (UI)      │    │ Game Engine (TS)    │
│ - Menus, HUD        │◄──►│ - Fixed timestep    │
│ - Settings          │    │ - Input handling    │
│ - Leaderboards      │    │ - Physics & AI      │
└─────────────────────┘    │ - Rendering         │
         ▲                 └─────────────────────┘
         │ Zustand snapshots
         ▼
┌─────────────────────────────────────────────────┐
│ Multi-Canvas Stack                              │
│ Background | Entities | HUD                     │
└─────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Rendering**: HTML5 Canvas 2D (multi-canvas layering)
- **State Management**: Zustand
- **Audio**: Howler.js
- **Storage**: localForage (IndexedDB)
- **Testing**: Vitest, Playwright
- **Asset Pipeline**: Sprite atlas, Bitmap fonts

## 📁 Project Structure

```
src/
├── app/                 # React UI components
│   ├── routes/         # Menu, Settings, GameOver
│   └── ui/             # HUD, Controls
├── core/               # Game engine core
│   ├── loop.ts         # Fixed timestep loop
│   ├── time.ts         # Timing utilities
│   └── rng.ts          # Seeded random number generator
├── input/              # Input handling
├── state/              # Game state management
├── physics/            # Collision detection & resolution
├── ecs/                # Entity-Component-System
│   ├── entities/       # Hero, Gorilla, Barrel, etc.
│   └── systems/        # Movement, AI, particles
├── level/              # Level data and loading
├── render/             # Canvas rendering
├── audio/              # Sound effects and music
├── persistence/        # Save/load, replays
└── assets/             # Sprites, audio, fonts
```

## 🎮 Game Stages

1. **25m (Girders)**: Classic barrel rolling with ladder mechanics
2. **50m (Conveyors)**: Moving platforms with cement pans
3. **75m (Elevators)**: Vertical elevators with bouncing springs
4. **100m (Rivets)**: Remove all rivets to drop the Gorilla

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run end-to-end tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Debug Features

- **F1**: Toggle collision debug overlay
- **F2**: Toggle performance HUD
- **F3**: Toggle sprite bounds and state labels

## 🎨 Asset Pipeline

- **Sprites**: Single atlas (PNG + JSON) for all game sprites
- **Fonts**: Bitmap fonts for crisp HUD text
- **Audio**: Compressed audio sprites for low latency
- **Levels**: Tiled editor → JSON → compiled stage data

## 📊 Performance

- **Target**: 60 FPS on modern desktop browsers
- **Frame Budget**: ~16.7ms total (2.5ms update + 3.5ms render)
- **Optimizations**: 
  - Spatial hash collision detection
  - Object pooling for particles
  - Multi-canvas layering
  - Integer position rounding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Donkey Kong game by Nintendo (1981)
- Classic arcade game design principles
- Modern web game development best practices

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/joshovinga/donkey-kong-arcade/issues) on GitHub.

---

**Note**: This is a fan-made recreation for educational purposes. All original game assets, names, and trademarks belong to their respective owners.
