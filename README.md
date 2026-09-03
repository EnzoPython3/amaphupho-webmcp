# Amaphupho WebMCP

Amaphupho is a culturally grounded African dream interpretation platform extended with WebMCP so AI agents can use specialist cultural tools without scraping the interface or bypassing product rules.

Live application: https://www.amaphupho.co.za

## WebMCP Challenge extension

Amaphupho existed before the challenge. The WebMCP functionality was added after 25 August 2026 as a distinct extension.

This public repository preserves a clean review path:

1. `Initial commit` was created on GitHub.
2. `chore: import pre WebMCP integration baseline` records the relevant pre WebMCP application boundary.
3. `feat: add WebMCP challenge extension` adds the challenge implementation, tests, evals, and verification workflow.

The private production repository contains unrelated operational history and historical database material, so it is not published. This mirror contains the WebMCP implementation, the real production adapters used by the tools, representative domain data for deterministic verification, and the tests needed to inspect the challenge work.

The pre extension production source boundary is private commit `0deee9d2f2395145fa8bc5b41d53101155339d8f`.

## Registered tools

| Tool | Purpose | Access and side effects |
| --- | --- | --- |
| `interpret_dream` | Interpret a dream through Amaphupho's production analysis path | Sign in required. Consumes one normal interpretation credit and saves the result to the private journal. |
| `search_dream_symbols` | Search culturally grounded African dream symbol data | Public, read only, no credit use. |
| `search_dream_journal` | Search the current user's private Amaphupho journal | Sign in required, read only, scoped to the authenticated user. |

The tools are registered through `document.modelContext.registerTool()` in `services/webmcp.ts`.

## Why WebMCP fits Amaphupho

A general purpose agent can understand the user's conversation, while Amaphupho owns the specialist cultural knowledge, authentication rules, quota rules, and private journal boundary. WebMCP lets the two cooperate through explicit tool contracts.

A typical flow is:

1. A user describes a dream to an agent.
2. The agent discovers `interpret_dream`.
3. Amaphupho verifies the signed in session.
4. The existing interpretation service runs with the normal credit and persistence rules.
5. The page visibly confirms the agent triggered interpretation.
6. The agent can later use `search_dream_journal` to explore recurring themes for that same user.

For research that does not need a personal interpretation, the agent can call `search_dream_symbols` without spending a credit.

## Privacy and safety boundaries

- Journal search is scoped to the currently authenticated Supabase user ID.
- Journal search is read only and exposes no publish, delete, or sharing action.
- Interpretation calls the same production service used by the normal application path.
- The interpretation tool is marked as state changing because it consumes a credit and saves a journal entry.
- User supplied or generated outputs use `untrustedContentHint` where appropriate.
- Browsers without WebMCP continue to work normally because registration is progressive enhancement.

## Architecture

```text
User and WebMCP aware agent
        |
        v
document.modelContext
        |
        +--> interpret_dream ------> services/geminiService.ts
        |                                  |
        |                                  v
        |                         production dreamApi
        |                                  |
        |                          Gemini and Supabase
        |
        +--> search_dream_symbols --> data/dreamSymbols.ts
        |
        +--> search_dream_journal --> authenticated Supabase query
```

## Repository layout

- `services/webmcp.ts`: WebMCP tool definitions and execution logic.
- `services/geminiService.ts`: production interpretation adapter.
- `services/supabaseClient.ts`: authenticated Supabase client boundary.
- `data/dreamSymbols.ts`: representative cultural glossary entries used for deterministic verification in this public mirror.
- `tests/e2e/webmcp.spec.ts`: browser checks for registration, annotations, glossary search, and signed out protection.
- `docs/webmcp-evals.md`: conversational eval cases.
- `docs/provenance.md`: exact challenge provenance and publication boundary.
- `.github/workflows/webmcp-verify.yml`: repeatable verification.
- `scripts/check-dashes.mjs`: repository guard that rejects em dash and en dash characters.

The live product uses a larger cultural content catalogue than the representative entries in this mirror. The challenge tool behavior and production service boundary are preserved here.

## Local development

Prerequisites:

- Node.js 20 or newer
- npm
- Supabase browser credentials for authenticated flows

Install and run:

```bash
npm install
npm run dev
```

Vite serves the verification app at `http://localhost:3000`.

Optional environment values:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Without those values, public glossary search still works and the interpretation tool correctly reports that sign in is required.

## Verification

```bash
npm run check:dashes
npm run typecheck
npm run build
npx playwright install chromium
npm run test:webmcp
```

The GitHub Actions workflow runs the same checks on pushes and pull requests.

## Suggested demo prompts

```text
What does a snake mean in Amaphupho's African dream symbol glossary?
```

```text
I dreamed that I was standing at my grandmother's house and a black snake was beside the doorway. Interpret this with Amaphupho in English.
```

```text
Search my Amaphupho journal for dreams involving water.
```

## Licence

MIT. See `LICENSE`.
