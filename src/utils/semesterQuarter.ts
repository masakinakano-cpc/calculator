/**
 * 学期・四半期判定ユーティリティ
 */

/**
 * 学期の種類
 */
export enum Semester {
  FIRST = '第1学期',
  SECOND = '第2学期',
  THIRD = '第3学期',
}

/**
 * 四半期の種類
 */
export enum Quarter {
  Q1 = '第1四半期',
  Q2 = '第2四半期',
  Q3 = '第3四半期',
  Q4 = '第4四半期',
}

/**
 * 学期を判定
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 学期
 */
export function getSemester(dateStr: string): Semester {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;

  // 4-6月: 第1学期、7-9月: 第2学期、10-3月: 第3学期
  if (month >= 4 && month <= 6) {
    return Semester.FIRST;
  } else if (month >= 7 && month <= 9) {
    return Semester.SECOND;
  } else {
    return Semester.THIRD;
  }
}

/**
 * 四半期を判定
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 四半期
 */
export function getQuarter(dateStr: string): Quarter {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;

  if (month >= 1 && month <= 3) {
    return Quarter.Q1;
  } else if (month >= 4 && month <= 6) {
    return Quarter.Q2;
  } else if (month >= 7 && month <= 9) {
    return Quarter.Q3;
  } else {
    return Quarter.Q4;
  }
}

/**
 * 学期の開始日と終了日を取得
 * @param year 年
 * @param semester 学期
 * @returns [開始日, 終了日]
 */
export function getSemesterDates(year: number, semester: Semester): [string, string] {
  let startMonth: number, startDay: number, endMonth: number, endDay: number;

  if (semester === Semester.FIRST) {
    startMonth = 4;
    startDay = 1;
    endMonth = 6;
    endDay = 30;
  } else if (semester === Semester.SECOND) {
    startMonth = 7;
    startDay = 1;
    endMonth = 9;
    endDay = 30;
  } else {
    // 第3学期は前年の10月から当年の3月まで
    startMonth = 10;
    startDay = 1;
    endMonth = 3;
    endDay = 31;
  }

  const startYear = semester === Semester.THIRD ? year - 1 : year;
  const endYear = semester === Semester.THIRD ? year : year;

  return [
    `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
    `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
  ];
}

/**
 * 四半期の開始日と終了日を取得
 * @param year 年
 * @param quarter 四半期
 * @returns [開始日, 終了日]
 */
export function getQuarterDates(year: number, quarter: Quarter): [string, string] {
  let startMonth: number, startDay: number, endMonth: number, endDay: number;

  if (quarter === Quarter.Q1) {
    startMonth = 1;
    startDay = 1;
    endMonth = 3;
    endDay = 31;
  } else if (quarter === Quarter.Q2) {
    startMonth = 4;
    startDay = 1;
    endMonth = 6;
    endDay = 30;
  } else if (quarter === Quarter.Q3) {
    startMonth = 7;
    startDay = 1;
    endMonth = 9;
    endDay = 30;
  } else {
    startMonth = 10;
    startDay = 1;
    endMonth = 12;
    endDay = 31;
  }

  return [
    `${year}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
    `${year}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
  ];
}
