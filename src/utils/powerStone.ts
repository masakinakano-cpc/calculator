/**
 * パワーストーン・ラッキーアイテムユーティリティ
 */

import { Constellation } from './astrology';
import { LifePathNumber } from './numerology';
import { Zodiac } from '../types';

/**
 * パワーストーン情報
 */
export interface PowerStone {
  name: string;
  nameHiragana: string;
  emoji: string;
  meaning: string;
  effect: string;
  color: string;
}

/**
 * ラッキーアイテム情報
 */
export interface LuckyItem {
  name: string;
  nameHiragana: string;
  emoji: string;
  meaning: string;
  whenToUse: string;
}

/**
 * パワーストーンデータ
 */
const POWER_STONES: Record<string, PowerStone> = {
  // 星座別
  ARIES: {
    name: 'ルビー',
    nameHiragana: 'るびー',
    emoji: '💎',
    meaning: 'ゆうきとパワーをあたえる',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    color: 'あか',
  },
  TAURUS: {
    name: 'エメラルド',
    nameHiragana: 'えめらるど',
    emoji: '💚',
    meaning: 'あんしんとへいわをあたえる',
    effect: 'こころがおちつき、しあわせなきもちになれる',
    color: 'みどり',
  },
  GEMINI: {
    name: 'シトリン',
    nameHiragana: 'しとりん',
    emoji: '💛',
    meaning: 'あかるさとパワーをあたえる',
    effect: 'じぶんをひょうげんするちからがつよくなる',
    color: 'きいろ',
  },
  CANCER: {
    name: 'パール',
    nameHiragana: 'ぱーる',
    emoji: '🤍',
    meaning: 'やさしさとあんしんをあたえる',
    effect: 'こころがおちつき、やさしいきもちになれる',
    color: 'しろ',
  },
  LEO: {
    name: 'サンストーン',
    nameHiragana: 'さんすとーん',
    emoji: '☀️',
    meaning: 'ひかりとパワーをあたえる',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    color: 'きいろ',
  },
  VIRGO: {
    name: 'サファイア',
    nameHiragana: 'さふぁいあ',
    emoji: '💙',
    meaning: 'ちせいとしずけさをあたえる',
    effect: 'べんきょうやおしごとがうまくいく',
    color: 'あお',
  },
  LIBRA: {
    name: 'オパール',
    nameHiragana: 'おぱーる',
    emoji: '🌈',
    meaning: 'バランスとちょうわをあたえる',
    effect: 'かんけいがうまくいく',
    color: 'にじいろ',
  },
  SCORPIO: {
    name: 'ガーネット',
    nameHiragana: 'がーねっと',
    emoji: '❤️',
    meaning: 'パワーとしんじるちからをあたえる',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    color: 'あか',
  },
  SAGITTARIUS: {
    name: 'トパーズ',
    nameHiragana: 'とぱーず',
    emoji: '💛',
    meaning: 'あかるさとパワーをあたえる',
    effect: 'あたらしいことにちょうせんするきがつよくなる',
    color: 'きいろ',
  },
  CAPRICORN: {
    name: 'オニキス',
    nameHiragana: 'おにきす',
    emoji: '⚫',
    meaning: 'つよさとしんじるちからをあたえる',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    color: 'くろ',
  },
  AQUARIUS: {
    name: 'アメジスト',
    nameHiragana: 'あめじすと',
    emoji: '💜',
    meaning: 'しんせいとちせいをあたえる',
    effect: 'こころがおちつき、べんきょうがうまくいく',
    color: 'むらさき',
  },
  PISCES: {
    name: 'アクアマリン',
    nameHiragana: 'あくあまりん',
    emoji: '💙',
    meaning: 'やすらぎとへいわをあたえる',
    effect: 'こころがおちつき、しあわせなきもちになれる',
    color: 'みずいろ',
  },
};

/**
 * 数秘術別パワーストーン
 */
const NUMEROLOGY_STONES: Record<number, PowerStone> = {
  1: { name: 'ダイヤモンド', nameHiragana: 'だいやもんど', emoji: '💎', meaning: 'つよさとリーダーシップ', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'しろ' },
  2: { name: 'ムーンストーン', nameHiragana: 'むーんすとーん', emoji: '🌙', meaning: 'やさしさとちょうわ', effect: 'かんけいがうまくいく', color: 'しろ' },
  3: { name: 'シトリン', nameHiragana: 'しとりん', emoji: '💛', meaning: 'あかるさとパワー', effect: 'じぶんをひょうげんするちからがつよくなる', color: 'きいろ' },
  4: { name: 'アメジスト', nameHiragana: 'あめじすと', emoji: '💜', meaning: 'しんせいとちせい', effect: 'べんきょうやおしごとがうまくいく', color: 'むらさき' },
  5: { name: 'エメラルド', nameHiragana: 'えめらるど', emoji: '💚', meaning: 'じゆうとパワー', effect: 'あたらしいことにちょうせんするきがつよくなる', color: 'みどり' },
  6: { name: 'ローズクォーツ', nameHiragana: 'ろーずくぉーつ', emoji: '💗', meaning: 'あいとやさしさ', effect: 'かんけいがうまくいく', color: 'ももいろ' },
  7: { name: 'アメジスト', nameHiragana: 'あめじすと', emoji: '💜', meaning: 'しんせいとちせい', effect: 'べんきょうがうまくいく', color: 'むらさき' },
  8: { name: 'トパーズ', nameHiragana: 'とぱーず', emoji: '💛', meaning: 'パワーとせいこう', effect: 'おしごとがうまくいく', color: 'きいろ' },
  9: { name: 'ルビー', nameHiragana: 'るびー', emoji: '💎', meaning: 'ゆうきとパワー', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'あか' },
  11: { name: 'ムーンストーン', nameHiragana: 'むーんすとーん', emoji: '🌙', meaning: 'しんせいとちせい', effect: 'べんきょうがうまくいく', color: 'しろ' },
  22: { name: 'サファイア', nameHiragana: 'さふぁいあ', emoji: '💙', meaning: 'ちせいとしずけさ', effect: 'べんきょうやおしごとがうまくいく', color: 'あお' },
  33: { name: 'ダイヤモンド', nameHiragana: 'だいやもんど', emoji: '💎', meaning: 'つよさとリーダーシップ', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'しろ' },
};

/**
 * 星座からパワーストーンを取得
 */
export function getPowerStoneFromConstellation(constellation: Constellation): PowerStone {
  return POWER_STONES[constellation] || POWER_STONES.ARIES;
}

/**
 * 数秘術からパワーストーンを取得
 */
export function getPowerStoneFromNumerology(lifePathNumber: LifePathNumber): PowerStone {
  return NUMEROLOGY_STONES[lifePathNumber] || NUMEROLOGY_STONES[1];
}

/**
 * 干支からパワーストーンを取得
 */
export function getPowerStoneFromZodiac(zodiac: Zodiac): PowerStone {
  const zodiacStones: Record<Zodiac, PowerStone> = {
    [Zodiac.RAT]: { name: 'ガーネット', nameHiragana: 'がーねっと', emoji: '❤️', meaning: 'パワーとしんじるちから', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'あか' },
    [Zodiac.OX]: { name: 'オニキス', nameHiragana: 'おにきす', emoji: '⚫', meaning: 'つよさとしんじるちから', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'くろ' },
    [Zodiac.TIGER]: { name: 'ルビー', nameHiragana: 'るびー', emoji: '💎', meaning: 'ゆうきとパワー', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'あか' },
    [Zodiac.RABBIT]: { name: 'パール', nameHiragana: 'ぱーる', emoji: '🤍', meaning: 'やさしさとあんしん', effect: 'こころがおちつき、やさしいきもちになれる', color: 'しろ' },
    [Zodiac.DRAGON]: { name: 'サンストーン', nameHiragana: 'さんすとーん', emoji: '☀️', meaning: 'ひかりとパワー', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'きいろ' },
    [Zodiac.SNAKE]: { name: 'エメラルド', nameHiragana: 'えめらるど', emoji: '💚', meaning: 'あんしんとへいわ', effect: 'こころがおちつき、しあわせなきもちになれる', color: 'みどり' },
    [Zodiac.HORSE]: { name: 'トパーズ', nameHiragana: 'とぱーず', emoji: '💛', meaning: 'あかるさとパワー', effect: 'あたらしいことにちょうせんするきがつよくなる', color: 'きいろ' },
    [Zodiac.SHEEP]: { name: 'ムーンストーン', nameHiragana: 'むーんすとーん', emoji: '🌙', meaning: 'やさしさとちょうわ', effect: 'かんけいがうまくいく', color: 'しろ' },
    [Zodiac.MONKEY]: { name: 'シトリン', nameHiragana: 'しとりん', emoji: '💛', meaning: 'あかるさとパワー', effect: 'じぶんをひょうげんするちからがつよくなる', color: 'きいろ' },
    [Zodiac.ROOSTER]: { name: 'ダイヤモンド', nameHiragana: 'だいやもんど', emoji: '💎', meaning: 'つよさとリーダーシップ', effect: 'じぶんのちからをしんじるきがつよくなる', color: 'しろ' },
    [Zodiac.DOG]: { name: 'サファイア', nameHiragana: 'さふぁいあ', emoji: '💙', meaning: 'ちせいとしずけさ', effect: 'べんきょうやおしごとがうまくいく', color: 'あお' },
    [Zodiac.PIG]: { name: 'ローズクォーツ', nameHiragana: 'ろーずくぉーつ', emoji: '💗', meaning: 'あいとやさしさ', effect: 'かんけいがうまくいく', color: 'ももいろ' },
  };
  return zodiacStones[zodiac];
}

/**
 * ラッキーアイテムを取得
 */
export function getLuckyItems(_constellation: Constellation, _lifePathNumber: LifePathNumber): LuckyItem[] {
  const items: LuckyItem[] = [
    {
      name: 'えんぴつ',
      nameHiragana: 'えんぴつ',
      emoji: '✏️',
      meaning: 'べんきょうやおしごとがうまくいく',
      whenToUse: 'べんきょうするとき、おしごとするとき',
    },
    {
      name: 'ほん',
      nameHiragana: 'ほん',
      emoji: '📚',
      meaning: 'ちしきがふえる',
      whenToUse: 'べんきょうするとき、よみものをよむとき',
    },
    {
      name: 'おかし',
      nameHiragana: 'おかし',
      emoji: '🍬',
      meaning: 'たのしいきもちになれる',
      whenToUse: 'きもちがおちこんだとき、たのしいきもちになりたいとき',
    },
    {
      name: 'はな',
      nameHiragana: 'はな',
      emoji: '🌸',
      meaning: 'きもちがよくなる',
      whenToUse: 'きもちがおちこんだとき、きもちをよくしたいとき',
    },
    {
      name: 'みず',
      nameHiragana: 'みず',
      emoji: '💧',
      meaning: 'きもちがおちつく',
      whenToUse: 'きもちがおちつかないとき、リラックスしたいとき',
    },
  ];

  // 星座・数秘術に応じて追加のアイテムを返す
  return items;
}
