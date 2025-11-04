/**
 * 四柱推命（簡易版）ユーティリティ
 */

/**
 * 十干
 */
export enum Tenkan {
  KINOE = 'KINOE',   // 甲
  KINOTO = 'KINOTO', // 乙
  HINOE = 'HINOE',   // 丙
  HINOTO = 'HINOTO', // 丁
  TSUCHINOE = 'TSUCHINOE', // 戊
  TSUCHINOTO = 'TSUCHINOTO', // 己
  KANOE = 'KANOE',   // 庚
  KANOTO = 'KANOTO', // 辛
  MIZUNOE = 'MIZUNOE', // 壬
  MIZUNOTO = 'MIZUNOTO', // 癸
}

/**
 * 十二支
 */
export enum Jyunishi {
  NE = 'NE',   // 子
  USHI = 'USHI', // 丑
  TORA = 'TORA', // 寅
  U = 'U',     // 卯
  TATSU = 'TATSU', // 辰
  MI = 'MI',   // 巳
  UMA = 'UMA', // 午
  HITSUJI = 'HITSUJI', // 未
  SARU = 'SARU', // 申
  TORI = 'TORI', // 酉
  INU = 'INU', // 戌
  I = 'I',     // 亥
}

/**
 * 四柱推命結果
 */
export interface FourPillarsResult {
  year: { tenkan: Tenkan; jyunishi: Jyunishi };
  month: { tenkan: Tenkan; jyunishi: Jyunishi };
  day: { tenkan: Tenkan; jyunishi: Jyunishi };
  hour: { tenkan: Tenkan; jyunishi: Jyunishi };
  personality: string;
  fortune: string;
  compatibility: {
    excellent: string[];
    good: string[];
    normal: string[];
    challenging: string[];
  };
}

/**
 * 十干名
 */
export const TENKAN_NAMES: Record<Tenkan, string> = {
  [Tenkan.KINOE]: 'きのえ',
  [Tenkan.KINOTO]: 'きのと',
  [Tenkan.HINOE]: 'ひのえ',
  [Tenkan.HINOTO]: 'ひのと',
  [Tenkan.TSUCHINOE]: 'つちのえ',
  [Tenkan.TSUCHINOTO]: 'つちのと',
  [Tenkan.KANOE]: 'かのえ',
  [Tenkan.KANOTO]: 'かのと',
  [Tenkan.MIZUNOE]: 'みずのえ',
  [Tenkan.MIZUNOTO]: 'みずのと',
};

/**
 * 十二支名
 */
export const JYUNISHI_NAMES: Record<Jyunishi, string> = {
  [Jyunishi.NE]: 'ね',
  [Jyunishi.USHI]: 'うし',
  [Jyunishi.TORA]: 'とら',
  [Jyunishi.U]: 'う',
  [Jyunishi.TATSU]: 'たつ',
  [Jyunishi.MI]: 'み',
  [Jyunishi.UMA]: 'うま',
  [Jyunishi.HITSUJI]: 'ひつじ',
  [Jyunishi.SARU]: 'さる',
  [Jyunishi.TORI]: 'とり',
  [Jyunishi.INU]: 'いぬ',
  [Jyunishi.I]: 'い',
};

/**
 * 生年月日から四柱推命を計算（簡易版）
 */
export function calculateFourPillars(year: number, month: number, day: number): FourPillarsResult {
  // 簡易版：生年月日から十干十二支を決定
  const tenkans = Object.values(Tenkan);
  const jyunishis = Object.values(Jyunishi);

  const yearTenkan = tenkans[year % 10];
  const yearJyunishi = jyunishis[year % 12];
  const monthTenkan = tenkans[(year + month) % 10];
  const monthJyunishi = jyunishis[(year + month) % 12];
  const dayTenkan = tenkans[(year + month + day) % 10];
  const dayJyunishi = jyunishis[(year + month + day) % 12];
  const hourTenkan = tenkans[(year + month + day + 12) % 10];
  const hourJyunishi = jyunishis[(year + month + day + 12) % 12];

  // 性格分析（簡易版）
  const personalities = [
    'あかるく、かつどうてき。あたらしいことがすき。',
    'しずかで、おだやか。かんがえることがすき。',
    'やさしく、おだやか。ともだちをたいせつにする。',
    'つよく、リーダーシップがある。あたらしいことがすき。',
    'しんけんで、べんきょうがすき。',
  ];
  const personality = personalities[(year + month + day) % personalities.length];

  // 運勢（簡易版）
  const fortunes = [
    'きょうはいいちょうし！たのしいことがありそうだよ。',
    'きょうはすこしゆっくりとすごすといいかも。リラックスしてね。',
    'きょうはあたらしいことにちょうせんするのにぴったりだよ！',
    'きょうはちょっとちゅういが必要。ゆっくりとすごしてね。',
    'きょうはふつうのちょうし。じぶんのペースをまもってね。',
  ];
  const fortune = fortunes[(year + month + day) % fortunes.length];

  // 相性（簡易版）
  const compatibility = {
    excellent: ['きのえ', 'ひのえ', 'みずのえ'],
    good: ['きのと', 'ひのと', 'みずのと'],
    normal: ['つちのえ', 'つちのと'],
    challenging: ['かのえ', 'かのと'],
  };

  return {
    year: { tenkan: yearTenkan, jyunishi: yearJyunishi },
    month: { tenkan: monthTenkan, jyunishi: monthJyunishi },
    day: { tenkan: dayTenkan, jyunishi: dayJyunishi },
    hour: { tenkan: hourTenkan, jyunishi: hourJyunishi },
    personality,
    fortune,
    compatibility,
  };
}

/**
 * 2人の四柱推命から相性を計算（簡易版）
 */
export function calculateFourPillarsCompatibility(
  result1: FourPillarsResult,
  result2: FourPillarsResult
): {
  score: number;
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  message: string;
} {
  // 簡易版：日柱の十干で相性を判定
  const tenkan1 = result1.day.tenkan;
  const tenkan2 = result2.day.tenkan;

  // 相性の判定（簡易版）
  const excellentPairs: [Tenkan, Tenkan][] = [
    [Tenkan.KINOE, Tenkan.KINOTO],
    [Tenkan.HINOE, Tenkan.HINOTO],
    [Tenkan.MIZUNOE, Tenkan.MIZUNOTO],
  ];

  const isExcellent = excellentPairs.some(([t1, t2]) =>
    (tenkan1 === t1 && tenkan2 === t2) || (tenkan1 === t2 && tenkan2 === t1)
  );

  if (isExcellent) {
    return {
      score: 90,
      level: 'excellent',
      message: 'とってもすばらしい相性！いっしょにいると、たのしいことがたくさんありそう！',
    };
  }

  // その他の判定（簡易版）
  const score = Math.floor(Math.random() * 40) + 50;
  let level: 'excellent' | 'good' | 'normal' | 'challenging';
  let message: string;

  if (score >= 80) {
    level = 'excellent';
    message = 'とってもすばらしい相性！';
  } else if (score >= 70) {
    level = 'good';
    message = 'いい相性だよ！';
  } else if (score >= 55) {
    level = 'normal';
    message = 'バランスのとれた相性だよ。';
  } else {
    level = 'challenging';
    message = 'ちょっとチャレンジのある相性だけど、おたがいをりかいすることで、すてきなかんけいになれるよ。';
  }

  return { score, level, message };
}
