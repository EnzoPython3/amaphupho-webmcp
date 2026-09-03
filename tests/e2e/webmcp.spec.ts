import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const tools: any[] = [];
    (window as any).__webMcpTools = tools;

    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        registerTool: async (definition: any) => {
          tools.push(definition);
        },
      },
    });
  });
});

test('registers the three Amaphupho WebMCP tools', async ({ page }) => {
  await page.goto('/');

  await expect.poll(async () => page.evaluate(() =>
    (window as any).__webMcpTools?.map((tool: any) => tool.name).sort()
  )).toEqual([
    'interpret_dream',
    'search_dream_journal',
    'search_dream_symbols',
  ]);

  const annotations = await page.evaluate(() => {
    const tools = (window as any).__webMcpTools as any[];
    return Object.fromEntries(tools.map((tool) => [tool.name, tool.annotations]));
  });

  expect(annotations.interpret_dream.readOnlyHint).toBe(false);
  expect(annotations.search_dream_symbols.readOnlyHint).toBe(true);
  expect(annotations.search_dream_journal.readOnlyHint).toBe(true);
});

test('search_dream_symbols returns curated glossary data', async ({ page }) => {
  await page.goto('/');

  const result = await page.evaluate(async () => {
    const tools = (window as any).__webMcpTools as any[];
    const tool = tools.find((candidate) => candidate.name === 'search_dream_symbols');
    return JSON.parse(await tool.execute({ query: 'snake', limit: 2 }));
  });

  expect(result.query).toBe('snake');
  expect(result.matches.length).toBeGreaterThan(0);
  expect(result.matches[0]).toMatchObject({
    english: expect.any(String),
    meaning: expect.any(String),
    url: expect.stringContaining('https://www.amaphupho.co.za/dream-meaning/'),
  });
});

test('interpret_dream refuses to spend a credit without a signed in user', async ({ page }) => {
  await page.goto('/');

  const result = await page.evaluate(async () => {
    const tools = (window as any).__webMcpTools as any[];
    const tool = tools.find((candidate) => candidate.name === 'interpret_dream');
    return JSON.parse(await tool.execute({ dream: 'I saw a river.' }));
  });

  expect(result).toMatchObject({
    requiresSignIn: true,
  });
});
