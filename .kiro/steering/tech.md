# Technology Stack

## Core Technologies

- **Framework**: React 19.2.4
- **Build Tool**: Vite 7.3.1
- **Language**: JavaScript (not TypeScript) - use `.js` and `.jsx` extensions
- **UI Library**: Material-UI (MUI) 7.3.7
- **State Management**: Recoil 0.7.7
- **Routing**: React Router DOM 7.13.0

## Testing

- **Test Runner**: Vitest 4.0.18
- **Testing Library**: @testing-library/react 16.3.2
- **Property-Based Testing**: fast-check 4.5.3
- **Mocking**: MSW (Mock Service Worker) 2.12.7
- **Environment**: jsdom 28.0.0

## Development Tools

- **Mock API**: JSON Server 0.17.4 (custom server in `mock-api/server.cjs`)
- **Dev Server Port**: 5173 (Vite)
- **Mock API Port**: 3001 (JSON Server)

## Common Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run mock-api         # Start JSON Server mock API (port 3001)

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage report
```

## API Configuration

- API base URL configured via environment variable: `VITE_API_BASE_URL`
- Default: `http://localhost:3001` (mock API)
- All API calls use POST method
- Configuration file: `src/config/apiConfig.js`

## Project Type

- ES Modules (`"type": "module"` in package.json)
- Use `import/export` syntax, not `require`
