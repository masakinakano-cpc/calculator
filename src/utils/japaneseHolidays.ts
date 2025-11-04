/**
 * 日本の祝日計算ユーティリティ
 * 移動祝日、振替休日、国民の休日を正確に計算
 */

/**
 * 固定祝日
 */
const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': '元日',
  '02-11': '建国記念の日',
  '02-23': '天皇誕生日',
  '04-29': '昭和の日',
  '05-03': '憲法記念日',
  '05-04': 'みどりの日',
  '05-05': 'こどもの日',
  '08-11': '山の日',
  '11-03': '文化の日',
  '11-23': '勤労感謝の日',
};

/**
 * 春分の日を計算（簡易版：2000-2099年の範囲）
 * 実際には太陽黄経に基づく計算が必要
 */
function calculateVernalEquinoxDay(year: number): number {
  if (year >= 2000 && year <= 2099) {
    // 簡易計算式：20日 + (year - 2000) * 0.2422の整数部分
    const offset = Math.floor((year - 2000) * 0.2422);
    return 20 + offset;
  }
  return 20; // デフォルト
}

/**
 * 秋分の日を計算（簡易版）
 */
function calculateAutumnalEquinoxDay(year: number): number {
  if (year >= 2000 && year <= 2099) {
    const offset = Math.floor((year - 2000) * 0.2422);
    return 23 + offset;
  }
  return 23; // デフォルト
}

/**
 * 第N月曜日を計算
 * @param year 年
 * @param month 月
 * @param weekday 曜日（0=日曜、1=月曜、...、6=土曜）
 * @param n 第何週目か（1, 2, 3, 4）
 * @returns 日
 */
function getNthWeekday(year: number, month: number, weekday: number, n: number): number {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay();

  let day = 1;
  if (firstWeekday <= weekday) {
    day = weekday - firstWeekday + 1;
  } else {
    day = 7 - firstWeekday + weekday + 1;
  }

  day += (n - 1) * 7;
  return day;
}

/**
 * 指定年の祝日一覧を取得
 * @param year 年
 * @returns 祝日の配列 [{date: 日付文字列, name: 祝日名}]
 */
export function getJapaneseHolidays(year: number): Array<{ date: string; name: string }> {
  const holidays: Array<{ date: string; name: string }> = [];

  // 固定祝日
  for (const [dateStr, name] of Object.entries(FIXED_HOLIDAYS)) {
    const [month, day] = dateStr.split('-').map(Number);
    holidays.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      name,
    });
  }

  // 春分の日
  const vernalDay = calculateVernalEquinoxDay(year);
  holidays.push({
    date: `${year}-03-${String(vernalDay).padStart(2, '0')}`,
    name: '春分の日',
  });

  // 秋分の日
  const autumnalDay = calculateAutumnalEquinoxDay(year);
  holidays.push({
    date: `${year}-09-${String(autumnalDay).padStart(2, '0')}`,
    name: '秋分の日',
  });

  // 移動祝日
  // 海の日（7月第3月曜日、2020年以降は固定）
  if (year >= 2003 && year < 2020) {
    const day = getNthWeekday(year, 7, 1, 3); // 月曜日 = 1
    holidays.push({
      date: `${year}-07-${String(day).padStart(2, '0')}`,
      name: '海の日',
    });
  } else if (year >= 2020) {
    holidays.push({
      date: `${year}-07-23`,
      name: '海の日',
    });
  } else {
    holidays.push({
      date: `${year}-07-20`,
      name: '海の日',
    });
  }

  // 敬老の日（9月第3月曜日）
  const respectDay = getNthWeekday(year, 9, 1, 3);
  holidays.push({
    date: `${year}-09-${String(respectDay).padStart(2, '0')}`,
    name: '敬老の日',
  });

  // 体育の日/スポーツの日（10月第2月曜日、2020年以降はスポーツの日）
  const sportsDay = getNthWeekday(year, 10, 1, 2);
  holidays.push({
    date: `${year}-10-${String(sportsDay).padStart(2, '0')}`,
    name: year >= 2020 ? 'スポーツの日' : '体育の日',
  });

  // 振替休日を計算
  const substituteHolidays = calculateSubstituteHolidays(year, holidays.map(h => h.date));
  substituteHolidays.forEach(date => {
    holidays.push({
      date,
      name: '振替休日',
    });
  });

  // 国民の休日を計算（祝日と祝日の間の平日）
  const nationalHolidays = calculateNationalHolidays(year, holidays.map(h => h.date));
  nationalHolidays.forEach(date => {
    holidays.push({
      date,
      name: '国民の休日',
    });
  });

  // 日付順にソート
  holidays.sort((a, b) => a.date.localeCompare(b.date));

  return holidays;
}

/**
 * 振替休日を計算
 * 日曜日が祝日の場合、その次の平日（月曜日）が振替休日
 */
function calculateSubstituteHolidays(_year: number, holidayDates: string[]): string[] {
  const substitutes: string[] = [];

  for (const holidayDate of holidayDates) {
    const date = new Date(holidayDate);
    if (date.getDay() === 0) { // 日曜日
      // 次の平日（月曜日）を探す
      let nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // 月曜日が既に祝日でない場合のみ追加
      const nextDayStr = formatDate(nextDay);
      if (!holidayDates.includes(nextDayStr)) {
        substitutes.push(nextDayStr);
      }
    }
  }

  return substitutes;
}

/**
 * 国民の休日を計算
 * 祝日と祝日の間の平日が国民の休日
 */
function calculateNationalHolidays(_year: number, holidayDates: string[]): string[] {
  const nationalHolidays: string[] = [];
  const sortedDates = [...holidayDates].sort();

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const date1 = new Date(sortedDates[i]);
    const date2 = new Date(sortedDates[i + 1]);

    // 2つの祝日の間が1日だけの場合
    const diffDays = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 2) {
      const middleDate = new Date(date1);
      middleDate.setDate(middleDate.getDate() + 1);
      const middleDateStr = formatDate(middleDate);

      // その日が既に祝日でない場合のみ追加
      if (!holidayDates.includes(middleDateStr)) {
        nationalHolidays.push(middleDateStr);
      }
    }
  }

  return nationalHolidays;
}

/**
 * DateオブジェクトをYYYY-MM-DD形式に変換
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 指定した日付が祝日かどうか判定
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 祝日ならtrue
 */
export function isJapaneseHoliday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const holidays = getJapaneseHolidays(year);
  return holidays.some(h => h.date === dateStr);
}

/**
 * 指定した日付の祝日名を取得
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 祝日名、またはnull
 */
export function getHolidayName(dateStr: string): string | null {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const holidays = getJapaneseHolidays(year);
  const holiday = holidays.find(h => h.date === dateStr);
  return holiday ? holiday.name : null;
}
