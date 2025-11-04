/**
 * 色占いユーティリティ
 */

import { Constellation, CONSTELLATION_CHARACTERISTICS } from './astrology';
import { LifePathNumber } from './numerology';
import { Zodiac } from '../types';

/**
 * 色の情報
 */
export interface ColorInfo {
  name: string;
  nameHiragana: string;
  emoji: string;
  meaning: string;
  effect: string;
  whenToUse: string;
}

/**
 * 色のデータ
 */
const COLOR_DATA: Record<string, ColorInfo> = {
  あか: {
    name: 'あか',
    nameHiragana: 'あか',
    emoji: '❤️',
    meaning: 'パワーとゆうき',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    whenToUse: 'パワーがほしいとき、ゆうきをだしたいとき',
  },
  あお: {
    name: 'あお',
    nameHiragana: 'あお',
    emoji: '💙',
    meaning: 'しずけさとちせい',
    effect: 'こころがおちつき、べんきょうがうまくいく',
    whenToUse: 'べんきょうするとき、おしごとするとき',
  },
  きいろ: {
    name: 'きいろ',
    nameHiragana: 'きいろ',
    emoji: '💛',
    meaning: 'あかるさとパワー',
    effect: 'きもちがよくなり、あかるいきもちになれる',
    whenToUse: 'きもちがおちこんだとき、あかるいきもちになりたいとき',
  },
  みどり: {
    name: 'みどり',
    nameHiragana: 'みどり',
    emoji: '💚',
    meaning: 'あんしんとへいわ',
    effect: 'こころがおちつき、しあわせなきもちになれる',
    whenToUse: 'こころがおちつかないとき、リラックスしたいとき',
  },
  むらさき: {
    name: 'むらさき',
    nameHiragana: 'むらさき',
    emoji: '💜',
    meaning: 'しんせいとちせい',
    effect: 'べんきょうがうまくいく',
    whenToUse: 'べんきょうするとき、おしごとするとき',
  },
  しろ: {
    name: 'しろ',
    nameHiragana: 'しろ',
    emoji: '🤍',
    meaning: 'しんせいとけいせい',
    effect: 'こころがおちつき、きもちがよくなる',
    whenToUse: 'こころがおちつかないとき、リラックスしたいとき',
  },
  くろ: {
    name: 'くろ',
    nameHiragana: 'くろ',
    emoji: '⚫',
    meaning: 'つよさとしんじるちから',
    effect: 'じぶんのちからをしんじるきがつよくなる',
    whenToUse: 'パワーがほしいとき、ゆうきをだしたいとき',
  },
  ももいろ: {
    name: 'ももいろ',
    nameHiragana: 'ももいろ',
    emoji: '💗',
    meaning: 'あいとやさしさ',
    effect: 'かんけいがうまくいく',
    whenToUse: 'ともだちやかぞくとすごすとき',
  },
  みずいろ: {
    name: 'みずいろ',
    nameHiragana: 'みずいろ',
    emoji: '💧',
    meaning: 'やすらぎとへいわ',
    effect: 'こころがおちつき、しあわせなきもちになれる',
    whenToUse: 'こころがおちつかないとき、リラックスしたいとき',
  },
};

/**
 * 生年月日からラッキーカラーを判定
 */
export function getLuckyColorFromBirthDate(
  constellation: Constellation,
  _lifePathNumber: LifePathNumber,
  _zodiac: Zodiac
): ColorInfo {
  // 星座のラッキーカラーから選択
  const constellationColors = CONSTELLATION_CHARACTERISTICS[constellation].luckyColors;

  // 最初のラッキーカラーを返す
  const colorName = constellationColors[0] || 'あか';
  return COLOR_DATA[colorName] || COLOR_DATA['あか'];
}

/**
 * 今日着るべき色を提案
 */
export function getTodayColor(
  constellation: Constellation,
  lifePathNumber: LifePathNumber,
  zodiac: Zodiac
): ColorInfo {
  const luckyColor = getLuckyColorFromBirthDate(constellation, lifePathNumber, zodiac);

  // 今日の運勢に応じて色を調整（簡易版）
  const today = new Date();
  const seed = today.getDate() + today.getMonth() * 31;
  const colors = Object.keys(COLOR_DATA);
  const colorName = colors[seed % colors.length];

  return COLOR_DATA[colorName] || luckyColor;
}

/**
 * 色の意味と効果を取得
 */
export function getColorInfo(colorName: string): ColorInfo | null {
  return COLOR_DATA[colorName] || null;
}
