/**
 * カスタム営業日設定ユーティリティ
 */

import { isJapaneseHoliday } from './japaneseHolidays';

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
 * カスタム営業日設定
 */
export interface CustomBusinessDaysConfig {
  // 営業日の曜日（0=日曜、1=月曜、...、6=土曜）
  // trueなら営業日、falseなら休業日
  weekdays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  // カスタム休日（祝日以外の休業日）
  customHolidays: string[]; // YYYY-MM-DD形式の配列
  // カスタム営業日（祝日でも営業する日）
  customBusinessDays: string[]; // YYYY-MM-DD形式の配列
}

/**
 * デフォルト設定（月〜金が営業日）
 */
export const DEFAULT_CUSTOM_BUSINESS_DAYS: CustomBusinessDaysConfig = {
  weekdays: {
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  },
  customHolidays: [],
  customBusinessDays: [],
};

/**
 * 指定した日付がカスタム設定に基づいて営業日かどうか判定
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @param config カスタム営業日設定
 * @returns 営業日ならtrue
 */
export function isCustomBusinessDay(
  dateStr: string,
  config: CustomBusinessDaysConfig = DEFAULT_CUSTOM_BUSINESS_DAYS
): boolean {
  const date = new Date(dateStr);
  const weekday = date.getDay();

  // カスタム営業日リストに含まれている場合は必ず営業日
  if (config.customBusinessDays.includes(dateStr)) {
    return true;
  }

  // カスタム休日リストに含まれている場合は必ず休業日
  if (config.customHolidays.includes(dateStr)) {
    return false;
  }

  // 曜日チェック
  const weekdayMap = {
    0: config.weekdays.sunday,
    1: config.weekdays.monday,
    2: config.weekdays.tuesday,
    3: config.weekdays.wednesday,
    4: config.weekdays.thursday,
    5: config.weekdays.friday,
    6: config.weekdays.saturday,
  };

  if (!weekdayMap[weekday as keyof typeof weekdayMap]) {
    return false;
  }

  // 祝日チェック（カスタム営業日でなければ）
  if (isJapaneseHoliday(dateStr)) {
    return false;
  }

  return true;
}

/**
 * カスタム営業日設定に基づいて営業日数を計算
 * @param startDateStr 開始日付 (YYYY-MM-DD)
 * @param endDateStr 終了日付 (YYYY-MM-DD)
 * @param config カスタム営業日設定
 * @returns 営業日数
 */
export function countCustomBusinessDays(
  startDateStr: string,
  endDateStr: string,
  config: CustomBusinessDaysConfig = DEFAULT_CUSTOM_BUSINESS_DAYS
): number {
  let count = 0;
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    if (isCustomBusinessDay(dateStr, config)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

/**
 * カスタム営業日設定に基づいてn営業日後の日付を計算
 * @param dateStr 開始日付 (YYYY-MM-DD)
 * @param businessDays 営業日数
 * @param config カスタム営業日設定
 * @returns 営業日後の日付 (YYYY-MM-DD)
 */
export function addCustomBusinessDays(
  dateStr: string,
  businessDays: number,
  config: CustomBusinessDaysConfig = DEFAULT_CUSTOM_BUSINESS_DAYS
): string {
  let currentDate = new Date(dateStr);
  let daysToAdd = businessDays;

  while (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dateStr = formatDate(currentDate);
    if (isCustomBusinessDay(dateStr, config)) {
      daysToAdd--;
    }
  }

  return formatDate(currentDate);
}
