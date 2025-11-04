/**
 * 計算履歴管理ユーティリティ
 */

const HISTORY_KEY = 'date_calculation_history';
const MAX_HISTORY = 50; // 最大履歴数

/**
 * 計算履歴のアイテム
 */
export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  type: string; // 計算タイプ
  input: string; // 入力値
  result: string; // 結果
  formula?: string; // 計算式
}

/**
 * 計算履歴を取得
 * @returns 計算履歴の配列
 */
export function getCalculationHistory(): CalculationHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 計算履歴を保存
 * @param item 計算履歴アイテム
 */
export function saveCalculationHistory(item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const history = getCalculationHistory();
    const newItem: CalculationHistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save calculation history:', error);
  }
}

/**
 * 計算履歴を削除
 * @param id 履歴ID
 */
export function deleteCalculationHistory(id: string): void {
  try {
    const history = getCalculationHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete calculation history:', error);
  }
}

/**
 * 計算履歴を全削除
 */
export function clearCalculationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear calculation history:', error);
  }
}
