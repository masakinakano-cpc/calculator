/**
 * 日付計算ユーティリティ
 */

/**
 * 日付に日数を加算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @param days 加算する日数
 * @returns 新しい日付文字列 (YYYY-MM-DD)
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * 日付に月を加算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @param months 加算する月数
 * @returns 新しい日付文字列 (YYYY-MM-DD)
 */
export function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.setMonth(date.getMonth() + months));
  return formatDate(date);
}

/**
 * 日付に年を加算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @param years 加算する年数
 * @returns 新しい日付文字列 (YYYY-MM-DD)
 */
export function addYears(dateStr: string, years: number): string {
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + years);
  return formatDate(date);
}

/**
 * 2つの日付間の日数差分を計算
 * @param date1Str 日付1文字列 (YYYY-MM-DD)
 * @param date2Str 日付2文字列 (YYYY-MM-DD)
 * @returns 日数差分（date2 - date1）
 */
export function dateDifference(date1Str: string, date2Str: string): number {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 日付をYYYY-MM-DD形式にフォーマット
 * @param date Dateオブジェクト
 * @returns YYYY-MM-DD形式の文字列
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 日付をYYYY年MM月DD日形式にフォーマット
 * @param dateStr YYYY-MM-DD形式の日付文字列
 * @returns YYYY年MM月DD日形式の文字列
 */
export function formatDateJapanese(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 今日の日付を取得
 * @returns YYYY-MM-DD形式の文字列
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * 日付文字列が有効かチェック
 * @param dateStr YYYY-MM-DD形式の日付文字列
 * @returns 有効ならtrue
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}
