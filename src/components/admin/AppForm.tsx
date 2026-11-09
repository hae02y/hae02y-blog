import Link from 'next/link';
import type { AppRow } from '@/db/schema';
import { appIconOptions } from '@/components/apps/AppIcon';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface AppFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<AppRow>;
  submitLabel: string;
  error?: string;
}

const label = 'block text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/50';
const input = 'mt-1.5 w-full rounded-xl border border-black/15 bg-white/70 px-3.5 py-2.5 text-sm text-black outline-none focus:border-black/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white';

export default function AppForm({ action, defaults, submitLabel, error }: AppFormProps) {
  const d = defaults ?? {};
  return (
    <form action={action} className="mt-7 space-y-5">
      {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error === 'duplicate' ? '이미 등록된 URL입니다.' : '이름과 앱 이름, 올바른 http(s) 주소를 입력해 주세요.'}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="name" className={label}>앱 이름 *</label><input id="name" name="name" required maxLength={100} defaultValue={d.name ?? ''} className={input} placeholder="앱 이름" /></div>
        <div><label htmlFor="shortName" className={label}>아이콘 아래 이름 *</label><input id="shortName" name="shortName" required maxLength={30} defaultValue={d.shortName ?? ''} className={input} placeholder="짧은 이름" /></div>
      </div>
      <div><label htmlFor="href" className={label}>앱 주소 *</label><input id="href" name="href" type="url" required defaultValue={d.href ?? ''} className={input} placeholder="https://example.com/" /></div>
      <div><label htmlFor="description" className={label}>소개</label><textarea id="description" name="description" rows={3} maxLength={500} defaultValue={d.description ?? ''} className={input} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="kind" className={label}>종류</label><select id="kind" name="kind" defaultValue={d.kind ?? '웹앱'} className={input}>{['웹사이트', '웹앱', '모바일 앱', '실험작'].map(kind => <option key={kind} value={kind}>{kind}</option>)}</select></div>
        <fieldset><legend className={label}>지원 플랫폼</legend><div className="mt-3 flex flex-wrap gap-4">{['Web', 'iOS', 'Android'].map(platform => <label key={platform} className="flex items-center gap-1.5 text-sm text-black dark:text-white"><input type="checkbox" name="platforms" value={platform} defaultChecked={(d.platforms ?? ['Web']).includes(platform)} />{platform}</label>)}</div></fieldset>
      </div>
      <ImageUploadField name="iconImage" label="앱 아이콘 이미지 (선택)" defaultValue={d.iconImage ?? ''} placeholder="이미지 URL 또는 파일 업로드" />
      <div className="grid gap-5 sm:grid-cols-3">
        <div><label htmlFor="category" className={label}>분류</label><input id="category" name="category" maxLength={30} defaultValue={d.category ?? 'WEB APP'} className={input} placeholder="WEB APP" /></div>
        <div><label htmlFor="icon" className={label}>기본 아이콘</label><select id="icon" name="icon" defaultValue={d.icon ?? 'app'} className={input}>{appIconOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><label htmlFor="sortOrder" className={label}>표시 순서</label><input id="sortOrder" name="sortOrder" type="number" step="1" defaultValue={d.sortOrder ?? 0} className={input} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm text-black dark:text-white"><input name="published" type="checkbox" defaultChecked={d.published ?? true} className="h-4 w-4" />공개</label>
      <div className="flex items-center gap-4 pt-2"><button type="submit" className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:opacity-85 dark:bg-white dark:text-black">{submitLabel}</button><Link href="/admin/apps" className="text-sm text-black/50 dark:text-white/50">취소</Link></div>
    </form>
  );
}
