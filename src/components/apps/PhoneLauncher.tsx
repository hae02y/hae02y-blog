'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import AppIcon from './AppIcon';
import styles from './PhoneLauncher.module.css';

type LauncherApp = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  href: string;
  category: string;
  icon: string;
  iconImage: string | null;
};

type GestureStart = { x: number; y: number; interactive: boolean };

export default function PhoneLauncher({ apps }: { apps: LauncherApp[] }) {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [query, setQuery] = useState('');
  const gestureStart = useRef<GestureStart | null>(null);
  const filteredApps = apps.filter(app => `${app.name} ${app.shortName} ${app.category} ${app.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const splitIndex = Math.ceil(filteredApps.length / 2);
  const leftApps = filteredApps.slice(0, splitIndex);
  const rightApps = filteredApps.slice(splitIndex);

  useEffect(() => {
    const landscape = window.matchMedia('(max-width: 900px) and (orientation: landscape)');
    const syncFold = () => setIsUnfolded(landscape.matches);
    syncFold();
    landscape.addEventListener('change', syncFold);
    return () => landscape.removeEventListener('change', syncFold);
  }, []);

  function finishGesture(x: number, y: number) {
    const start = gestureStart.current;
    gestureStart.current = null;
    if (!start || start.interactive) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) < 68 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    if (window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches) return;
    setIsUnfolded(dx > 0);
  }

  function gestureHandlers() {
    return {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse') return;
        gestureStart.current = {
          x: event.clientX,
          y: event.clientY,
          interactive: Boolean((event.target as HTMLElement).closest('a, button, input, label')),
        };
      },
      onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') finishGesture(event.clientX, event.clientY);
      },
      onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
        gestureStart.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          interactive: Boolean((event.target as HTMLElement).closest('a, button, input, label')),
        };
      },
      onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => {
        finishGesture(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      },
    };
  }

  const appTile = (app: LauncherApp, visible: boolean) => (
    <a key={app.id} className={styles.appTile} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} 열기 (새 탭)`} title={app.name} tabIndex={visible ? 0 : -1}>
      <span className={styles.iconWrap}>
        <AppIcon icon={app.icon} image={app.iconImage} iconSize={30} className={styles.appIcon} />
        <ArrowUpRight className={styles.appArrow} size={16} aria-hidden="true" />
      </span>
      <strong>{app.shortName || app.name}</strong>
    </a>
  );

  const searchBox = (label: string, visible: boolean) => (
    <label className={styles.searchBox}>
      <Search size={15} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="앱 검색" aria-label={label} tabIndex={visible ? 0 : -1} />
    </label>
  );

  return (
    <section className={styles.stage} aria-label="접이식 앱 목록">
      <div className={`${styles.device}${isUnfolded ? ` ${styles.isOpen}` : ''}`}>
        <div className={styles.camera} aria-hidden="true" />
        <div className={styles.coverScreen} {...gestureHandlers()}>
          <div className={`${styles.coverContent}${isUnfolded ? ` ${styles.contentHidden}` : ''}`} aria-hidden={isUnfolded}>
            <p className={styles.kicker}>HAE02Y / APPS</p>
            <h2>만든 앱들<span className={styles.count}>{apps.length}</span></h2>
            {searchBox('접힌 화면에서 앱 검색', !isUnfolded)}
            <div className={styles.appGrid}>
              {filteredApps.map(app => appTile(app, !isUnfolded))}
              {filteredApps.length === 0 && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
            <p className={styles.coverHint}><span className={styles.desktopHint}>화면을 오른쪽으로 밀어 펼치기</span><span className={styles.mobileHint}>가로로 돌려 펼치기</span><ChevronsRight size={16} aria-hidden="true" /></p>
          </div>
          <div className={`${styles.openContent}${isUnfolded ? ` ${styles.contentVisible}` : ''}`} aria-hidden={!isUnfolded}>
            <div className={styles.openHeader}><span>HAE02Y / APPS</span><strong>{filteredApps.length} APPS</strong></div>
            <h2>만든 앱들</h2>
            {searchBox('펼친 화면에서 앱 검색', isUnfolded)}
            <div className={styles.appGrid}>
              {leftApps.map(app => appTile(app, isUnfolded))}
              {filteredApps.length === 0 && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
          </div>
        </div>
        <div className={styles.hinge} aria-hidden="true" />
        <div className={styles.innerScreen} aria-hidden={!isUnfolded} {...gestureHandlers()}>
          <div className={styles.innerContent}>
            <div className={styles.openHeader}><span>APP COLLECTION</span><ArrowUpRight size={16} aria-hidden="true" /></div>
            <h2>앱 목록</h2>
            <p className={styles.innerCount}>{filteredApps.length}개 앱을 둘러보세요.</p>
            <div className={styles.appGrid}>{rightApps.map(app => appTile(app, isUnfolded))}</div>
          </div>
        </div>
        <button
          type="button"
          className={styles.foldToggle}
          onClick={() => setIsUnfolded(value => !value)}
          aria-label={isUnfolded ? '듀오 접기' : '듀오 펼치기'}
          aria-expanded={isUnfolded}
        >
          {isUnfolded ? <ChevronsLeft size={22} /> : <ChevronsRight size={22} />}
          <span>{isUnfolded ? '접기' : '펼치기'}</span>
        </button>
      </div>
      <p className={styles.instructions}>마우스를 올려 펼치기 · 좌우로 밀어 접고 펼치기 · 모바일은 가로로 돌리기</p>
    </section>
  );
}
