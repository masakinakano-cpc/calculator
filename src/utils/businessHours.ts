/**
 * 営業時間計算ユーティリティ
 */

import { isBusinessDay } from './dateAdvanced';

/**
 * DateオブジェクトをYYYY-MM-DD形式に変換
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 営業時間の設定
 */
export interface BusinessHours {
  startHour: number; // 開始時刻（時）
  startMinute: number; // 開始時刻（分）
  endHour: number; // 終了時刻（時）
  endMinute: number; // 終了時刻（分）
}

/**
 * デフォルトの営業時間（9:00-17:00）
 */
export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  startHour: 9,
  startMinute: 0,
  endHour: 17,
  endMinute: 0,
};

/**
 * 営業時間を考慮した時間計算
 * @param startDateStr 開始日時文字列 (YYYY-MM-DD)
 * @param endDateStr 終了日時文字列 (YYYY-MM-DD)
 * @param businessHours 営業時間設定
 * @returns 営業時間（時間）
 */
export function calculateBusinessHours(
  startDateStr: string,
  endDateStr: string,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): number {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  let totalHours = 0;

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    if (isBusinessDay(dateStr)) {
      const startTime = new Date(currentDate);
      startTime.setHours(businessHours.startHour, businessHours.startMinute, 0, 0);
      const endTime = new Date(currentDate);
      endTime.setHours(businessHours.endHour, businessHours.endMinute, 0, 0);

      if (currentDate.getTime() === startDate.getTime()) {
        // 開始日
        const dayStart = Math.max(startDate.getTime(), startTime.getTime());
        const dayEnd = endTime.getTime();
        totalHours += (dayEnd - dayStart) / (1000 * 60 * 60);
      } else if (currentDate.getTime() === endDate.getTime()) {
        // 終了日
        const dayStart = startTime.getTime();
        const dayEnd = Math.min(endDate.getTime(), endTime.getTime());
        totalHours += (dayEnd - dayStart) / (1000 * 60 * 60);
      } else {
        // 中間日
        totalHours += (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Math.max(0, totalHours);
}

/**
 * 営業時間を考慮した営業日数を計算
 * @param startDateStr 開始日時文字列
 * @param endDateStr 終了日時文字列
 * @param businessHours 営業時間設定
 * @returns 営業日数と営業時間
 */
export function calculateBusinessDaysWithHours(
  startDateStr: string,
  endDateStr: string,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): { days: number; hours: number; minutes: number } {
  const hours = calculateBusinessHours(startDateStr, endDateStr, businessHours);
  const days = Math.floor(hours / (businessHours.endHour - businessHours.startHour));
  const remainingHours = hours % (businessHours.endHour - businessHours.startHour);
  const minutes = Math.floor(remainingHours * 60);

  return {
    days,
    hours: Math.floor(remainingHours),
    minutes,
  };
}
