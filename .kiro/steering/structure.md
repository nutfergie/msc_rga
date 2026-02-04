# Project Structure

## Directory Organization

```
rga-web-application/
├── src/
│   ├── components/      # React components (.jsx files)
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions (validation, etc.)
│   ├── config/          # Configuration files (API config)
│   ├── state/           # Recoil state management (atoms, selectors)
│   ├── test/            # Test setup and utilities
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point with RecoilRoot
├── mock-api/            # JSON Server mock API
│   ├── db.json          # Mock data
│   └── server.cjs       # Custom JSON Server with POST endpoints
├── .kiro/
│   ├── specs/           # Feature specifications
│   └── steering/        # Steering documents (this file)
└── dist/                # Build output (generated)
```

## Key Conventions

### File Naming
- React components: PascalCase with `.jsx` extension (e.g., `OrderSearch.jsx`)
- Utilities/services: camelCase with `.js` extension (e.g., `validation.js`, `api.js`)
- State files: camelCase (e.g., `atoms.js`, `selectors.js`)

### Component Structure
- One component per file
- Export component as default
- Co-locate related components in `components/` directory

### State Management
- Use Recoil for global state
- Define atoms in `state/atoms.js`
- Define selectors in `state/selectors.js`
- Wrap app with `<RecoilRoot>` in `main.jsx`

### API Layer
- All API calls go through `services/api.js`
- API configuration in `config/apiConfig.js`
- Use POST method for all endpoints
- Endpoints: `/order`, `/rgaReason`, `/rgaSubmit`

### Validation
- Validation logic in `utils/validation.js`
- Separate validation functions for different forms
- Return error message string or null

### Testing
- Test setup in `src/test/setup.js`
- Use Vitest with jsdom environment
- Property-based tests use fast-check
- Test files use `.test.js` or `.test.jsx` extension

## Mock API Structure

The mock API (`mock-api/server.cjs`) provides custom POST endpoints that mirror the real API:
- `/order` - Search for orders
- `/rgaReason` - Get cancellation reasons
- `/rgaSubmit` - Submit RGA document

Data stored in `mock-api/db.json` with collections: `orders`, `rgaReasons`, `rgaDocuments`
