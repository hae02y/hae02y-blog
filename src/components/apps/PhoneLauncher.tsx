'use client';

import { useEffect, useRef, useState } from 'react';
import { Plane, BatteryFull, Bluetooth, ChevronRight, Flashlight, Focus, LockKeyhole, Search, Signal, Sun, Volume2, Wifi, X } from 'lucide-react';
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

type Screen = 'home' | 'library' | 'search' | 'control' | 'locked';

const shortcuts = [
  { name: '블로그', href: '/blog/', mark: 'B', color: 'blog' },
  { name: '소개', href: '/about/', mark: 'h.', color: 'about' },
];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: false }).format(date);
}

export default function PhoneLauncher({ apps }: { apps: LauncherApp[] }) {
  const [screen, setScreen] = useState<Screen>('home');
  const [time, setTime] = useState('9:41');
  const [dateLabel, setDateLabel] = useState('');
  const [query, setQuery] = useState('');
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [focus, setFocus] = useState(false);
  const [brightness, setBrightness] = useState(76);
  const [volume, setVolume] = useState(48);
  const [flashlight, setFlashlight] = useState(false);
  const gestureStart = useRef<{ x: number; y: number; screen: Screen; interactive: boolean } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(formatTime(now));
      setDateLabel(new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(now));
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen === 'search') searchRef.current?.focus();
  }, [screen]);

  const filteredApps = apps.filter(app => `${app.name} ${app.shortName} ${app.description} ${app.category}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

  function onGestureEnd(x: number, y: number) {
    const start = gestureStart.current;
    gestureStart.current = null;
    if (!start || start.interactive) return;

    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 55) return;

    if (Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (start.screen === 'home' && dx < 0) setScreen('library');
      if (start.screen === 'library' && dx > 0) setScreen('home');
      return;
    }

    if (dy < 0) {
      if (start.screen !== 'home') setScreen('home');
    } else if (start.y < 90 && start.x > 180 && start.screen !== 'locked') {
      setScreen('control');
    } else if (start.screen === 'home' || start.screen === 'library') {
      setScreen('search');
    } else if (start.screen === 'search' || start.screen === 'control') {
      setScreen('home');
    }
  }

  const appLink = (app: LauncherApp, compact = false) => (
    <a key={app.id} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} 열기 (새 탭)`} className={compact ? styles.libraryApp : styles.app}>
      <AppIcon icon={app.icon} image={app.iconImage} iconSize={29} className={styles.appIcon} />
      {compact ? <span className={styles.libraryName}>{app.name}<small>{app.category}</small></span> : <span className={styles.appName}>{app.shortName}</span>}
    </a>
  );

  return (
    <section className={styles.stage} aria-label="인터랙티브 앱 홈 화면">
      <div className={styles.device}>
        <button type="button" className={styles.powerButton} onClick={() => setScreen(screen === 'locked' ? 'home' : 'locked')} aria-label={screen === 'locked' ? '잠금 해제' : '화면 잠금'} title={screen === 'locked' ? '잠금 해제' : '화면 잠금'} />
        <div className={styles.volumeButtons} aria-hidden="true"><i /><i /></div>
        <div
          className={styles.screen}
          onPointerDown={event => {
            if (event.pointerType !== 'mouse') return;
            const bounds = event.currentTarget.getBoundingClientRect();
            gestureStart.current = {
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
              screen,
              interactive: Boolean((event.target as HTMLElement).closest('a, button, input, label')) && !(event.target as HTMLElement).classList.contains(styles.controlHotspot),
            };
          }}
          onPointerUp={event => {
            if (event.pointerType !== 'mouse') return;
            const bounds = event.currentTarget.getBoundingClientRect();
            onGestureEnd(event.clientX - bounds.left, event.clientY - bounds.top);
          }}
          onTouchStart={event => {
            const bounds = event.currentTarget.getBoundingClientRect();
            gestureStart.current = {
              x: event.touches[0].clientX - bounds.left,
              y: event.touches[0].clientY - bounds.top,
              screen,
              interactive: Boolean((event.target as HTMLElement).closest('a, button, input, label')) && !(event.target as HTMLElement).classList.contains(styles.controlHotspot),
            };
          }}
          onTouchEnd={event => {
            const bounds = event.currentTarget.getBoundingClientRect();
            onGestureEnd(event.changedTouches[0].clientX - bounds.left, event.changedTouches[0].clientY - bounds.top);
          }}
        >
          <div className={styles.wallpaper} aria-hidden="true"><div className={styles.orbOne} /><div className={styles.orbTwo} /><div className={styles.glow} /></div>
          <div className={styles.island} aria-hidden="true"><span /></div>
          <div className={styles.statusBar}>
            <span>{time}</span>
            <div className={styles.statusRight}>
              <Signal size={14} fill="currentColor" aria-label="신호" />
              <Wifi size={16} aria-label="Wi-Fi" className={!wifi || airplane ? styles.dimmed : ''} />
              <BatteryFull size={20} fill="currentColor" aria-label="배터리" />
            </div>
          </div>

          {screen === 'locked' && (
            <div className={styles.lockScreen}>
              <LockKeyhole size={18} strokeWidth={1.8} />
              <span className={styles.lockDate}>{dateLabel}</span>
              <strong className={styles.lockTime}>{time}</strong>
              <button type="button" className={styles.unlockButton} onClick={() => setScreen('home')}>위로 쓸어 올리거나 눌러 잠금 해제 <ChevronRight size={15} /></button>
            </div>
          )}

          {screen === 'home' && (
            <div className={styles.homeScreen}>
              <div className={styles.heroWidget}>
                <div className={styles.widgetTop}><span>HAE02Y SPACE</span><span className={styles.widgetSparkle}>✳</span></div>
                <div><span className={styles.widgetDate}>{dateLabel}</span><strong className={styles.widgetTime}>{time}</strong></div>
                <span className={styles.widgetBottom}>내가 만든 앱 {apps.length}개 <ChevronRight size={14} /></span>
              </div>
              <div className={styles.appGrid}>
                {apps.slice(0, 10).map(app => appLink(app))}
                {shortcuts.map(item => <a key={item.name} href={item.href} className={styles.app} aria-label={`${item.name} 열기`}><span className={`${styles.appIcon} ${styles[item.color]}`}>{item.mark}</span><span className={styles.appName}>{item.name}</span></a>)}
              </div>
            </div>
          )}

          {screen === 'library' && (
            <div className={styles.libraryScreen}>
              <div className={styles.panelHeading}><span>앱 보관함</span><button type="button" onClick={() => setScreen('home')} aria-label="홈으로 돌아가기"><X size={18} /></button></div>
              <button type="button" className={styles.librarySearch} onClick={() => setScreen('search')}><Search size={17} /> 앱 검색</button>
              <p className={styles.libraryCaption}>MADE BY HAE02Y · {apps.length} APPS</p>
              <div className={styles.libraryList}>{apps.map(app => appLink(app, true))}{apps.length === 0 && <span className={styles.empty}>아직 공개된 앱이 없습니다.</span>}</div>
            </div>
          )}

          {screen === 'search' && (
            <div className={styles.searchScreen}>
              <div className={styles.searchTop}><label className={styles.searchInputWrap}><Search size={18} /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="앱 검색" aria-label="앱 검색" /></label><button type="button" onClick={() => { setQuery(''); setScreen('home'); }}>취소</button></div>
              <p className={styles.libraryCaption}>검색 결과</p>
              <div className={styles.libraryList}>{filteredApps.map(app => appLink(app, true))}{filteredApps.length === 0 && <span className={styles.empty}>일치하는 앱이 없습니다.</span>}</div>
            </div>
          )}

          {screen === 'control' && (
            <div className={styles.controlScreen}>
              <div className={styles.panelHeading}><span>제어 센터</span><button type="button" onClick={() => setScreen('home')} aria-label="제어 센터 닫기"><X size={18} /></button></div>
              <p className={styles.controlDate}>{dateLabel}</p>
              <div className={styles.controlGrid}>
                <div className={styles.connectivity}>
                  <button type="button" className={airplane ? styles.active : ''} onClick={() => setAirplane(!airplane)} aria-pressed={airplane}><Plane size={20} /><span>에어플레인</span></button>
                  <button type="button" className={wifi && !airplane ? styles.active : ''} onClick={() => { setWifi(!wifi); if (airplane) setAirplane(false); }} aria-pressed={wifi && !airplane}><Wifi size={20} /><span>Wi-Fi</span></button>
                  <button type="button" className={bluetooth ? styles.active : ''} onClick={() => setBluetooth(!bluetooth)} aria-pressed={bluetooth}><Bluetooth size={20} /><span>Bluetooth</span></button>
                  <button type="button" className={focus ? styles.active : ''} onClick={() => setFocus(!focus)} aria-pressed={focus}><Focus size={20} /><span>집중 모드</span></button>
                </div>
                <div className={styles.sliderGroup}>
                  <label className={styles.sliderTile}><Sun size={21} /><span>밝기 {brightness}%</span><input type="range" min="15" max="100" value={brightness} onChange={event => setBrightness(Number(event.target.value))} aria-label="화면 밝기" /></label>
                  <label className={styles.sliderTile}><Volume2 size={21} /><span>음량 {volume}%</span><input type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="음량" /></label>
                </div>
              </div>
              <div className={styles.controlBottom}><button type="button" className={flashlight ? styles.active : ''} onClick={() => setFlashlight(!flashlight)} aria-pressed={flashlight}><Flashlight size={20} /> 손전등</button><button type="button" onClick={() => setScreen('locked')}><LockKeyhole size={20} /> 잠금</button></div>
              <p className={styles.controlNote}>이 화면 안에서 동작하는 데모 컨트롤입니다.</p>
            </div>
          )}

          {(screen === 'home' || screen === 'library') && (
            <div className={styles.bottomArea}>
              <div className={styles.pageDots}><button type="button" className={screen === 'home' ? styles.currentDot : ''} onClick={() => setScreen('home')} aria-label="홈 화면" aria-current={screen === 'home' ? 'page' : undefined} /><button type="button" className={screen === 'library' ? styles.currentDot : ''} onClick={() => setScreen('library')} aria-label="앱 보관함" aria-current={screen === 'library' ? 'page' : undefined} /></div>
              <button type="button" className={styles.searchPill} onClick={() => setScreen('search')}><Search size={13} /> 검색</button>
              <div className={styles.dock}>
                <a href="/" className={`${styles.dockIcon} ${styles.dockHome}`} aria-label="블로그 홈">h.</a>
                <a href="/blog/" className={`${styles.dockIcon} ${styles.dockBlog}`} aria-label="기술 글">B</a>
                <a href="/about/?tab=portfolio" className={`${styles.dockIcon} ${styles.dockAbout}`} aria-label="포트폴리오">P</a>
                <button type="button" className={`${styles.dockIcon} ${styles.dockSearch}`} onClick={() => setScreen('search')} aria-label="앱 검색"><Search size={22} /></button>
              </div>
            </div>
          )}

          <div className={styles.brightnessShade} style={{ opacity: (100 - brightness) / 150 }} aria-hidden="true" />
          {screen !== 'locked' && <button type="button" className={styles.controlHotspot} onClick={() => setScreen('control')} aria-label="제어 센터 열기" title="제어 센터 열기" />}
          <button type="button" className={styles.homeIndicator} onClick={() => setScreen('home')} aria-label={screen === 'locked' ? '잠금 해제하고 홈으로' : '홈 화면으로'} />
        </div>
      </div>
      <div className={styles.phoneHints}>← 앱 보관함 · 화면 아래로 검색 · 오른쪽 위에서 아래로 제어 센터 · 위로 홈</div>
    </section>
  );
}
