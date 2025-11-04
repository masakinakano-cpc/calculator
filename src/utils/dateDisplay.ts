/**
 * 日付の複数形式表示ユーティリティ
 */

import { dateDifferenceDetailed } from './dateCalculatorExtended';

/**
 * 日数を複数の形式で表示
 * @param totalDays 総日数
 * @returns 複数形式の文字列
 */
export function formatDaysMultiple(totalDays: number): {
  years: string;
  months: string;
  weeks: string;
  days: string;
  full: string;
} {
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const weeks = Math.floor(remainingDays / 7);
  const days = remainingDays % 7;

  return {
    years: `${totalDays}にち = ${years}ねん${remainingDays}にち`,
    months: `${totalDays}にち = ${Math.floor(totalDays / 30)}かげつ${totalDays % 30}にち`,
    weeks: `${totalDays}にち = ${weeks}しゅう${days}にち`,
    days: `${totalDays}にち`,
    full: `${totalDays}にち = ${years}ねん${months}かげつ${days}にち = ${Math.floor(totalDays / 7)}しゅう${totalDays % 7}にち`,
  };
}

/**
 * 2つの日付の差分を複数形式で表示
 * @param date1Str 日付1
 * @param date2Str 日付2
 * @returns 複数形式の文字列
 */
export function formatDateDifferenceMultiple(date1Str: string, date2Str: string): string {
  const diff = dateDifferenceDetailed(date1Str, date2Str);
  const formats = formatDaysMultiple(diff.totalDays);
  return `${formats.full} (${diff.years}ねん${diff.months}かげつ${diff.days}にち、${diff.weeks}しゅう)`;
}
