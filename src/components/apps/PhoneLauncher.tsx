'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  const gestureStart = useRef<GestureStart | null>(null);
  const splitIndex = Math.ceil(apps.length / 2);
  const leftApps = apps.slice(0, splitIndex);
  const rightApps = apps.slice(splitIndex);

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
          interactive: Boolean((event.target as HTMLElement).closest('a, button')),
        };
      },
      onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') finishGesture(event.clientX, event.clientY);
      },
      onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
        gestureStart.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          interactive: Boolean((event.target as HTMLElement).closest('a, button')),
        };
      },
      onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => {
        finishGesture(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      },
    };
  }

  const appCard = (app: LauncherApp) => (
    <a key={app.id} className={styles.appCard} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} 열기 (새 탭)`}>
      <AppIcon icon={app.icon} image={app.iconImage} iconSize={26} className={styles.cardIcon} />
      <span className={styles.cardCopy}>
        <small>{app.category}</small>
        <strong>{app.name}</strong>
        <span>{app.description}</span>
      </span>
      <ArrowUpRight className={styles.cardArrow} size={18} aria-hidden="true" />
    </a>
  );

  return (
    <section className={styles.stage} aria-label="접이식 앱 목록">
      <div className={`${styles.device}${isUnfolded ? ` ${styles.isOpen}` : ''}`}>
        <div className={styles.camera} aria-hidden="true" />
        <div className={styles.coverScreen} {...gestureHandlers()}>
          <div className={`${styles.coverContent}${isUnfolded ? ` ${styles.contentHidden}` : ''}`} aria-hidden={isUnfolded}>
            <p className={styles.kicker}>HAE02Y / APPS</p>
            <h2>만든 앱들<span className={styles.count}>{apps.length}</span></h2>
            <div className={styles.coverGrid}>
              {apps.slice(0, 6).map(app => (
                <a key={app.id} className={styles.coverApp} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} 열기 (새 탭)`}>
                  <span className={styles.coverIconWrap}>
                    <AppIcon icon={app.icon} image={app.iconImage} iconSize={31} className={styles.coverIcon} />
                    <ArrowUpRight className={styles.coverArrow} size={17} aria-hidden="true" />
                  </span>
                  <strong>{app.shortName || app.name}</strong>
                  <small>{app.category}</small>
                </a>
              ))}
              {apps.length === 0 && <p className={styles.empty}>아직 공개된 앱이 없습니다.</p>}
            </div>
            {apps.length > 6 && <p className={styles.moreApps}>펼치면 모든 앱을 볼 수 있습니다.</p>}
            <p className={styles.coverHint}><span className={styles.desktopHint}>화면을 오른쪽으로 밀어 펼치기</span><span className={styles.mobileHint}>가로로 돌려 펼치기</span><ChevronsRight size={16} aria-hidden="true" /></p>
          </div>
          <div className={`${styles.openContent}${isUnfolded ? ` ${styles.contentVisible}` : ''}`} aria-hidden={!isUnfolded}>
            <div className={styles.openHeader}><span>01 / APPS</span><strong>{apps.length} APPS</strong></div>
            <h2>앱을 펼쳐보다.</h2>
            <div className={styles.appList}>{leftApps.map(appCard)}</div>
            {apps.length === 0 && <p className={styles.empty}>아직 공개된 앱이 없습니다.</p>}
          </div>
        </div>
        <div className={styles.hinge} aria-hidden="true" />
        <div className={styles.innerScreen} aria-hidden={!isUnfolded} {...gestureHandlers()}>
          <div className={styles.innerContent}>
            <div className={styles.openHeader}><span>02 / COLLECTION</span><ArrowUpRight size={16} aria-hidden="true" /></div>
            <h2>지금 열어볼 앱.</h2>
            <div className={styles.appList}>{rightApps.map(appCard)}</div>
            {rightApps.length === 0 && <p className={styles.empty}>왼쪽 화면에서 앱을 살펴보세요.</p>}
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
