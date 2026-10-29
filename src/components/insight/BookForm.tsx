import type { BookRow } from '@/db/schema';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface BookFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<BookRow>;
  submitLabel: string;
}

const labelCls = 'block text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/50';
const inputCls =
  'mt-1.5 w-full rounded-xl border border-black/15 bg-white/70 px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:focus:border-white/40';

export default function BookForm({ action, defaults, submitLabel }: BookFormProps) {
  const d = defaults ?? {};
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelCls}>제목 *</label>
          <input id="title" name="title" required defaultValue={d.title ?? ''} className={inputCls} placeholder="클린 코드" />
        </div>
        <div>
          <label htmlFor="author" className={labelCls}>저자</label>
          <input id="author" name="author" defaultValue={d.author ?? ''} className={inputCls} placeholder="로버트 C. 마틴" />
        </div>
      </div>

      <ImageUploadField name="cover" label="표지 이미지" defaultValue={d.cover ?? ''} placeholder="https://… 또는 파일 업로드 (비우면 제목만 표시)" />

      <div>
        <label htmlFor="link" className={labelCls}>출처/인증 링크</label>
        <input id="link" name="link" type="url" defaultValue={d.link ?? ''} className={inputCls} placeholder="https://brunch.co.kr/book/…" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="status" className={labelCls}>상태</label>
          <select id="status" name="status" defaultValue={d.status ?? 'finished'} className={inputCls}>
            <option value="finished">완독</option>
            <option value="reading">읽는 중</option>
          </select>
        </div>
        <div>
          <label htmlFor="readDate" className={labelCls}>읽은 날짜</label>
          <input id="readDate" name="readDate" type="date" defaultValue={d.readDate ?? ''} className={inputCls} />
        </div>
        <div>
          <label htmlFor="rating" className={labelCls}>별점</label>
          <select id="rating" name="rating" defaultValue={d.rating != null ? String(d.rating) : ''} className={inputCls}>
            <option value="">없음</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>한 줄 소개</label>
        <input id="description" name="description" defaultValue={d.description ?? ''} className={inputCls} placeholder="목록/미리보기에 보일 한 줄" />
      </div>

      <div>
        <label className={labelCls}>내 생각 (마크다운)</label>
        <div className="mt-1.5">
          <MarkdownEditor name="content" defaultValue={d.content ?? ''} rows={12} placeholder="이 책을 읽고 느낀 점을 자유롭게… (🖼 이미지 업로드 가능)" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black">
          {submitLabel}
        </button>
        <a href="/Insight/books/admin" className="text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white">
          취소
        </a>
      </div>
    </form>
  );
}
