// Minimal Markdown renderer for content/resume.md.
// Deliberately supports only the subset that file uses: h1/h2/h3, paragraphs,
// unordered lists, **bold**, *italic*, `code`, [links](url) and bare URLs/emails.
// No HTML passthrough — everything is escaped first, so the source file can
// never inject markup into the page.

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(text) {
  let out = esc(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const safe = /^(https?:|mailto:|\/|#)/.test(href) ? href : '#';
    return `<a href="${safe}">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');
  // Bare emails and domains in the contact line.
  out = out.replace(/\b([\w.+-]+@[\w-]+\.[\w.]+)\b/g, '<a href="mailto:$1">$1</a>');
  out = out.replace(
    /(^|[\s·])((?:linkedin\.com|github\.com|[\w-]+\.com)\/[\w./-]+)/g,
    '$1<a href="https://$2">$2</a>'
  );
  return out;
}

export function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line.trim());
    if (bullet) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${inline(line.trim())}</p>`);
  }
  closeList();
  return html.join('\n');
}

export { esc };
