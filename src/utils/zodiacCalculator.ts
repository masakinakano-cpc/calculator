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

/**
 * 十二支の英語名
 */
export const ZODIAC_NAMES_EN: Record<Zodiac, string> = {
  [Zodiac.RAT]: 'Rat',
  [Zodiac.OX]: 'Ox',
  [Zodiac.TIGER]: 'Tiger',
  [Zodiac.RABBIT]: 'Rabbit',
  [Zodiac.DRAGON]: 'Dragon',
  [Zodiac.SNAKE]: 'Snake',
  [Zodiac.HORSE]: 'Horse',
  [Zodiac.SHEEP]: 'Goat',
  [Zodiac.MONKEY]: 'Monkey',
  [Zodiac.ROOSTER]: 'Rooster',
  [Zodiac.DOG]: 'Dog',
  [Zodiac.PIG]: 'Pig',
};

/**
 * 五行（ごぎょう）: 木火土金水
 */
export enum Element {
  WOOD = 'WOOD',     // 木
  FIRE = 'FIRE',     // 火
  EARTH = 'EARTH',   // 土
  METAL = 'METAL',   // 金
  WATER = 'WATER',   // 水
}

export const ELEMENT_NAMES_JA: Record<Element, string> = {
  [Element.WOOD]: '木',
  [Element.FIRE]: '火',
  [Element.EARTH]: '土',
  [Element.METAL]: '金',
  [Element.WATER]: '水',
};

export const ELEMENT_NAMES_EN: Record<Element, string> = {
  [Element.WOOD]: 'Wood',
  [Element.FIRE]: 'Fire',
  [Element.EARTH]: 'Earth',
  [Element.METAL]: 'Metal',
  [Element.WATER]: 'Water',
};

/**
 * 十二支と五行の対応
 */
export const ZODIAC_ELEMENTS: Record<Zodiac, Element> = {
  [Zodiac.RAT]: Element.WATER,
  [Zodiac.OX]: Element.EARTH,
  [Zodiac.TIGER]: Element.WOOD,
  [Zodiac.RABBIT]: Element.WOOD,
  [Zodiac.DRAGON]: Element.EARTH,
  [Zodiac.SNAKE]: Element.FIRE,
  [Zodiac.HORSE]: Element.FIRE,
  [Zodiac.SHEEP]: Element.EARTH,
  [Zodiac.MONKEY]: Element.METAL,
  [Zodiac.ROOSTER]: Element.METAL,
  [Zodiac.DOG]: Element.EARTH,
  [Zodiac.PIG]: Element.WATER,
};

/**
 * 十二支の性格・特徴
 */
export const ZODIAC_CHARACTERISTICS: Record<Zodiac, {
  personality: string;
  strengths: string[];
  luckyColors: string[];
  luckyNumbers: number[];
}> = {
  [Zodiac.RAT]: {
    personality: 'かしこくて、てきおうりょくがたかい。ちゅういぶかくて、おかねのかんりがとくい',
    strengths: ['ちえがある', 'そうぞうりょくがゆたか', 'きようがきく'],
    luckyColors: ['あお', 'きん', 'みどり'],
    luckyNumbers: [2, 3],
  },
  [Zodiac.OX]: {
    personality: 'まじめで、こつこつとがんばる。しんらいできて、せきにんかんがつよい',
    strengths: ['しんぼうづよい', 'せきにんかんがある', 'せいじつ'],
    luckyColors: ['きいろ', 'みどり', 'しろ'],
    luckyNumbers: [1, 9],
  },
  [Zodiac.TIGER]: {
    personality: 'ゆうかんで、じしんがある。リーダーシップがあり、ぼうけんずき',
    strengths: ['ゆうき', 'じしん', 'じょうねつてき'],
    luckyColors: ['あお', 'はいいろ', 'オレンジ'],
    luckyNumbers: [1, 3, 4],
  },
  [Zodiac.RABBIT]: {
    personality: 'やさしくて、れいぎただしい。へいわをこのみ、げいじゅつてきなセンスがある',
    strengths: ['やさしい', 'しんちょう', 'ゆうが'],
    luckyColors: ['あか', 'ピンク', 'むらさき', 'あお'],
    luckyNumbers: [3, 4, 9],
  },
  [Zodiac.DRAGON]: {
    personality: 'パワフルで、カリスマせいがある。やさしくて、りそうがたかい',
    strengths: ['じしん', 'ちえ', 'ねつれつ'],
    luckyColors: ['きん', 'ぎん', 'しろ'],
    luckyNumbers: [1, 6, 7],
  },
  [Zodiac.SNAKE]: {
    personality: 'かしこくて、ちょっかんがするどい。おちついていて、しんちょう',
    strengths: ['ちてき', 'ちょっかん', 'ミステリアス'],
    luckyColors: ['くろ', 'あか', 'きいろ'],
    luckyNumbers: [2, 8, 9],
  },
  [Zodiac.HORSE]: {
    personality: 'げんきで、じゆうをあいする。しゃこうてきで、たのしいことがすき',
    strengths: ['げんき', 'じゆう', 'がんばりや'],
    luckyColors: ['きいろ', 'みどり'],
    luckyNumbers: [2, 3, 7],
  },
  [Zodiac.SHEEP]: {
    personality: 'やさしくて、おだやか。げいじゅつてきで、かぞくをたいせつにする',
    strengths: ['やさしい', 'そうぞうりょく', 'おもいやり'],
    luckyColors: ['みどり', 'あか', 'むらさき'],
    luckyNumbers: [3, 4, 9],
  },
  [Zodiac.MONKEY]: {
    personality: 'あたまがよくて、ユーモアがある。きようで、てきおうりょくがたかい',
    strengths: ['あたまがいい', 'おもしろい', 'きようがきく'],
    luckyColors: ['しろ', 'あお', 'きん'],
    luckyNumbers: [1, 7, 8],
  },
  [Zodiac.ROOSTER]: {
    personality: 'しっかりしていて、せいかくにこうどうする。じしんがあり、まじめ',
    strengths: ['せいかく', 'じしん', 'まじめ'],
    luckyColors: ['きん', 'ちゃいろ', 'きいろ'],
    luckyNumbers: [5, 7, 8],
  },
  [Zodiac.DOG]: {
    personality: 'ちゅうじつで、しんらいできる。まじめで、せいぎかんがつよい',
    strengths: ['ちゅうじつ', 'ゆうかん', 'せきにんかん'],
    luckyColors: ['あか', 'みどり', 'むらさき'],
    luckyNumbers: [3, 4, 9],
  },
  [Zodiac.PIG]: {
    personality: 'やさしくて、しょうじき。かぞくおもいで、たのしいことがすき',
    strengths: ['やさしい', 'しょうじき', 'ゆたか'],
    luckyColors: ['きいろ', 'はいいろ', 'ちゃいろ', 'きん'],
    luckyNumbers: [2, 5, 8],
  },
};

/**
 * 十二支の相性（最高の相性）
 */
export const ZODIAC_BEST_MATCHES: Record<Zodiac, Zodiac[]> = {
  [Zodiac.RAT]: [Zodiac.DRAGON, Zodiac.MONKEY, Zodiac.OX],
  [Zodiac.OX]: [Zodiac.RAT, Zodiac.SNAKE, Zodiac.ROOSTER],
  [Zodiac.TIGER]: [Zodiac.HORSE, Zodiac.DOG, Zodiac.PIG],
  [Zodiac.RABBIT]: [Zodiac.SHEEP, Zodiac.PIG, Zodiac.DOG],
  [Zodiac.DRAGON]: [Zodiac.RAT, Zodiac.MONKEY, Zodiac.ROOSTER],
  [Zodiac.SNAKE]: [Zodiac.OX, Zodiac.ROOSTER, Zodiac.MONKEY],
  [Zodiac.HORSE]: [Zodiac.TIGER, Zodiac.SHEEP, Zodiac.DOG],
  [Zodiac.SHEEP]: [Zodiac.RABBIT, Zodiac.HORSE, Zodiac.PIG],
  [Zodiac.MONKEY]: [Zodiac.RAT, Zodiac.DRAGON, Zodiac.SNAKE],
  [Zodiac.ROOSTER]: [Zodiac.OX, Zodiac.SNAKE, Zodiac.DRAGON],
  [Zodiac.DOG]: [Zodiac.TIGER, Zodiac.RABBIT, Zodiac.HORSE],
  [Zodiac.PIG]: [Zodiac.RABBIT, Zodiac.SHEEP, Zodiac.TIGER],
};

/**
 * 十二支の相性（注意が必要）
 */
export const ZODIAC_CHALLENGING_MATCHES: Record<Zodiac, Zodiac[]> = {
  [Zodiac.RAT]: [Zodiac.HORSE, Zodiac.ROOSTER],
  [Zodiac.OX]: [Zodiac.SHEEP, Zodiac.HORSE, Zodiac.DOG],
  [Zodiac.TIGER]: [Zodiac.SNAKE, Zodiac.MONKEY],
  [Zodiac.RABBIT]: [Zodiac.ROOSTER, Zodiac.RAT],
  [Zodiac.DRAGON]: [Zodiac.DOG, Zodiac.DRAGON],
  [Zodiac.SNAKE]: [Zodiac.TIGER, Zodiac.PIG],
  [Zodiac.HORSE]: [Zodiac.RAT, Zodiac.OX],
  [Zodiac.SHEEP]: [Zodiac.OX, Zodiac.DOG],
  [Zodiac.MONKEY]: [Zodiac.TIGER, Zodiac.PIG],
  [Zodiac.ROOSTER]: [Zodiac.RABBIT, Zodiac.ROOSTER],
  [Zodiac.DOG]: [Zodiac.DRAGON, Zodiac.SHEEP, Zodiac.OX],
  [Zodiac.PIG]: [Zodiac.SNAKE, Zodiac.MONKEY],
};

/**
 * 十二支の由来・歴史
 */
export const ZODIAC_HISTORY = `
十二支（じゅうにし）は、中国からつたわった、ねん・つき・ひ・じかんをあらわすほうほうだよ。

むかしむかし、かみさまが「おしょうがつのあさ、さいしょにきた12ひきの どうぶつを、ねんのかみさまにするよ！」と いったんだ。

ねずみは うしのせなかに のって いちばんに とうちゃく！それで ねずみ が いちばんに なったんだって。

日本では やく1400ねんまえから つかわれていて、いまでも おしょうがつや ねんがじょう で みることが できるね。
`;

/**
 * 2つの干支の相性を計算
 */
export function calculateCompatibility(zodiac1: Zodiac, zodiac2: Zodiac): {
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  message: string;
} {
  // 同じ干支
  if (zodiac1 === zodiac2) {
    return {
      level: 'good',
      message: 'おなじ干支どうしは、おたがいをよく理解できるよ！',
    };
  }

  // 最高の相性
  if (ZODIAC_BEST_MATCHES[zodiac1].includes(zodiac2)) {
    return {
      level: 'excellent',
      message: 'とってもいい相性！いっしょにいると、たのしいことがたくさんありそう！',
    };
  }

  // 注意が必要
  if (ZODIAC_CHALLENGING_MATCHES[zodiac1].includes(zodiac2)) {
    return {
      level: 'challenging',
      message: 'ちがいがあるけど、おたがいを理解すれば、いい友だちになれるよ！',
    };
  }

  // 普通の相性
  return {
    level: 'normal',
    message: 'バランスのとれた相性だよ！なかよくできるね。',
  };
}

/**
 * 年齢から生まれた可能性がある年を計算
 */
export function getYearFromAge(age: number): number[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // 誕生日前か後かで2つの可能性がある
  if (currentMonth < 3) { // 1-3月は前の年も可能性あり
    return [currentYear - age, currentYear - age - 1];
  }

  return [currentYear - age];
}
