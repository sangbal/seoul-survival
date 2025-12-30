import type { Fighter } from "../../domain/types";

/**
 * nickname이 구버전(string) 또는 신버전({ko,en}) 모두 처리
 * - ko: string
 * - en: string (없으면 '')
 */
export function getNicknameParts(f: Fighter): { ko: string; en: string } {
  const n: any = (f as any).nickname;
  if (!n) return { ko: "—", en: "" };
  if (typeof n === "string") return { ko: n, en: "" };
  // 신버전
  return { ko: String(n.ko ?? "—"), en: String(n.en ?? "") };
}

/**
 * 기본 표기: "바이퍼 (Viper)" 처럼 ko를 기본으로, en이 있으면 괄호로 표시
 */
export function formatFighterName(f: Fighter): string {
  const { ko, en } = getNicknameParts(f);
  return en ? `${ko} (${en})` : ko;
}

/**
 * 언어별 표기: lang이 'ko'면 ko, 아니면 en(없으면 ko fallback)
 */
export function getFighterDisplayName(f: Fighter, lang: "ko" | "en"): string {
  const { ko, en } = getNicknameParts(f);
  if (lang === "ko") return ko;
  return en || ko;
}
