/**
 * Weekday Fortune (曜日占い) Utilities
 * Fortune telling based on the day of the week you were born
 */

export enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const WEEKDAY_NAMES_JP: Record<Weekday, string> = {
  [Weekday.SUNDAY]: '日曜日',
  [Weekday.MONDAY]: '月曜日',
  [Weekday.TUESDAY]: '火曜日',
  [Weekday.WEDNESDAY]: '水曜日',
  [Weekday.THURSDAY]: '木曜日',
  [Weekday.FRIDAY]: '金曜日',
  [Weekday.SATURDAY]: '土曜日',
};

export const WEEKDAY_NAMES_HIRAGANA: Record<Weekday, string> = {
  [Weekday.SUNDAY]: 'にちようび',
  [Weekday.MONDAY]: 'げつようび',
  [Weekday.TUESDAY]: 'かようび',
  [Weekday.WEDNESDAY]: 'すいようび',
  [Weekday.THURSDAY]: 'もくようび',
  [Weekday.FRIDAY]: 'きんようび',
  [Weekday.SATURDAY]: 'どようび',
};

export const WEEKDAY_COLORS: Record<Weekday, string> = {
  [Weekday.SUNDAY]: '赤',
  [Weekday.MONDAY]: '白',
  [Weekday.TUESDAY]: '赤',
  [Weekday.WEDNESDAY]: '緑',
  [Weekday.THURSDAY]: '黄',
  [Weekday.FRIDAY]: '青',
  [Weekday.SATURDAY]: '紫',
};

export const WEEKDAY_PLANETS: Record<Weekday, string> = {
  [Weekday.SUNDAY]: '太陽',
  [Weekday.MONDAY]: '月',
  [Weekday.TUESDAY]: '火星',
  [Weekday.WEDNESDAY]: '水星',
  [Weekday.THURSDAY]: '木星',
  [Weekday.FRIDAY]: '金星',
  [Weekday.SATURDAY]: '土星',
};

export const WEEKDAY_CHARACTERISTICS: Record<Weekday, {
  personality: string;
  strengths: string[];
  weaknesses: string[];
  luckyItems: string[];
  advice: string;
  emoji: string;
}> = {
  [Weekday.SUNDAY]: {
    personality: 'たいようのように、あかるくて、みんなのちゅうもくをあびるせいかく。じしんがあり、リーダーシップがある。',
    strengths: ['あかるい', 'じしんがある', 'リーダーシップ', 'せっきょくてき'],
    weaknesses: ['わがまま', 'プライドがたかい', 'めだちたがり'],
    luckyItems: ['きんのアクセサリー', 'たいよう', 'ひまわり'],
    advice: 'みんなをあかるくてらすそんざいでいよう！でもときにはひかえめもだいじだよ。',
    emoji: '☀️',
  },
  [Weekday.MONDAY]: {
    personality: 'つきのように、やさしくて、かんじょうゆたか。ちょっかんりょくがつよく、ひとのきもちがわかる。',
    strengths: ['やさしい', 'きょうかんりょく', 'ちょっかんてき', 'そうぞうりょく'],
    weaknesses: ['きぶんや', 'かんじょうてき', 'きにしやすい'],
    luckyItems: ['みず', 'つき', 'しんじゅ'],
    advice: 'じぶんのきもちをたいせつにして、ちょっかんをしんじよう。',
    emoji: '🌙',
  },
  [Weekday.TUESDAY]: {
    personality: 'かせいのように、じょうねつてきで、エネルギッシュ。ちょうせんするこころがつよい。',
    strengths: ['ゆうかん', 'じょうねつてき', 'ちょうせんてき', 'せっきょくてき'],
    weaknesses: ['せっかち', 'すぐおこる', 'あらっぽい'],
    luckyItems: ['あかいもの', 'スポーツ', 'ほのお'],
    advice: 'エネルギーをポジティブなほうこうにつかおう！いきおいよくチャレンジ！',
    emoji: '🔥',
  },
  [Weekday.WEDNESDAY]: {
    personality: 'すいせいのように、あたまがよくて、コミュニケーションじょうず。きようびんでてきおうりょくがある。',
    strengths: ['ちてき', 'コミュニケーション', 'てきおうりょく', 'きようびん'],
    weaknesses: ['あきっぽい', 'しんけいしつ', 'かんがえすぎる'],
    luckyItems: ['ほん', 'ペン', 'スマホ'],
    advice: 'あたまのよさをいかして、いろいろなことにチャレンジしよう！',
    emoji: '💡',
  },
  [Weekday.THURSDAY]: {
    personality: 'もくせいのように、おおらかで、せいちょうしていく。らくてんてきで、うんがいい。',
    strengths: ['らくてんてき', 'おおらか', 'せいちょうりょく', 'うんがいい'],
    weaknesses: ['らくてんてきすぎる', 'たよりすぎる', 'むだづかい'],
    luckyItems: ['みどりのもの', 'き', 'たから'],
    advice: 'ポジティブなこころをたもって、おおきくせいちょうしよう！',
    emoji: '🌳',
  },
  [Weekday.FRIDAY]: {
    personality: 'きんせいのように、あいにあふれ、びてきセンスがある。ひとをひきつけるみりょくがある。',
    strengths: ['あいじょうぶかい', 'びてきセンス', 'しゃこうてき', 'みりょくてき'],
    weaknesses: ['ゆうじゅうふだん', 'ひょうめんてき', 'いぞんてき'],
    luckyItems: ['はな', 'おしゃれなもの', 'おんがく'],
    advice: 'あいとうつくしさをたいせつに。まわりのひとをしあわせにしよう！',
    emoji: '💖',
  },
  [Weekday.SATURDAY]: {
    personality: 'どせいのように、しんちょうで、せきにんかんがつよい。けいかくてきで、きりつがある。',
    strengths: ['せきにんかん', 'しんちょう', 'けいかくてき', 'がまんづよい'],
    weaknesses: ['かたくるしい', 'しんぱいしょう', 'ゆうずうがきかない'],
    luckyItems: ['くろいもの', 'とけい', 'いし'],
    advice: 'けいかくてきにすすんで、もくひょうをたっせいしよう！たまにはリラックスも。',
    emoji: '⏰',
  },
};

/**
 * Get weekday from birth date
 */
export function getWeekday(year: number, month: number, day: number): Weekday {
  const date = new Date(year, month - 1, day);
  return date.getDay() as Weekday;
}

/**
 * Calculate compatibility between two weekdays
 */
export function calculateWeekdayCompatibility(
  weekday1: Weekday,
  weekday2: Weekday
): {
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  score: number; // 0-100
  message: string;
} {
  if (weekday1 === weekday2) {
    return {
      level: 'good',
      score: 75,
      message: 'おなじようびうまれ！おたがいのきもちがよくわかるよ。',
    };
  }

  // Excellent matches based on planetary harmony
  const excellentPairs: [Weekday, Weekday][] = [
    [Weekday.SUNDAY, Weekday.THURSDAY],  // Sun-Jupiter
    [Weekday.MONDAY, Weekday.FRIDAY],    // Moon-Venus
    [Weekday.TUESDAY, Weekday.SUNDAY],   // Mars-Sun
    [Weekday.WEDNESDAY, Weekday.FRIDAY], // Mercury-Venus
    [Weekday.THURSDAY, Weekday.SUNDAY],  // Jupiter-Sun
    [Weekday.FRIDAY, Weekday.WEDNESDAY], // Venus-Mercury
    [Weekday.SATURDAY, Weekday.THURSDAY], // Saturn-Jupiter
  ];

  const isExcellent = excellentPairs.some(
    ([a, b]) => (a === weekday1 && b === weekday2) || (a === weekday2 && b === weekday1)
  );

  if (isExcellent) {
    return {
      level: 'excellent',
      score: 95,
      message: 'わくせいのちょうわがばつぐん！おたがいをたかめあえるあいしょうだよ。',
    };
  }

  // Challenging matches
  const challengingPairs: [Weekday, Weekday][] = [
    [Weekday.SUNDAY, Weekday.SATURDAY],  // Sun-Saturn
    [Weekday.MONDAY, Weekday.TUESDAY],   // Moon-Mars
    [Weekday.TUESDAY, Weekday.FRIDAY],   // Mars-Venus
    [Weekday.WEDNESDAY, Weekday.SATURDAY], // Mercury-Saturn
  ];

  const isChallenging = challengingPairs.some(
    ([a, b]) => (a === weekday1 && b === weekday2) || (a === weekday2 && b === weekday1)
  );

  if (isChallenging) {
    return {
      level: 'challenging',
      score: 45,
      message: 'すこしちがうタイプどうし。でも、ちがいをみとめあえばうまくいくよ！',
    };
  }

  // Good matches
  const goodPairs: [Weekday, Weekday][] = [
    [Weekday.SUNDAY, Weekday.MONDAY],
    [Weekday.MONDAY, Weekday.WEDNESDAY],
    [Weekday.TUESDAY, Weekday.THURSDAY],
    [Weekday.WEDNESDAY, Weekday.THURSDAY],
    [Weekday.THURSDAY, Weekday.FRIDAY],
    [Weekday.FRIDAY, Weekday.SATURDAY],
  ];

  const isGood = goodPairs.some(
    ([a, b]) => (a === weekday1 && b === weekday2) || (a === weekday2 && b === weekday1)
  );

  if (isGood) {
    return {
      level: 'good',
      score: 80,
      message: 'いいあいしょう！おたがいをほかんしあえるそんざいだよ。',
    };
  }

  return {
    level: 'normal',
    score: 60,
    message: 'ふつうのあいしょう。おたがいをりかいすればだいじょうぶ！',
  };
}

/**
 * Get today's fortune for a weekday
 */
export function getTodaysWeekdayFortune(birthWeekday: Weekday): {
  overall: number; // 1-5 stars
  love: number;
  work: number;
  money: number;
  health: number;
  luckyAction: string;
  advice: string;
} {
  const today = new Date();
  const todayWeekday = today.getDay() as Weekday;

  // Calculate fortune based on relationship between birth weekday and today's weekday
  const calculateScore = (offset: number): number => {
    const diff = Math.abs((todayWeekday - birthWeekday + 7) % 7);
    const baseScore = 3;

    if (diff === 0) return 5; // Same weekday - excellent
    if (diff === 1 || diff === 6) return 4; // Adjacent - good
    if (diff === 2 || diff === 5) return 3; // Normal
    if (diff === 3 || diff === 4) return 2 + Math.floor(Math.random() * 2); // Varies

    return baseScore + offset;
  };

  const luckyActions = [
    'あたらしいことにチャレンジする',
    'ともだちにれんらくする',
    'すきなおんがくをきく',
    'おさんぽする',
    'ほんをよむ',
    'えをかく',
    'うんどうする',
    'おいしいものをたべる',
  ];

  const advices = [
    'きょうはラッキーデイ！いいことがあるよ。',
    'ちょっとちゅういがひつよう。でもだいじょうぶ！',
    'へいおんなひ。おちついてすごそう。',
    'わくわくすることがまっているよ！',
    'ゆっくりやすむのもだいじだよ。',
    'あたらしいはっけんがあるかも！',
  ];

  return {
    overall: calculateScore(0),
    love: calculateScore(1),
    work: calculateScore(-1),
    money: calculateScore(0),
    health: calculateScore(1),
    luckyAction: luckyActions[Math.floor(Math.random() * luckyActions.length)],
    advice: advices[Math.floor(Math.random() * advices.length)],
  };
}
