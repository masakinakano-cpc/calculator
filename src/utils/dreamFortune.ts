/**
 * 夢占いユーティリティ
 */

/**
 * 夢の種類
 */
export enum DreamType {
  ANIMAL = 'animal',       // 動物
  NATURE = 'nature',       // 自然
  PERSON = 'person',       // 人
  OBJECT = 'object',       // 物
  BUILDING = 'building',   // 建物
  FOOD = 'food',           // 食べ物
  VEHICLE = 'vehicle',     // 乗り物
  WATER = 'water',         // 水
  FIRE = 'fire',           // 火
  FLYING = 'flying',       // 空を飛ぶ
  FALLING = 'falling',     // 落下
  EXAM = 'exam',           // 試験
  DEATH = 'death',         // 死
  MONEY = 'money',         // お金
}

/**
 * 夢占い結果
 */
export interface DreamFortuneResult {
  dreamType: DreamType;
  meaning: string;
  advice: string;
  fortune: 'excellent' | 'good' | 'normal' | 'challenging';
}

/**
 * 夢の種類名
 */
export const DREAM_TYPE_NAMES: Record<DreamType, string> = {
  [DreamType.ANIMAL]: 'どうぶつ',
  [DreamType.NATURE]: 'しぜん',
  [DreamType.PERSON]: 'ひと',
  [DreamType.OBJECT]: 'もの',
  [DreamType.BUILDING]: 'たてもの',
  [DreamType.FOOD]: 'たべもの',
  [DreamType.VEHICLE]: 'のりもの',
  [DreamType.WATER]: 'みず',
  [DreamType.FIRE]: 'ひ',
  [DreamType.FLYING]: 'そらをとぶ',
  [DreamType.FALLING]: 'らっか',
  [DreamType.EXAM]: 'しけん',
  [DreamType.DEATH]: 'し',
  [DreamType.MONEY]: 'おかね',
};

/**
 * 夢の意味データ
 */
const DREAM_MEANINGS: Record<DreamType, { meaning: string; advice: string; fortune: 'excellent' | 'good' | 'normal' | 'challenging' }> = {
  [DreamType.ANIMAL]: {
    meaning: 'どうぶつがでてくるゆめは、じぶんのきもちをあらわしているよ。',
    advice: 'じぶんのきもちをたいせつにして、じぶんのやりたいことをやろう！',
    fortune: 'good',
  },
  [DreamType.NATURE]: {
    meaning: 'しぜんがでてくるゆめは、こころがおちついていることをあらわしているよ。',
    advice: 'こころをしずめて、リラックスしてね。',
    fortune: 'excellent',
  },
  [DreamType.PERSON]: {
    meaning: 'ひとがでてくるゆめは、かんけいをあらわしているよ。',
    advice: 'ともだちやかぞくをたいせつにしよう！',
    fortune: 'good',
  },
  [DreamType.OBJECT]: {
    meaning: 'ものがでてくるゆめは、じぶんのきもちをあらわしているよ。',
    advice: 'じぶんのきもちをたいせつにして、じぶんのやりたいことをやろう！',
    fortune: 'normal',
  },
  [DreamType.BUILDING]: {
    meaning: 'たてものがでてくるゆめは、じぶんのきもちをあらわしているよ。',
    advice: 'じぶんのきもちをたいせつにして、じぶんのやりたいことをやろう！',
    fortune: 'normal',
  },
  [DreamType.FOOD]: {
    meaning: 'たべものがでてくるゆめは、たのしいきもちをあらわしているよ。',
    advice: 'きょうはたのしいことがありそうだよ！',
    fortune: 'excellent',
  },
  [DreamType.VEHICLE]: {
    meaning: 'のりものがでてくるゆめは、あたらしいことがはじまることをあらわしているよ。',
    advice: 'あたらしいことにちょうせんしてみよう！',
    fortune: 'good',
  },
  [DreamType.WATER]: {
    meaning: 'みずがでてくるゆめは、こころがおちついていることをあらわしているよ。',
    advice: 'こころをしずめて、リラックスしてね。',
    fortune: 'excellent',
  },
  [DreamType.FIRE]: {
    meaning: 'ひがでてくるゆめは、パワーとゆうきをあらわしているよ。',
    advice: 'じぶんのちからをしんじて、やりたいことをやろう！',
    fortune: 'good',
  },
  [DreamType.FLYING]: {
    meaning: 'そらをとぶゆめは、じゆうをあらわしているよ。',
    advice: 'じぶんのやりたいことをやろう！',
    fortune: 'excellent',
  },
  [DreamType.FALLING]: {
    meaning: 'らっかするゆめは、ちょっとしんぱいなきもちをあらわしているよ。',
    advice: 'ゆっくりとすごして、むりをしないでね。',
    fortune: 'challenging',
  },
  [DreamType.EXAM]: {
    meaning: 'しけんがでてくるゆめは、べんきょうをあらわしているよ。',
    advice: 'べんきょうをがんばってね！',
    fortune: 'normal',
  },
  [DreamType.DEATH]: {
    meaning: 'しがでてくるゆめは、あたらしいことがはじまることをあらわしているよ。',
    advice: 'あたらしいことがはじまるきせつ。あきらめずに、つづけていこう！',
    fortune: 'good',
  },
  [DreamType.MONEY]: {
    meaning: 'おかねがでてくるゆめは、おかねをあらわしているよ。',
    advice: 'おかねをたいせつにして、かしこくつかってね。',
    fortune: 'excellent',
  },
};

/**
 * 夢の内容から運勢を判定
 */
export function interpretDream(dreamType: DreamType): DreamFortuneResult {
  const dreamData = DREAM_MEANINGS[dreamType];
  return {
    dreamType,
    meaning: dreamData.meaning,
    advice: dreamData.advice,
    fortune: dreamData.fortune,
  };
}

/**
 * 夢の種類から適切な種類を判定（簡易版）
 */
export function getDreamTypeFromKeyword(keyword: string): DreamType | null {
  const keywordLower = keyword.toLowerCase();

  // キーワードマッチング（簡易版）
  if (keywordLower.includes('どうぶつ') || keywordLower.includes('ねこ') || keywordLower.includes('いぬ')) {
    return DreamType.ANIMAL;
  } else if (keywordLower.includes('はな') || keywordLower.includes('き') || keywordLower.includes('やま')) {
    return DreamType.NATURE;
  } else if (keywordLower.includes('ひと') || keywordLower.includes('ともだち') || keywordLower.includes('かぞく')) {
    return DreamType.PERSON;
  } else if (keywordLower.includes('みず') || keywordLower.includes('うみ') || keywordLower.includes('かわ')) {
    return DreamType.WATER;
  } else if (keywordLower.includes('ひ') || keywordLower.includes('ほのお')) {
    return DreamType.FIRE;
  } else if (keywordLower.includes('とぶ') || keywordLower.includes('そら')) {
    return DreamType.FLYING;
  } else if (keywordLower.includes('おちる') || keywordLower.includes('らっか')) {
    return DreamType.FALLING;
  } else if (keywordLower.includes('しけん') || keywordLower.includes('テスト')) {
    return DreamType.EXAM;
  } else if (keywordLower.includes('し') || keywordLower.includes('しぬ')) {
    return DreamType.DEATH;
  } else if (keywordLower.includes('おかね') || keywordLower.includes('かね')) {
    return DreamType.MONEY;
  } else if (keywordLower.includes('たべもの') || keywordLower.includes('ごはん')) {
    return DreamType.FOOD;
  } else if (keywordLower.includes('のりもの') || keywordLower.includes('くるま')) {
    return DreamType.VEHICLE;
  } else if (keywordLower.includes('たてもの') || keywordLower.includes('いえ')) {
    return DreamType.BUILDING;
  }

  return null;
}
