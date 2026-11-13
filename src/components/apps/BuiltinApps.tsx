'use client';

import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, Camera, Compass, Delete, Download, ExternalLink, MicOff, Phone, PhoneOff, RefreshCw, RotateCcw, SwitchCamera, Volume2, X } from 'lucide-react';
import styles from './BuiltinApps.module.css';

export type BuiltinApp = 'phone' | 'safari' | 'camera';
export const builtinApps = [
  { id: 'phone', name: '전화', Icon: Phone },
  { id: 'safari', name: '사파리', Icon: Compass },
  { id: 'camera', name: '카메라', Icon: Camera },
] as const;

type Props = { app: BuiltinApp | null; container: HTMLElement | null; onClose: () => void; onReturnFocus: () => void; favorites: { name: string; href: string }[] };

export default function BuiltinApps({ app, container, onClose, onReturnFocus, favorites }: Props) {
  return <Dialog.Root open={app !== null} onOpenChange={open => { if (!open) onClose(); }}>
    <Dialog.Portal container={container}>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content onCloseAutoFocus={event => { event.preventDefault(); onReturnFocus(); }} className={styles.window} onClick={event => event.stopPropagation()} onPointerDown={event => event.stopPropagation()}>
        <header className={styles.header}>
          <Dialog.Title>{builtinApps.find(item => item.id === app)?.name}</Dialog.Title>
          <Dialog.Description className="sr-only">폰 안에서 사용하는 앱. 닫기 또는 홈 버튼으로 돌아갑니다.</Dialog.Description>
          <Dialog.Close aria-label="앱 닫기"><X size={18} /></Dialog.Close>
        </header>
        <div className={styles.content}>
          {app === 'safari' && <SafariApp favorites={favorites} />}
          {app === 'camera' && <CameraApp />}
          {app === 'phone' && <PhoneApp />}
        </div>
        <Dialog.Close className={styles.home} aria-label="앱에서 홈 화면으로"><span /></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function SafariApp({ favorites }: Pick<Props, 'favorites'>) {
  const [address, setAddress] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const [reload, setReload] = useState(0);
  const [error, setError] = useState('');
  const url = history[index];
  function navigate(value: string) {
    try {
      const input = value.trim();
      if (!input) return;
      const target = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
      if (!['https:', 'http:'].includes(target.protocol) || target.username || target.password) throw new Error();
      if (target.protocol === 'http:' && window.location.protocol === 'https:') {
        setError('HTTPS 주소로 입력해 주세요.'); return;
      }
      if (target.origin === window.location.origin && /^\/apps(?:\/|$)/.test(target.pathname)) {
        setError('앱 화면을 다시 중첩해서 열 수 없습니다.'); return;
      }
      setHistory([...history.slice(0, index + 1), target.href]); setIndex(index + 1); setAddress(target.href); setError('');
    } catch { setError('올바른 웹 주소를 입력해 주세요. 예: example.com'); }
  }
  function move(next: number) { setIndex(next); setAddress(history[next] ?? ''); setError(''); }
  return <div className={styles.browser}>
    <form className={styles.address} onSubmit={event => { event.preventDefault(); navigate(address); }}>
      <Compass size={17} /><input aria-label="웹 주소" placeholder="웹 주소 입력" value={address} onChange={event => setAddress(event.target.value)} autoCapitalize="none" autoCorrect="off" inputMode="url" />
      <button type="submit" aria-label="웹사이트 열기">이동</button>
    </form>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <nav className={styles.browserTools} aria-label="브라우저 도구">
      <button aria-label="이전 입력 주소" disabled={index <= 0} onClick={() => move(index - 1)}><ArrowLeft size={20} /></button>
      <button aria-label="다음 입력 주소" disabled={index >= history.length - 1} onClick={() => move(index + 1)}><ArrowRight size={20} /></button>
      <button aria-label="새로고침" disabled={!url} onClick={() => setReload(value => value + 1)}><RefreshCw size={18} /></button>
      <button onClick={() => { setIndex(-1); setAddress(''); setError(''); }}>즐겨찾기</button>
      {url && <a href={url} target="_blank" rel="noopener noreferrer" aria-label="현재 입력 주소 새 탭으로 열기"><ExternalLink size={18} /></a>}
    </nav>
    {url ? <>
      <iframe key={`${index}-${reload}`} src={url} title="사파리 웹 페이지" className={styles.webFrame} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" allow="camera 'none'; microphone 'none'; geolocation 'none'" />
      <p className={styles.browserHint}>화면이 표시되지 않나요? <a href={url} target="_blank" rel="noopener noreferrer">새 탭으로 열기 ↗</a></p>
    </> : <div className={styles.favorites}><h3>즐겨찾기</h3><p>만든 앱을 이 화면 안에서 둘러보세요.</p>{favorites.map(item => <button key={item.href} onClick={() => navigate(item.href)}><Compass size={24} /><span>{item.name}</span></button>)}</div>}
  </div>;
}

function CameraApp() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const photoUrl = useRef<string | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>('environment');
  const [status, setStatus] = useState<'idle' | 'requesting' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  function stop() { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; }
  useEffect(() => {
    const hide = () => {
      if (document.hidden) { generation.current++; stop(); setStatus('idle'); }
    };
    document.addEventListener('visibilitychange', hide);
    return () => { generation.current++; stop(); if (photoUrl.current) URL.revokeObjectURL(photoUrl.current); document.removeEventListener('visibilitychange', hide); };
  }, []);
  async function start(nextFacing = facing) {
    const request = ++generation.current;
    stop(); setReview(false); setStatus('requesting'); setError(''); setFacing(nextFacing);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
      const media = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: nextFacing }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (request !== generation.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      if (video.current) { video.current.srcObject = media; await video.current.play(); }
      if (request === generation.current) setStatus('ready');
    } catch (cause) {
      if (request !== generation.current) return;
      stop(); setStatus('error');
      const name = cause instanceof Error ? cause.name : '';
      setError(name === 'NotAllowedError' ? '카메라 권한이 거부되었습니다. 브라우저 설정에서 허용한 뒤 다시 시도해 주세요.' : name === 'NotFoundError' ? '연결된 카메라를 찾을 수 없습니다.' : '카메라를 켤 수 없습니다. HTTPS 연결과 다른 앱의 카메라 사용 여부를 확인해 주세요.');
    }
  }
  function capture() {
    const source = video.current;
    if (!source?.videoWidth || status !== 'ready') return;
    const canvas = document.createElement('canvas');
    canvas.width = source.videoWidth; canvas.height = source.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    if (facing === 'user') { context.translate(canvas.width, 0); context.scale(-1, 1); }
    context.drawImage(source, 0, 0);
    const request = generation.current;
    canvas.toBlob(blob => {
      if (!blob || request !== generation.current) return;
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
      photoUrl.current = URL.createObjectURL(blob); setPhoto(photoUrl.current); setReview(true);
      generation.current++; stop(); setStatus('idle');
    }, 'image/jpeg', .92);
  }
  return <div className={styles.camera}>
    <div className={styles.viewfinder}>
      <video ref={video} muted playsInline autoPlay className={facing === 'user' ? styles.mirrored : ''} hidden={review} />
      {review && photo ? <img src={photo} alt="방금 촬영한 사진" /> : status !== 'ready' && <div className={styles.cameraMessage}>
        <Camera size={42} /><p>{status === 'requesting' ? '브라우저에서 카메라 권한을 허용해 주세요.' : error || '카메라를 켜고 사진을 촬영하세요.'}</p>
        {status !== 'requesting' && <button onClick={() => void start()}>{status === 'error' ? '다시 시도' : '카메라 켜기'}</button>}
      </div>}
    </div>
    <p className={styles.photoMode}>{review ? '촬영한 사진' : '사진'}</p>
    <div className={styles.cameraControls}>
      {review && photo ? <><button onClick={() => void start()}><RotateCcw size={22} /><span>다시 촬영</span></button><a href={photo} download="hae02y-photo.jpg"><Download size={24} /><span>사진 저장</span></a></> : <>
        <button disabled={!photo} onClick={() => { generation.current++; stop(); setStatus('idle'); setReview(true); }} aria-label="촬영한 사진 보기">{photo ? <img src={photo} alt="" /> : <span>사진</span>}</button>
        <button className={styles.shutter} disabled={status !== 'ready'} onClick={capture} aria-label="사진 촬영"><span /></button>
        <button disabled={status === 'requesting'} onClick={() => void start(facing === 'user' ? 'environment' : 'user')} aria-label="전후면 카메라 전환"><SwitchCamera size={28} /></button>
      </>}
    </div>
    <p className={styles.cameraNote}>사진은 서버로 전송되지 않습니다. 닫기 전에 저장해 주세요.</p>
  </div>;
}

function PhoneApp() {
  const [number, setNumber] = useState('');
  const [phase, setPhase] = useState<'dial' | 'calling' | 'connected' | 'ended'>('dial');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  useEffect(() => {
    if (phase === 'calling') { const timer = setTimeout(() => setPhase('connected'), 2200); return () => clearTimeout(timer); }
    if (phase === 'connected') { const started = Date.now(); const timer = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 250); return () => clearInterval(timer); }
  }, [phase]);
  const labels = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '+', ''];
  function dial() { if (!number) return; setSeconds(0); setMuted(false); setSpeaker(false); setPhase('calling'); }
  return <div className={`${styles.phone} ${phase !== 'dial' ? styles.inCall : ''}`}>
    <span className={styles.simulation}>모의 통화 · 실제 발신되지 않음</span>
    {phase === 'dial' ? <>
      <input className={styles.number} value={number} onChange={event => setNumber(event.target.value.replace(/[^0-9*#+]/g, '').slice(0, 24))} aria-label="전화번호" inputMode="tel" placeholder="번호 입력" />
      <div className={styles.keypad}>{['1','2','3','4','5','6','7','8','9','*','0','#'].map((key, index) => <button key={key} onClick={() => setNumber(value => (value + key).slice(0, 24))} aria-label={key}><strong>{key}</strong><small>{labels[index] || '\u00a0'}</small></button>)}</div>
      <div className={styles.dialActions}><button className={styles.callButton} disabled={!number} onClick={dial} aria-label="모의 전화 걸기"><Phone size={28} fill="currentColor" /></button><button aria-label="마지막 번호 지우기" disabled={!number} onClick={() => setNumber(value => value.slice(0, -1))}><Delete size={24} /></button></div>
    </> : <>
      <div className={styles.callIdentity}><span className={styles.avatar}><Phone size={32} /></span><strong>{number}</strong><p role="status">{phase === 'calling' ? '연결 중…' : phase === 'ended' ? '통화 종료' : `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}</p></div>
      {phase !== 'ended' ? <><div className={styles.callOptions}><button aria-pressed={muted} onClick={() => setMuted(value => !value)}><MicOff size={24} /><span>음소거</span></button><button aria-pressed={speaker} onClick={() => setSpeaker(value => !value)}><Volume2 size={24} /><span>스피커</span></button></div><button className={styles.endCall} onClick={() => setPhase('ended')} aria-label="통화 종료"><PhoneOff size={28} fill="currentColor" /></button></> : <button className={styles.returnDial} onClick={() => setPhase('dial')}>키패드로 돌아가기</button>}
    </>}
  </div>;
}
