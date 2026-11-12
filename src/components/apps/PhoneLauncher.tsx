'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BatteryFull, Check, ChevronUp, ChevronsLeft, ChevronsRight, Copy, Search, Wifi, X } from 'lucide-react';
import AppIcon from './AppIcon';
import styles from './PhoneLauncher.module.css';

type LauncherApp = {
  id: number;
  name: string;
  shortName: string;
  description: string;
  href: string;
  category: string;
  kind: string;
  platforms: string[];
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
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [query, setQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDirection, setPageDirection] = useState(1);
  const [clock, setClock] = useState('9:41');
  const [appsPerScreen, setAppsPerScreen] = useState(16);
  const [orderedIds, setOrderedIds] = useState(() => apps.map(app => app.id));
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [menuAppId, setMenuAppId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropId, setDropId] = useState<number | null>(null);
  const [edgeTargetPage, setEdgeTargetPage] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [launchingId, setLaunchingId] = useState<number | null>(null);
  const [newAppIds, setNewAppIds] = useState<number[]>([]);
  const [infoAppId, setInfoAppId] = useState<number | null>(null);
  const [islandAppId, setIslandAppId] = useState<number | null>(null);
  const [infoPosition, setInfoPosition] = useState({ x: 12, y: 12 });
  const gestureStart = useRef<GestureStart | null>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const infoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const islandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockPointer = useRef<{ x: number; y: number } | null>(null);
  const appPointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const backgroundPointer = useRef<{ x: number; y: number } | null>(null);
  const dragIdRef = useRef<number | null>(null);
  const dropIdRef = useRef<number | null>(null);
  const edgeTargetPageRef = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const order = new Map(orderedIds.map((id, index) => [id, index]));
  const orderedApps = [...apps].sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER));
  const hasQuery = query.trim().length > 0;
  const filteredApps = orderedApps.filter(app => `${app.name} ${app.shortName} ${app.category} ${app.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const dockApps = hasQuery ? [] : orderedApps.slice(0, 4);
  const gridApps = hasQuery ? filteredApps : filteredApps.slice(dockApps.length);
  const pageSize = appsPerScreen * (isUnfolded ? 2 : 1);
  const pageCount = Math.max(1, Math.ceil(gridApps.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const visibleApps = gridApps.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const leftApps = visibleApps.slice(0, appsPerScreen);
  const rightApps = visibleApps.slice(appsPerScreen);
  const menuApp = apps.find(app => app.id === menuAppId);
  const infoApp = apps.find(app => app.id === infoAppId);
  const islandApp = apps.find(app => app.id === islandAppId);
  const selectedApp = apps.find(app => app.id === selectedAppId);
  const selectedIndex = selectedAppId === null ? -1 : filteredApps.findIndex(app => app.id === selectedAppId);

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

  function animateAppOpen(id: number) {
    if (launchTimer.current !== null) clearTimeout(launchTimer.current);
    setLaunchingId(id);
    launchTimer.current = setTimeout(() => setLaunchingId(null), 240);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuAppId !== null) setMenuAppId(null);
      else if (isEditing) { setIsEditing(false); setSelectedAppId(null); }
      else if (infoAppId !== null) setInfoAppId(null);
      else if (query) setQuery('');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [infoAppId, isEditing, menuAppId, query]);

  useEffect(() => {
    const landscape = window.matchMedia('(max-height: 500px) and (orientation: landscape) and (pointer: coarse)');
    const syncFold = () => { setIsUnfolded(landscape.matches); setMenuAppId(null); setInfoAppId(null); setIslandAppId(null); };
    const syncPageSize = () => {
      if (landscape.matches) setAppsPerScreen(window.innerHeight < 390 ? 8 : 12);
      else if (window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches) {
        setAppsPerScreen(window.innerHeight < 620 ? 12 : window.innerHeight >= 760 ? 20 : 16);
      } else setAppsPerScreen(window.innerHeight < 690 ? 12 : 16);
    };
    syncFold();
    syncPageSize();
    landscape.addEventListener('change', syncFold);
    window.addEventListener('resize', syncPageSize);
    return () => { landscape.removeEventListener('change', syncFold); window.removeEventListener('resize', syncPageSize); };
  }, []);

  useEffect(() => {
    const fullscreen = window.matchMedia('(max-width: 767px), (max-height: 500px) and (orientation: landscape) and (pointer: coarse)');
    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    const rootBackground = root.style.backgroundColor;
    const bodyBackground = body.style.backgroundColor;
    const rootColorScheme = root.style.colorScheme;
    const syncScroll = () => {
      root.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      root.style.backgroundColor = fullscreen.matches ? '#030812' : rootBackground;
      body.style.backgroundColor = fullscreen.matches ? '#030812' : bodyBackground;
      root.style.colorScheme = fullscreen.matches ? 'dark' : rootColorScheme;
    };
    syncScroll();
    fullscreen.addEventListener('change', syncScroll);
    return () => {
      fullscreen.removeEventListener('change', syncScroll);
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
      root.style.backgroundColor = rootBackground;
      body.style.backgroundColor = bodyBackground;
      root.style.colorScheme = rootColorScheme;
    };
  }, []);

  useEffect(() => {
    const syncClock = () => setClock(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    syncClock();
    const interval = window.setInterval(syncClock, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    if (infoTimer.current !== null) clearTimeout(infoTimer.current);
    if (islandTimer.current !== null) clearTimeout(islandTimer.current);
    if (launchTimer.current !== null) clearTimeout(launchTimer.current);
    if (unlockTimer.current !== null) clearTimeout(unlockTimer.current);
  }, []);

  function unlockPhone() {
    if (!isLocked || isUnlocking) return;
    setIsUnlocking(true);
    if (unlockTimer.current !== null) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => { setIsLocked(false); setIsUnlocking(false); }, 620);
  }

  function clearHold() {
    if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  function clearInfoTimer() {
    if (infoTimer.current !== null) clearTimeout(infoTimer.current);
    infoTimer.current = null;
  }

  function showIsland(id: number, autoHide = false) {
    if (islandTimer.current !== null) clearTimeout(islandTimer.current);
    setIslandAppId(id);
    if (autoHide) islandTimer.current = setTimeout(() => setIslandAppId(null), 3200);
  }

  function hideIsland(delay = 0) {
    if (islandTimer.current !== null) clearTimeout(islandTimer.current);
    islandTimer.current = setTimeout(() => setIslandAppId(null), delay);
  }

  function showInfo(element: HTMLElement, id: number) {
    const device = deviceRef.current?.getBoundingClientRect();
    if (!device) return;
    const icon = element.getBoundingClientRect();
    const width = Math.min(260, device.width - 24);
    const x = Math.max(12, Math.min(icon.left - device.left + icon.width / 2 - width / 2, device.width - width - 12));
    const below = icon.bottom - device.top + 10;
    const y = below + 280 <= device.height - 12 ? below : Math.max(12, icon.top - device.top - 290);
    setInfoPosition({ x, y });
    setInfoAppId(id);
  }

  function blockNextClick() {
    suppressClick.current = true;
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

  function moveAppToPage(id: number, targetPage: number) {
    const next = [...orderedIds];
    const fromIndex = next.indexOf(id);
    if (fromIndex < 0) return;
    next.splice(fromIndex, 1);
    next.splice(Math.min(next.length, dockApps.length + targetPage * pageSize), 0, id);
    setOrderedIds(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage may be disabled. */ }
    changePage(targetPage);
  }

  function moveSelected(direction: -1 | 1) {
    if (selectedAppId === null || selectedIndex < 0) return;
    const target = filteredApps[selectedIndex + direction];
    if (target === undefined) return;
    moveApp(selectedAppId, target.id);
    setPageIndex(Math.floor(Math.max(0, selectedIndex + direction - dockApps.length) / pageSize));
  }

  function changePage(index: number) {
    setPageDirection(index >= currentPage ? 1 : -1);
    setPageIndex(index);
    setMenuAppId(null);
    setInfoAppId(null);
    setIslandAppId(null);
    if (isEditing) setSelectedAppId(null);
  }

  function startAppPointer(event: React.PointerEvent<HTMLAnchorElement>, id: number) {
    // A new gesture must never inherit click suppression from an earlier swipe.
    suppressClick.current = false;
    appPointer.current = { x: event.clientX, y: event.clientY, id };
    setDragOffset({ x: 0, y: 0 });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (isEditing) {
      setSelectedAppId(id);
      dragIdRef.current = id;
      setDraggedId(id);
      return;
    }
    if (event.pointerType !== 'mouse') {
      clearInfoTimer();
      infoTimer.current = setTimeout(() => {
        showIsland(id, true);
        blockNextClick();
      }, 220);
    }
    clearHold();
    holdTimer.current = setTimeout(() => {
      clearInfoTimer();
      setIsEditing(true);
      setSelectedAppId(id);
      setInfoAppId(null);
      setIslandAppId(null);
      dragIdRef.current = id;
      setDraggedId(id);
      setMenuAppId(null);
      blockNextClick();
      if (navigator.vibrate) navigator.vibrate(12);
    }, 700);
  }

  function moveAppPointer(event: React.PointerEvent<HTMLAnchorElement>) {
    const start = appPointer.current;
    if (!start) return;
    const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (distance > 10) {
      clearHold();
      clearInfoTimer();
      setInfoAppId(null);
      hideIsland();
    }
    if (dragIdRef.current === null) return;
    setDragOffset({ x: event.clientX - start.x, y: event.clientY - start.y });
    if (distance < 8) return;
    const device = deviceRef.current?.getBoundingClientRect();
    const edgePage = device && event.clientX < device.left + 36 && currentPage > 0 ? currentPage - 1
      : device && event.clientX > device.right - 36 && currentPage < pageCount - 1 ? currentPage + 1 : null;
    edgeTargetPageRef.current = edgePage;
    setEdgeTargetPage(edgePage);
    if (edgePage !== null) {
      dropIdRef.current = null;
      setDropId(null);
      return;
    }
    const target = document.elementsFromPoint(event.clientX, event.clientY)
      .map(element => element.closest<HTMLElement>('[data-app-id]'))
      .find(element => element && Number(element.dataset.appId) !== dragIdRef.current);
    const id = target ? Number(target.dataset.appId) : null;
    dropIdRef.current = id;
    setDropId(id);
  }

  function endAppPointer(cancelled = false) {
    clearHold();
    clearInfoTimer();
    if (!cancelled && dragIdRef.current !== null && edgeTargetPageRef.current !== null) moveAppToPage(dragIdRef.current, edgeTargetPageRef.current);
    else if (!cancelled && dragIdRef.current !== null && dropIdRef.current !== null) moveApp(dragIdRef.current, dropIdRef.current);
    if (dragIdRef.current !== null) blockNextClick();
    if (cancelled || dragIdRef.current !== null) setInfoAppId(null);
    if (cancelled || dragIdRef.current !== null) setIslandAppId(null);
    dragIdRef.current = null;
    dropIdRef.current = null;
    edgeTargetPageRef.current = null;
    appPointer.current = null;
    setDraggedId(null);
    setDropId(null);
    setEdgeTargetPage(null);
    setDragOffset({ x: 0, y: 0 });
  }

  function openMenu(event: React.MouseEvent<HTMLAnchorElement>, id: number) {
    event.preventDefault();
    if (window.matchMedia('(hover: none)').matches) return;
    clearHold();
    clearInfoTimer();
    setInfoAppId(null);
    setIslandAppId(null);
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
        holdTimer.current = setTimeout(() => { clearInfoTimer(); setIsEditing(true); setSelectedAppId(null); setIslandAppId(null); blockNextClick(); }, 700);
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

  const appTile = (app: LauncherApp, visible: boolean, inDock = false) => (
    <a
      key={app.id}
      data-app-id={app.id}
      className={`${styles.appTile}${inDock ? ` ${styles.dockTile}` : ''}${isEditing ? ` ${styles.jiggling}` : ''}${selectedAppId === app.id && isEditing ? ` ${styles.selected}` : ''}${draggedId === app.id ? ` ${styles.dragged}` : ''}${dropId === app.id && draggedId !== app.id ? ` ${styles.dropTarget}` : ''}${launchingId === app.id ? ` ${styles.launching}` : ''}`}
      style={draggedId === app.id ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` } : undefined}
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${newAppIds.includes(app.id) ? '새 앱, ' : ''}${app.name} 열기 (새 탭)`}
      title={app.name}
      tabIndex={visible && !isLocked ? 0 : -1}
      draggable={false}
      onClick={event => {
        if (isEditing) { event.preventDefault(); setSelectedAppId(app.id); }
        else if (suppressClick.current && event.detail !== 0) event.preventDefault();
        else { markAppOpened(app.id); animateAppOpen(app.id); setInfoAppId(null); setIslandAppId(null); }
        suppressClick.current = false;
      }}
      onPointerEnter={event => {
        if (event.pointerType !== 'mouse' || isEditing) return;
        showIsland(app.id);
        clearInfoTimer();
        const element = event.currentTarget;
        infoTimer.current = setTimeout(() => showInfo(element, app.id), 900);
      }}
      onPointerLeave={event => {
        if (event.pointerType !== 'mouse') return;
        clearInfoTimer();
        if (event.relatedTarget instanceof Node && infoCardRef.current?.contains(event.relatedTarget)) return;
        setInfoAppId(null);
        hideIsland(90);
      }}
      onFocus={event => { if (event.currentTarget.matches(':focus-visible') && !isEditing) showIsland(app.id); }}
      onBlur={() => hideIsland(90)}
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
        {inDock && newAppIds.includes(app.id) && <span className={styles.dockNewDot} aria-hidden="true" />}
      </span>
      {!inDock && <span className={styles.appLabel}>
        <strong>{app.shortName || app.name}</strong>
        {newAppIds.includes(app.id) && <span className={styles.newDot} aria-hidden="true" />}
      </span>}
    </a>
  );

  const searchBox = (label: string, visible: boolean) => (
    <label className={`${styles.searchBox}${query ? ` ${styles.searchActive}` : ''}`}>
      <Search size={15} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input value={query} onFocus={() => { setIsEditing(false); setSelectedAppId(null); setMenuAppId(null); setInfoAppId(null); }} onChange={event => { setQuery(event.target.value); setPageIndex(0); }} placeholder="앱 검색" aria-label={label} tabIndex={visible && !isLocked ? 0 : -1} />
    </label>
  );

  const editToolbar = (visible: boolean) => (
    <div className={styles.editToolbar} role="group" aria-label="앱 순서 편집">
      <button type="button" onClick={() => moveSelected(-1)} disabled={selectedIndex <= 0} tabIndex={visible ? 0 : -1} aria-label="선택한 앱을 앞으로 이동"><ArrowLeft size={16} aria-hidden="true" /></button>
      <span aria-live="polite">{selectedApp?.shortName || '아이콘 선택'}</span>
      <button type="button" onClick={() => moveSelected(1)} disabled={selectedIndex < 0 || selectedIndex >= filteredApps.length - 1} tabIndex={visible ? 0 : -1} aria-label="선택한 앱을 뒤로 이동"><ArrowRight size={16} aria-hidden="true" /></button>
    </div>
  );

  const pageDots = pageCount > 1 && (
    <div className={styles.pageDots} aria-label="앱 페이지">
      {Array.from({ length: pageCount }, (_, index) => (
        <button key={index} type="button" className={index === currentPage ? styles.activeDot : ''} onClick={() => changePage(index)} aria-label={`${index + 1}페이지`} aria-current={index === currentPage ? 'page' : undefined} tabIndex={isLocked ? -1 : 0} />
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
      <div ref={deviceRef} className={`${styles.device}${isUnfolded ? ` ${styles.isOpen}` : ''}${isUnlocking ? ` ${styles.unlockingDevice}` : ''}`} onPointerDownCapture={event => { if (menuAppId !== null && !(event.target as HTMLElement).closest('[role="menu"]')) setMenuAppId(null); }} onClick={event => { if (!(event.target as HTMLElement).closest('[data-app-id], button, input, label, [data-app-info]')) { setInfoAppId(null); setIslandAppId(null); if (isEditing) { setIsEditing(false); setSelectedAppId(null); } } }}>
        <div className={`${styles.dynamicIsland}${islandApp && !isEditing ? ` ${styles.islandExpanded}` : ''}`} role="status" aria-live="polite" aria-label={islandApp && !isEditing ? `${islandApp.name}: ${islandApp.description}` : '다이내믹 아일랜드'}>
          {islandApp && !isEditing && <div className={styles.islandContent}>
            <AppIcon icon={islandApp.icon} image={islandApp.iconImage} iconSize={25} className={styles.islandIcon} />
            <div className={styles.islandText}>
              <div className={styles.islandHeading}><strong>{islandApp.name}</strong><span>{islandApp.kind} · {islandApp.platforms.join(' · ')}</span></div>
              <p>{islandApp.description || `${islandApp.name}을(를) 열어보세요.`}</p>
            </div>
          </div>}
        </div>
        <div className={styles.coverScreen} {...gestureHandlers()} aria-hidden={isLocked}>
          <div className={`${styles.coverContent}${isUnfolded ? ` ${styles.contentHidden}` : ''}`} aria-hidden={isUnfolded}>
            <div className={styles.statusBar}><span aria-hidden="true">{clock}</span>{isEditing ? <button type="button" className={styles.doneButton} onClick={() => { setIsEditing(false); setSelectedAppId(null); }}>완료</button> : statusIcons}</div>
            <div key={`cover-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>
              {visibleApps.map(app => appTile(app, !isUnfolded))}
              {gridApps.length === 0 && (apps.length === 0 || hasQuery) && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
            {pageDots}
            {isEditing ? editToolbar(!isUnfolded) : searchBox('접힌 화면에서 앱 검색', !isUnfolded)}
            {dockApps.length > 0 && <div className={styles.dock} aria-label="고정 앱">{dockApps.map(app => appTile(app, !isUnfolded, true))}</div>}
            <span className={styles.homeIndicator} aria-hidden="true" />
          </div>
          <div className={`${styles.openContent}${isUnfolded ? ` ${styles.contentVisible}` : ''}`} aria-hidden={!isUnfolded}>
            <div className={styles.statusBar}><span aria-hidden="true">{clock}</span>{isEditing && <button type="button" className={styles.doneButton} onClick={() => { setIsEditing(false); setSelectedAppId(null); }}>완료</button>}</div>
            <div key={`left-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>
              {leftApps.map(app => appTile(app, isUnfolded))}
              {gridApps.length === 0 && (apps.length === 0 || hasQuery) && <p className={styles.empty}>{apps.length === 0 ? '아직 공개된 앱이 없습니다.' : '검색 결과가 없습니다.'}</p>}
            </div>
            {pageDots}
            {isEditing ? editToolbar(isUnfolded) : searchBox('펼친 화면에서 앱 검색', isUnfolded)}
            {dockApps.length > 0 && <div className={styles.dock} aria-label="고정 앱">{dockApps.map(app => appTile(app, isUnfolded, true))}</div>}
            <span className={styles.homeIndicator} aria-hidden="true" />
          </div>
        </div>
        <div className={styles.hinge} aria-hidden="true" />
        <div className={styles.innerScreen} aria-hidden={!isUnfolded || isLocked} {...gestureHandlers()}>
          <div className={styles.innerContent}>
            <div className={`${styles.statusBar} ${styles.rightStatus}`} aria-hidden="true">{statusIcons}</div>
            <div key={`right-${currentPage}`} className={`${styles.appGrid}${pageDirection < 0 ? ` ${styles.pagePrev}` : ''}`}>{rightApps.map(app => appTile(app, isUnfolded))}</div>
            <span className={styles.homeIndicator} aria-hidden="true" />
          </div>
        </div>
        {infoApp && !isEditing && <div ref={infoCardRef} data-app-info className={styles.infoCard} style={{ left: infoPosition.x, top: infoPosition.y }} role="group" aria-label={`${infoApp.name} 정보`} onPointerLeave={event => { if (event.pointerType === 'mouse') { setInfoAppId(null); hideIsland(90); } }}>
          <div className={styles.infoHeader}>
            <AppIcon icon={infoApp.icon} image={infoApp.iconImage} iconSize={24} className={styles.infoIcon} />
            <div><strong>{infoApp.name}</strong><span>{infoApp.kind}</span></div>
            <button type="button" className={styles.infoClose} onClick={() => setInfoAppId(null)} aria-label="정보 닫기"><X size={16} aria-hidden="true" /></button>
          </div>
          <p>{infoApp.description || `${infoApp.name}을(를) 열어보세요.`}</p>
          <div className={styles.infoPlatforms}>{infoApp.platforms.map(platform => <span key={platform}>{platform}</span>)}</div>
          <a className={styles.infoOpen} href={infoApp.href} target="_blank" rel="noopener noreferrer" onClick={() => { markAppOpened(infoApp.id); setInfoAppId(null); }}>열기 <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>}
        {menuApp && <div className={styles.quickMenu} style={{ left: menuPosition.x, top: menuPosition.y }} role="menu" aria-label={`${menuApp.name} 메뉴`}>
          <strong>{menuApp.name}</strong>
          <a href={menuApp.href} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => { markAppOpened(menuApp.id); setMenuAppId(null); }}><ArrowUpRight size={16} />앱 열기</a>
          <button type="button" role="menuitem" onClick={async () => { try { await navigator.clipboard.writeText(menuApp.href); setCopied(true); } catch { setCopied(false); } }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '복사됨' : '링크 복사'}</button>
          <button type="button" role="menuitem" onClick={() => { setIsEditing(true); setSelectedAppId(menuApp.id); setMenuAppId(null); }}>홈 화면 편집</button>
          <button type="button" role="menuitem" onClick={() => { const ids = apps.map(app => app.id); setOrderedIds(ids); try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ } setMenuAppId(null); }}>기본 정렬로</button>
        </div>}
        {isEditing && draggedId !== null && edgeTargetPage !== null && <div className={`${styles.dragEdge}${edgeTargetPage < currentPage ? ` ${styles.dragEdgeLeft}` : ` ${styles.dragEdgeRight}`}`} aria-hidden="true">
          {edgeTargetPage < currentPage ? <ChevronsLeft size={22} /> : <ChevronsRight size={22} />}
          <span>{edgeTargetPage + 1}</span>
        </div>}
        <button
          type="button"
          className={styles.foldToggle}
          onClick={() => { setMenuAppId(null); setInfoAppId(null); setIsUnfolded(value => !value); }}
          aria-label={isUnfolded ? '듀오 접기' : '듀오 펼치기'}
          aria-expanded={isUnfolded}
          tabIndex={isLocked ? -1 : 0}
          disabled={isLocked}
        >
          {isUnfolded ? <ChevronsLeft size={22} /> : <ChevronsRight size={22} />}
          <span>{isUnfolded ? '접기' : '펼치기'}</span>
        </button>
        {isLocked && <div
          className={`${styles.lockScreen}${isUnlocking ? ` ${styles.lockScreenUnlocking}` : ''}`}
          aria-label="잠금 화면"
          onPointerDown={event => { lockPointer.current = { x: event.clientX, y: event.clientY }; }}
          onPointerUp={event => {
            const start = lockPointer.current;
            lockPointer.current = null;
            if (start && start.y - event.clientY > 65 && Math.abs(start.x - event.clientX) < 120) unlockPhone();
          }}
          onPointerCancel={() => { lockPointer.current = null; }}
        >
          <div className={styles.lockStatus} aria-hidden="true"><span>{clock}</span>{statusIcons}</div>
          <div className={styles.lockTime} aria-hidden="true">
            <span>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
            <strong>{clock}</strong>
          </div>
          <div className={styles.lockBottom}>
            <button type="button" onClick={unlockPhone} aria-label="잠금 해제하고 앱 보기"><ChevronUp size={24} aria-hidden="true" /><span>위로 밀어 잠금 해제</span></button>
            <span className={styles.lockHomeIndicator} aria-hidden="true" />
          </div>
        </div>}
      </div>
      <p className={styles.instructions}>아이콘에 마우스를 올리거나 손가락을 잠깐 대면 상세 정보 · 길게 눌러 정렬 · 좌우로 밀어 페이지 이동</p>
    </section>
  );
}
