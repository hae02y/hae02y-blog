import { createHash } from 'node:crypto';

// Character windows keep this example dependency-free. They are not token windows.
export function chunkMarkdown(markdown, source, maxChars = 900, overlap = 120) {
  if (!Number.isInteger(maxChars) || maxChars < 1 || overlap < 0 || overlap >= maxChars) {
    throw new Error('Invalid chunk size/overlap');
  }
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const sections = [];
  let heading = '소개';
  let lines = [];
  let inFence = false;
  for (const line of body.split('\n')) {
    if (/^```/.test(line)) inFence = !inFence;
    if (!inFence && /^#{1,3} /.test(line)) {
      if (lines.join('\n').trim()) sections.push({ heading, text: lines.join('\n').trim() });
      heading = line.replace(/^#+ /, '');
      lines = [];
    } else lines.push(line);
  }
  if (lines.join('\n').trim()) sections.push({ heading, text: lines.join('\n').trim() });
  return sections.flatMap(section => {
    const chunks = [];
    for (let start = 0; start < section.text.length; start += maxChars - overlap) {
      const text = section.text.slice(start, start + maxChars);
      const id = createHash('sha256').update(JSON.stringify([source, section.heading, start, text])).digest('hex').slice(0, 16);
      chunks.push({ id, source, heading: section.heading, start, text });
      if (start + maxChars >= section.text.length) break;
    }
    return chunks;
  });
}

export function cosine(a, b) {
  if (!a.length || a.length !== b.length || ![...a, ...b].every(Number.isFinite)) {
    throw new Error('Embedding dimensions or values are invalid; rebuild the index');
  }
  let dot = 0;
  let aa = 0;
  let bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aa += a[i] ** 2;
    bb += b[i] ** 2;
  }
  if (!aa || !bb) throw new Error('Zero embedding is invalid');
  return dot / Math.sqrt(aa * bb);
}

export function search(index, queryVector, topK = 3) {
  if (!Number.isInteger(topK) || topK < 1) throw new Error('topK must be a positive integer');
  return index.map(({ vector, ...chunk }) => ({ ...chunk, score: cosine(queryVector, vector) }))
    .sort((a, b) => b.score - a.score).slice(0, topK);
}

export function contextFor(hits) {
  return hits.map((hit, i) => ({ citation: i + 1, source: hit.source, heading: hit.heading, text: hit.text }));
}
