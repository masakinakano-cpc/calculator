/**
 * 日付の範囲指定ユーティリティ
 */

import { dateDifference } from './dateCalculator';
import { countBusinessDays } from './dateAdvanced';
import { isJapaneseHoliday } from './japaneseHolidays';

/**
 * 日付範囲の情報
 */
export interface DateRangeInfo {
  totalDays: number;
  businessDays: number;
  weekends: number;
  holidays: number;
  startDate: string;
  endDate: string;
}

/**
 * 日付範囲の情報を計算
 * @param startDateStr 開始日付 (YYYY-MM-DD)
 * @param endDateStr 終了日付 (YYYY-MM-DD)
 * @returns 範囲情報
 */
export function calculateDateRange(startDateStr: string, endDateStr: string): DateRangeInfo {
  const totalDays = Math.abs(dateDifference(startDateStr, endDateStr)) + 1;
  const businessDays = countBusinessDays(startDateStr, endDateStr);

  let weekends = 0;
  let holidays = 0;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const current = new Date(start);

  while (current <= end) {
    const dateStr = formatDate(current);
    const weekday = current.getDay();

    if (weekday === 0 || weekday === 6) {
      weekends++;
    }

    if (isJapaneseHoliday(dateStr) && weekday !== 0 && weekday !== 6) {
      holidays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    totalDays,
    businessDays,
    weekends,
    holidays,
    startDate: startDateStr,
    endDate: endDateStr,
  };
}

/**
 * DateオブジェクトをYYYY-MM-DD形式に変換
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
