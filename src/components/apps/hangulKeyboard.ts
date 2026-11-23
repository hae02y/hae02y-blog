// Two-set Hangul composition, including compound vowels and final consonants.
const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const vowels = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const finals = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
const pairs: Record<string, string> = { 'ㅗㅏ':'ㅘ', 'ㅗㅐ':'ㅙ', 'ㅗㅣ':'ㅚ', 'ㅜㅓ':'ㅝ', 'ㅜㅔ':'ㅞ', 'ㅜㅣ':'ㅟ', 'ㅡㅣ':'ㅢ', 'ㄱㅅ':'ㄳ', 'ㄴㅈ':'ㄵ', 'ㄴㅎ':'ㄶ', 'ㄹㄱ':'ㄺ', 'ㄹㅁ':'ㄻ', 'ㄹㅂ':'ㄼ', 'ㄹㅅ':'ㄽ', 'ㄹㅌ':'ㄾ', 'ㄹㅍ':'ㄿ', 'ㄹㅎ':'ㅀ', 'ㅂㅅ':'ㅄ' };
const split = (value: string) => Object.entries(pairs).find(([, combined]) => combined === value)?.[0];
const syllable = (initial: number, vowel: number, final = 0) => String.fromCharCode(0xac00 + (initial * 21 + vowel) * 28 + final);

export function typeHangul(text: string, key: string): string {
  const last = text.slice(-1), rest = text.slice(0, -1);
  const code = last.charCodeAt(0) - 0xac00;
  const v = vowels.indexOf(key);
  if (code >= 0 && code < 11172) {
    const i = Math.floor(code / 588), m = Math.floor(code / 28) % 21, f = code % 28;
    if (v >= 0) {
      if (f) {
        const parts = split(finals[f]);
        const next = parts ? parts[1] : finals[f];
        return rest + syllable(i, m, parts ? finals.indexOf(parts[0]) : 0) + syllable(initials.indexOf(next), v);
      }
      const combined = pairs[vowels[m] + key];
      if (combined) return rest + syllable(i, vowels.indexOf(combined));
    } else {
      const nextFinal = f ? pairs[finals[f] + key] : key;
      const index = finals.indexOf(nextFinal ?? '');
      if (index > 0) return rest + syllable(i, m, index);
    }
  } else if (initials.includes(last) && last && v >= 0) {
    return rest + syllable(initials.indexOf(last), v);
  } else if (pairs[last + key] && vowels.includes(last)) {
    return rest + pairs[last + key];
  }
  return text + key;
}

export function eraseHangul(text: string): string {
  const last = text.slice(-1), rest = text.slice(0, -1), code = last.charCodeAt(0) - 0xac00;
  if (code >= 0 && code < 11172) {
    const i = Math.floor(code / 588), m = Math.floor(code / 28) % 21, f = code % 28;
    if (f) return rest + syllable(i, m, split(finals[f]) ? finals.indexOf(split(finals[f])![0]) : 0);
    if (split(vowels[m])) return rest + syllable(i, vowels.indexOf(split(vowels[m])![0]));
    return rest + initials[i];
  }
  return rest + (split(last)?.[0] ?? '');
}
