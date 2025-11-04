/**
 * 週の範囲計算ユーティリティ
 */

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
 * 週の開始日（月曜日）を取得
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 週の開始日
 */
export function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 月曜日を週の始まりとする
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

/**
 * 週の終了日（日曜日）を取得
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 週の終了日
 */
export function getWeekEnd(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = day === 0 ? 0 : 7 - day; // 日曜日を週の終わりとする
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

/**
 * 月の第何週かを計算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 週の番号（1から始まる）
 */
export function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstMonday = getWeekStart(formatDate(firstDay));
  const currentMonday = getWeekStart(dateStr);

  const firstMondayDate = new Date(firstMonday);
  const currentMondayDate = new Date(currentMonday);

  const diffDays = Math.floor((currentMondayDate.getTime() - firstMondayDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

/**
 * 年の第何週かを計算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 週の番号（1から始まる）
 */
export function getWeekOfYear(dateStr: string): number {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const jan1Monday = getWeekStart(formatDate(jan1));

  const currentMonday = getWeekStart(dateStr);
  const jan1MondayDate = new Date(jan1Monday);
  const currentMondayDate = new Date(currentMonday);

  const diffDays = Math.floor((currentMondayDate.getTime() - jan1MondayDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

/**
 * 週の範囲を取得
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns {start: 開始日, end: 終了日, weekOfMonth: 月の第何週, weekOfYear: 年の第何週}
 */
export function getWeekRange(dateStr: string): {
  start: string;
  end: string;
  weekOfMonth: number;
  weekOfYear: number;
} {
  return {
    start: getWeekStart(dateStr),
    end: getWeekEnd(dateStr),
    weekOfMonth: getWeekOfMonth(dateStr),
    weekOfYear: getWeekOfYear(dateStr),
  };
}
