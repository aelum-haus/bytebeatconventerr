export function downloadBytebeat() {
    const bytebeatFormula = document.getElementById('output').value;
    if (!bytebeatFormula) {
        alert('No bytebeat code to download. Please convert audio or image first.');
        return;
    }

    // Build a simple standalone HTML file that displays the formula and offers copy/download
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Bytebeat Formula</title>
<style>
  body{font-family: "Noto Sans", system-ui, -apple-system, Arial, sans-serif; background:#ffffff; color:#000; padding:20px;}
  .actions{position:fixed; top:16px; right:16px;}
  .btn{padding:8px 12px; border-radius:8px; border:1px solid #111; background:#111;color:#fff;text-decoration:none;margin-left:8px;}
  pre{white-space:pre-wrap; word-break:break-word; background:#f5f5f5; padding:16px; border-radius:8px; border:1px solid #e0e0e0;}
  textarea{width:100%;height:120px;margin-top:12px;}
</style>
</head>
<body>
  <div class="actions">
    <a class="btn" id="downloadFile" download="bytebeat.txt">Download .txt</a>
    <a class="btn" id="copyBtn">Copy</a>
  </div>
  <h1>Bytebeat Formula</h1>
  <p>Open this file in any browser. Use the buttons to download a plain .txt copy or copy to clipboard.</p>
  <pre id="formula">${escapeHtml(bytebeatFormula)}</pre>
  <textarea id="editable">${escapeHtml(bytebeatFormula)}</textarea>
<script>
function downloadText(filename, text){
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.getElementById('downloadFile');
  a.href = url;
}
document.getElementById('copyBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(document.getElementById('editable').value); alert('Copied to clipboard'); }
  catch(e){ alert('Copy failed'); }
});
document.getElementById('editable').addEventListener('input', () => {
  downloadText('bytebeat.txt', document.getElementById('editable').value);
});
// initialize
downloadText('bytebeat.txt', document.getElementById('editable').value);
</script>
</body>
</html>`;

    // create blob and trigger download (standalone html file)
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bytebeat.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* helper to escape HTML injected into the template */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function copyBytebeat() {
    const outputText = document.getElementById('output').value;
    if (!outputText) {
        showToast('No bytebeat code to copy. Please convert audio first.', 'error');
        return;
    }
    navigator.clipboard.writeText(outputText)
        .then(() => {
            const button = document.getElementById('copyBytebeat'); 
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = originalText; }, 1200);
            }
            showToast('Bytebeat code copied to clipboard.', 'success');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy to clipboard.', 'error');
        });
}

export function showToast(message, type = 'success', timeout = 2200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => container.removeChild(el), 180);
    }, timeout);
}