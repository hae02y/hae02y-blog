import { AppWindow, Dices, FlaskConical, Gamepad2, Globe2, Smartphone } from 'lucide-react';

export const appIconOptions = [
  { value: 'app', label: '앱' },
  { value: 'dice', label: '주사위' },
  { value: 'flask', label: '실험실' },
  { value: 'game', label: '게임' },
  { value: 'globe', label: '웹' },
  { value: 'phone', label: '휴대폰' },
] as const;

const icons = {
  app: { Icon: AppWindow, color: 'from-rose-500 via-orange-500 to-amber-500' },
  dice: { Icon: Dices, color: 'from-violet-500 via-fuchsia-500 to-pink-500' },
  flask: { Icon: FlaskConical, color: 'from-cyan-400 via-sky-500 to-indigo-600' },
  game: { Icon: Gamepad2, color: 'from-emerald-400 via-teal-500 to-cyan-600' },
  globe: { Icon: Globe2, color: 'from-blue-500 via-indigo-500 to-violet-600' },
  phone: { Icon: Smartphone, color: 'from-slate-500 via-slate-700 to-slate-900' },
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
