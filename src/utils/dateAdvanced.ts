/**
 * 高度な日付計算機能
 * 営業日計算、週の何日目か、複数日付比較など
 */

import { getToday, dateDifference } from './dateCalculator';

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
 * 日本の祝日（固定のもの）
 */
const JAPANESE_HOLIDAYS: Record<string, string> = {
  '01-01': '元日',
  '02-11': '建国記念の日',
  '02-23': '天皇誕生日',
  '04-29': '昭和の日',
  '05-03': '憲法記念日',
  '05-04': 'みどりの日',
  '05-05': 'こどもの日',
  '08-11': '山の日',
  '11-03': '文化の日',
  '11-23': '勤労感謝の日',
};

/**
 * 指定した年・月の祝日を取得（移動祝日を除く）
 * @param year 年
 * @param month 月
 * @returns 祝日の配列 [{day: 日, name: 祝日名}]
 */
function getHolidaysInMonth(_year: number, month: number): Array<{ day: number; name: string }> {
  const holidays: Array<{ day: number; name: string }> = [];

  // 固定祝日
  const monthStr = String(month).padStart(2, '0');
  for (const [dateStr, name] of Object.entries(JAPANESE_HOLIDAYS)) {
    if (dateStr.startsWith(monthStr)) {
      const day = parseInt(dateStr.split('-')[1]);
      holidays.push({ day, name });
    }
  }

  // 移動祝日（簡易版）
  // 春分の日（3月20日頃）
  if (month === 3) {
    holidays.push({ day: 20, name: '春分の日' });
  }
  // 秋分の日（9月23日頃）
  if (month === 9) {
    holidays.push({ day: 23, name: '秋分の日' });
  }
  // 海の日（7月第3月曜日、簡易版では7月20日）
  if (month === 7) {
    holidays.push({ day: 20, name: '海の日' });
  }
  // 敬老の日（9月第3月曜日、簡易版では9月15日）
  if (month === 9) {
    holidays.push({ day: 15, name: '敬老の日' });
  }
  // 体育の日（10月第2月曜日、簡易版では10月10日）
  if (month === 10) {
    holidays.push({ day: 10, name: '体育の日' });
  }

  return holidays;
}

/**
 * 指定した日付が営業日かどうか判定（土日祝を除く）
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 営業日ならtrue
 */
export function isBusinessDay(dateStr: string): boolean {
  const date = new Date(dateStr);
  const weekday = date.getDay();

  // 土曜日(6)と日曜日(0)は営業日ではない
  if (weekday === 0 || weekday === 6) {
    return false;
  }

  // 祝日チェック
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const holidays = getHolidaysInMonth(year, month);

  for (const holiday of holidays) {
    if (holiday.day === day) {
      return false;
    }
  }

  return true;
}

/**
 * 営業日を計算（指定した日付からn営業日後）
 * @param dateStr 開始日付文字列 (YYYY-MM-DD)
 * @param businessDays 営業日数
 * @returns 営業日後の日付文字列 (YYYY-MM-DD)
 */
export function addBusinessDays(dateStr: string, businessDays: number): string {
  let currentDate = new Date(dateStr);
  let daysToAdd = businessDays;

  while (daysToAdd > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (isBusinessDay(formatDate(currentDate))) {
      daysToAdd--;
    }
  }

  return formatDate(currentDate);
}

/**
 * 2つの日付間の営業日数を計算
 * @param startDateStr 開始日付文字列 (YYYY-MM-DD)
 * @param endDateStr 終了日付文字列 (YYYY-MM-DD)
 * @returns 営業日数
 */
export function countBusinessDays(startDateStr: string, endDateStr: string): number {
  let count = 0;
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    if (isBusinessDay(formatDate(currentDate))) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

/**
 * 週の何日目か（第1月曜日など）を計算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 週の何日目か（例: "第1月曜日"）
 */
export function getWeekdayPosition(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const weekday = date.getDay();

  // その月の第何週目か計算
  const weekNumber = Math.floor((day - 1) / 7) + 1;

  const weekdayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const weekdayName = weekdayNames[weekday];

  return `第${weekNumber}${weekdayName}曜日`;
}

/**
 * 指定した日付が何年前か計算
 * @param pastYear 過去の年
 * @param referenceYear 基準年（省略時は今年）
 * @returns 何年前か
 */
export function getYearsAgo(pastYear: number, referenceYear?: number): number {
  const refYear = referenceYear || new Date().getFullYear();
  return refYear - pastYear;
}

/**
 * 何年前の年を計算
 * @param yearsAgo 何年前
 * @param referenceYear 基準年（省略時は今年）
 * @returns 過去の年
 */
export function getPastYear(yearsAgo: number, referenceYear?: number): number {
  const refYear = referenceYear || new Date().getFullYear();
  return refYear - yearsAgo;
}

/**
 * 複数の日付を比較
 * @param dateStrs 日付文字列の配列 (YYYY-MM-DD)
 * @returns 比較結果
 */
export function compareMultipleDates(dateStrs: string[]): {
  oldest: string;
  newest: string;
  sorted: string[];
  differences: Array<{ date1: string; date2: string; days: number }>;
} {
  if (dateStrs.length < 2) {
    throw new Error('2つ以上の日付が必要です');
  }

  // ソート
  const sorted = [...dateStrs].sort();
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];

  // 各日付間の差分を計算
  const differences: Array<{ date1: string; date2: string; days: number }> = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const date1 = sorted[i];
    const date2 = sorted[i + 1];
    const days = dateDifference(date1, date2);
    differences.push({ date1, date2, days });
  }

  return {
    oldest,
    newest,
    sorted,
    differences,
  };
}

/**
 * 計画・予測機能：〇日後に〇歳になる日付を計算
 * @param birthDateStr 生年月日文字列 (YYYY-MM-DD)
 * @param targetAge 目標年齢
 * @returns その年齢になる日付文字列 (YYYY-MM-DD)
 */
export function getBirthdayAtAge(birthDateStr: string, targetAge: number): string {
  const birthDate = new Date(birthDateStr);
  const targetYear = birthDate.getFullYear() + targetAge;

  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getDate()).padStart(2, '0');

  return `${targetYear}-${month}-${day}`;
}

/**
 * 計画・予測機能：今日から〇日後は何歳になるか計算
 * @param birthDateStr 生年月日文字列 (YYYY-MM-DD)
 * @param daysLater 何日後
 * @returns その日の年齢
 */
export function getAgeAfterDays(birthDateStr: string, daysLater: number): number {
  const today = new Date(getToday());
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + daysLater);

  const birthDate = new Date(birthDateStr);
  const targetYear = targetDate.getFullYear();
  const birthYear = birthDate.getFullYear();

  let age = targetYear - birthYear;

  // まだ誕生日が来ていない場合は1歳引く
  const targetMonth = targetDate.getMonth();
  const birthMonth = birthDate.getMonth();
  const targetDay = targetDate.getDate();
  const birthDay = birthDate.getDate();

  if (targetMonth < birthMonth || (targetMonth === birthMonth && targetDay < birthDay)) {
    age--;
  }

  return age;
}
