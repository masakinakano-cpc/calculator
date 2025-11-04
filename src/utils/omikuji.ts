/**
 * Omikuji (おみくじ) Utilities
 * Traditional Japanese fortune slips
 */

export enum OmikujiLevel {
  DAIKICHI = 'DAIKICHI',           // 大吉 - Excellent fortune
  CHUKICHI = 'CHUKICHI',           // 中吉 - Middle fortune
  SHOKICHI = 'SHOKICHI',           // 小吉 - Small fortune
  KICHI = 'KICHI',                 // 吉 - Good fortune
  SUEKICHI = 'SUEKICHI',           // 末吉 - Future fortune
  KYO = 'KYO',                     // 凶 - Bad fortune
  DAIKYO = 'DAIKYO',               // 大凶 - Great misfortune
}

export const OMIKUJI_NAMES_JP: Record<OmikujiLevel, string> = {
  [OmikujiLevel.DAIKICHI]: '大吉',
  [OmikujiLevel.CHUKICHI]: '中吉',
  [OmikujiLevel.SHOKICHI]: '小吉',
  [OmikujiLevel.KICHI]: '吉',
  [OmikujiLevel.SUEKICHI]: '末吉',
  [OmikujiLevel.KYO]: '凶',
  [OmikujiLevel.DAIKYO]: '大凶',
};

export const OMIKUJI_NAMES_HIRAGANA: Record<OmikujiLevel, string> = {
  [OmikujiLevel.DAIKICHI]: 'だいきち',
  [OmikujiLevel.CHUKICHI]: 'ちゅうきち',
  [OmikujiLevel.SHOKICHI]: 'しょうきち',
  [OmikujiLevel.KICHI]: 'きち',
  [OmikujiLevel.SUEKICHI]: 'すえきち',
  [OmikujiLevel.KYO]: 'きょう',
  [OmikujiLevel.DAIKYO]: 'だいきょう',
};

export const OMIKUJI_EMOJIS: Record<OmikujiLevel, string> = {
  [OmikujiLevel.DAIKICHI]: '🌟',
  [OmikujiLevel.CHUKICHI]: '✨',
  [OmikujiLevel.SHOKICHI]: '⭐',
  [OmikujiLevel.KICHI]: '🎊',
  [OmikujiLevel.SUEKICHI]: '🍀',
  [OmikujiLevel.KYO]: '☁️',
  [OmikujiLevel.DAIKYO]: '⚠️',
};

export const OMIKUJI_COLORS: Record<OmikujiLevel, string> = {
  [OmikujiLevel.DAIKICHI]: '#FFD700',    // Gold
  [OmikujiLevel.CHUKICHI]: '#FFA500',    // Orange
  [OmikujiLevel.SHOKICHI]: '#90EE90',    // Light green
  [OmikujiLevel.KICHI]: '#98D8C8',       // Mint
  [OmikujiLevel.SUEKICHI]: '#87CEEB',    // Sky blue
  [OmikujiLevel.KYO]: '#D3D3D3',         // Light gray
  [OmikujiLevel.DAIKYO]: '#A9A9A9',      // Dark gray
};

// Probability weights for drawing omikuji
export const OMIKUJI_WEIGHTS: Record<OmikujiLevel, number> = {
  [OmikujiLevel.DAIKICHI]: 10,   // 10%
  [OmikujiLevel.CHUKICHI]: 20,   // 20%
  [OmikujiLevel.SHOKICHI]: 20,   // 20%
  [OmikujiLevel.KICHI]: 25,      // 25%
  [OmikujiLevel.SUEKICHI]: 20,   // 20%
  [OmikujiLevel.KYO]: 4,         // 4%
  [OmikujiLevel.DAIKYO]: 1,      // 1%
};

export interface OmikujiFortune {
  level: OmikujiLevel;
  message: string;
  wish: string;          // 願い事
  health: string;        // 健康
  study: string;         // 学問
  travel: string;        // 旅行
  lostItem: string;      // 失せ物
  friendship: string;    // 友達
  luckyDirection: string; // 幸運の方角
  luckyItem: string;     // 幸運のアイテム
  poem: string;          // 和歌・詩
}

const OMIKUJI_FORTUNES: Record<OmikujiLevel, Omit<OmikujiFortune, 'level'>> = {
  [OmikujiLevel.DAIKICHI]: {
    message: 'おめでとう！さいこうのうんせいだよ！なにをしてもうまくいく、とってもいいひ。じしんをもってチャレンジしよう！',
    wish: 'かならずかなうよ。あきらめずにがんばって！',
    health: 'げんきいっぱい！でもちょうしにのりすぎないでね。',
    study: 'しゅうちゅうりょくばつぐん！いまがまなぶチャンスだよ。',
    travel: 'どこにいってもたのしいぼうけんがまっているよ！',
    lostItem: 'すぐにみつかるよ。たかいところをさがしてみて。',
    friendship: 'すてきなであいがあるかも。えがおでせっきょくてきに！',
    luckyDirection: 'みなみ',
    luckyItem: 'きんいろのもの',
    poem: 'あさひのぼり　ひかりさすみち　あゆみゆく　こころはずんで　あたらしいひ',
  },
  [OmikujiLevel.CHUKICHI]: {
    message: 'とってもいいうんせい！ちょっとずつだけど、いいことがどんどんふえていくよ。',
    wish: 'じかんはかかるけど、かなうよ。あせらずに。',
    health: 'ちょうしはいいよ。すいみんをしっかりとってね。',
    study: 'どりょくがみのるとき。コツコツつづけよう！',
    travel: 'たのしいたびになるよ。けいかくをしっかりたてて。',
    lostItem: 'ちかくにあるよ。よくつかうばしょをみてみて。',
    friendship: 'いまのともだちをたいせつに。きずながふかまるよ。',
    luckyDirection: 'ひがし',
    luckyItem: 'あおいもの',
    poem: 'ゆっくりと　あるきつづける　そのさきに　きぼうのはなが　さきほこるなり',
  },
  [OmikujiLevel.SHOKICHI]: {
    message: 'いいうんせいだよ。ちいさなしあわせをみつけられるひ。かんしゃのきもちをわすれずに。',
    wish: 'ちいさなねがいからかなえていこう。よくばらないでね。',
    health: 'まあまあだいじょうぶ。むりはしないでね。',
    study: 'すこしずつせいちょうしているよ。じしんをもって！',
    travel: 'ちかばのおでかけがおすすめ。あんぜんに。',
    lostItem: 'わすれたころにでてくるかも。あわてないで。',
    friendship: 'しずかにすごすのもいいよ。むりにあわせなくてOK。',
    luckyDirection: 'きた',
    luckyItem: 'みどりのもの',
    poem: 'ちいさくも　たしかなあゆみ　つみかさね　やがてはおおきな　ちからとなりぬ',
  },
  [OmikujiLevel.KICHI]: {
    message: 'いいかんじのうんせい。ふつうにすごせばだいじょうぶ。あせらずマイペースで。',
    wish: 'かなうかも。でもどりょくもひつようだよ。',
    health: 'ふつう。きそくただしいせいかつをこころがけて。',
    study: 'ちょっとずつがんばろう。あせりはきんもつ。',
    travel: 'たのしめるよ。じゅんびはしっかりね。',
    lostItem: 'よくさがせばみつかるよ。ひきだしのなかとか。',
    friendship: 'へいおんにすごせるよ。じぶんからこえをかけてみて。',
    luckyDirection: 'にし',
    luckyItem: 'しろいもの',
    poem: 'へいおんに　すぎゆくひびも　たからもの　あたりまえにも　かんしゃをこめて',
  },
  [OmikujiLevel.SUEKICHI]: {
    message: 'いまはまだまだだけど、さいごにはいいことがあるよ。あきらめないでがんばって！',
    wish: 'いますぐはむずかしい。でもさいごにはかなうよ。',
    health: 'ちょっとちゅうい。やすそくをしっかりとろう。',
    study: 'あとからせいかがでるよ。いまはしんぼう。',
    travel: 'けいかくをしっかりたてて。あわてないで。',
    lostItem: 'じかんがかかりそう。あとででてくるかも。',
    friendship: 'いまはしずかに。そのうちいいことがあるよ。',
    luckyDirection: 'みなみひがし',
    luckyItem: 'きいろいもの',
    poem: 'いまはまだ　くらきみちでも　あきらめず　あゆみをすすめ　あさはかならず',
  },
  [OmikujiLevel.KYO]: {
    message: 'ちょっとちゅういがひつようなとき。あせらず、しんちょうにいこう。でもだいじょうぶ、わるいことはながくつづかないよ。',
    wish: 'いまはがまん。むりしないほうがいいよ。',
    health: 'むりはきんもつ。ゆっくりやすんで。',
    study: 'しゅうちゅうしにくいかも。きほんをふくしゅうしよう。',
    travel: 'いまはやめておこう。いえでのんびりするのもいいよ。',
    lostItem: 'みつかりにくいかも。でもあきらめないで。',
    friendship: 'トラブルにちゅうい。やさしいことばをつかってね。',
    luckyDirection: 'ほくせい',
    luckyItem: 'おまもり',
    poem: 'くもはれて　ひかりさしこむ　そのときを　しんじてまとう　あめのすぎるを',
  },
  [OmikujiLevel.DAIKYO]: {
    message: 'とってもめずらしい！ぎゃくにラッキーかも？でも、きょうはしんちょうに。むりをせず、まわりのひとをたいせつにしよう。',
    wish: 'いまはがまんのとき。あとでいいことがあるよ。',
    health: 'よくやすんで。むりはぜったいダメ。',
    study: 'きほんにもどろう。あせらずていねいに。',
    travel: 'きょうはやめておこう。いえでリラックスして。',
    lostItem: 'みつけるのはむずかしそう。でもあきらめずに。',
    friendship: 'けんかにちゅうい。やさしくせっすることがだいじ。',
    luckyDirection: 'うごかないほうがいいよ',
    luckyItem: 'おまもり・かぞく',
    poem: 'たいふうも　いつかはすぎる　そのあとに　うつくしいにじ　あらわれるなり',
  },
};

/**
 * Draw omikuji based on weighted probability
 */
export function drawOmikuji(seed?: number): OmikujiFortune {
  const levels = Object.values(OmikujiLevel);
  const weights = levels.map(level => OMIKUJI_WEIGHTS[level]);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Use seed for deterministic results, or random
  const random = seed !== undefined
    ? (Math.sin(seed) * 10000) % 1
    : Math.random();

  let randomValue = Math.abs(random) * totalWeight;
  let selectedLevel: OmikujiLevel = OmikujiLevel.KICHI;

  for (let i = 0; i < levels.length; i++) {
    randomValue -= weights[i];
    if (randomValue <= 0) {
      selectedLevel = levels[i];
      break;
    }
  }

  return {
    level: selectedLevel,
    ...OMIKUJI_FORTUNES[selectedLevel],
  };
}

/**
 * Draw omikuji based on birth date (deterministic)
 */
export function drawOmikujiFromBirthDate(year: number, month: number, day: number): OmikujiFortune {
  // Create seed from birth date and current date
  const today = new Date();
  const seed = year + month * 100 + day * 10000 + today.getDate() + today.getMonth() * 31;
  return drawOmikuji(seed);
}

/**
 * Get luck percentage from omikuji level
 */
export function getOmikujiLuckPercentage(level: OmikujiLevel): number {
  const percentages: Record<OmikujiLevel, number> = {
    [OmikujiLevel.DAIKICHI]: 100,
    [OmikujiLevel.CHUKICHI]: 85,
    [OmikujiLevel.SHOKICHI]: 70,
    [OmikujiLevel.KICHI]: 60,
    [OmikujiLevel.SUEKICHI]: 50,
    [OmikujiLevel.KYO]: 30,
    [OmikujiLevel.DAIKYO]: 10,
  };
  return percentages[level];
}

/**
 * Get star rating from omikuji level
 */
export function getOmikujiStarRating(level: OmikujiLevel): number {
  const stars: Record<OmikujiLevel, number> = {
    [OmikujiLevel.DAIKICHI]: 5,
    [OmikujiLevel.CHUKICHI]: 4,
    [OmikujiLevel.SHOKICHI]: 3,
    [OmikujiLevel.KICHI]: 3,
    [OmikujiLevel.SUEKICHI]: 2,
    [OmikujiLevel.KYO]: 1,
    [OmikujiLevel.DAIKYO]: 1,
  };
  return stars[level];
}

/**
 * Interpret omikuji result with advice
 */
export function interpretOmikuji(level: OmikujiLevel): string {
  const interpretations: Record<OmikujiLevel, string> = {
    [OmikujiLevel.DAIKICHI]: 'さいこうのうんせい！なんでもチャレンジしてみよう！',
    [OmikujiLevel.CHUKICHI]: 'とてもいいうんせい。じしんをもってすすもう！',
    [OmikujiLevel.SHOKICHI]: 'いいうんせいだよ。ちいさなしあわせをたいせつに。',
    [OmikujiLevel.KICHI]: 'まあまあのうんせい。マイペースでだいじょうぶ！',
    [OmikujiLevel.SUEKICHI]: 'さいごにはいいことがあるよ。あきらめないで！',
    [OmikujiLevel.KYO]: 'ちょっとちゅういがひつよう。しんちょうにいこう。',
    [OmikujiLevel.DAIKYO]: 'とってもレアなおみくじ！ぎゃくにラッキーかも？',
  };
  return interpretations[level];
}
