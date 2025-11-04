/**
 * 日付計算拡張ユーティリティ
 * 年齢、学年、卒業年度、和暦、季節、記念日などの計算機能
 */

import { addDays, dateDifference, getToday } from './dateCalculator';

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
 * 元号の種類
 */
export enum Era {
  MEIJI = '明治',
  TAISHO = '大正',
  SHOWA = '昭和',
  HEISEI = '平成',
  REIWA = '令和',
}

/**
 * 元号の開始日
 */
const ERA_START_DATES: Record<Era, string> = {
  [Era.MEIJI]: '1868-01-25',
  [Era.TAISHO]: '1912-07-30',
  [Era.SHOWA]: '1926-12-25',
  [Era.HEISEI]: '1989-01-08',
  [Era.REIWA]: '2019-05-01',
};

/**
 * 和暦情報を取得
 */
export function getJapaneseEra(dateStr: string): { era: Era; year: number; fullString: string } {
  const date = new Date(dateStr);

  if (date >= new Date(ERA_START_DATES[Era.REIWA])) {
    const year = date.getFullYear() - 2018;
    return { era: Era.REIWA, year, fullString: `令和${year}年` };
  } else if (date >= new Date(ERA_START_DATES[Era.HEISEI])) {
    const year = date.getFullYear() - 1988;
    return { era: Era.HEISEI, year, fullString: `平成${year}年` };
  } else if (date >= new Date(ERA_START_DATES[Era.SHOWA])) {
    const year = date.getFullYear() - 1925;
    return { era: Era.SHOWA, year, fullString: `昭和${year}年` };
  } else if (date >= new Date(ERA_START_DATES[Era.TAISHO])) {
    const year = date.getFullYear() - 1911;
    return { era: Era.TAISHO, year, fullString: `大正${year}年` };
  } else if (date >= new Date(ERA_START_DATES[Era.MEIJI])) {
    const year = date.getFullYear() - 1867;
    return { era: Era.MEIJI, year, fullString: `明治${year}年` };
  } else {
    return { era: Era.MEIJI, year: 1, fullString: '明治以前' };
  }
}

/**
 * 曜日を取得（日付文字列から）
 */
export function getWeekdayFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdays = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
  return weekdays[date.getDay()];
}

/**
 * 曜日の絵文字
 */
export function getWeekdayEmojiFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  const emojis = ['☀️', '🌙', '🔥', '💧', '🌳', '✨', '土'];
  return emojis[date.getDay()];
}

/**
 * うるう年か判定
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 1年の何日目か計算
 */
export function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 季節を判定
 */
export function getSeason(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) return 'はる';
  if (month >= 6 && month <= 8) return 'なつ';
  if (month >= 9 && month <= 11) return 'あき';
  return 'ふゆ';
}

/**
 * 年齢を計算
 */
export function calculateAge(birthDateStr: string, referenceDateStr: string = getToday()): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const birth = new Date(birthDateStr);
  const reference = new Date(referenceDateStr);

  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  let days = reference.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = dateDifference(birthDateStr, referenceDateStr);

  return { years, months, days, totalDays };
}

/**
 * 学年を計算（小学校）
 */
export function getGrade(birthDateStr: string, referenceDateStr: string = getToday()): {
  schoolType: string;
  grade: number;
  schoolYear: number;
} {
  const birth = new Date(birthDateStr);
  const reference = new Date(referenceDateStr);

  // 4月1日時点での年齢を基準にする
  const schoolYearStart = new Date(reference.getFullYear(), 3, 1); // 4月1日
  const ageDate = reference < schoolYearStart
    ? new Date(reference.getFullYear() - 1, 3, 1)
    : schoolYearStart;

  let age = ageDate.getFullYear() - birth.getFullYear();
  if (ageDate.getMonth() < birth.getMonth() ||
      (ageDate.getMonth() === birth.getMonth() && ageDate.getDate() < birth.getDate())) {
    age--;
  }

  if (age >= 6 && age <= 11) {
    return { schoolType: 'しょうがっこう', grade: age - 5, schoolYear: ageDate.getFullYear() };
  } else if (age >= 12 && age <= 14) {
    return { schoolType: 'ちゅうがっこう', grade: age - 11, schoolYear: ageDate.getFullYear() };
  } else if (age >= 15 && age <= 17) {
    return { schoolType: 'こうこう', grade: age - 14, schoolYear: ageDate.getFullYear() };
  } else if (age >= 18 && age <= 21) {
    return { schoolType: 'だいがく', grade: age - 17, schoolYear: ageDate.getFullYear() };
  } else {
    return { schoolType: 'がっこう', grade: 0, schoolYear: ageDate.getFullYear() };
  }
}

/**
 * 卒業年度を計算
 */
export function getGraduationYear(birthDateStr: string, schoolType: 'elementary' | 'junior' | 'high' | 'university'): number {
  const birth = new Date(birthDateStr);
  const birthYear = birth.getFullYear();
  const birthMonth = birth.getMonth() + 1;

  // 4月1日以前生まれはその年、4月2日以降は翌年
  const schoolYear = birthMonth <= 4 ? birthYear : birthYear + 1;

  const graduationYears = {
    elementary: schoolYear + 6,    // 小学校卒業
    junior: schoolYear + 9,         // 中学校卒業
    high: schoolYear + 12,           // 高校卒業
    university: schoolYear + 16,    // 大学卒業（4年制）
  };

  return graduationYears[schoolType];
}

/**
 * 記念日までの日数を計算
 */
export function daysUntilAnniversary(birthDateStr: string, referenceDateStr: string = getToday()): number {
  const birth = new Date(birthDateStr);
  const reference = new Date(referenceDateStr);
  const thisYear = new Date(reference.getFullYear(), birth.getMonth(), birth.getDate());
  const nextYear = new Date(reference.getFullYear() + 1, birth.getMonth(), birth.getDate());

  const target = thisYear > reference ? thisYear : nextYear;
  const targetStr = formatDate(target);
  return dateDifference(referenceDateStr, targetStr);
}

/**
 * 特定のイベントまでの日数を計算
 */
export function daysUntilEvent(eventMonth: number, eventDay: number, referenceDateStr: string = getToday()): number {
  const reference = new Date(referenceDateStr);
  const thisYear = new Date(reference.getFullYear(), eventMonth - 1, eventDay);
  const nextYear = new Date(reference.getFullYear() + 1, eventMonth - 1, eventDay);

  const target = thisYear > reference ? thisYear : nextYear;
  const targetStr = formatDate(target);
  return dateDifference(referenceDateStr, targetStr);
}

/**
 * 日付の差分を詳細に計算
 */
export function dateDifferenceDetailed(date1Str: string, date2Str: string): {
  years: number;
  months: number;
  days: number;
  weeks: number;
  totalDays: number;
} {
  const totalDays = dateDifference(date1Str, date2Str);
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  let years = date2.getFullYear() - date1.getFullYear();
  let months = date2.getMonth() - date1.getMonth();
  let days = date2.getDate() - date1.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(totalDays / 7);

  return { years, months, days, weeks, totalDays };
}

/**
 * 日付に週を加算
 */
export function addWeeks(dateStr: string, weeks: number): string {
  return addDays(dateStr, weeks * 7);
}

/**
 * 今日からの日数を計算
 */
export function daysFromToday(dateStr: string): number {
  const today = getToday();
  return dateDifference(today, dateStr);
}

/**
 * 〇歳の誕生日を計算
 */
export function getBirthdayAtAge(birthDateStr: string, targetAge: number): string {
  const birth = new Date(birthDateStr);
  const targetYear = birth.getFullYear() + targetAge;
  const targetDate = new Date(targetYear, birth.getMonth(), birth.getDate());
  return formatDate(targetDate);
}

/**
 * 〇年〇月生まれは何年生かを計算
 */
export function getGradeFromBirthMonth(birthYear: number, birthMonth: number, referenceYear: number, referenceMonth: number): {
  grade: number;
  schoolType: string;
} {
  // 4月1日時点での年齢を基準
  const schoolYear = referenceMonth >= 4 ? referenceYear : referenceYear - 1;
  const age = schoolYear - birthYear;

  if (birthMonth > 4) {
    // 4月2日以降生まれは1つ下の学年
    const adjustedAge = age - 1;
    if (adjustedAge >= 6 && adjustedAge <= 11) {
      return { grade: adjustedAge - 5, schoolType: 'しょうがっこう' };
    } else if (adjustedAge >= 12 && adjustedAge <= 14) {
      return { grade: adjustedAge - 11, schoolType: 'ちゅうがっこう' };
    } else if (adjustedAge >= 15 && adjustedAge <= 17) {
      return { grade: adjustedAge - 14, schoolType: 'こうこう' };
    }
  } else {
    if (age >= 6 && age <= 11) {
      return { grade: age - 5, schoolType: 'しょうがっこう' };
    } else if (age >= 12 && age <= 14) {
      return { grade: age - 11, schoolType: 'ちゅうがっこう' };
    } else if (age >= 15 && age <= 17) {
      return { grade: age - 14, schoolType: 'こうこう' };
    }
  }

  return { grade: 0, schoolType: 'そのた' };
}
