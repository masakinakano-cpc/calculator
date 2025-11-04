/**
 * 年齢の可視化（円グラフ）ユーティリティ
 */

/**
 * 年齢の円グラフデータ
 */
export interface AgeChartData {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  percentageOfYear: number; // 年間の何%経過（0-100）
  percentageOfMonth: number; // 月間の何%経過（0-100）
}

/**
 * 年齢の円グラフデータを生成
 * @param birthDateStr 生年月日 (YYYY-MM-DD)
 * @param referenceDateStr 基準日 (YYYY-MM-DD、省略時は今日)
 * @returns 円グラフデータ
 */
export function getAgeChartData(birthDateStr: string, referenceDateStr?: string): AgeChartData {
  const birthDate = new Date(birthDateStr);
  const referenceDate = referenceDateStr ? new Date(referenceDateStr) : new Date();

  const totalDays = Math.floor((referenceDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  // 年間の進捗率（現在の年齢の年の中で何%経過したか）
  const currentYearStart = new Date(referenceDate.getFullYear(), 0, 1);
  const daysInYear = Math.floor((referenceDate.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24));
  const percentageOfYear = (daysInYear / 365) * 100;

  // 月間の進捗率（現在の月の中で何%経過したか）
  const currentMonthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const daysInMonth = Math.floor((referenceDate.getTime() - currentMonthStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysInCurrentMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate();
  const percentageOfMonth = (daysInMonth / daysInCurrentMonth) * 100;

  return {
    years,
    months,
    days,
    totalDays,
    percentageOfYear: Math.min(percentageOfYear, 100),
    percentageOfMonth: Math.min(percentageOfMonth, 100),
  };
}

/**
 * 複数の年齢を比較するためのグラフデータ
 */
export interface AgeComparisonChartData {
  name: string;
  date: string;
  age: AgeChartData;
  difference: {
    years: number;
    months: number;
    days: number;
  };
}

/**
 * 複数の年齢を比較するグラフデータを生成
 * @param birthDates 生年月日と名前の配列 [{date: string, name: string}]
 * @returns 比較グラフデータ
 */
export function getAgeComparisonChartData(
  birthDates: Array<{ date: string; name: string }>
): AgeComparisonChartData[] {
  const chartData = birthDates.map(({ date, name }) => ({
    name,
    date,
    age: getAgeChartData(date),
  }));

  // 最も若い人を基準にする
  const youngest = chartData.reduce((min, current) =>
    current.age.totalDays < min.age.totalDays ? current : min
  );

  return chartData.map(item => {
    const diffDays = item.age.totalDays - youngest.age.totalDays;
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    return {
      ...item,
      difference: {
        years,
        months,
        days,
      },
    };
  });
}
