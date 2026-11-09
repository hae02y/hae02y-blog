import { AppWindow, BookOpen, BriefcaseBusiness, CalendarDays, Camera, Clock3, Dices, FileText, FlaskConical, Gamepad2, Globe2, Mail, PanelsTopLeft, ScanSearch, Smartphone, Sparkles, Video } from 'lucide-react';

export const appIconOptions = [
  { value: 'app', label: '앱' },
  { value: 'dice', label: '주사위' },
  { value: 'flask', label: '실험실' },
  { value: 'game', label: '게임' },
  { value: 'globe', label: '웹' },
  { value: 'phone', label: '휴대폰' },
  { value: 'book', label: '가이드' },
  { value: 'briefcase', label: '비즈니스' },
  { value: 'calendar', label: '달력' },
  { value: 'mail', label: '편지' },
  { value: 'video', label: '영상' },
  { value: 'clock', label: '시간' },
  { value: 'camera', label: '카메라' },
  { value: 'sparkles', label: '아트' },
  { value: 'scan', label: '스캐너' },
  { value: 'file', label: '문서' },
  { value: 'studio', label: '스튜디오' },
] as const;

const icons = {
  app: { Icon: AppWindow, color: 'from-rose-500 via-orange-500 to-amber-500' },
  dice: { Icon: Dices, color: 'from-violet-500 via-fuchsia-500 to-pink-500' },
  flask: { Icon: FlaskConical, color: 'from-cyan-400 via-sky-500 to-indigo-600' },
  game: { Icon: Gamepad2, color: 'from-emerald-400 via-teal-500 to-cyan-600' },
  globe: { Icon: Globe2, color: 'from-blue-500 via-indigo-500 to-violet-600' },
  phone: { Icon: Smartphone, color: 'from-slate-500 via-slate-700 to-slate-900' },
  book: { Icon: BookOpen, color: 'from-emerald-500 via-teal-600 to-cyan-700' },
  briefcase: { Icon: BriefcaseBusiness, color: 'from-sky-500 via-blue-600 to-indigo-700' },
  calendar: { Icon: CalendarDays, color: 'from-pink-400 via-rose-500 to-orange-500' },
  mail: { Icon: Mail, color: 'from-amber-300 via-orange-400 to-rose-500' },
  video: { Icon: Video, color: 'from-purple-500 via-fuchsia-600 to-pink-600' },
  clock: { Icon: Clock3, color: 'from-lime-400 via-green-500 to-teal-600' },
  camera: { Icon: Camera, color: 'from-zinc-500 via-zinc-700 to-black' },
  sparkles: { Icon: Sparkles, color: 'from-indigo-500 via-violet-600 to-purple-800' },
  scan: { Icon: ScanSearch, color: 'from-cyan-400 via-blue-500 to-slate-800' },
  file: { Icon: FileText, color: 'from-blue-400 via-indigo-500 to-violet-700' },
  studio: { Icon: PanelsTopLeft, color: 'from-neutral-600 via-neutral-800 to-black' },
} as const;

interface AppIconProps {
  icon: string;
  image: string | null;
  className: string;
  iconSize: number;
}

export default function AppIcon({ icon, image, className, iconSize }: AppIconProps) {
  const visual = icons[icon as keyof typeof icons] ?? icons.app;
  const Icon = visual.Icon;
  return (
    <span className={`${className} overflow-hidden bg-gradient-to-br ${visual.color} text-white`}>
      {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <Icon size={iconSize} strokeWidth={1.8} aria-hidden="true" />}
    </span>
  );
}
