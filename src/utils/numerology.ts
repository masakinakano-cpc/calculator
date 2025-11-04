/**
 * Numerology (数秘術) Utilities
 * Calculate life path numbers and personality insights from birth dates
 */

export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

export const LIFE_PATH_NAMES: Record<LifePathNumber, string> = {
  1: 'リーダー',
  2: 'ちょうわしゃ',
  3: 'ひょうげんしゃ',
  4: 'けんせつしゃ',
  5: 'じゆうじん',
  6: 'ようごしゃ',
  7: 'たんきゅうしゃ',
  8: 'じつげんしゃ',
  9: 'かんせいしゃ',
  11: 'れいかんしゃ',
  22: 'マスタービルダー',
  33: 'マスターティーチャー',
};

export const LIFE_PATH_CHARACTERISTICS: Record<LifePathNumber, {
  description: string;
  strengths: string[];
  challenges: string[];
  mission: string;
  luckyNumbers: number[];
  emoji: string;
}> = {
  1: {
    description: 'どくりつしんがつよく、あたらしいことをはじめるのがとくいなリーダータイプ。',
    strengths: ['どくりつしん', 'リーダーシップ', 'そうぞうりょく', 'ゆうき'],
    challenges: ['わがまま', 'たにんのいけんをきかない', 'こりつしやすい'],
    mission: 'あたらしいみちをきりひらき、まわりをみちびくこと',
    luckyNumbers: [1, 10, 19, 28],
    emoji: '👑',
  },
  2: {
    description: 'きょうちょうせいとちょうわをたいせつにする、へいわしゅぎしゃ。',
    strengths: ['きょうちょうせい', 'やさしさ', 'きょうかんりょく', 'がいこうてき'],
    challenges: ['ゆうじゅうふだん', 'きにしすぎる', 'じぶんをおさえる'],
    mission: 'ひとびとをつなぎ、ちょうわをつくること',
    luckyNumbers: [2, 11, 20, 29],
    emoji: '🤝',
  },
  3: {
    description: 'あかるく、そうぞうてき。じぶんをひょうげんすることがとくい。',
    strengths: ['ひょうげんりょく', 'そうぞうりょく', 'あかるさ', 'しゃこうてき'],
    challenges: ['あきっぽい', 'さんまんしやすい', 'けいはくになりがち'],
    mission: 'よろこびとそうぞうせいをひろめること',
    luckyNumbers: [3, 12, 21, 30],
    emoji: '🎨',
  },
  4: {
    description: 'まじめで、けいかくてき。あんていとこうぞうをつくるのがとくい。',
    strengths: ['きりつ', 'しんらいせい', 'けいぞくりょく', 'けいかくりょく'],
    challenges: ['かたくるしい', 'がんこ', 'へんかがにがて'],
    mission: 'あんていしたきばんをつくり、じつげんすること',
    luckyNumbers: [4, 13, 22, 31],
    emoji: '🏗️',
  },
  5: {
    description: 'じゆうをあいし、へんかとぼうけんをこのむタイプ。',
    strengths: ['じゆう', 'てきおうりょく', 'こうきしん', 'たようせい'],
    challenges: ['おちつきがない', 'むせきにん', 'あきやすい'],
    mission: 'じゆうにけいけんし、へんかをもたらすこと',
    luckyNumbers: [5, 14, 23],
    emoji: '🌍',
  },
  6: {
    description: 'せきにんかんがつよく、ひとをささえることにやりがいをかんじる。',
    strengths: ['せきにんかん', 'やさしさ', 'ようごりょく', 'ちょうわ'],
    challenges: ['おせっかい', 'じぶんをぎせいにする', 'かんぺきしゅぎ'],
    mission: 'あいとちょうわをひろめ、ひとをささえること',
    luckyNumbers: [6, 15, 24],
    emoji: '💝',
  },
  7: {
    description: 'ふかくかんがえ、しんりをもとめるてつがくしゃタイプ。',
    strengths: ['ぶんせきりょく', 'ちせい', 'ちょっかん', 'しんこう'],
    challenges: ['こりつしやすい', 'ひとをしんようしない', 'かんがえすぎる'],
    mission: 'しんりをたんきゅうし、ちえをつたえること',
    luckyNumbers: [7, 16, 25],
    emoji: '🔍',
  },
  8: {
    description: 'じつげんりょくがたかく、せいこうとけんりょくをもとめるタイプ。',
    strengths: ['じつげんりょく', 'やしん', 'けいえいのうりょく', 'リーダーシップ'],
    challenges: ['ぶっしつしゅぎ', 'しはいてき', 'ワーカホリック'],
    mission: 'ゆたかさをそうぞうし、けんりょくをただしくつかうこと',
    luckyNumbers: [8, 17, 26],
    emoji: '💼',
  },
  9: {
    description: 'ひろいしやで、ひとどうてきなはくあいしゅぎしゃ。',
    strengths: ['きょうかんりょく', 'はくあい', 'りそうしゅぎ', 'げいじゅつせい'],
    challenges: ['げんじつとうひ', 'かんぺきをもとめすぎる', 'じぶんをぎせいにする'],
    mission: 'せかいにあいとへいわをもたらすこと',
    luckyNumbers: [9, 18, 27],
    emoji: '🌏',
  },
  11: {
    description: 'マスターナンバー。れいてきなちょっかんとインスピレーションにすぐれる。',
    strengths: ['れいかん', 'ちょっかん', 'インスピレーション', 'カリスマ'],
    challenges: ['しんけいしつ', 'プレッシャーによわい', 'じぶんにきびしい'],
    mission: 'れいてきなメッセージをつたえ、ひとびとをみちびくこと',
    luckyNumbers: [11, 2, 29],
    emoji: '✨',
  },
  22: {
    description: 'マスターナンバー。おおきなゆめをげんじつにするちからをもつ。',
    strengths: ['じつげんりょく', 'ビジョン', 'えいきょうりょく', 'じっせんりょく'],
    challenges: ['プレッシャー', 'せきにんのおもさ', 'ストレス'],
    mission: 'おおきなビジョンをげんじつにし、せかいをかえること',
    luckyNumbers: [22, 4, 13],
    emoji: '🏆',
  },
  33: {
    description: 'マスターナンバー。むじょうけんのあいとぎせいのこころをもつ。',
    strengths: ['むじょうけんのあい', 'きょうしりょく', 'ようご', 'せいしんせい'],
    challenges: ['じぶんをぎせいにしすぎる', 'ストレス', 'かんぺきしゅぎ'],
    mission: 'あいをおしえ、ひとびとをせいちょうさせること',
    luckyNumbers: [33, 6, 15],
    emoji: '👼',
  },
};

/**
 * Calculate life path number from birth date
 * Master numbers (11, 22, 33) are preserved during calculation
 */
export function calculateLifePathNumber(year: number, month: number, day: number): LifePathNumber {
  // Reduce each component separately
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const reducedYear = reduceToSingleDigit(year);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedDay = reduceToSingleDigit(day);

  // Add reduced components
  let sum = reducedYear + reducedMonth + reducedDay;

  // Final reduction
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum as LifePathNumber;
}

/**
 * Calculate compatibility between two life path numbers
 */
export function calculateNumerologyCompatibility(
  number1: LifePathNumber,
  number2: LifePathNumber
): {
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  score: number; // 0-100
  message: string;
} {
  if (number1 === number2) {
    return {
      level: 'good',
      score: 75,
      message: 'おなじナンバーどうし！おたがいをしんからりかいできるよ。',
    };
  }

  // Excellent matches
  const excellentPairs: [LifePathNumber, LifePathNumber][] = [
    [1, 5], [1, 3], [2, 6], [2, 8], [3, 5], [3, 9],
    [4, 8], [4, 22], [6, 9], [7, 9], [11, 22], [22, 33]
  ];

  // Check if this pair is excellent (order doesn't matter)
  const isExcellent = excellentPairs.some(
    ([a, b]) => (a === number1 && b === number2) || (a === number2 && b === number1)
  );

  if (isExcellent) {
    return {
      level: 'excellent',
      score: 95,
      message: 'さいこうのあいしょう！おたがいをたかめあえるそんざいだよ。',
    };
  }

  // Challenging matches
  const challengingPairs: [LifePathNumber, LifePathNumber][] = [
    [1, 4], [1, 8], [2, 5], [3, 4], [4, 5], [5, 6], [7, 8]
  ];

  const isChallenging = challengingPairs.some(
    ([a, b]) => (a === number1 && b === number2) || (a === number2 && b === number1)
  );

  if (isChallenging) {
    return {
      level: 'challenging',
      score: 45,
      message: 'ちょっとむずかしいあいしょう。でも、おたがいをりかいすればだいじょうぶ！',
    };
  }

  // Master numbers have special compatibility
  if ([11, 22, 33].includes(number1) || [11, 22, 33].includes(number2)) {
    return {
      level: 'good',
      score: 80,
      message: 'マスターナンバーとのそうせい。とくべつなえんがあるよ！',
    };
  }

  // Normal compatibility
  return {
    level: 'normal',
    score: 65,
    message: 'ふつうのあいしょう。おたがいをそんちょうすることがたいせつだよ。',
  };
}

/**
 * Get personal year number (その年の運勢)
 */
export function getPersonalYearNumber(birthMonth: number, birthDay: number, targetYear: number): number {
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const reducedMonth = reduceToSingleDigit(birthMonth);
  const reducedDay = reduceToSingleDigit(birthDay);
  const reducedYear = reduceToSingleDigit(targetYear);

  let sum = reducedMonth + reducedDay + reducedYear;
  return reduceToSingleDigit(sum);
}

export const PERSONAL_YEAR_MEANINGS: Record<number, {
  theme: string;
  description: string;
  advice: string;
}> = {
  1: {
    theme: 'あたらしいはじまり',
    description: 'あたらしいサイクルのスタート！なにかをはじめるのにさいこうのとしだよ。',
    advice: 'ゆうきをだして、あたらしいことにチャレンジしよう！',
  },
  2: {
    theme: 'きょうちょうとちょうわ',
    description: 'ひととのつながりがだいじなとし。きょうりょくしてものごとをすすめよう。',
    advice: 'あせらず、ゆっくりとひとびととのきずなをふかめよう。',
  },
  3: {
    theme: 'ひょうげんとそうぞう',
    description: 'そうぞうりょくがはっきされるとき。たのしむことをわすれずに！',
    advice: 'じぶんをひょうげんして、あかるくすごそう！',
  },
  4: {
    theme: 'どりょくとけんせつ',
    description: 'きそをつくるだいじなとし。ちからづよくまえにすすもう。',
    advice: 'けいかくをたてて、コツコツとどりょくしよう。',
  },
  5: {
    theme: 'へんかとじゆう',
    description: 'へんかがおおく、わくわくするとし。あたらしいたいけんをたのしもう！',
    advice: 'じゆうにこうどうして、たくさんのけいけんをしよう！',
  },
  6: {
    theme: 'せきにんとあい',
    description: 'かぞくやともだちとのじかんがたいせつなとし。',
    advice: 'ひとのためになることをして、あいをわけあおう。',
  },
  7: {
    theme: 'ないめんのせいちょう',
    description: 'じぶんをみつめ、まなぶことがおおいとし。',
    advice: 'しずかにかんがえるじかんをつくり、せいしんてきにせいちょうしよう。',
  },
  8: {
    theme: 'せいこうとたっせい',
    description: 'どりょくがみのり、せいこうするとし！',
    advice: 'じしんをもって、おおきなもくひょうにチャレンジしよう！',
  },
  9: {
    theme: 'かんせいとしゅうりょう',
    description: 'ひとつのサイクルがおわり、つぎへのじゅんび。',
    advice: 'これまでをふりかえり、かんしゃのきもちをもとう。',
  },
};

/**
 * Calculate multiple numerology insights
 */
export function getNumerologyInsights(year: number, month: number, day: number) {
  const lifePathNumber = calculateLifePathNumber(year, month, day);
  const currentYear = new Date().getFullYear();
  const personalYear = getPersonalYearNumber(month, day, currentYear);

  return {
    lifePathNumber,
    lifePathName: LIFE_PATH_NAMES[lifePathNumber],
    characteristics: LIFE_PATH_CHARACTERISTICS[lifePathNumber],
    personalYear,
    personalYearMeaning: PERSONAL_YEAR_MEANINGS[personalYear],
  };
}
