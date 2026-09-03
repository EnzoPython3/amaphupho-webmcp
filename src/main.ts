import { registerWebMcpTools } from '../services/webmcp';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    <h1>Amaphupho WebMCP</h1>
    <p>Challenge verification surface for the deployed Amaphupho tools.</p>
    <p id="status" role="status">Waiting for WebMCP registration.</p>
  `;
}

window.addEventListener('amaphupho:webmcp-complete', (event: Event) => {
  const title = (event as CustomEvent<{ title?: string }>).detail?.title || 'Dream interpretation complete';
  const status = document.getElementById('status');
  if (status) status.textContent = `${title}. Interpretation completed and saved to the private journal.`;
});

registerWebMcpTools()
  .then((registered) => {
    const status = document.getElementById('status');
    if (status) status.textContent = registered ? 'WebMCP tools registered.' : 'WebMCP is not available in this browser.';
  })
  .catch((error) => {
    const status = document.getElementById('status');
    if (status) status.textContent = `WebMCP registration failed: ${String(error)}`;
  });
