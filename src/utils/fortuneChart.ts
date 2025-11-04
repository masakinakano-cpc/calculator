/**
 * 運勢グラフユーティリティ
 */

import { Constellation } from './astrology';
import { Weekday } from './weekdayFortune';

/**
 * 運勢カテゴリ
 */
export enum FortuneCategory {
  OVERALL = 'overall',  // 総合
  LOVE = 'love',        // 恋愛
  WORK = 'work',        // 仕事
  MONEY = 'money',      // お金
  HEALTH = 'health',    // 健康
}

/**
 * 日ごとの運勢データ
 */
export interface DailyFortuneData {
  date: string; // YYYY-MM-DD
  overall: number;
  love: number;
  work: number;
  money: number;
  health: number;
}

/**
 * 期間の運勢データ
 */
export interface FortuneChartData {
  category: FortuneCategory;
  data: Array<{
    date: string;
    value: number;
  }>;
  average: number;
  max: number;
  min: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * 期間の運勢グラフデータを生成
 */
export function generateFortuneChart(
  constellation: Constellation,
  weekday: Weekday,
  startDate: Date,
  endDate: Date
): FortuneChartData[] {
  const categories = [
    FortuneCategory.OVERALL,
    FortuneCategory.LOVE,
    FortuneCategory.WORK,
    FortuneCategory.MONEY,
    FortuneCategory.HEALTH,
  ];

  return categories.map(category => {
    const data: Array<{ date: string; value: number }> = [];
    const current = new Date(startDate);
    let total = 0;
    let max = 0;
    let min = 5;

    while (current <= endDate) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      const seed = current.getFullYear() * 10000 + (current.getMonth() + 1) * 100 + current.getDate() +
        Object.values(Constellation).indexOf(constellation) * 1000 + weekday * 100;

      const random = (min: number, max: number) => {
        const x = Math.sin(seed * (min + max)) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
      };

      let value = 0;
      if (category === FortuneCategory.OVERALL) {
        value = random(1, 5);
      } else if (category === FortuneCategory.LOVE) {
        value = random(1, 5);
      } else if (category === FortuneCategory.WORK) {
        value = random(1, 5);
      } else if (category === FortuneCategory.MONEY) {
        value = random(1, 5);
      } else {
        value = random(1, 5);
      }

      data.push({ date: dateStr, value });
      total += value;
      max = Math.max(max, value);
      min = Math.min(min, value);

      current.setDate(current.getDate() + 1);
    }

    const average = total / data.length;

    // トレンドを計算（最初の1/3と最後の1/3を比較）
    const firstThird = data.slice(0, Math.floor(data.length / 3));
    const lastThird = data.slice(-Math.floor(data.length / 3));
    const firstAvg = firstThird.reduce((sum, d) => sum + d.value, 0) / firstThird.length;
    const lastAvg = lastThird.reduce((sum, d) => sum + d.value, 0) / lastThird.length;

    let trend: 'up' | 'down' | 'stable';
    if (lastAvg > firstAvg + 0.3) {
      trend = 'up';
    } else if (lastAvg < firstAvg - 0.3) {
      trend = 'down';
    } else {
      trend = 'stable';
    }

    return {
      category,
      data,
      average: Math.round(average * 10) / 10,
      max,
      min,
      trend,
    };
  });
}
