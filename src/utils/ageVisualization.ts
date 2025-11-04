/**
 * 年齢の可視化ユーティリティ
 */

import { calculateAge as calculateAgeFromDate } from './dateCalculatorExtended';

/**
 * 年齢の詳細情報
 */
export interface AgeDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  percentageOfYear: number; // 年間の何%経過したか
  percentageOfMonth: number; // 月間の何%経過したか
}

/**
 * 年齢の詳細情報を取得
 * @param birthDateStr 生年月日 (YYYY-MM-DD)
 * @param referenceDateStr 基準日 (YYYY-MM-DD、省略時は今日)
 * @returns 年齢の詳細情報
 */
export function getAgeDetails(birthDateStr: string, referenceDateStr?: string): AgeDetails {
  const age = calculateAgeFromDate(birthDateStr, referenceDateStr);
  const totalMonths = age.years * 12 + age.months;
  const percentageOfYear = (age.months * 30 + age.days) / 365;
  const percentageOfMonth = age.days / 30;

  return {
    years: age.years,
    months: age.months,
    days: age.days,
    totalDays: age.totalDays,
    totalMonths,
    percentageOfYear,
    percentageOfMonth,
  };
}

/**
 * 複数の年齢を比較
 * @param birthDates 生年月日の配列
 * @returns 年齢差の情報
 */
export function compareAges(birthDates: string[]): Array<{
  date: string;
  age: AgeDetails;
  difference: {
    years: number;
    months: number;
    days: number;
  };
}> {
  const ages = birthDates.map(date => ({
    date,
    age: getAgeDetails(date),
  }));

  // 最も若い人を基準にする
  const youngest = ages.reduce((min, current) =>
    current.age.totalDays < min.age.totalDays ? current : min
  );

  return ages.map(item => {
    const diffDays = item.age.totalDays - youngest.age.totalDays;
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    return {
      date: item.date,
      age: item.age,
      difference: {
        years,
        months,
        days,
      },
    };
  });
}
