# sillypog.com

A modern portfolio website showcasing interactive web development projects, built with TypeScript, Vite, and vanilla JavaScript.

## Technology Stack

**Build & Development:**
- Vite 5.0.10 - Fast build tool and dev server
- TypeScript 5.x - Type-safe JavaScript
- Sass 1.69.5 - CSS preprocessor
- Vitest 4.0.16 - Unit testing framework

**Runtime Dependencies:**
- jQuery 3.7.1 - For legacy plugins only
- GSAP 3.12.5 - Animation library
- jquery-bbq 1.0.0 - Hash-based routing
- letteringjs 0.7.0 - Text animation effects

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server on http://localhost:9001
npm run dev
```

The dev server includes:
- Hot module replacement (HMR)
- TypeScript compilation
- Sass processing
- Fast refresh on file changes

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output goes to the `dist/` directory and includes:
- Minified and bundled JavaScript
- Compiled and minified CSS
- Optimized assets
- Source maps for debugging

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage (requires Node 20+)
npm run test:coverage
```

**Test Coverage:**
- 137 tests across 7 test suites
- Physics engine (Vector, Rectangle, Physics, Circle)
- DOM utilities
- Content management
- View management and routing

## Project Structure

```
sillypog.com/
├── src/
│   ├── index.html          # Main HTML file
│   ├── scss/               # Sass stylesheets
│   └── js/                 # TypeScript source files
│       ├── main.ts         # Application entry point
│       ├── app.ts          # Main app initialization
│       ├── events.ts       # Custom event system
│       ├── templates.ts    # Template literals
│       ├── ContentModel.ts # Content loading
│       ├── ViewManager.ts  # Page routing
│       ├── physics/        # Physics simulation
│       │   ├── Vector.ts
│       │   ├── Rectangle.ts
│       │   ├── Physics.ts
│       │   └── Circle.ts
│       ├── utils/          # Utility functions
│       │   ├── dom.ts      # DOM helpers
│       │   ├── loadSVG.ts
│       │   └── removeInlineStyle.ts
│       └── views/          # View components
│           ├── About.ts
│           ├── Portfolio.ts
│           ├── Links.ts
│           └── Articles.ts
├── dist/                   # Production build output
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest test configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Development Workflow

### Adding New Features

1. Create TypeScript files in `src/js/`
2. Import and use in existing modules
3. Write tests in `.test.ts` files
4. Run tests to verify: `npm test`
5. Test in browser: `npm run dev`

### Code Style

- **TypeScript**: Strict mode enabled
- **Modules**: ES modules with explicit imports
- **Events**: Native CustomEvents API
- **DOM**: Vanilla JavaScript (jQuery only for plugins)
- **Templates**: Template literals

### Hash-Based Routing

The site uses hash-based routing with jQuery BBQ for GitHub Pages compatibility:
- `/` or `#` - About page
- `#!portfolio` - Portfolio page
- `#!portfolio/project-name` - Specific project
- `#!links` - Links page
- `#!articles` - Articles page
- `#!articles/article-name` - Specific article

## Architecture

### Module System
The project uses ES modules with TypeScript for type safety. All legacy IIFE modules have been converted to modern ES module syntax.

### Event System
Custom events are used for cross-module communication:
- `sillypog:outroComplete` - Fired when page outro animation completes
- `sillypog:contentsLoaded` - Fired when content JSON is loaded

### View Management
The `ViewManager` class handles routing and page transitions:
1. Listens for hash changes
2. Triggers outro animation on current page
3. Waits for outro complete event
4. Triggers intro animation on new page

### Physics Engine
Interactive physics simulations using:
- Vector math for forces and motion
- Rectangle bounds checking
- Physics simulation with velocity, acceleration, and friction
- Circle display objects with physics integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Modernization Journey

This project has been progressively modernized from 2014-era tooling:

**Completed Phases:**
- ✅ Phase 1: Replaced Grunt with Vite, Bower with npm
- ✅ Phase 2: Converted IIFE modules to ES modules
- ✅ Phase 3: Reduced jQuery to plugins only
- ✅ Phase 4: Replaced jquery-tmpl with template literals
- ⏭️ Phase 5: Kept hash routing (skipped History API for GitHub Pages)
- ✅ Phase 6: Added TypeScript with strict type checking
- ✅ Phase 7: Added Vitest testing infrastructure
- ⏭️ Phase 8: Deployment (skipped)
- ✅ Phase 9: Final cleanup and documentation

See [PLAN.md](./PLAN.md) for the complete modernization plan and details.

## Performance

**Bundle Sizes:**
- Main bundle: 280 kB (102.07 kB gzipped)
- CSS: 4.74 kB (1.57 kB gzipped)
- HTML: 3.62 kB (1.42 kB gzipped)

**Lighthouse Scores:**
Target: 90+ across all categories

## Contributing

This is a personal portfolio site, but if you find bugs or have suggestions:
1. Open an issue describing the problem or suggestion
2. For code contributions, ensure tests pass: `npm test`
3. Follow the existing code style and TypeScript patterns

## License

Copyright © 2014-2026 Peter Hastie. All rights reserved.

## Contact

- Website: https://sillypog.com
- Email: pete@sillypog.com
- GitHub: https://github.com/sillypog
