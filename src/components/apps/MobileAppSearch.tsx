'use client';

import { useRef, useState, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUp, Delete, Globe, Search, X } from 'lucide-react';
import { eraseHangul, typeHangul } from './hangulKeyboard';
import styles from './MobileAppSearch.module.css';

type Props = { query: string; onChange: (value: string) => void; onClose: () => void; children: ReactNode };
export default function MobileAppSearch({ query, onChange, onClose, children }: Props) {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [numbers, setNumbers] = useState(false);
  const [shift, setShift] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const rows = numbers ? ['1234567890', '-/:;()₩&@"', '.,?!\''] : language === 'ko'
    ? [shift ? 'ㅃㅉㄸㄲㅆㅛㅕㅑㅒㅖ' : 'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ', 'ㅁㄴㅇㄹㅎㅗㅓㅏㅣ', 'ㅋㅌㅊㅍㅠㅜㅡ']
    : ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(row => shift ? row.toUpperCase() : row);
  function type(key: string) {
    onChange(language === 'ko' && !numbers ? typeHangul(query, key) : query + key);
    setShift(false);
  }
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.backdrop} />
      <Dialog.Content className={styles.panel} aria-describedby={undefined} onCloseAutoFocus={event => event.preventDefault()} onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus({ preventScroll: true }); }}>
        <Dialog.Title className="sr-only">앱 검색</Dialog.Title>
        <div className={styles.results}>{children}</div>
        <div className={styles.searchRow}>
          <div className={styles.field}><Search size={19} aria-hidden="true" />
            <input ref={input} type="text" readOnly inputMode="none" value={query} aria-label="앱 검색어" placeholder="앱 검색" onKeyDown={event => {
              if (event.metaKey || event.ctrlKey || event.altKey || event.nativeEvent.isComposing) return;
              if (event.key === 'Backspace') { event.preventDefault(); onChange(eraseHangul(query)); }
              else if (event.key.length === 1) { event.preventDefault(); onChange(query + event.key); }
            }} />
            {query && <button type="button" aria-label="검색어 지우기" onClick={() => onChange('')}><X size={17} /></button>}
          </div>
          <Dialog.Close className={styles.cancel}>취소</Dialog.Close>
        </div>
        <div className={styles.keyboard} role="group" aria-label="검색용 화면 키보드">
          {rows.map((row, index) => <div className={styles.row} key={index}>
            {index === 2 && <button type="button" className={styles.special} aria-label="대문자 및 쌍자음" aria-pressed={shift} onClick={() => setShift(!shift)}><ArrowUp size={20} fill={shift ? 'currentColor' : 'none'} /></button>}
            {[...row].map(key => <button type="button" key={key} onClick={() => type(key)}>{key}</button>)}
            {index === 2 && <button type="button" className={styles.special} aria-label="한 글자 지우기" onClick={() => onChange(eraseHangul(query))}><Delete size={21} /></button>}
          </div>)}
          <div className={styles.row}>
            <button type="button" className={styles.special} onClick={() => { setNumbers(!numbers); setShift(false); }}>{numbers ? (language === 'ko' ? '가나다' : 'ABC') : '123'}</button>
            <button type="button" className={styles.special} aria-label="한영 전환" onClick={() => { setLanguage(language === 'ko' ? 'en' : 'ko'); setNumbers(false); setShift(false); }}><Globe size={21} /></button>
            <button type="button" className={styles.space} onClick={() => type(' ')}>스페이스</button>
            <button type="button" className={styles.done} onClick={onClose}>완료</button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
