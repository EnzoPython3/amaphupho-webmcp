# Judge testing guide

Live application: https://www.amaphupho.co.za

Public source: https://github.com/EnzoPython3/amaphupho-webmcp

## Fastest test

Use the ChatGPT desktop app built in browser or Chrome with WebMCP testing enabled.

Open the live application and try:

```text
What does Amaphupho say dreaming about a snake means?
```

Expected tool: `search_dream_symbols`

This public tool requires no sign in and spends no credit.

## Authenticated interpretation

Sign in with the judging account supplied in the submission, then try:

```text
Interpret this dream with Amaphupho in English: I was standing at my grandmother's house and a black snake was beside the doorway.
```

Expected tool: `interpret_dream`

The tool uses the same production interpretation path as the human interface. It consumes one normal interpretation credit and saves the result to the signed in user's private journal.

## Private journal search

After signing in, try:

```text
Search my Amaphupho journal for dreams involving snakes.
```

Expected tool: `search_dream_journal`

The tool is read only and scoped to the current authenticated user.

## Chrome verification

1. Use Chrome 149 or newer.
2. Enable `chrome://flags/#enable-webmcp-testing`.
3. Relaunch Chrome.
4. Open https://www.amaphupho.co.za.
5. Open DevTools.
6. Select Application, then WebMCP.
7. Confirm these tools are present:
   - `interpret_dream`
   - `search_dream_symbols`
   - `search_dream_journal`
8. Select `search_dream_symbols` and run it with `query` set to `snake`.

## Source and deployment boundary

The live application is deployed from the private production repository because that repository also contains unrelated operational history and historical backup material that should not be published.

This public repository is the reviewable WebMCP challenge source. It contains a standalone verification application, the WebMCP tool contracts, production facing adapters used by those tools, deterministic tests, eval cases, provenance documentation, and configuration templates. Production credentials are never committed.

The live site and the public repository contain the same WebMCP tool definitions submitted for judging.

## Challenge provenance

Amaphupho existed before the WebMCP Challenge. The WebMCP extension was added after 25 August 2026. See `docs/provenance.md` for the exact source boundary and commit history.
