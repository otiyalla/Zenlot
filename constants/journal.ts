export function lexicalToPlainText(editorState?: string | null, fallback?: string): string {
  if (!editorState) return fallback ?? '';
  try {
    const parsed = typeof editorState === 'string' ? JSON.parse(editorState) : editorState;
    const root = parsed?.root;
    if (!root?.children) return fallback ?? '';
    const lines: string[] = [];
    const walk = (node: any) => {
      if (!node) return;
      if (node.type === 'paragraph' && Array.isArray(node.children) && node.children.length === 0) {
        lines.push(''); // preserve empty paragraph spacing
      }
      if (typeof node.text === 'string' && node.text.length > 0) {
        lines.push(node.text);
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(root);
    // Collapse consecutive empties nicely
    const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    return text.length ? text : (fallback ?? '');
  } catch {
    return fallback ?? '';
  }
}

export function extractPlainTextFromLexical(editorState?: string | null, fallback?: string) {
  if (!editorState) return fallback ?? '';
  try {
    const json = typeof editorState === 'string' ? JSON.parse(editorState) : editorState;
    // Very lightweight traversal — handles your editorDefault structure
    const root = json?.root;
    if (!root?.children) return fallback ?? '';
    const texts: string[] = [];
    const walk = (node: any) => {
      if (!node) return;
      if (node.text) texts.push(node.text);
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    root.children.forEach(walk);
    const text = texts.join('\n').trim();
    return text || (fallback ?? '');
  } catch {
    return fallback ?? '';
  }
}
