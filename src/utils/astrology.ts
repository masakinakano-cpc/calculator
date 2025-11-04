/**
 * Astrology (星座占い) Utilities
 * Western zodiac constellation-based fortune telling
 */

export enum Constellation {
  ARIES = 'ARIES',           // 牡羊座 (おひつじざ) 3/21-4/19
  TAURUS = 'TAURUS',         // 牡牛座 (おうしざ) 4/20-5/20
  GEMINI = 'GEMINI',         // 双子座 (ふたござ) 5/21-6/21
  CANCER = 'CANCER',         // 蟹座 (かにざ) 6/22-7/22
  LEO = 'LEO',               // 獅子座 (ししざ) 7/23-8/22
  VIRGO = 'VIRGO',           // 乙女座 (おとめざ) 8/23-9/22
  LIBRA = 'LIBRA',           // 天秤座 (てんびんざ) 9/23-10/23
  SCORPIO = 'SCORPIO',       // 蠍座 (さそりざ) 10/24-11/22
  SAGITTARIUS = 'SAGITTARIUS', // 射手座 (いてざ) 11/23-12/21
  CAPRICORN = 'CAPRICORN',   // 山羊座 (やぎざ) 12/22-1/19
  AQUARIUS = 'AQUARIUS',     // 水瓶座 (みずがめざ) 1/20-2/18
  PISCES = 'PISCES',         // 魚座 (うおざ) 2/19-3/20
}

export const CONSTELLATION_NAMES_JP: Record<Constellation, string> = {
  [Constellation.ARIES]: '牡羊座',
  [Constellation.TAURUS]: '牡牛座',
  [Constellation.GEMINI]: '双子座',
  [Constellation.CANCER]: '蟹座',
  [Constellation.LEO]: '獅子座',
  [Constellation.VIRGO]: '乙女座',
  [Constellation.LIBRA]: '天秤座',
  [Constellation.SCORPIO]: '蠍座',
  [Constellation.SAGITTARIUS]: '射手座',
  [Constellation.CAPRICORN]: '山羊座',
  [Constellation.AQUARIUS]: '水瓶座',
  [Constellation.PISCES]: '魚座',
};

export const CONSTELLATION_NAMES_HIRAGANA: Record<Constellation, string> = {
  [Constellation.ARIES]: 'おひつじざ',
  [Constellation.TAURUS]: 'おうしざ',
  [Constellation.GEMINI]: 'ふたござ',
  [Constellation.CANCER]: 'かにざ',
  [Constellation.LEO]: 'ししざ',
  [Constellation.VIRGO]: 'おとめざ',
  [Constellation.LIBRA]: 'てんびんざ',
  [Constellation.SCORPIO]: 'さそりざ',
  [Constellation.SAGITTARIUS]: 'いてざ',
  [Constellation.CAPRICORN]: 'やぎざ',
  [Constellation.AQUARIUS]: 'みずがめざ',
  [Constellation.PISCES]: 'うおざ',
};

export const CONSTELLATION_SYMBOLS: Record<Constellation, string> = {
  [Constellation.ARIES]: '♈',
  [Constellation.TAURUS]: '♉',
  [Constellation.GEMINI]: '♊',
  [Constellation.CANCER]: '♋',
  [Constellation.LEO]: '♌',
  [Constellation.VIRGO]: '♍',
  [Constellation.LIBRA]: '♎',
  [Constellation.SCORPIO]: '♏',
  [Constellation.SAGITTARIUS]: '♐',
  [Constellation.CAPRICORN]: '♑',
  [Constellation.AQUARIUS]: '♒',
  [Constellation.PISCES]: '♓',
};

export enum AstrologyElement {
  FIRE = 'FIRE',       // 火 (情熱・行動)
  EARTH = 'EARTH',     // 地 (安定・現実)
  AIR = 'AIR',         // 風 (知性・コミュニケーション)
  WATER = 'WATER',     // 水 (感情・直感)
}

export const CONSTELLATION_ELEMENTS: Record<Constellation, AstrologyElement> = {
  [Constellation.ARIES]: AstrologyElement.FIRE,
  [Constellation.TAURUS]: AstrologyElement.EARTH,
  [Constellation.GEMINI]: AstrologyElement.AIR,
  [Constellation.CANCER]: AstrologyElement.WATER,
  [Constellation.LEO]: AstrologyElement.FIRE,
  [Constellation.VIRGO]: AstrologyElement.EARTH,
  [Constellation.LIBRA]: AstrologyElement.AIR,
  [Constellation.SCORPIO]: AstrologyElement.WATER,
  [Constellation.SAGITTARIUS]: AstrologyElement.FIRE,
  [Constellation.CAPRICORN]: AstrologyElement.EARTH,
  [Constellation.AQUARIUS]: AstrologyElement.AIR,
  [Constellation.PISCES]: AstrologyElement.WATER,
};

export const ELEMENT_NAMES_JP: Record<AstrologyElement, string> = {
  [AstrologyElement.FIRE]: '火',
  [AstrologyElement.EARTH]: '地',
  [AstrologyElement.AIR]: '風',
  [AstrologyElement.WATER]: '水',
};

export const CONSTELLATION_CHARACTERISTICS: Record<Constellation, {
  personality: string;
  strengths: string[];
  weaknesses: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  emoji: string;
}> = {
  [Constellation.ARIES]: {
    personality: 'じょうねつてきで、なにごとにもせっきょくてきにちょうせんするせいかく。リーダーシップがあり、ゆうきがある。',
    strengths: ['ゆうかん', 'せっきょくてき', 'じしんがある', 'せいちょくである'],
    weaknesses: ['せっかち', 'わがまま', 'こうきしん', 'かんじょうてき'],
    luckyColors: ['赤', 'オレンジ'],
    luckyNumbers: [1, 9],
    emoji: '🐏',
  },
  [Constellation.TAURUS]: {
    personality: 'おちついていて、しんらいできるせいかく。けいぞくりょくがあり、げんじつてきにものごとをかんがえる。',
    strengths: ['しんらいできる', 'けいぞくりょく', 'じっさいてき', 'ちゅうじつ'],
    weaknesses: ['がんこ', 'しつこい', 'へんかがにがて', 'しょゆうよくがつよい'],
    luckyColors: ['緑', 'ピンク'],
    luckyNumbers: [6, 2],
    emoji: '🐂',
  },
  [Constellation.GEMINI]: {
    personality: 'こうきしんおうせいで、コミュニケーションのうりょくがたかい。さまざまなことにきょうみをもつ。',
    strengths: ['てきおうりょく', 'ちせい', 'しゃこうてき', 'ユーモアがある'],
    weaknesses: ['あきっぽい', 'きまぐれ', 'しんけいしつ', 'いちかんせいがない'],
    luckyColors: ['黄色', '水色'],
    luckyNumbers: [5, 3],
    emoji: '👯',
  },
  [Constellation.CANCER]: {
    personality: 'やさしくて、かぞくやともだちをたいせつにするせいかく。ちょっかんりょくがつよく、かんじょうゆたか。',
    strengths: ['やさしい', 'きょうかんりょく', 'ちゅうぎしん', 'まもるちから'],
    weaknesses: ['かんじょうてき', 'きにしやすい', 'じぶんをとじこめる', 'きぶんや'],
    luckyColors: ['白', '銀'],
    luckyNumbers: [2, 7],
    emoji: '🦀',
  },
  [Constellation.LEO]: {
    personality: 'じしんにあふれ、そんざいかんがある。リーダーシップがあり、そうぞうてきである。',
    strengths: ['リーダーシップ', 'きどう', 'そうぞうりょく', 'ねっしん'],
    weaknesses: ['プライドがたかい', 'わがまま', 'しはいてき', 'かんしょうてき'],
    luckyColors: ['金', '黄色'],
    luckyNumbers: [1, 5],
    emoji: '🦁',
  },
  [Constellation.VIRGO]: {
    personality: 'せいかくで、ぶんせきてき。さいのうやせいじつさがあり、こまかいことにきづく。',
    strengths: ['せいかく', 'ぶんせきりょく', 'せいじつ', 'きんべん'],
    weaknesses: ['しんぱいしょう', 'ひはんてき', 'かんぺきしゅぎ', 'こだわりすぎる'],
    luckyColors: ['茶色', '緑'],
    luckyNumbers: [5, 14],
    emoji: '👧',
  },
  [Constellation.LIBRA]: {
    personality: 'バランスかんかくがあり、こうへいである。しゃこうてきで、ちょうわをたいせつにする。',
    strengths: ['こうへい', 'しゃこうてき', 'バランスかんかく', 'がいこうてき'],
    weaknesses: ['ゆうじゅうふだん', 'けつだんりょくがない', 'たにんにたよる', 'ひょうめんてき'],
    luckyColors: ['ピンク', '青'],
    luckyNumbers: [6, 9],
    emoji: '⚖️',
  },
  [Constellation.SCORPIO]: {
    personality: 'じょうねつてきで、しゅうちゅうりょくがある。しんみつけいがつよく、ちょっかんてきである。',
    strengths: ['じょうねつてき', 'ちゅうせいしん', 'ゆうき', 'ちょっかんりょく'],
    weaknesses: ['しっとぶかい', 'ひみつしゅぎ', 'しゅうねんぶかい', 'うたがいぶかい'],
    luckyColors: ['赤', '黒'],
    luckyNumbers: [8, 11],
    emoji: '🦂',
  },
  [Constellation.SAGITTARIUS]: {
    personality: 'ぼうけんしんがあり、らくてんてきである。じゆうをあいし、せつがくてきである。',
    strengths: ['らくてんてき', 'ぼうけんしん', 'せいちょく', 'せつがくてき'],
    weaknesses: ['むせきにん', 'はいりょふそく', 'せっかち', 'やくそくをやぶる'],
    luckyColors: ['紫', '青'],
    luckyNumbers: [3, 9],
    emoji: '🏹',
  },
  [Constellation.CAPRICORN]: {
    personality: 'せきにんかんがつよく、きりつをまもる。やしんがあり、じっせんてきである。',
    strengths: ['せきにんかん', 'きりつ', 'やしん', 'じっせんてき'],
    weaknesses: ['かたくるしい', 'ひかんてき', 'がんこ', 'れいたんである'],
    luckyColors: ['黒', '茶色'],
    luckyNumbers: [8, 10],
    emoji: '🐐',
  },
  [Constellation.AQUARIUS]: {
    personality: 'どくそうてきで、かくしんてきである。じんどうしゅぎてきで、ちてきである。',
    strengths: ['どくそうてき', 'かくしんてき', 'じんどうてき', 'ちてき'],
    weaknesses: ['かわりもの', 'かんじょうのうすい', 'かたくな', 'よそういじ'],
    luckyColors: ['水色', '銀'],
    luckyNumbers: [4, 11],
    emoji: '🏺',
  },
  [Constellation.PISCES]: {
    personality: 'やさしくて、きょうかんりょくがたかい。げいじゅつてきで、ちょっかんてきである。',
    strengths: ['やさしい', 'きょうかんりょく', 'げいじゅつてき', 'ちょっかんてき'],
    weaknesses: ['げんじつとうひ', 'ゆうじゅうふだん', 'だまされやすい', 'ぎせいてき'],
    luckyColors: ['紫', '緑'],
    luckyNumbers: [3, 7],
    emoji: '🐟',
  },
};

// Compatibility matrix (星座相性)
export const CONSTELLATION_BEST_MATCHES: Record<Constellation, Constellation[]> = {
  [Constellation.ARIES]: [Constellation.LEO, Constellation.SAGITTARIUS, Constellation.GEMINI],
  [Constellation.TAURUS]: [Constellation.VIRGO, Constellation.CAPRICORN, Constellation.CANCER],
  [Constellation.GEMINI]: [Constellation.LIBRA, Constellation.AQUARIUS, Constellation.ARIES],
  [Constellation.CANCER]: [Constellation.SCORPIO, Constellation.PISCES, Constellation.TAURUS],
  [Constellation.LEO]: [Constellation.ARIES, Constellation.SAGITTARIUS, Constellation.LIBRA],
  [Constellation.VIRGO]: [Constellation.TAURUS, Constellation.CAPRICORN, Constellation.SCORPIO],
  [Constellation.LIBRA]: [Constellation.GEMINI, Constellation.AQUARIUS, Constellation.LEO],
  [Constellation.SCORPIO]: [Constellation.CANCER, Constellation.PISCES, Constellation.VIRGO],
  [Constellation.SAGITTARIUS]: [Constellation.ARIES, Constellation.LEO, Constellation.AQUARIUS],
  [Constellation.CAPRICORN]: [Constellation.TAURUS, Constellation.VIRGO, Constellation.PISCES],
  [Constellation.AQUARIUS]: [Constellation.GEMINI, Constellation.LIBRA, Constellation.SAGITTARIUS],
  [Constellation.PISCES]: [Constellation.CANCER, Constellation.SCORPIO, Constellation.CAPRICORN],
};

export const CONSTELLATION_CHALLENGING_MATCHES: Record<Constellation, Constellation[]> = {
  [Constellation.ARIES]: [Constellation.CANCER, Constellation.CAPRICORN],
  [Constellation.TAURUS]: [Constellation.LEO, Constellation.AQUARIUS],
  [Constellation.GEMINI]: [Constellation.VIRGO, Constellation.PISCES],
  [Constellation.CANCER]: [Constellation.ARIES, Constellation.LIBRA],
  [Constellation.LEO]: [Constellation.TAURUS, Constellation.SCORPIO],
  [Constellation.VIRGO]: [Constellation.GEMINI, Constellation.SAGITTARIUS],
  [Constellation.LIBRA]: [Constellation.CANCER, Constellation.CAPRICORN],
  [Constellation.SCORPIO]: [Constellation.LEO, Constellation.AQUARIUS],
  [Constellation.SAGITTARIUS]: [Constellation.VIRGO, Constellation.PISCES],
  [Constellation.CAPRICORN]: [Constellation.ARIES, Constellation.LIBRA],
  [Constellation.AQUARIUS]: [Constellation.TAURUS, Constellation.SCORPIO],
  [Constellation.PISCES]: [Constellation.GEMINI, Constellation.SAGITTARIUS],
};

/**
 * Calculate constellation from birth date
 */
export function getConstellation(month: number, day: number): Constellation {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return Constellation.ARIES;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return Constellation.TAURUS;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return Constellation.GEMINI;
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return Constellation.CANCER;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return Constellation.LEO;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return Constellation.VIRGO;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return Constellation.LIBRA;
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return Constellation.SCORPIO;
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return Constellation.SAGITTARIUS;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return Constellation.CAPRICORN;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return Constellation.AQUARIUS;
  return Constellation.PISCES; // (2/19-3/20)
}

/**
 * Calculate compatibility between two constellations
 */
export function calculateConstellationCompatibility(
  constellation1: Constellation,
  constellation2: Constellation
): {
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  score: number; // 0-100
  message: string;
} {
  if (constellation1 === constellation2) {
    return {
      level: 'good',
      score: 75,
      message: 'おなじせいざどうし！おたがいをよくりかいできるよ。',
    };
  }

  const bestMatches = CONSTELLATION_BEST_MATCHES[constellation1];
  const challenging = CONSTELLATION_CHALLENGING_MATCHES[constellation1];

  if (bestMatches.includes(constellation2)) {
    return {
      level: 'excellent',
      score: 95,
      message: 'さいこうのあいしょう！おたがいにそんけいしあえるそんざいだよ。',
    };
  }

  if (challenging.includes(constellation2)) {
    return {
      level: 'challenging',
      score: 40,
      message: 'すこしむずかしいあいしょう。でも、ちがいをみとめあえばだいじょうぶ！',
    };
  }

  // Check element compatibility
  const element1 = CONSTELLATION_ELEMENTS[constellation1];
  const element2 = CONSTELLATION_ELEMENTS[constellation2];

  if (element1 === element2) {
    return {
      level: 'good',
      score: 80,
      message: 'おなじエレメントで、かんがえかたがにている。いいあいしょうだよ！',
    };
  }

  // Fire + Air, Earth + Water are compatible
  if (
    (element1 === AstrologyElement.FIRE && element2 === AstrologyElement.AIR) ||
    (element1 === AstrologyElement.AIR && element2 === AstrologyElement.FIRE) ||
    (element1 === AstrologyElement.EARTH && element2 === AstrologyElement.WATER) ||
    (element1 === AstrologyElement.WATER && element2 === AstrologyElement.EARTH)
  ) {
    return {
      level: 'good',
      score: 70,
      message: 'エレメントのそうせいがいい！たがいをたすけあえるあいしょうだよ。',
    };
  }

  return {
    level: 'normal',
    score: 60,
    message: 'ふつうのあいしょう。おたがいをりかいすることがだいじだよ。',
  };
}

/**
 * Get today's fortune for a constellation
 */
export function getTodaysFortune(constellation: Constellation): {
  overall: number; // 1-5 stars
  love: number;
  work: number;
  money: number;
  health: number;
  luckyItem: string;
  luckyColor: string;
  advice: string;
} {
  // Generate semi-random fortune based on date and constellation
  const today = new Date();
  const seed = today.getDate() + today.getMonth() * 31 + Object.values(Constellation).indexOf(constellation);

  const random = (min: number, max: number) => {
    const x = Math.sin(seed * (min + max)) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const luckyItems = [
    'えんぴつ', 'ほん', 'おかし', 'くつ', 'ぼうし', 'かばん',
    'てちょう', 'はな', 'おんがく', 'えがお', 'みず', 'そら'
  ];

  const advice = [
    'きょうはあたらしいことにちょうせんしてみよう！',
    'ともだちをたいせつにするといいことがあるよ。',
    'すこしやすんで、リラックスするじかんをつくろう。',
    'じぶんのきもちをそっちょくにつたえてみて。',
    'まわりのひとにやさしくすると、うんきがアップするよ！',
    'あたらしいはっけんがあるかも。こうきしんをもってすごそう！',
  ];

  const chars = CONSTELLATION_CHARACTERISTICS[constellation];

  return {
    overall: random(1, 5),
    love: random(1, 5),
    work: random(1, 5),
    money: random(1, 5),
    health: random(1, 5),
    luckyItem: luckyItems[random(0, luckyItems.length - 1)],
    luckyColor: chars.luckyColors[random(0, chars.luckyColors.length - 1)],
    advice: advice[random(0, advice.length - 1)],
  };
}
