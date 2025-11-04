/**
 * 記念日リスト管理ユーティリティ
 */

const ANNIVERSARY_KEY = 'anniversary_list';
const MAX_ANNIVERSARIES = 50;

/**
 * 記念日アイテム
 */
export interface AnniversaryItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type?: 'birthday' | 'anniversary' | 'event' | 'custom';
  createdAt: number;
}

/**
 * 記念日リストを取得
 * @returns 記念日の配列
 */
export function getAnniversaryList(): AnniversaryItem[] {
  try {
    const stored = localStorage.getItem(ANNIVERSARY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 記念日を追加
 * @param item 記念日アイテム（idとcreatedAtを除く）
 */
export function addAnniversary(item: Omit<AnniversaryItem, 'id' | 'createdAt'>): void {
  try {
    const list = getAnniversaryList();
    const newItem: AnniversaryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };

    const updatedList = [newItem, ...list].slice(0, MAX_ANNIVERSARIES);
    localStorage.setItem(ANNIVERSARY_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Failed to add anniversary:', error);
  }
}

/**
 * 記念日を削除
 * @param id 記念日ID
 */
export function deleteAnniversary(id: string): void {
  try {
    const list = getAnniversaryList();
    const updatedList = list.filter(item => item.id !== id);
    localStorage.setItem(ANNIVERSARY_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Failed to delete anniversary:', error);
  }
}

/**
 * 記念日を更新
 * @param id 記念日ID
 * @param updates 更新内容
 */
export function updateAnniversary(id: string, updates: Partial<Omit<AnniversaryItem, 'id' | 'createdAt'>>): void {
  try {
    const list = getAnniversaryList();
    const updatedList = list.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(ANNIVERSARY_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Failed to update anniversary:', error);
  }
}

/**
 * 記念日リストを全削除
 */
export function clearAnniversaryList(): void {
  try {
    localStorage.removeItem(ANNIVERSARY_KEY);
  } catch (error) {
    console.error('Failed to clear anniversary list:', error);
  }
}

/**
 * 記念日までの日数を計算
 * @param dateStr 記念日の日付 (YYYY-MM-DD)
 * @returns 残り日数
 */
export function getDaysUntilAnniversary(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  const thisYear = new Date(today.getFullYear(), target.getMonth(), target.getDate());
  const nextYear = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate());

  const targetDate = thisYear > today ? thisYear : nextYear;
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
