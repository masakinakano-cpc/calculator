/**
 * 願い事成就度ユーティリティ
 */

import { Constellation, getTodaysFortune } from './astrology';
import { LifePathNumber } from './numerology';
import { Weekday, getTodaysWeekdayFortune } from './weekdayFortune';
import { Zodiac } from '../types';

/**
 * 願い事の種類
 */
export enum WishType {
  LOVE = 'love',       // 恋愛
  WORK = 'work',       // 仕事
  HEALTH = 'health',   // 健康
  MONEY = 'money',     // お金
  STUDY = 'study',     // 勉強
  FRIENDSHIP = 'friendship', // 友情
  FAMILY = 'family',   // 家族
  DREAM = 'dream',     // 夢
}

/**
 * 願い事成就度
 */
export interface WishAchievement {
  type: WishType;
  today: number;      // 今日の成就度（0-100）
  thisMonth: number;  // 今月の成就度（0-100）
  level: 'excellent' | 'good' | 'normal' | 'challenging';
  advice: string;
  luckyActions: string[];
}

/**
 * 願い事の種類名
 */
export const WISH_TYPE_NAMES: Record<WishType, string> = {
  [WishType.LOVE]: 'れんあい',
  [WishType.WORK]: 'おしごと',
  [WishType.HEALTH]: 'けんこう',
  [WishType.MONEY]: 'おかね',
  [WishType.STUDY]: 'べんきょう',
  [WishType.FRIENDSHIP]: 'ゆうじょう',
  [WishType.FAMILY]: 'かぞく',
  [WishType.DREAM]: 'ゆめ',
};

/**
 * 願い事成就度を計算
 */
export function calculateWishAchievement(
  constellation: Constellation,
  _lifePathNumber: LifePathNumber,
  weekday: Weekday,
  _zodiac: Zodiac,
  wishType: WishType
): WishAchievement {
  const todayFortune = getTodaysFortune(constellation);
  const todayWeekdayFortune = getTodaysWeekdayFortune(weekday);

  // 今日の成就度を計算
  let todayScore = 0;
  if (wishType === WishType.LOVE) {
    todayScore = (todayFortune.love * 20) + (todayWeekdayFortune.love * 20);
  } else if (wishType === WishType.WORK) {
    todayScore = (todayFortune.work * 20) + (todayWeekdayFortune.work * 20);
  } else if (wishType === WishType.HEALTH) {
    todayScore = (todayFortune.health * 20) + (todayWeekdayFortune.health * 20);
  } else if (wishType === WishType.MONEY) {
    todayScore = (todayFortune.money * 20) + (todayWeekdayFortune.money * 20);
  } else if (wishType === WishType.STUDY) {
    todayScore = (todayFortune.work * 20) + (todayWeekdayFortune.work * 20);
  } else if (wishType === WishType.FRIENDSHIP) {
    todayScore = (todayFortune.love * 20) + (todayWeekdayFortune.love * 20);
  } else if (wishType === WishType.FAMILY) {
    todayScore = (todayFortune.love * 20) + (todayWeekdayFortune.love * 20);
  } else {
    todayScore = (todayFortune.overall * 20) + (todayWeekdayFortune.overall * 20);
  }

  todayScore = Math.min(todayScore, 100);

  // 今月の成就度（簡易版：今日のスコアに基づく）
  const thisMonth = Math.min(todayScore + Math.floor(Math.random() * 20), 100);

  // レベル判定
  let level: 'excellent' | 'good' | 'normal' | 'challenging';
  if (todayScore >= 80) {
    level = 'excellent';
  } else if (todayScore >= 60) {
    level = 'good';
  } else if (todayScore >= 40) {
    level = 'normal';
  } else {
    level = 'challenging';
  }

  // アドバイスを生成
  const advice = generateAdvice(wishType, level, todayScore);

  // ラッキーアクション
  const luckyActions = generateLuckyActions(wishType);

  return {
    type: wishType,
    today: todayScore,
    thisMonth,
    level,
    advice,
    luckyActions,
  };
}

/**
 * アドバイスを生成
 */
function generateAdvice(wishType: WishType, level: string, _score: number): string {
  const wishName = WISH_TYPE_NAMES[wishType];

  if (level === 'excellent') {
    return `${wishName}のねがいは、きょうはとてもじょうぶなきがつよいよ！おうえんしてるよ！あきらめずに、つづけていけば、きっとかなうよ！`;
  } else if (level === 'good') {
    return `${wishName}のねがいは、きょうはいいちょうしだよ！おうえんしてるよ！あきらめずに、つづけていけば、きっとかなうよ！`;
  } else if (level === 'normal') {
    return `${wishName}のねがいは、きょうはふつうのちょうしだよ。あきらめずに、つづけていけば、きっとかなうよ！`;
  } else {
    return `${wishName}のねがいは、きょうはちょっとチャレンジがあるけど、あきらめずに、つづけていけば、きっとかなうよ！`;
  }
}

/**
 * ラッキーアクションを生成
 */
function generateLuckyActions(wishType: WishType): string[] {
  const actions: Record<WishType, string[]> = {
    [WishType.LOVE]: [
      'ともだちやかぞくにやさしくする',
      'じぶんのきもちをそっちょくにつたえる',
      'あたらしいひととであう',
    ],
    [WishType.WORK]: [
      'べんきょうする',
      'あたらしいことにちょうせんする',
      'じぶんのやりたいことをやる',
    ],
    [WishType.HEALTH]: [
      'すこしやすんで、リラックスする',
      'からだをうごかす',
      'すいみんをじゅうぶんにとる',
    ],
    [WishType.MONEY]: [
      'おかねをたいせつにする',
      'おかねをかしこくつかう',
      'おかねをためる',
    ],
    [WishType.STUDY]: [
      'べんきょうする',
      'ほんをよむ',
      'あたらしいことをまなぶ',
    ],
    [WishType.FRIENDSHIP]: [
      'ともだちをたいせつにする',
      'ともだちとあそぶ',
      'ともだちにやさしくする',
    ],
    [WishType.FAMILY]: [
      'かぞくをたいせつにする',
      'かぞくとあそぶ',
      'かぞくにやさしくする',
    ],
    [WishType.DREAM]: [
      'じぶんのゆめをかんがえる',
      'じぶんのやりたいことをやる',
      'あたらしいことにちょうせんする',
    ],
  };

  return actions[wishType] || [];
}
