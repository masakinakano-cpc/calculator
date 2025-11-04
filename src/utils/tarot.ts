/**
 * タロットカードユーティリティ
 */

/**
 * タロットカードの種類
 */
export enum TarotCard {
  // 大アルカナ
  FOOL = 'FOOL',
  MAGICIAN = 'MAGICIAN',
  HIGH_PRIESTESS = 'HIGH_PRIESTESS',
  EMPRESS = 'EMPRESS',
  EMPEROR = 'EMPEROR',
  HIEROPHANT = 'HIEROPHANT',
  LOVERS = 'LOVERS',
  CHARIOT = 'CHARIOT',
  STRENGTH = 'STRENGTH',
  HERMIT = 'HERMIT',
  WHEEL_OF_FORTUNE = 'WHEEL_OF_FORTUNE',
  JUSTICE = 'JUSTICE',
  HANGED_MAN = 'HANGED_MAN',
  DEATH = 'DEATH',
  TEMPERANCE = 'TEMPERANCE',
  DEVIL = 'DEVIL',
  TOWER = 'TOWER',
  STAR = 'STAR',
  MOON = 'MOON',
  SUN = 'SUN',
  JUDGEMENT = 'JUDGEMENT',
  WORLD = 'WORLD',
}

/**
 * タロットカード情報
 */
export interface TarotCardInfo {
  card: TarotCard;
  name: string;
  nameHiragana: string;
  emoji: string;
  meaning: string;
  advice: string;
  isReversed: boolean;
}

/**
 * タロットカード名
 */
export const TAROT_CARD_NAMES: Record<TarotCard, string> = {
  [TarotCard.FOOL]: '愚者',
  [TarotCard.MAGICIAN]: '魔術師',
  [TarotCard.HIGH_PRIESTESS]: '女教皇',
  [TarotCard.EMPRESS]: '女帝',
  [TarotCard.EMPEROR]: '皇帝',
  [TarotCard.HIEROPHANT]: '教皇',
  [TarotCard.LOVERS]: '恋人',
  [TarotCard.CHARIOT]: '戦車',
  [TarotCard.STRENGTH]: '力',
  [TarotCard.HERMIT]: '隠者',
  [TarotCard.WHEEL_OF_FORTUNE]: '運命の輪',
  [TarotCard.JUSTICE]: '正義',
  [TarotCard.HANGED_MAN]: '吊られた男',
  [TarotCard.DEATH]: '死神',
  [TarotCard.TEMPERANCE]: '節制',
  [TarotCard.DEVIL]: '悪魔',
  [TarotCard.TOWER]: '塔',
  [TarotCard.STAR]: '星',
  [TarotCard.MOON]: '月',
  [TarotCard.SUN]: '太陽',
  [TarotCard.JUDGEMENT]: '審判',
  [TarotCard.WORLD]: '世界',
};

/**
 * タロットカード名（ひらがな）
 */
export const TAROT_CARD_NAMES_HIRAGANA: Record<TarotCard, string> = {
  [TarotCard.FOOL]: 'ぐしゃ',
  [TarotCard.MAGICIAN]: 'まじゅつし',
  [TarotCard.HIGH_PRIESTESS]: 'じょきょうこう',
  [TarotCard.EMPRESS]: 'じょてい',
  [TarotCard.EMPEROR]: 'こうてい',
  [TarotCard.HIEROPHANT]: 'きょうこう',
  [TarotCard.LOVERS]: 'こいびと',
  [TarotCard.CHARIOT]: 'せんしゃ',
  [TarotCard.STRENGTH]: 'ちから',
  [TarotCard.HERMIT]: 'いんじゃ',
  [TarotCard.WHEEL_OF_FORTUNE]: 'うんめいのわ',
  [TarotCard.JUSTICE]: 'せいぎ',
  [TarotCard.HANGED_MAN]: 'つられたおとこ',
  [TarotCard.DEATH]: 'しにがみ',
  [TarotCard.TEMPERANCE]: 'せっせい',
  [TarotCard.DEVIL]: 'あくま',
  [TarotCard.TOWER]: 'とう',
  [TarotCard.STAR]: 'ほし',
  [TarotCard.MOON]: 'つき',
  [TarotCard.SUN]: 'たいよう',
  [TarotCard.JUDGEMENT]: 'しんぱん',
  [TarotCard.WORLD]: 'せかい',
};

/**
 * タロットカードの意味
 */
const TAROT_MEANINGS: Record<TarotCard, { meaning: string; advice: string; emoji: string }> = {
  [TarotCard.FOOL]: { meaning: 'あたらしいはじまり、むじゅん', advice: 'あたらしいことにちょうせんしてみよう！', emoji: '🃏' },
  [TarotCard.MAGICIAN]: { meaning: 'パワー、じつげんりょく', advice: 'じぶんのちからをしんじて、やりたいことをやろう！', emoji: '🎩' },
  [TarotCard.HIGH_PRIESTESS]: { meaning: 'しんせい、ちせい', advice: 'こころをしずめて、じぶんのなかをみてみよう。', emoji: '👑' },
  [TarotCard.EMPRESS]: { meaning: 'せいちょう、ゆたかさ', advice: 'じぶんをたいせつにして、たのしいことをしよう！', emoji: '👸' },
  [TarotCard.EMPEROR]: { meaning: 'リーダーシップ、つよさ', advice: 'じぶんのちからをしんじて、リーダーシップをはっきしてみよう！', emoji: '👑' },
  [TarotCard.HIEROPHANT]: { meaning: 'がくしゅう、しどう', advice: 'べんきょうして、あたらしいことをまなぼう！', emoji: '📖' },
  [TarotCard.LOVERS]: { meaning: 'あい、かんけい', advice: 'ともだちやかぞくをたいせつにしよう！', emoji: '💕' },
  [TarotCard.CHARIOT]: { meaning: 'せいこう、ちょうせん', advice: 'あたらしいことにちょうせんしてみよう！', emoji: '🏇' },
  [TarotCard.STRENGTH]: { meaning: 'つよさ、しんじるちから', advice: 'じぶんのちからをしんじて、つづけていこう！', emoji: '💪' },
  [TarotCard.HERMIT]: { meaning: 'かんがえる、いっしん', advice: 'こころをしずめて、じぶんのなかをみてみよう。', emoji: '🧙' },
  [TarotCard.WHEEL_OF_FORTUNE]: { meaning: 'うんめい、へんか', advice: 'きょうはうんがかわるきせつかも。あきらめずに、つづけていこう！', emoji: '🎡' },
  [TarotCard.JUSTICE]: { meaning: 'せいぎ、バランス', advice: 'バランスをたいせつにして、こうせいにつとめよう！', emoji: '⚖️' },
  [TarotCard.HANGED_MAN]: { meaning: 'しんせい、かんがえなおし', advice: 'こころをしずめて、じぶんのなかをみてみよう。', emoji: '🙃' },
  [TarotCard.DEATH]: { meaning: 'へんか、しんせい', advice: 'あたらしいことがはじまるきせつ。あきらめずに、つづけていこう！', emoji: '💀' },
  [TarotCard.TEMPERANCE]: { meaning: 'バランス、ちょうわ', advice: 'バランスをたいせつにして、ゆっくりとすすもう！', emoji: '🧘' },
  [TarotCard.DEVIL]: { meaning: 'きんしゅう、じゆう', advice: 'じゆうになるために、こころをひらいてみよう！', emoji: '😈' },
  [TarotCard.TOWER]: { meaning: 'へんか、けいこく', advice: 'きょうはちょっとちゅういが必要。ゆっくりとすごしてね。', emoji: '🗼' },
  [TarotCard.STAR]: { meaning: 'きぼう、あかるいみらい', advice: 'きょうはきぼうにあふれたきせつ！あきらめずに、つづけていこう！', emoji: '⭐' },
  [TarotCard.MOON]: { meaning: 'ゆめ、そうぞう', advice: 'こころをしずめて、じぶんのなかをみてみよう。', emoji: '🌙' },
  [TarotCard.SUN]: { meaning: 'あかるさ、せいこう', advice: 'きょうはあかるいきせつ！たのしいことがありそうだよ！', emoji: '☀️' },
  [TarotCard.JUDGEMENT]: { meaning: 'しんせい、かんがえなおし', advice: 'こころをしずめて、じぶんのなかをみてみよう。', emoji: '📯' },
  [TarotCard.WORLD]: { meaning: 'かんせい、せいこう', advice: 'きょうはかんせいのきせつ！おめでとう！', emoji: '🌍' },
};

/**
 * 生年月日からメインカードを決定
 */
export function getMainCardFromBirthDate(year: number, month: number, day: number): TarotCard {
  const seed = year + month * 100 + day;
  const cards = Object.values(TarotCard);
  const index = seed % cards.length;
  return cards[index];
}

/**
 * 今日のカードを引く
 */
export function drawTodayCard(year: number, month: number, day: number): TarotCardInfo {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + year + month + day;
  const cards = Object.values(TarotCard);
  const cardIndex = seed % cards.length;
  const card = cards[cardIndex];
  const isReversed = (seed % 2) === 0;

  const cardInfo = TAROT_MEANINGS[card];

  return {
    card,
    name: TAROT_CARD_NAMES[card],
    nameHiragana: TAROT_CARD_NAMES_HIRAGANA[card],
    emoji: cardInfo.emoji,
    meaning: isReversed ? `${cardInfo.meaning}（ぎゃく）` : cardInfo.meaning,
    advice: isReversed ? `きょうはちょっとちゅういが必要。${cardInfo.advice}` : cardInfo.advice,
    isReversed,
  };
}
