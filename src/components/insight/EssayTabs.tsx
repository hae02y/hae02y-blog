import Link from 'next/link';

interface EssayTabsProps {
  active: 'essay' | 'books';
}

const TABS: { key: EssayTabsProps['active']; label: string; href: string }[] = [
  { key: 'essay', label: '에세이', href: '/Insight/' },
  { key: 'books', label: '서재', href: '/Insight/books/' },
];

export default function EssayTabs({ active }: EssayTabsProps) {
  return (
    <nav className="mb-7 flex justify-center md:mb-9">
      <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/60 p-1 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
        {TABS.map(tab => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full px-5 py-2 text-sm font-medium tracking-[-0.01em] transition md:px-6 ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
