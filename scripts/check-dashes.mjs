import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const rootsToSkip = new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results']);
const forbidden = /\u2013|\u2014/g;
const failures = [];

async function walk(path) {
  const info = await stat(path);
  if (info.isDirectory()) {
    const name = path.split('/').pop();
    if (name && rootsToSkip.has(name)) return;
    for (const entry of await readdir(path)) await walk(join(path, entry));
    return;
  }

  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch {
    return;
  }

  if (forbidden.test(text)) failures.push(path);
  forbidden.lastIndex = 0;
}

await walk('.');

if (failures.length) {
  console.error('Forbidden dash characters found in:');
  for (const file of failures) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Dash check passed.');
