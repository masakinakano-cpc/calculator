/**
 * 旧暦（太陰太陽暦）変換ユーティリティ
 * 簡易版の実装（正確な変換には専用の計算が必要）
 */

/**
 * 旧暦の日付を表す型
 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean; // 閏月かどうか
}

/**
 * 新暦から旧暦への変換（簡易版）
 * 正確な変換には専用の計算が必要ですが、ここでは簡易的な近似を行います
 * @param dateStr 新暦の日付文字列 (YYYY-MM-DD)
 * @returns 旧暦の日付
 */
export function toLunarDate(dateStr: string): LunarDate {
  const date = new Date(dateStr);

  // 簡易的な変換（実際の旧暦計算は複雑）
  // 旧暦は約29.5日周期なので、新暦から約1ヶ月前後を計算
  const lunarDate = new Date(date);
  lunarDate.setDate(lunarDate.getDate() - 30); // 簡易的に30日戻す

  // 実際の旧暦計算は複雑なので、ここでは簡易的な表示
  // より正確な実装には、旧暦計算ライブラリが必要
  return {
    year: lunarDate.getFullYear(),
    month: lunarDate.getMonth() + 1,
    day: lunarDate.getDate(),
    isLeapMonth: false,
  };
}

/**
 * 旧暦から新暦への変換（簡易版）
 * @param lunarDate 旧暦の日付
 * @returns 新暦の日付文字列 (YYYY-MM-DD)
 */
export function fromLunarDate(lunarDate: LunarDate): string {
  const date = new Date(lunarDate.year, lunarDate.month - 1, lunarDate.day);
  date.setDate(date.getDate() + 30); // 簡易的に30日進める

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 旧暦の月名を取得
 * @param month 月
 * @param isLeapMonth 閏月かどうか
 * @returns 月名
 */
export function getLunarMonthName(month: number, isLeapMonth: boolean = false): string {
  const monthNames = [
    '睦月', '如月', '弥生', '卯月', '皐月', '水無月',
    '文月', '葉月', '長月', '神無月', '霜月', '師走'
  ];
  const prefix = isLeapMonth ? '閏' : '';
  return prefix + monthNames[month - 1];
}

/**
 * 旧暦の日付を文字列で表示
 * @param lunarDate 旧暦の日付
 * @returns 表示用文字列
 */
export function formatLunarDate(lunarDate: LunarDate): string {
  const monthName = getLunarMonthName(lunarDate.month, lunarDate.isLeapMonth);
  return `${lunarDate.year}年${monthName}${lunarDate.day}日`;
}
