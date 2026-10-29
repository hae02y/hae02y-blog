'use client';

import { useRef, useState } from 'react';

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}

const btnCls =
  'rounded-md border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-black/70 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/[0.05] dark:text-white/70 dark:hover:bg-white dark:hover:text-black';

export default function MarkdownEditor({ name, defaultValue, rows = 18, placeholder }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function wrap(pre: string, post = pre) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e);
    ta.setRangeText(`${pre}${sel}${post}`, s, e, 'end');
    ta.focus();
  }

  function linePrefix(prefix: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, value } = ta;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    ta.setRangeText(prefix, lineStart, lineStart, 'end');
    ta.focus();
  }

  function insert(text: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    ta.setRangeText(text, s, e, 'end');
    ta.focus();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '업로드 실패');
        }
        const { url } = await res.json();
        insert(`\n![${file.name}](${url})\n`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="rounded-xl border border-black/15 bg-white/70 dark:border-white/15 dark:bg-white/[0.05]">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-black/10 p-2 dark:border-white/10">
        <button type="button" className={btnCls} onClick={() => wrap('**')}>굵게</button>
        <button type="button" className={btnCls} onClick={() => wrap('*')}>기울임</button>
        <button type="button" className={btnCls} onClick={() => linePrefix('## ')}>제목</button>
        <button type="button" className={btnCls} onClick={() => linePrefix('- ')}>목록</button>
        <button type="button" className={btnCls} onClick={() => linePrefix('> ')}>인용</button>
        <button type="button" className={btnCls} onClick={() => wrap('`')}>코드</button>
        <button type="button" className={btnCls} onClick={() => insert('\n```\n코드\n```\n')}>코드블록</button>
        <button type="button" className={btnCls} onClick={() => wrap('[', '](https://)')}>링크</button>
        <button type="button" className={btnCls} onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '업로드 중…' : '🖼 이미지'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="px-3 pt-2 text-xs text-red-500">{error}</p>}
      <textarea
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        onDrop={e => {
          if (e.dataTransfer.files?.length) {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }
        }}
        className="w-full resize-y bg-transparent px-3.5 py-3 font-mono text-sm leading-6 text-black outline-none dark:text-white"
      />
    </div>
  );
}
