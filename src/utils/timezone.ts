/**
 * タイムゾーン対応ユーティリティ
 */

/**
 * 主要なタイムゾーン
 */
export const TIMEZONES = {
  'Asia/Tokyo': '日本標準時 (JST)',
  'America/New_York': '東部標準時 (EST)',
  'America/Los_Angeles': '太平洋標準時 (PST)',
  'Europe/London': 'グリニッジ標準時 (GMT)',
  'Europe/Paris': '中央ヨーロッパ時間 (CET)',
  'Asia/Shanghai': '中国標準時 (CST)',
  'Asia/Seoul': '韓国標準時 (KST)',
  'Australia/Sydney': 'オーストラリア東部標準時 (AEST)',
};

/**
 * 日付を別のタイムゾーンに変換
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @param fromTimezone 元のタイムゾーン
 * @param toTimezone 変換先のタイムゾーン
 * @returns 変換後の日付文字列 (YYYY-MM-DD)
 */
export function convertTimezone(
  dateStr: string,
  fromTimezone: string,
  toTimezone: string
): string {
  // 簡易版：実際の実装にはIntl APIやライブラリが必要
  // ここでは基本的な時差計算のみ
  const date = new Date(dateStr + 'T00:00:00');

  // タイムゾーンオフセット（時間単位）
  const timezoneOffsets: Record<string, number> = {
    'Asia/Tokyo': 9,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Asia/Shanghai': 8,
    'Asia/Seoul': 9,
    'Australia/Sydney': 10,
  };

  const fromOffset = timezoneOffsets[fromTimezone] || 0;
  const toOffset = timezoneOffsets[toTimezone] || 0;
  const diffHours = toOffset - fromOffset;

  date.setHours(date.getHours() + diffHours);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * タイムゾーン間の時差を取得
 * @param timezone1 タイムゾーン1
 * @param timezone2 タイムゾーン2
 * @returns 時差（時間）
 */
export function getTimezoneOffset(timezone1: string, timezone2: string): number {
  const offsets: Record<string, number> = {
    'Asia/Tokyo': 9,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Asia/Shanghai': 8,
    'Asia/Seoul': 9,
    'Australia/Sydney': 10,
  };

  const offset1 = offsets[timezone1] || 0;
  const offset2 = offsets[timezone2] || 0;
  return offset2 - offset1;
}
