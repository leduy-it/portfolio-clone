# Playwright End-to-End Tests

Tests for the three most important flows on the leduy.py portfolio.

## Prerequisites

Install Playwright's Chromium browser (one-time setup):

```bash
npx playwright install chromium
```

## Running the tests

Start the dev server first (in a separate terminal):

```bash
npm run dev -- -p 3002
```

Then run the tests:

```bash
npx playwright test
```

To run a specific spec:

```bash
npx playwright test tests/01-navigation.spec.ts
npx playwright test tests/02-locale-toggle.spec.ts
npx playwright test tests/03-chat-flow.spec.ts
```

## Test descriptions

| File | Flow tested |
|------|-------------|
| `01-navigation.spec.ts` | Header brand, nav links, and routing to `/experience`, `/blog`, `/photography` |
| `02-locale-toggle.spec.ts` | EN/VI language toggle, brand text swap, and localStorage persistence across reloads |
| `03-chat-flow.spec.ts` | Agent chat input/reply, maximize/restore window, compose form open/cancel |

## Notes

- Tests assume the dev server is running at `http://localhost:3002`.
- Test #3 (`03-chat-flow.spec.ts`) uses a **canned response** for the stack question, so it works without an API key. The streaming assistant reply assertion requires a working `OPENROUTER_API_KEY` in `.env.local`; if the key is absent the test for live replies will fail with a network or empty-reply error.
- The locale toggle tests clear `leduy.locale` from localStorage in `beforeEach` to guarantee a clean EN baseline.
