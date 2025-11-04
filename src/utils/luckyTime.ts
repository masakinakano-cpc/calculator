/**
 * 今日のラッキータイムユーティリティ
 */

import { Constellation, getTodaysFortune } from './astrology';
import { LifePathNumber } from './numerology';
import { Weekday, getTodaysWeekdayFortune } from './weekdayFortune';
import { Zodiac } from '../types';

/**
 * ラッキータイム情報
 */
export interface LuckyTimeInfo {
  timeSlots: Array<{
    time: string;      // 例: "10:00-12:00"
    score: number;    // 1-5
    activity: string; // おすすめのアクション
  }>;
  luckyDirection: string;  // ラッキー方位
  luckyColor: string;      // ラッキーカラー
  luckyNumber: number;     // ラッキーナンバー
  luckyAction: string;    // ラッキーアクション
  bestTime: string;       // ベストタイム
}

/**
 * 今日のラッキータイムを計算
 */
export function calculateLuckyTime(
  constellation: Constellation,
  _lifePathNumber: LifePathNumber,
  weekday: Weekday,
  _zodiac: Zodiac
): LuckyTimeInfo {
  const todayFortune = getTodaysFortune(constellation);
  getTodaysWeekdayFortune(weekday); // 将来的に使用する可能性があるため保持

  // 時間帯ごとのスコアを計算
  const timeSlots = [
    { time: '6:00-8:00', baseScore: 3 },
    { time: '8:00-10:00', baseScore: 4 },
    { time: '10:00-12:00', baseScore: 5 },
    { time: '12:00-14:00', baseScore: 4 },
    { time: '14:00-16:00', baseScore: 5 },
    { time: '16:00-18:00', baseScore: 4 },
    { time: '18:00-20:00', baseScore: 3 },
    { time: '20:00-22:00', baseScore: 2 },
  ].map(slot => {
    const score = Math.min(5, Math.max(1, slot.baseScore + (todayFortune.overall - 3)));
    const activities = [
      'べんきょうする',
      'あたらしいことにちょうせんする',
      'ともだちとあそぶ',
      'リラックスする',
      'じぶんのやりたいことをやる',
    ];
    return {
      time: slot.time,
      score,
      activity: activities[Math.floor(Math.random() * activities.length)],
    };
  });

  // ベストタイムを見つける
  const bestSlot = timeSlots.reduce((best, current) =>
    current.score > best.score ? current : best
  );
  const bestTime = bestSlot.time;

  // ラッキー方位
  const directions = ['きた', 'みなみ', 'ひがし', 'にし', 'きたひがし', 'みなみにし', 'きたにし', 'みなみひがし'];
  const luckyDirection = directions[Math.floor(Math.random() * directions.length)];

  // ラッキーカラー（星座のラッキーカラーから）
  const luckyColor = todayFortune.luckyColor;

  // ラッキーナンバー
  const luckyNumber = Math.floor(Math.random() * 9) + 1;

  // ラッキーアクション
  const luckyActions = [
    'あたらしいことにちょうせんする',
    'ともだちとあそぶ',
    'べんきょうする',
    'じぶんのやりたいことをやる',
    'リラックスする',
  ];
  const luckyAction = luckyActions[Math.floor(Math.random() * luckyActions.length)];

  return {
    timeSlots,
    luckyDirection,
    luckyColor,
    luckyNumber,
    luckyAction,
    bestTime,
  };
}
