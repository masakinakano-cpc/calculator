/**
 * 相性診断ユーティリティ
 * 2人の生年月日から総合的な相性を診断
 */

import { calculateConstellationCompatibility } from './astrology';
import { calculateNumerologyCompatibility } from './numerology';
import { calculateWeekdayCompatibility } from './weekdayFortune';
import { calculateCompatibility } from './zodiacCalculator';
import { getConstellation } from './astrology';
import { calculateLifePathNumber } from './numerology';
import { getWeekday } from './weekdayFortune';
import { getZodiacFromYear } from './zodiacCalculator';

/**
 * 相性診断結果
 */
export interface CompatibilityResult {
  overallScore: number; // 総合スコア（0-100）
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  constellation: {
    score: number;
    message: string;
  };
  numerology: {
    score: number;
    message: string;
  };
  weekday: {
    score: number;
    message: string;
  };
  zodiac: {
    score: number;
    message: string;
  };
  advice: string;
}

/**
 * 2人の生年月日から総合的な相性を診断
 */
export function calculateOverallCompatibility(
  year1: number, month1: number, day1: number,
  year2: number, month2: number, day2: number
): CompatibilityResult {
  // 各占いの結果を取得
  const constellation1 = getConstellation(month1, day1);
  const constellation2 = getConstellation(month2, day2);
  const lifePath1 = calculateLifePathNumber(year1, month1, day1);
  const lifePath2 = calculateLifePathNumber(year2, month2, day2);
  const weekday1 = getWeekday(year1, month1, day1);
  const weekday2 = getWeekday(year2, month2, day2);
  const zodiac1 = getZodiacFromYear(year1);
  const zodiac2 = getZodiacFromYear(year2);

  // 各相性を計算
  const constellationCompat = calculateConstellationCompatibility(constellation1, constellation2);
  const numerologyCompat = calculateNumerologyCompatibility(lifePath1, lifePath2);
  const weekdayCompat = calculateWeekdayCompatibility(weekday1, weekday2);
  const zodiacCompat = calculateCompatibility(zodiac1, zodiac2);

  // 総合スコアを計算（各相性の平均）
  // 星座、数秘術、曜日はscoreプロパティがあるが、干支はlevelのみなので、scoreを推定
  const zodiacScore = zodiacCompat.level === 'excellent' ? 90 : zodiacCompat.level === 'good' ? 70 : zodiacCompat.level === 'normal' ? 50 : 30;
  const overallScore = Math.round(
    (constellationCompat.score + numerologyCompat.score + weekdayCompat.score + zodiacScore) / 4
  );

  // レベル判定
  let level: 'excellent' | 'good' | 'normal' | 'challenging';
  if (overallScore >= 85) {
    level = 'excellent';
  } else if (overallScore >= 70) {
    level = 'good';
  } else if (overallScore >= 55) {
    level = 'normal';
  } else {
    level = 'challenging';
  }

  // アドバイスを生成
  const advice = generateAdvice(overallScore, level);

  return {
    overallScore,
    level,
    constellation: {
      score: constellationCompat.score,
      message: constellationCompat.message,
    },
    numerology: {
      score: numerologyCompat.score,
      message: numerologyCompat.message,
    },
    weekday: {
      score: weekdayCompat.score,
      message: weekdayCompat.message,
    },
    zodiac: {
      score: zodiacScore,
      message: zodiacCompat.message,
    },
    advice,
  };
}

/**
 * アドバイスを生成
 */
function generateAdvice(
  _score: number,
  level: string
): string {
  if (level === 'excellent') {
    return 'とってもすばらしい相性！おたがいをりかいし、たがいをそんちょうすることで、すてきなかんけいをきずけるよ。いっしょにいて、たのしいことがたくさんありそう！';
  } else if (level === 'good') {
    return 'いい相性だよ！おたがいのちがいをりかいし、たがいをそんちょうすることで、すてきなかんけいになれるね。コミュニケーションをたいせつにしよう！';
  } else if (level === 'normal') {
    return 'バランスのとれた相性だよ。おたがいのちがいをりかいし、たがいをそんちょうすることで、なかよくできるね。コミュニケーションをかかさずに！';
  } else {
    return 'ちょっとチャレンジのある相性だけど、おたがいをりかいし、たがいをそんちょうすることで、すてきなかんけいになれるよ。あきらめずに、コミュニケーションをかかさずに！';
  }
}
