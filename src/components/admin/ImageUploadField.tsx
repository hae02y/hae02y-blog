'use client';

import { useRef, useState } from 'react';

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function ImageUploadField({ name, label, defaultValue, placeholder }: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '업로드 실패');
      }
      const { url: uploaded } = await res.json();
      setUrl(uploaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/50">{label}</label>
      <div className="mt-1.5 flex items-start gap-3">
        {url && (
          <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-black/10 object-cover dark:border-white/15" />
        )}
        <div className="min-w-0 flex-1">
          <input
            type="url"
            name={name}
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-black/15 bg-white/70 px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:focus:border-white/40"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-black/70 transition hover:bg-black hover:text-white dark:border-white/15 dark:bg-white/[0.05] dark:text-white/70 dark:hover:bg-white dark:hover:text-black"
            >
              {uploading ? '업로드 중…' : '파일 업로드'}
            </button>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
        </div>
      </div>
    </div>
  );
}
