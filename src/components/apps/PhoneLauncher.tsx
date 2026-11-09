'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BatteryFull, Check, ChevronsLeft, ChevronsRight, Copy, Search, Wifi } from 'lucide-react';
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
  addedAt: string;
};

type GestureStart = { x: number; y: number; interactive: boolean };
type MenuPosition = { x: number; y: number };
const STORAGE_KEY = 'hae02y-app-order';
const OPENED_APPS_KEY = 'hae02y-opened-apps';
const NEW_APP_DAYS = 30;

export default function PhoneLauncher({ apps }: { apps: LauncherApp[] }) {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [query, setQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDirection, setPageDirection] = useState(1);
  const [clock, setClock] = useState('9:41');
  const [appsPerScreen, setAppsPerScreen] = useState(16);
  const [orderedIds, setOrderedIds] = useState(() => apps.map(app => app.id));
  const [isEditing, setIsEditing] = useState(false);
  const [menuAppId, setMenuAppId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropId, setDropId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newAppIds, setNewAppIds] = useState<number[]>([]);
  const gestureStart = useRef<GestureStart | null>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appPointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const backgroundPointer = useRef<{ x: number; y: number } | null>(null);
  const dragIdRef = useRef<number | null>(null);
  const dropIdRef = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const order = new Map(orderedIds.map((id, index) => [id, index]));
  const orderedApps = [...apps].sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER));
  const filteredApps = orderedApps.filter(app => `${app.name} ${app.shortName} ${app.category} ${app.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const pageSize = appsPerScreen * (isUnfolded ? 2 : 1);
  const pageCount = Math.max(1, Math.ceil(filteredApps.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const visibleApps = filteredApps.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const leftApps = visibleApps.slice(0, appsPerScreen);
  const rightApps = visibleApps.slice(appsPerScreen);
  const menuApp = apps.find(app => app.id === menuAppId);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
      if (Array.isArray(saved)) {
        const validIds = [...new Set(saved.filter((id): id is number => typeof id === 'number' && apps.some(app => app.id === id)))];
        setOrderedIds([...validIds, ...apps.map(app => app.id).filter(id => !validIds.includes(id))]);
      }
    } catch {
      // Keep the published order if local storage is unavailable.
    }
  }, [apps]);

  useEffect(() => {
    let openedIds: number[] = [];
    try {
      const saved = JSON.parse(localStorage.getItem(OPENED_APPS_KEY) ?? '[]') as unknown;
      if (Array.isArray(saved)) openedIds = saved.filter((id): id is number => typeof id === 'number');
    } catch {
      // Keep recent badges when local storage is unavailable.
    }
    const cutoff = Date.now() - NEW_APP_DAYS * 24 * 60 * 60 * 1000;
    setNewAppIds(apps.filter(app => Date.parse(app.addedAt) >= cutoff && !openedIds.includes(app.id)).map(app => app.id));
  }, [apps]);

  function markAppOpened(id: number) {
    setNewAppIds(ids => ids.filter(value => value !== id));
    try {
      const saved = JSON.parse(localStorage.getItem(OPENED_APPS_KEY) ?? '[]') as unknown;
      const ids = Array.isArray(saved) ? saved.filter((value): value is number => typeof value === 'number') : [];
      localStorage.setItem(OPENED_APPS_KEY, JSON.stringify([...new Set([...ids, id])]));
    } catch { /* Storage may be disabled. */ }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuAppId !== null) setMenuAppId(null);
      else if (isEditing) setIsEditing(false);
      else if (query) setQuery('');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEditing, menuAppId, query]);

  useEffect(() => {
    const landscape = window.matchMedia('(max-width: 900px) and (orientation: landscape)');
    const syncFold = () => { setIsUnfolded(landscape.matches); setMenuAppId(null); };
    const syncPageSize = () => {
      if (window.matchMedia('(max-width: 900px) and (max-height: 500px) and (orientation: landscape)').matches) setAppsPerScreen(12);
      else if (window.matchMedia('(max-width: 767px) and (min-height: 760px) and (orientation: portrait)').matches) setAppsPerScreen(24);
      else setAppsPerScreen(16);
    };
    syncFold();
    syncPageSize();
    landscape.addEventListener('change', syncFold);
    window.addEventListener('resize', syncPageSize);
    return () => { landscape.removeEventListener('change', syncFold); window.removeEventListener('resize', syncPageSize); };
  }, []);

  useEffect(() => {
    const syncClock = () => setClock(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    syncClock();
    const interval = window.setInterval(syncClock, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  function clearHold() {
    if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  function blockNextClick() {
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 700);
  }

  function moveApp(fromId: number, toId: number) {
    if (fromId === toId) return;
    const next = [...orderedIds];
    const fromIndex = next.indexOf(fromId);
    const toIndex = next.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) return;
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, fromId);
    setOrderedIds(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage may be disabled. */ }
  }

  function changePage(index: number) {
    setPageDirection(index >= currentPage ? 1 : -1);
    setPageIndex(index);
    setMenuAppId(null);
  }

  function startAppPointer(event: React.PointerEvent<HTMLAnchorElement>, id: number) {
    appPointer.current = { x: event.clientX, y: event.clientY, id };
    setDragOffset({ x: 0, y: 0 });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (isEditing) {
      dragIdRef.current = id;
      setDraggedId(id);
      return;
    }
    clearHold();
    holdTimer.current = setTimeout(() => {
      setIsEditing(true);
      dragIdRef.current = id;
      setDraggedId(id);
      setMenuAppId(null);
      blockNextClick();
      if (navigator.vibrate) navigator.vibrate(12);
    }, 520);
  }

  function moveAppPointer(event: React.PointerEvent<HTMLAnchorElement>) {
    const start = appPointer.current;
    if (!start) return;
    const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (distance > 10) clearHold();
    if (dragIdRef.current === null) return;
    setDragOffset({ x: event.clientX - start.x, y: event.clientY - start.y });
    if (distance < 8) return;
    const target = document.elementsFromPoint(event.clientX, event.clientY)
      .map(element => element.closest<HTMLElement>('[data-app-id]'))
      .find(element => element && Number(element.dataset.appId) !== dragIdRef.current);
    const id = target ? Number(target.dataset.appId) : null;
    dropIdRef.current = id;
    setDropId(id);
  }

  function endAppPointer(cancelled = false) {
    clearHold();
    if (!cancelled && dragIdRef.current !== null && dropIdRef.current !== null) moveApp(dragIdRef.current, dropIdRef.current);
    if (dragIdRef.current !== null) blockNextClick();
    dragIdRef.current = null;
    dropIdRef.current = null;
    appPointer.current = null;
    setDraggedId(null);
    setDropId(null);
    setDragOffset({ x: 0, y: 0 });
  }

  function openMenu(event: React.MouseEvent<HTMLAnchorElement>, id: number) {
    event.preventDefault();
    clearHold();
    if (window.matchMedia('(hover: none)').matches) {
      setIsEditing(true);
      blockNextClick();
      return;
    }
    const bounds = deviceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setMenuPosition({
      x: Math.min(Math.max(event.clientX - bounds.left, 10), bounds.width - 195),
      y: Math.min(Math.max(event.clientY - bounds.top, 10), Math.max(10, bounds.height - 210)),
    });
    setMenuAppId(id);
    setCopied(false);
  }

  function finishGesture(x: number, y: number) {
    const start = gestureStart.current;
    gestureStart.current = null;
    if (!start || start.interactive || isEditing || menuAppId !== null) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) < 68 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    blockNextClick();
    if (dx < 0 && currentPage < pageCount - 1) changePage(currentPage + 1);
    else if (dx > 0 && currentPage > 0) changePage(currentPage - 1);
    else if (!window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches && dx > 0) setIsUnfolded(value => !value);
  }

  function gestureHandlers() {
    return {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        const interactive = Boolean((event.target as HTMLElement).closest('a, button, input, label'));
        if (event.pointerType === 'mouse') gestureStart.current = { x: event.clientX, y: event.clientY, interactive };
        if (interactive || isEditing) return;
        backgroundPointer.current = { x: event.clientX, y: event.clientY };
        clearHold();
        holdTimer.current = setTimeout(() => { setIsEditing(true); blockNextClick(); }, 520);
      },
      onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
        const start = backgroundPointer.current;
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) {
          clearHold();
          backgroundPointer.current = null;
        }
      },
      onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
        clearHold();
        backgroundPointer.current = null;
        if (event.pointerType === 'mouse') finishGesture(event.clientX, event.clientY);
      },
      onPointerCancel: () => { clearHold(); backgroundPointer.current = null; },
      onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
        gestureStart.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          interactive: Boolean((event.target as HTMLElement).closest('button, input, label')),
        };
      },
      onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => {
        finishGesture(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      },
    };
  }

  const appTile = (app: LauncherApp, visible: boolean) => (
    <a
      key={app.id}
      data-app-id={app.id}
      className={`${styles.appTile}${isEditing ? ` ${styles.jiggling}` : ''}${draggedId === app.id ? ` ${styles.dragged}` : ''}${dropId === app.id && draggedId !== app.id ? ` ${styles.dropTarget}` : ''}`}
      style={draggedId === app.id ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` } : undefined}
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${newAppIds.includes(app.id) ? '새 앱, ' : ''}${app.name} 열기 (새 탭)`}
      title={app.name}
      tabIndex={visible ? 0 : -1}
      draggable={false}
      onClick={event => {
        if (isEditing || suppressClick.current) event.preventDefault();
        else markAppOpened(app.id);
        suppressClick.current = false;
      }}
      onContextMenu={event => openMenu(event, app.id)}
      onKeyDown={event => {
        if (!isEditing) return;
        const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[event.key];
        if (offset === undefined) return;
        event.preventDefault();
        const index = orderedIds.indexOf(app.id);
        const target = orderedIds[index + offset];
        if (target !== undefined) moveApp(app.id, target);
      }}
      onPointerDown={event => startAppPointer(event, app.id)}
      onPointerMove={moveAppPointer}
      onPointerUp={() => endAppPointer()}
      onPointerCancel={() => endAppPointer(true)}
    >
      <span className={styles.iconWrap}>
        <AppIcon icon={app.icon} image={app.iconImage} iconSize={30} className={styles.appIcon} />
        <ArrowUpRight className={styles.appArrow} size={16} aria-hidden="true" />
      </span>
      <span className={styles.appLabel}>
        <strong>{app.shortName || app.name}</strong>
        {newAppIds.includes(app.id) && <span className={styles.newDot} aria-hidden="true" />}
      </span>
    </a>
  );

  const searchBox = (label: string, visible: boolean) => (
    <label className={styles.searchBox}>
      <Search size={15} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input value={query} onFocus={() => { setIsEditing(false); setMenuAppId(null); }} onChange={event => { setQuery(event.target.value); setPageIndex(0); }} placeholder="앱 검색" aria-label={label} tabIndex={visible ? 0 : -1} />
    </label>
  );

  const pageDots = pageCount > 1 && (
    <div className={styles.pageDots} aria-label="앱 페이지">
      {Array.from({ length: pageCount }, (_, index) => (
        <button key={index} type="button" className={index === currentPage ? styles.activeDot : ''} onClick={() => changePage(index)} aria-label={`${index + 1}페이지`} aria-current={index === currentPage ? 'page' : undefined} />
      ))}
    </div>
  );

  const statusIcons = (
    <span className={styles.statusIcons} aria-hidden="true">
      <span className={styles.cellular}><i /><i /><i /><i /></span>
      <Wifi size={15} strokeWidth={2.5} />
      <BatteryFull size={19} strokeWidth={2.3} />
    </span>
  );

  return (
    <section className={styles.stage} aria-label={`접이식 앱 목록, 앱 ${apps.length}개`}>
      <div ref={deviceRef} className={`${styles.device}${isUnfolded ? ` ${styles.isOpen}` : ''}`} onPointerDownCapture={event => { if (menuAppId !== null && !(event.target as HTMLElement).closest('[role="menu"]')) setMenuAppId(null); }} onClick={event => { if (isEditing && !(event.target as HTMLElement).closest('[data-app-id], button, input, label')) setIsEditing(false); }}>
        <div className={styles.camera} aria-hidden="true" />
        <div className={styles.coverScreen} {...gestureHandlers()}>
          <div className={`${styles.coverContent}${isUnfolded ? ` ${styles.contentHidden}` : ''}`} aria-hidden={isUnfolded}>
            <div className={styles.statusBar}><span aria-hidden="true">{clock}</span>{isEditing ? <button type="button" className={styles.doneButton} onClick={() => setIsEditing(false)}>완료</button> : statusIcons}</div>
            <div key={`cover-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>
              {visibleApps.map(app => appTile(app, !isUnfolded))}
              {filteredApps.length === 0 && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
            {pageDots}
            {searchBox('접힌 화면에서 앱 검색', !isUnfolded)}
          </div>
          <div className={`${styles.openContent}${isUnfolded ? ` ${styles.contentVisible}` : ''}`} aria-hidden={!isUnfolded}>
            <div className={styles.statusBar}><span aria-hidden="true">{clock}</span>{isEditing && <button type="button" className={styles.doneButton} onClick={() => setIsEditing(false)}>완료</button>}</div>
            <div key={`left-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>
              {leftApps.map(app => appTile(app, isUnfolded))}
              {filteredApps.length === 0 && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
            {pageDots}
            {searchBox('펼친 화면에서 앱 검색', isUnfolded)}
          </div>
        </div>
        <div className={styles.hinge} aria-hidden="true" />
        <div className={styles.innerScreen} aria-hidden={!isUnfolded} {...gestureHandlers()}>
          <div className={styles.innerContent}>
            <div className={`${styles.statusBar} ${styles.rightStatus}`} aria-hidden="true">{statusIcons}</div>
            <div key={`right-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>{rightApps.map(app => appTile(app, isUnfolded))}</div>
            <span className={styles.homeIndicator} aria-hidden="true" />
          </div>
        </div>
        {menuApp && <div className={styles.quickMenu} style={{ left: menuPosition.x, top: menuPosition.y }} role="menu" aria-label={`${menuApp.name} 메뉴`}>
          <strong>{menuApp.name}</strong>
          <a href={menuApp.href} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => { markAppOpened(menuApp.id); setMenuAppId(null); }}><ArrowUpRight size={16} />앱 열기</a>
          <button type="button" role="menuitem" onClick={async () => { try { await navigator.clipboard.writeText(menuApp.href); setCopied(true); } catch { setCopied(false); } }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '복사됨' : '링크 복사'}</button>
          <button type="button" role="menuitem" onClick={() => { setIsEditing(true); setMenuAppId(null); }}>홈 화면 편집</button>
          <button type="button" role="menuitem" onClick={() => { const ids = apps.map(app => app.id); setOrderedIds(ids); try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ } setMenuAppId(null); }}>기본 정렬로</button>
        </div>}
        <button
          type="button"
          className={styles.foldToggle}
          onClick={() => { setMenuAppId(null); setIsUnfolded(value => !value); }}
          aria-label={isUnfolded ? '듀오 접기' : '듀오 펼치기'}
          aria-expanded={isUnfolded}
        >
          {isUnfolded ? <ChevronsLeft size={22} /> : <ChevronsRight size={22} />}
          <span>{isUnfolded ? '접기' : '펼치기'}</span>
        </button>
      </div>
      <p className={styles.instructions}>아이콘 길게 눌러 정렬 · 좌우로 밀어 페이지 이동 · 마우스를 올려 펼치기 · 모바일은 가로로 돌리기</p>
    </section>
  );
}
