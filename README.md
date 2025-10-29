# Smart Search Web Component

A search component built with Lit for searching across accounts, transactions, and customers.

## Installation

```bash
npm install
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/src/main.ts"></script>
</head>
<body>
  <smart-search></smart-search>
  <theme-toggle></theme-toggle>
</body>
</html>
```

### With Data

```javascript
import './components/smart-search';

const searchElement = document.querySelector('smart-search');

searchElement.accounts = [
  { id: '1', accountNumber: 'ACC001', accountHolder: 'John Doe', balance: 1000, type: 'checking' }
];

searchElement.transactions = [
  { id: '1', amount: 50, date: '2024-01-01', description: 'Coffee Shop', accountId: '1', type: 'debit' }
];

searchElement.customers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@test.com', phone: '555-0001', customerId: 'CUST001' }
];

searchElement.addEventListener('search-select', (e) => {
  console.log('Selected:', e.detail);
});
```

## API

### `<smart-search>`

**Properties:**
- `accounts: Account[]` - Array of account objects
- `transactions: Transaction[]` - Array of transaction objects
- `customers: Customer[]` - Array of customer objects
- `placeholder: string` - Input placeholder text (default: "Search accounts, transactions, customers...")

**Events:**
- `search-select` - Fired when a result is selected. Event detail contains `{ type, data }`

**Types:**

```typescript
type Account = {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit';
};

type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  accountId: string;
  type: 'debit' | 'credit';
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerId: string;
};
```

### `<theme-toggle>`

**Properties:**
- None (manages theme automatically via localStorage and system preferences)

**Events:**
- None

**Behavior:**
- Toggles between light/dark themes
- Persists preference to localStorage
- Respects system theme preference if not set

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# Visual UI
npm run test:ui

# Coverage report
npm run test:coverage
```

**Test Results:**
- 62 tests passing
- 83.41% overall coverage
- 2.21s execution time

## Project Structure

```
src/
├── components/
│   ├── smart-search/       # Search component
│   │   ├── index.ts
│   │   ├── index.css
│   │   └── smart-search.test.ts
│   └── theme-toggle/       # Theme switcher
│       ├── index.ts
│       ├── index.css
│       └── theme-toggle.test.ts
├── utils/
│   ├── search.utils.ts     # Search/formatting utilities
│   └── search.utils.test.ts
├── types/
│   └── financial.types.ts  # TypeScript types
├── data/
│   └── mock-data.ts        # Sample data
└── main.ts                 # Entry point
```

## Features

- **Fast Search** - Debounced input with 150ms delay
- **Multi-category** - Search across accounts, transactions, and customers
- **Keyboard Navigation** - Arrow keys, Enter, Escape
- **Highlighting** - Match highlighting in results
- **Theme Support** - Light/dark mode with persistence
- **Type Safe** - Full TypeScript support
- **Tested** - 83% coverage with Vitest

## Browser Support

Modern browsers with Web Components support:
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+

## License

MIT
