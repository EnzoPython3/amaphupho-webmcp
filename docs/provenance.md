# Hackathon provenance

Amaphupho predates the OpenAI WebMCP Challenge.

## Production boundary before the extension

Private source commit before WebMCP work:

`0deee9d2f2395145fa8bc5b41d53101155339d8f`

The WebMCP implementation was developed on a dedicated branch and merged into the private production repository after verification.

Production merge commit:

`904e95415c435d0d64e0736db3a3eab237b3cc25`

## Public mirror history

The public repository intentionally starts with a clean history rather than copying the private Git history.

This protects unrelated operational documents and historical database material while preserving a clear challenge review path.

The public history is structured as:

1. GitHub initial commit.
2. Pre WebMCP integration baseline.
3. WebMCP challenge extension.

The public baseline is a sanitised functional extraction of the relevant integration boundary, not a claim that Amaphupho itself was created during the challenge.

## Challenge work

The extension adds:

- WebMCP Imperative API registration through `document.modelContext.registerTool()`.
- `interpret_dream` for authenticated interpretation using the production application service.
- `search_dream_symbols` for public cultural symbol research.
- `search_dream_journal` for authenticated read only journal search.
- Human visible completion feedback for agent triggered interpretation.
- Browser verification and conversational eval cases.
- Explicit read only and untrusted content annotations.
- Automated rejection of em dash and en dash characters in repository text.
