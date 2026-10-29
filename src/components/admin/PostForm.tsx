import type { PostRow } from '@/db/schema';
import MarkdownEditor from './MarkdownEditor';
import ImageUploadField from './ImageUploadField';

interface PostFormProps {
  action: (formData: FormData) => Promise<void>;
  type: 'blog' | 'essay';
  defaults?: Partial<PostRow>;
  submitLabel: string;
  isNew?: boolean;
}

const labelCls = 'block text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/50';
const inputCls =
  'mt-1.5 w-full rounded-xl border border-black/15 bg-white/70 px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:focus:border-white/40';

export default function PostForm({ action, type, defaults, submitLabel, isNew }: PostFormProps) {
  const d = defaults ?? {};
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="type" value={type} />

      <div>
        <label htmlFor="title" className={labelCls}>제목 *</label>
        <input id="title" name="title" required defaultValue={d.title ?? ''} className={inputCls} />
      </div>

      {isNew && (
        <div>
          <label htmlFor="slug" className={labelCls}>슬러그 (URL, 비우면 제목에서 자동)</label>
          <input id="slug" name="slug" className={inputCls} placeholder="my-post" />
        </div>
      )}

      <div>
        <label htmlFor="description" className={labelCls}>한 줄 소개 (비우면 본문에서 자동)</label>
        <input id="description" name="description" defaultValue={d.description ?? ''} className={inputCls} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tags" className={labelCls}>태그 (쉼표로 구분)</label>
          <input id="tags" name="tags" defaultValue={(d.tags ?? []).join(', ')} className={inputCls} placeholder="Spring, AWS" />
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>날짜</label>
          <input id="date" name="date" type="date" defaultValue={d.date ?? ''} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ImageUploadField name="heroImage" label="대표 이미지" defaultValue={d.heroImage ?? ''} placeholder="https://… 또는 파일 업로드" />
        {type === 'blog' && (
          <div>
            <label htmlFor="authors" className={labelCls}>저자 (쉼표로 구분)</label>
            <input id="authors" name="authors" defaultValue={(d.authors ?? []).join(', ')} className={inputCls} placeholder="haeyoung" />
          </div>
        )}
      </div>

      {type === 'blog' && (
        <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
          <input type="checkbox" name="comments" defaultChecked={d.comments ?? true} className="h-4 w-4" />
          댓글 사용
        </label>
      )}

      <div>
        <label className={labelCls}>본문 (마크다운)</label>
        <div className="mt-1.5">
          <MarkdownEditor name="content" defaultValue={d.content ?? ''} placeholder="내용을 마크다운으로… (🖼 이미지 버튼이나 드래그로 업로드)" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black">
          {submitLabel}
        </button>
        <a href={`/admin/posts?type=${type}`} className="text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white">
          취소
        </a>
      </div>
    </form>
  );
}
