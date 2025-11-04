/**
 * 九星気学（簡易版）ユーティリティ
 */

/**
 * 九星の種類
 */
export enum NineStar {
  ONE_WHITE = 'ONE_WHITE',       // 一白水星
  TWO_BLACK = 'TWO_BLACK',       // 二黒土星
  THREE_GREEN = 'THREE_GREEN',   // 三碧木星
  FOUR_GREEN = 'FOUR_GREEN',     // 四緑木星
  FIVE_YELLOW = 'FIVE_YELLOW',   // 五黄土星
  SIX_WHITE = 'SIX_WHITE',       // 六白金星
  SEVEN_RED = 'SEVEN_RED',       // 七赤金星
  EIGHT_WHITE = 'EIGHT_WHITE',   // 八白土星
  NINE_PURPLE = 'NINE_PURPLE',   // 九紫火星
}

/**
 * 九星名（ひらがな）
 */
export const NINE_STAR_NAMES: Record<NineStar, string> = {
  [NineStar.ONE_WHITE]: 'いっぱくすいせい',
  [NineStar.TWO_BLACK]: 'にこくどせい',
  [NineStar.THREE_GREEN]: 'さんぺきもくせい',
  [NineStar.FOUR_GREEN]: 'しろくもくせい',
  [NineStar.FIVE_YELLOW]: 'ごおうどせい',
  [NineStar.SIX_WHITE]: 'ろっぱくきんせい',
  [NineStar.SEVEN_RED]: 'しちせききんせい',
  [NineStar.EIGHT_WHITE]: 'はっぱくどせい',
  [NineStar.NINE_PURPLE]: 'きゅうしかせい',
};

/**
 * 九星の特性
 */
export interface NineStarCharacteristics {
  name: string;
  element: string;
  color: string;
  personality: string;
  luckyDirection: string;
  unluckyDirection: string;
}

/**
 * 九星の特性データ
 */
export const NINE_STAR_CHARACTERISTICS: Record<NineStar, NineStarCharacteristics> = {
  [NineStar.ONE_WHITE]: {
    name: 'いっぱくすいせい',
    element: 'みず',
    color: 'しろ',
    personality: 'しずかで、おだやかなせいかく。かんがえることがすき。',
    luckyDirection: 'きた',
    unluckyDirection: 'みなみ',
  },
  [NineStar.TWO_BLACK]: {
    name: 'にこくどせい',
    element: 'つち',
    color: 'くろ',
    personality: 'おだやかで、しんけん。べんきょうがすき。',
    luckyDirection: 'みなみ',
    unluckyDirection: 'きた',
  },
  [NineStar.THREE_GREEN]: {
    name: 'さんぺきもくせい',
    element: 'き',
    color: 'みどり',
    personality: 'あかるく、かつどうてき。あたらしいことがすき。',
    luckyDirection: 'ひがし',
    unluckyDirection: 'にし',
  },
  [NineStar.FOUR_GREEN]: {
    name: 'しろくもくせい',
    element: 'き',
    color: 'みどり',
    personality: 'やさしく、おだやか。ともだちをたいせつにする。',
    luckyDirection: 'ひがし',
    unluckyDirection: 'にし',
  },
  [NineStar.FIVE_YELLOW]: {
    name: 'ごおうどせい',
    element: 'つち',
    color: 'きいろ',
    personality: 'つよく、リーダーシップがある。あたらしいことがすき。',
    luckyDirection: 'ちゅうおう',
    unluckyDirection: 'すべて',
  },
  [NineStar.SIX_WHITE]: {
    name: 'ろっぱくきんせい',
    element: 'きん',
    color: 'しろ',
    personality: 'しずかで、かんがえることがすき。べんきょうがすき。',
    luckyDirection: 'にし',
    unluckyDirection: 'ひがし',
  },
  [NineStar.SEVEN_RED]: {
    name: 'しちせききんせい',
    element: 'きん',
    color: 'あか',
    personality: 'あかるく、かつどうてき。あたらしいことがすき。',
    luckyDirection: 'にし',
    unluckyDirection: 'ひがし',
  },
  [NineStar.EIGHT_WHITE]: {
    name: 'はっぱくどせい',
    element: 'つち',
    color: 'しろ',
    personality: 'おだやかで、しんけん。べんきょうがすき。',
    luckyDirection: 'きた',
    unluckyDirection: 'みなみ',
  },
  [NineStar.NINE_PURPLE]: {
    name: 'きゅうしかせい',
    element: 'ひ',
    color: 'むらさき',
    personality: 'あかるく、かつどうてき。あたらしいことがすき。',
    luckyDirection: 'みなみ',
    unluckyDirection: 'きた',
  },
};

/**
 * 生年月日から九星を判定（簡易版）
 */
export function getNineStarFromBirthDate(year: number, month: number, day: number): NineStar {
  // 簡易版：生年月日の合計から九星を決定
  const sum = year + month + day;
  const stars = Object.values(NineStar);
  const index = sum % stars.length;
  return stars[index];
}

/**
 * 今日のラッキー方位を計算
 */
export function getTodayLuckyDirection(nineStar: NineStar): string {
  const characteristics = NINE_STAR_CHARACTERISTICS[nineStar];
  return characteristics.luckyDirection;
}
