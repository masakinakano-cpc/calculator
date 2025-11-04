/**
 * 電卓モードの計算履歴管理
 */

import { db } from '../database';
import { BlockType } from '../types';

export interface StandardCalculationHistoryItem {
  id: string;
  timestamp: number;
  formula: string;
  result: string;
  input: string;
}

const STORAGE_KEY = 'standard_calculator_history';
const MAX_HISTORY_ITEMS = 100;

/**
 * 計算履歴を取得
 */
export function getStandardCalculationHistory(): StandardCalculationHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load calculation history:', error);
    return [];
  }
}

/**
 * 計算履歴を保存
 */
export function saveStandardCalculationHistory(
  item: Omit<StandardCalculationHistoryItem, 'id' | 'timestamp'>
): void {
  try {
    const history = getStandardCalculationHistory();
    const newItem: StandardCalculationHistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...item,
    };

    history.unshift(newItem);
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save calculation history:', error);
  }
}

/**
 * 計算履歴を削除
 */
export function deleteStandardCalculationHistory(id: string): void {
  try {
    const history = getStandardCalculationHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete calculation history:', error);
  }
}

/**
 * 計算履歴をすべて削除
 */
export function clearStandardCalculationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear calculation history:', error);
  }
}

/**
 * CBlockからSTANDARDタイプの履歴を取得
 */
export async function getStandardBlocksHistory(): Promise<StandardCalculationHistoryItem[]> {
  try {
    const blocks = await db.getAllBlocks();
    const standardBlocks = blocks.filter(block => block.type === BlockType.STANDARD);

    return standardBlocks.map(block => ({
      id: block.blockId,
      timestamp: block.createdAt,
      formula: block.formulaString,
      result: block.value,
      input: block.formulaString,
    }));
  } catch (error) {
    console.error('Failed to get blocks history:', error);
    return [];
  }
}
