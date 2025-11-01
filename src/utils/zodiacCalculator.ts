/**
 * 干支（Chinese Zodiac）計算ユーティリティ
 */

import { Zodiac } from '../types';

/**
 * 十二支のマッピング（西暦 % 12の余りベース）
 */
const ZODIAC_MAP: Record<number, Zodiac> = {
  0: Zodiac.MONKEY,    // 申 (さる)
  1: Zodiac.ROOSTER,   // 酉 (とり)
  2: Zodiac.DOG,       // 戌 (いぬ)
  3: Zodiac.PIG,       // 亥 (いのしし)
  4: Zodiac.RAT,       // 子 (ねずみ)
  5: Zodiac.OX,        // 丑 (うし)
  6: Zodiac.TIGER,     // 寅 (とら)
  7: Zodiac.RABBIT,    // 卯 (うさぎ)
  8: Zodiac.DRAGON,    // 辰 (たつ)
  9: Zodiac.SNAKE,     // 巳 (へび)
  10: Zodiac.HORSE,    // 午 (うま)
  11: Zodiac.SHEEP,    // 未 (ひつじ)
};

/**
 * 十二支の日本語名
 */
export const ZODIAC_NAMES_JA: Record<Zodiac, string> = {
  [Zodiac.RAT]: 'ねずみ',
  [Zodiac.OX]: 'うし',
  [Zodiac.TIGER]: 'とら',
  [Zodiac.RABBIT]: 'うさぎ',
  [Zodiac.DRAGON]: 'たつ',
  [Zodiac.SNAKE]: 'へび',
  [Zodiac.HORSE]: 'うま',
  [Zodiac.SHEEP]: 'ひつじ',
  [Zodiac.MONKEY]: 'さる',
  [Zodiac.ROOSTER]: 'とり',
  [Zodiac.DOG]: 'いぬ',
  [Zodiac.PIG]: 'いのしし',
};

/**
 * 十二支の漢字表記
 */
export const ZODIAC_KANJI: Record<Zodiac, string> = {
  [Zodiac.RAT]: '子',
  [Zodiac.OX]: '丑',
  [Zodiac.TIGER]: '寅',
  [Zodiac.RABBIT]: '卯',
  [Zodiac.DRAGON]: '辰',
  [Zodiac.SNAKE]: '巳',
  [Zodiac.HORSE]: '午',
  [Zodiac.SHEEP]: '未',
  [Zodiac.MONKEY]: '申',
  [Zodiac.ROOSTER]: '酉',
  [Zodiac.DOG]: '戌',
  [Zodiac.PIG]: '亥',
};

/**
 * 十二支の絵文字
 */
export const ZODIAC_EMOJI: Record<Zodiac, string> = {
  [Zodiac.RAT]: '🐭',
  [Zodiac.OX]: '🐮',
  [Zodiac.TIGER]: '🐯',
  [Zodiac.RABBIT]: '🐰',
  [Zodiac.DRAGON]: '🐲',
  [Zodiac.SNAKE]: '🐍',
  [Zodiac.HORSE]: '🐴',
  [Zodiac.SHEEP]: '🐑',
  [Zodiac.MONKEY]: '🐵',
  [Zodiac.ROOSTER]: '🐔',
  [Zodiac.DOG]: '🐶',
  [Zodiac.PIG]: '🐷',
};

/**
 * 西暦から十二支を計算
 * @param year 西暦年
 * @returns 十二支
 */
export function getZodiacFromYear(year: number): Zodiac {
  const remainder = year % 12;
  return ZODIAC_MAP[remainder];
}

/**
 * 十二支から次の該当年を計算
 * @param zodiac 十二支
 * @param fromYear 基準年（デフォルト: 現在年）
 * @returns 次の該当年
 */
export function getNextYearForZodiac(zodiac: Zodiac, fromYear?: number): number {
  const currentYear = fromYear || new Date().getFullYear();

  // 目標の十二支の余りを見つける
  const targetRemainder = Object.entries(ZODIAC_MAP).find(
    ([_, z]) => z === zodiac
  )?.[0];

  if (targetRemainder === undefined) {
    throw new Error('Invalid zodiac');
  }

  const target = parseInt(targetRemainder);
  const currentRemainder = currentYear % 12;

  // 次の該当年を計算
  let yearsToAdd = target - currentRemainder;
  if (yearsToAdd <= 0) {
    yearsToAdd += 12;
  }

  return currentYear + yearsToAdd;
}

/**
 * 十二支の完全な表示文字列を生成
 * @param zodiac 十二支
 * @returns 表示文字列（例: "辰年 (たつ) 🐲"）
 */
export function getZodiacDisplayString(zodiac: Zodiac): string {
  const kanji = ZODIAC_KANJI[zodiac];
  const hiragana = ZODIAC_NAMES_JA[zodiac];
  const emoji = ZODIAC_EMOJI[zodiac];
  return `${kanji}年 (${hiragana}) ${emoji}`;
}

/**
 * 生まれ年から現在の年齢を計算
 * @param birthYear 生まれ年
 * @param referenceDate 基準日（オプション、デフォルトは今日）
 * @returns 年齢
 */
export function calculateAge(birthYear: number, referenceDate?: Date): number {
  const today = referenceDate || new Date();
  const currentYear = today.getFullYear();
  return currentYear - birthYear;
}

/**
 * 十二支から最も近い過去の生まれ年を取得（年齢が0〜100歳の範囲で）
 * @param zodiac 十二支
 * @returns 最も若い該当年（現在年に最も近い過去の年）
 */
export function getRecentYearForZodiac(zodiac: Zodiac): number {
  const currentYear = new Date().getFullYear();

  // 目標の十二支の余りを見つける
  const targetRemainder = Object.entries(ZODIAC_MAP).find(
    ([_, z]) => z === zodiac
  )?.[0];

  if (targetRemainder === undefined) {
    throw new Error('Invalid zodiac');
  }

  const target = parseInt(targetRemainder);
  const currentRemainder = currentYear % 12;

  // 最も近い過去の該当年を計算
  let yearsBack = currentRemainder - target;
  if (yearsBack < 0) {
    yearsBack += 12;
  }

  // 0歳〜11歳の範囲で返す（最も若い年）
  return currentYear - yearsBack;
}

/**
 * 十二支に該当する全ての年を取得（0〜125歳の範囲）
 * @param zodiac 十二支
 * @param maxAge 最大年齢（デフォルト: 125）
 * @returns 年と年齢のペアの配列（新しい順）
 */
export function getAllYearsForZodiac(zodiac: Zodiac, maxAge: number = 125): Array<{ year: number; age: number }> {
  const currentYear = new Date().getFullYear();
  const baseYear = getRecentYearForZodiac(zodiac);
  const results: Array<{ year: number; age: number }> = [];

  // 最新の年から12年ごとに遡る
  for (let i = 0; i <= Math.floor(maxAge / 12); i++) {
    const year = baseYear - (i * 12);
    const age = currentYear - year;

    if (age >= 0 && age <= maxAge) {
      results.push({ year, age });
    }
  }

  return results;
}

/**
 * 十二支の円盤上の位置情報
 * 12時の位置を0度として、時計回りに配置
 */
export const ZODIAC_POSITIONS: Record<Zodiac, number> = {
  [Zodiac.RAT]: 0,        // 12時 (子)
  [Zodiac.OX]: 30,        // 1時 (丑)
  [Zodiac.TIGER]: 60,     // 2時 (寅)
  [Zodiac.RABBIT]: 90,    // 3時 (卯)
  [Zodiac.DRAGON]: 120,   // 4時 (辰)
  [Zodiac.SNAKE]: 150,    // 5時 (巳)
  [Zodiac.HORSE]: 180,    // 6時 (午)
  [Zodiac.SHEEP]: 210,    // 7時 (未)
  [Zodiac.MONKEY]: 240,   // 8時 (申)
  [Zodiac.ROOSTER]: 270,  // 9時 (酉)
  [Zodiac.DOG]: 300,      // 10時 (戌)
  [Zodiac.PIG]: 330,      // 11時 (亥)
};
