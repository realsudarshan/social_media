# Testing Guide

## Running Tests

Your project now has a comprehensive testing setup using Vitest and React Testing Library.

### Test Commands

```bash
# Run all tests
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are located in `__tests__` directories next to the code they test:

```
src/
├── components/
│   └── shared/
│       └── __tests__/
│           ├── Logo.test.tsx
│           └── FollowersModal.test.tsx
└── lib/
    └── utils/
        └── __tests__/
            └── index.test.ts
```

### What's Tested

✅ **Logo Component** - Different sizes and rendering  
✅ **FollowersModal Component** - Modal states, user interactions, empty states  
✅ **Utility Functions** - Date formatting logic  

### Writing New Tests

1. Create a `__tests__` folder next to your component
2. Name your test file `ComponentName.test.tsx`
3. Use the custom render function from `@/test/utils`

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test Utilities

- `@/test/utils` - Custom render with React Query and Router providers
- `vitest.setup.ts` - Global test configuration and mocks
- `tsconfig.vitest.json` - TypeScript configuration for tests

### Coverage

Run `npm run test:coverage` to see code coverage report. Aim for 70%+ coverage on critical paths.

### Tips

- Use `screen.debug()` to see the rendered HTML
- Use `test:ui` for interactive debugging
- Mock Appwrite calls are already configured
- All tests run in jsdom environment (simulates browser)
