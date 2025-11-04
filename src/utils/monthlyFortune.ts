/**
 * 月間・年間運勢ユーティリティ
 */

import { Constellation } from './astrology';
import { LifePathNumber } from './numerology';
import { Weekday } from './weekdayFortune';
import { Zodiac } from '../types';

/**
 * 日ごとの運勢
 */
export interface DailyFortune {
  date: string; // YYYY-MM-DD
  overall: number; // 1-5
  love: number;
  work: number;
  money: number;
  health: number;
  isLucky: boolean;
  isCaution: boolean;
  luckyTime: string;
  advice: string;
}

/**
 * 月間運勢
 */
export interface MonthlyFortune {
  month: number;
  year: number;
  overall: number;
  love: number;
  work: number;
  money: number;
  health: number;
  luckyDays: string[]; // ラッキー日のリスト
  cautionDays: string[]; // 注意日のリスト
  monthlyAdvice: string;
  dailyFortunes: DailyFortune[];
}

/**
 * 年間運勢
 */
export interface YearlyFortune {
  year: number;
  overall: number;
  love: number;
  work: number;
  money: number;
  health: number;
  luckyMonths: number[];
  cautionMonths: number[];
  yearlyAdvice: string;
  monthlyFortunes: MonthlyFortune[];
}

/**
 * 月間運勢を計算
 */
export function calculateMonthlyFortune(
  constellation: Constellation,
  lifePathNumber: LifePathNumber,
  weekday: Weekday,
  zodiac: Zodiac,
  year: number,
  month: number
): MonthlyFortune {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyFortunes: DailyFortune[] = [];
  const luckyDays: string[] = [];
  const cautionDays: string[] = [];

  let totalOverall = 0;
  let totalLove = 0;
  let totalWork = 0;
  let totalMoney = 0;
  let totalHealth = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const seed = year * 10000 + month * 100 + day +
      Object.values(Constellation).indexOf(constellation) * 1000 +
      lifePathNumber * 100 +
      weekday * 10 +
      Object.values(Zodiac).indexOf(zodiac);

    const random = (min: number, max: number) => {
      const x = Math.sin(seed * (min + max)) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    const overall = random(1, 5);
    const love = random(1, 5);
    const work = random(1, 5);
    const money = random(1, 5);
    const health = random(1, 5);

    totalOverall += overall;
    totalLove += love;
    totalWork += work;
    totalMoney += money;
    totalHealth += health;

    const isLucky = overall >= 4 && (love >= 4 || work >= 4 || money >= 4);
    const isCaution = overall <= 2 || (love <= 2 && work <= 2);

    if (isLucky) luckyDays.push(dateStr);
    if (isCaution) cautionDays.push(dateStr);

    const luckyTimes = ['6:00-8:00', '10:00-12:00', '14:00-16:00', '18:00-20:00'];
    const advices = [
      'きょうはあたらしいことにちょうせんしてみよう！',
      'ともだちをたいせつにするといいことがあるよ。',
      'すこしやすんで、リラックスするじかんをつくろう。',
      'じぶんのきもちをそっちょくにつたえてみて。',
    ];

    dailyFortunes.push({
      date: dateStr,
      overall,
      love,
      work,
      money,
      health,
      isLucky,
      isCaution,
      luckyTime: luckyTimes[random(0, luckyTimes.length - 1)],
      advice: advices[random(0, advices.length - 1)],
    });
  }

  const monthlyAdvices = [
    'この月はあたらしいことにちょうせんするきがつよくなるよ。おうえんしてるよ！',
    'この月はコミュニケーションをたいせつにすると、すてきなことがおこるかも。',
    'この月はゆっくりとすすむことがだいじ。あせらずに、じぶんのペースをまもってね。',
    'この月はたのしいことがたくさんありそう！いっしょにたのしもう！',
  ];

  return {
    month,
    year,
    overall: Math.round(totalOverall / daysInMonth),
    love: Math.round(totalLove / daysInMonth),
    work: Math.round(totalWork / daysInMonth),
    money: Math.round(totalMoney / daysInMonth),
    health: Math.round(totalHealth / daysInMonth),
    luckyDays,
    cautionDays,
    monthlyAdvice: monthlyAdvices[Math.floor(Math.random() * monthlyAdvices.length)],
    dailyFortunes,
  };
}

/**
 * 年間運勢を計算
 */
export function calculateYearlyFortune(
  constellation: Constellation,
  lifePathNumber: LifePathNumber,
  weekday: Weekday,
  zodiac: Zodiac,
  year: number
): YearlyFortune {
  const monthlyFortunes: MonthlyFortune[] = [];
  const luckyMonths: number[] = [];
  const cautionMonths: number[] = [];

  let totalOverall = 0;
  let totalLove = 0;
  let totalWork = 0;
  let totalMoney = 0;
  let totalHealth = 0;

  for (let month = 1; month <= 12; month++) {
    const monthly = calculateMonthlyFortune(constellation, lifePathNumber, weekday, zodiac, year, month);
    monthlyFortunes.push(monthly);

    totalOverall += monthly.overall;
    totalLove += monthly.love;
    totalWork += monthly.work;
    totalMoney += monthly.money;
    totalHealth += monthly.health;

    if (monthly.overall >= 4) {
      luckyMonths.push(month);
    } else if (monthly.overall <= 2) {
      cautionMonths.push(month);
    }
  }

  const yearlyAdvices = [
    `${year}ねんは、あたらしいことにちょうせんするきがつよくなるよ。おうえんしてるよ！`,
    `${year}ねんは、コミュニケーションをたいせつにすると、すてきなことがおこるかも。`,
    `${year}ねんは、ゆっくりとすすむことがだいじ。あせらずに、じぶんのペースをまもってね。`,
    `${year}ねんは、たのしいことがたくさんありそう！いっしょにたのしもう！`,
  ];

  return {
    year,
    overall: Math.round(totalOverall / 12),
    love: Math.round(totalLove / 12),
    work: Math.round(totalWork / 12),
    money: Math.round(totalMoney / 12),
    health: Math.round(totalHealth / 12),
    luckyMonths,
    cautionMonths,
    yearlyAdvice: yearlyAdvices[Math.floor(Math.random() * yearlyAdvices.length)],
    monthlyFortunes,
  };
}
