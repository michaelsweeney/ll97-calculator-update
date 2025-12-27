# NYC LL97 Calculator - Modernized

A modernized web application for calculating NYC Local Law 97 compliance and emissions metrics for buildings.

## Overview

This application helps building owners and managers calculate their compliance with NYC Local Law 97, which sets greenhouse gas emissions limits for large buildings in New York City. The calculator provides detailed emissions analysis, compliance forecasting, and visualization tools.

## Technology Stack

### Core Packages

- **React 18.3.1** - Modern React with concurrent features and hooks
- **TypeScript 5.7.2** - Type-safe development with latest TypeScript
- **Vite 6.0.5** - Fast build tool and dev server (replaces Create React App)
- **Redux Toolkit 2.5.0** - State management with modern Redux patterns
- **React Router DOM 7.1.1** - Client-side routing

### UI & Visualization

- **Material-UI (MUI) 6.3.1** - Modern Material Design components
- **Emotion 11.14.0** - CSS-in-JS styling solution
- **D3 7.9.0** - Data visualization library
- **React Number Format 5.4.2** - Number input formatting

### Development Tools

- **Vitest 3.2.4** - Fast unit testing framework
- **ESLint 9.17.0** - Code linting with TypeScript support
- **Prettier 3.4.2** - Code formatting
- **TypeScript ESLint 8.19.1** - TypeScript-specific linting rules

## Prerequisites

- **Node.js 20.0.0 or higher** - Required for running the application
- **npm** or **yarn** - Package manager (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NYC-LL97-Calculator-Modernized
```

2. Install dependencies:
```bash
npm install
```

## Build Instructions

### Development Build

Run the development server with hot module replacement (HMR):
```bash
npm run dev
```

The application will start at `http://localhost:3001`

### Production Build

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `build/` directory with:
- Minified and optimized JavaScript bundles
- Source maps for debugging
- Code splitting for React, MUI, and D3 vendors
- Optimized CSS and assets

### Type Checking

Run TypeScript type checking without emitting files:
```bash
npm run type-check
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Hosting Locally

### Development Server

Start the Vite development server:
```bash
npm run dev
```

Access the application at `http://localhost:3001`

### Production Preview

After building, preview the production build:
```bash
npm run preview
```

### Serve Production Build

To serve the production build with a static file server:
```bash
npx serve -s build
```

Or if you have `serve` installed globally:
```bash
serve -s build
```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Deployment

This application is configured for easy deployment to multiple platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### Quick Deploy to Vercel (Recommended)

The fastest way to deploy for client review:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com and sign in with GitHub
   - Click "Add New Project"
   - Import repository: `ll97-calculator-update`
   - Click "Deploy" (settings are auto-configured)
   - Get your live URL: `https://[project-name].vercel.app`

**Alternative platforms**: Netlify, Render, Cloudflare Pages, GitHub Pages - see [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Project Structure

```
src/
├── components/     # React components
├── store/          # Redux store and slices
├── locallaw/       # LL97 business logic and calculations
├── styles/         # Global styles and themes
├── types/          # TypeScript type definitions
├── assets/         # Static assets (images, fonts, etc.)
├── test/           # Test utilities and setup
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## Key Changes from v3 (Legacy Version)

### Build System & Tooling

| Aspect | Old Version (v3) | New Version (Modernized) |
|--------|------------------|--------------------------|
| **Build Tool** | Create React App (CRA) 5.0.1 | Vite 6.0.5 |
| **Dev Server** | Webpack Dev Server | Vite Dev Server (esbuild) |
| **TypeScript** | 4.9.5 | 5.7.2 |
| **Node Requirements** | >=18.x | >=20.0.0 |

**Benefits:**
- **10-100x faster** cold starts with Vite vs CRA
- **Instant HMR** (hot module replacement)
- **Native ESM** support in development
- **Faster builds** with Rollup and esbuild
- **Modern TypeScript** features and better type checking

### Package Upgrades

| Package | v3 Version | Modernized Version | Key Changes |
|---------|------------|-------------------|-------------|
| **React** | 18.3.1 | 18.3.1 | Same version (already modern) |
| **Material-UI** | 5.16.7 | 6.3.1 | Major version upgrade, improved theming |
| **Redux Toolkit** | 1.9.7 | 2.5.0 | Major version upgrade, better TypeScript support |
| **React Redux** | 8.1.3 | 9.2.0 | Major version upgrade, improved hooks API |
| **React Router** | 6.28.0 | 7.1.1 | Major version upgrade, new data APIs |
| **Redux** | 4.2.1 | 5.0.1 | Major version upgrade |
| **D3** | 7.6.1 | 7.9.0 | Minor update |
| **Immer** | 9.0.12 | 10.1.1 | Major version upgrade |

### Testing Framework

| Aspect | Old Version | New Version |
|--------|-------------|-------------|
| **Test Runner** | Jest (via react-scripts) | Vitest 3.2.4 |
| **Coverage** | Built-in Jest | @vitest/coverage-v8 |
| **Test UI** | None | @vitest/ui (interactive UI) |

**Benefits:**
- **Vite-native testing** - shares config with build
- **Faster test execution** with esbuild
- **Better ESM support**
- **Interactive test UI** for debugging

### Development Experience

**Old Version (v3):**
- Manual webpack/babel configuration required for customization
- Slower builds and longer startup times
- Limited ESM support
- Basic ESLint configuration via react-scripts
- No built-in code formatting

**New Version (Modernized):**
- Simple `vite.config.ts` for customization
- Lightning-fast dev server and HMR
- Full ESM support throughout
- Modern ESLint 9.x with TypeScript-aware rules
- Prettier integration for consistent formatting
- Path aliases configured for cleaner imports (`@/`, `components/`, `store/`, etc.)
- Separate coverage and UI tools for testing

### Configuration Files

**Old Version:**
- `react-scripts` managed most configuration internally
- Limited customization without ejecting

**New Version:**
- `vite.config.ts` - Build and dev server configuration
- `vitest.config.ts` - Test configuration
- `eslint.config.js` - Modern flat ESLint config
- `tsconfig.json` - TypeScript configuration
- Full control without "ejecting"

### Breaking Changes to Note

1. **Import paths** - May need to update if using absolute imports
2. **Environment variables** - Use `VITE_` prefix instead of `REACT_APP_`
3. **Build output** - Output directory is `build/` (configured to match v3)
4. **Test syntax** - Vitest is mostly Jest-compatible but check docs for edge cases
5. **Static file handling** - Files in `public/` work the same way

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

[Add your license information here]
