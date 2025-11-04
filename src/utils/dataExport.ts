/**
 * データエクスポートユーティリティ
 */

import { getCalculationHistory, saveCalculationHistory } from './calculationHistory';
import { getAnniversaryList, addAnniversary } from './anniversaryManager';
import { saveStandardCalculationHistory } from './standardCalculatorHistory';

/**
 * 計算履歴をCSV形式でエクスポート
 * @returns CSV文字列
 */
export function exportHistoryToCSV(): string {
  const history = getCalculationHistory();
  const headers = ['タイムスタンプ', 'タイプ', '入力', '結果', '計算式'];
  const rows = history.map(item => [
    new Date(item.timestamp).toLocaleString('ja-JP'),
    item.type,
    item.input,
    item.result,
    item.formula || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csv;
}

/**
 * 計算履歴をJSON形式でエクスポート
 * @returns JSON文字列
 */
export function exportHistoryToJSON(): string {
  const history = getCalculationHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * 記念日リストをCSV形式でエクスポート
 * @returns CSV文字列
 */
export function exportAnniversariesToCSV(): string {
  const anniversaries = getAnniversaryList();
  const headers = ['名前', '日付', 'タイプ'];
  const rows = anniversaries.map(item => [
    item.name,
    item.date,
    item.type || 'custom',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csv;
}

/**
 * 記念日リストをJSON形式でエクスポート
 * @returns JSON文字列
 */
export function exportAnniversariesToJSON(): string {
  const anniversaries = getAnniversaryList();
  return JSON.stringify(anniversaries, null, 2);
}

/**
 * ファイルをダウンロード
 * @param content ファイル内容
 * @param filename ファイル名
 * @param mimeType MIMEタイプ
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 電卓モードの計算履歴をCSV形式でエクスポート
 */
export function exportStandardHistoryToCSV(history: Array<{ timestamp: number; formula: string; result: string; input: string }>): string {
  const headers = ['タイムスタンプ', '計算式', '結果', '入力'];
  const rows = history.map(item => [
    new Date(item.timestamp).toLocaleString('ja-JP'),
    item.formula,
    item.result,
    item.input,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csv;
}

/**
 * 電卓モードの計算履歴をJSON形式でエクスポート
 */
export function exportStandardHistoryToJSON(history: Array<{ timestamp: number; formula: string; result: string; input: string }>): string {
  return JSON.stringify(history, null, 2);
}

/**
 * CSV文字列をパース（基本的な実装）
 */
function parseCSV(csv: string): string[][] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const rows: string[][] = [];
  for (const line of lines) {
    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // スキップ
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current);
    rows.push(row);
  }

  return rows;
}

/**
 * 計算履歴をCSVからインポート
 * @param csv CSV文字列
 * @returns インポートされたアイテム数
 */
export function importHistoryFromCSV(csv: string): { success: boolean; count: number; error?: string } {
  try {
    const rows = parseCSV(csv);
    if (rows.length < 2) {
      return { success: false, count: 0, error: 'CSV形式が正しくありません' };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // ヘッダーの確認
    const expectedHeaders = ['タイムスタンプ', 'タイプ', '入力', '結果', '計算式'];
    if (!expectedHeaders.every(h => headers.includes(h))) {
      return { success: false, count: 0, error: 'CSVヘッダーが正しくありません' };
    }

    const timestampIndex = headers.indexOf('タイムスタンプ');
    const typeIndex = headers.indexOf('タイプ');
    const inputIndex = headers.indexOf('入力');
    const resultIndex = headers.indexOf('結果');
    const formulaIndex = headers.indexOf('計算式');

    let imported = 0;
    for (const row of dataRows) {
      if (row.length < expectedHeaders.length) continue;

      try {
        const timestamp = new Date(row[timestampIndex]).getTime();
        if (isNaN(timestamp)) continue;

        saveCalculationHistory({
          type: row[typeIndex] || '',
          input: row[inputIndex] || '',
          result: row[resultIndex] || '',
          formula: row[formulaIndex] || '',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import row:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}

/**
 * 計算履歴をJSONからインポート
 * @param json JSON文字列
 * @returns インポートされたアイテム数
 */
export function importHistoryFromJSON(json: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      return { success: false, count: 0, error: 'JSON形式が正しくありません' };
    }

    let imported = 0;
    for (const item of data) {
      if (!item.type || !item.result) continue;

      try {
        saveCalculationHistory({
          type: item.type,
          input: item.input || '',
          result: item.result,
          formula: item.formula || '',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import item:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}

/**
 * 電卓モードの計算履歴をCSVからインポート
 */
export function importStandardHistoryFromCSV(csv: string): { success: boolean; count: number; error?: string } {
  try {
    const rows = parseCSV(csv);
    if (rows.length < 2) {
      return { success: false, count: 0, error: 'CSV形式が正しくありません' };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const expectedHeaders = ['タイムスタンプ', '計算式', '結果', '入力'];
    if (!expectedHeaders.every(h => headers.includes(h))) {
      return { success: false, count: 0, error: 'CSVヘッダーが正しくありません' };
    }

    const formulaIndex = headers.indexOf('計算式');
    const resultIndex = headers.indexOf('結果');
    const inputIndex = headers.indexOf('入力');

    let imported = 0;
    for (const row of dataRows) {
      if (row.length < expectedHeaders.length) continue;

      try {
        saveStandardCalculationHistory({
          formula: row[formulaIndex] || '',
          result: row[resultIndex] || '',
          input: row[inputIndex] || '',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import row:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}

/**
 * 電卓モードの計算履歴をJSONからインポート
 */
export function importStandardHistoryFromJSON(json: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      return { success: false, count: 0, error: 'JSON形式が正しくありません' };
    }

    let imported = 0;
    for (const item of data) {
      if (!item.formula && !item.result) continue;

      try {
        saveStandardCalculationHistory({
          formula: item.formula || '',
          result: item.result || '',
          input: item.input || '',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import item:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}

/**
 * 記念日リストをCSVからインポート
 */
export function importAnniversariesFromCSV(csv: string): { success: boolean; count: number; error?: string } {
  try {
    const rows = parseCSV(csv);
    if (rows.length < 2) {
      return { success: false, count: 0, error: 'CSV形式が正しくありません' };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const expectedHeaders = ['名前', '日付', 'タイプ'];
    if (!expectedHeaders.every(h => headers.includes(h))) {
      return { success: false, count: 0, error: 'CSVヘッダーが正しくありません' };
    }

    const nameIndex = headers.indexOf('名前');
    const dateIndex = headers.indexOf('日付');
    const typeIndex = headers.indexOf('タイプ');

    let imported = 0;
    for (const row of dataRows) {
      if (row.length < expectedHeaders.length) continue;

      try {
        const name = row[nameIndex];
        const date = row[dateIndex];
        if (!name || !date) continue;

        addAnniversary({
          name,
          date,
          type: (row[typeIndex] as any) || 'custom',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import row:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}

/**
 * 記念日リストをJSONからインポート
 */
export function importAnniversariesFromJSON(json: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) {
      return { success: false, count: 0, error: 'JSON形式が正しくありません' };
    }

    let imported = 0;
    for (const item of data) {
      if (!item.name || !item.date) continue;

      try {
        addAnniversary({
          name: item.name,
          date: item.date,
          type: item.type || 'custom',
        });
        imported++;
      } catch (error) {
        console.error('Failed to import item:', error);
      }
    }

    return { success: true, count: imported };
  } catch (error) {
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'インポートに失敗しました' };
  }
}
