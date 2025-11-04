/**
 * 日本の文化・行事に関するユーティリティ
 * 六曜、二十四節気、節分、お彼岸など
 */

/**
 * 六曜の種類
 */
export enum Rokuyo {
  TAIAN = '大安',
  BUTSUMETSU = '仏滅',
  SENSHO = '先勝',
  TOMOBIKI = '友引',
  SENPU = '先負',
  SHAKKO = '赤口',
}

/**
 * 六曜の説明
 */
export const ROKUYO_DESCRIPTIONS: Record<Rokuyo, string> = {
  [Rokuyo.TAIAN]: '万事に大吉。婚礼、開店、契約などに最適',
  [Rokuyo.BUTSUMETSU]: '万事に凶。婚礼、開店などは避ける',
  [Rokuyo.SENSHO]: '午前は吉、午後は凶。急用は午前中に',
  [Rokuyo.TOMOBIKI]: '午前は凶、午後は吉。友を引くので葬式は避ける',
  [Rokuyo.SENPU]: '午前は凶、午後は吉。急用は午後に',
  [Rokuyo.SHAKKO]: '正午のみ吉、それ以外は凶',
};

/**
 * 六曜を計算
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 六曜
 */
export function getRokuyo(dateStr: string): Rokuyo {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 簡易的な六曜計算（旧暦ベースの近似）
  // 実際の六曜は旧暦に基づくため、ここでは簡易版を実装
  const baseDate = new Date(year, month - 1, day);
  const epoch = new Date(1900, 0, 1); // 基準日
  const diffDays = Math.floor((baseDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));

  const rokuyoIndex = (diffDays + 6) % 6; // 6日周期で循環
  const rokuyoList = [
    Rokuyo.TAIAN,
    Rokuyo.BUTSUMETSU,
    Rokuyo.SENSHO,
    Rokuyo.TOMOBIKI,
    Rokuyo.SENPU,
    Rokuyo.SHAKKO,
  ];

  return rokuyoList[rokuyoIndex];
}

/**
 * 二十四節気の種類
 */
export enum SolarTerms {
  RISSYUN = '立春',
  USUI = '雨水',
  KEICHITSU = '啓蟄',
  SHUNBUN = '春分',
  SEIMEI = '清明',
  KOKU = '穀雨',
  RIKKA = '立夏',
  SHOMAN = '小満',
  BOSHU = '芒種',
  GESHI = '夏至',
  SHOSHO = '小暑',
  TAISHO = '大暑',
  RISSYU = '立秋',
  SHOSHO_AKI = '処暑',
  HAKURO = '白露',
  SHUBUN = '秋分',
  KANRO = '寒露',
  SOKKO = '霜降',
  RITTO = '立冬',
  SHOSETSU = '小雪',
  TAISETSU = '大雪',
  TOJI = '冬至',
  SHOKAN = '小寒',
  DAIKAN = '大寒',
}

/**
 * 二十四節気のデータ（2024年基準、簡易版）
 * 実際の計算は太陽黄経に基づくため、ここでは近似値を使用
 */
const SOLAR_TERMS_DATA: Array<{ term: SolarTerms; month: number; day: number }> = [
  { term: SolarTerms.RISSYUN, month: 2, day: 4 },
  { term: SolarTerms.USUI, month: 2, day: 19 },
  { term: SolarTerms.KEICHITSU, month: 3, day: 5 },
  { term: SolarTerms.SHUNBUN, month: 3, day: 20 },
  { term: SolarTerms.SEIMEI, month: 4, day: 5 },
  { term: SolarTerms.KOKU, month: 4, day: 20 },
  { term: SolarTerms.RIKKA, month: 5, day: 5 },
  { term: SolarTerms.SHOMAN, month: 5, day: 21 },
  { term: SolarTerms.BOSHU, month: 6, day: 6 },
  { term: SolarTerms.GESHI, month: 6, day: 21 },
  { term: SolarTerms.SHOSHO, month: 7, day: 7 },
  { term: SolarTerms.TAISHO, month: 7, day: 23 },
  { term: SolarTerms.RISSYU, month: 8, day: 7 },
  { term: SolarTerms.SHOSHO_AKI, month: 8, day: 23 },
  { term: SolarTerms.HAKURO, month: 9, day: 8 },
  { term: SolarTerms.SHUBUN, month: 9, day: 23 },
  { term: SolarTerms.KANRO, month: 10, day: 8 },
  { term: SolarTerms.SOKKO, month: 10, day: 23 },
  { term: SolarTerms.RITTO, month: 11, day: 7 },
  { term: SolarTerms.SHOSETSU, month: 11, day: 22 },
  { term: SolarTerms.TAISETSU, month: 12, day: 7 },
  { term: SolarTerms.TOJI, month: 12, day: 22 },
  { term: SolarTerms.SHOKAN, month: 1, day: 6 },
  { term: SolarTerms.DAIKAN, month: 1, day: 20 },
];

/**
 * 指定した日付の二十四節気を取得
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns 二十四節気、またはnull
 */
export function getSolarTerm(dateStr: string): SolarTerms | null {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 簡易的な判定（実際は太陽黄経に基づく）
  for (const termData of SOLAR_TERMS_DATA) {
    if (termData.month === month && Math.abs(termData.day - day) <= 2) {
      return termData.term;
    }
  }

  return null;
}

/**
 * 節分の日付を計算（立春の前日）
 * @param year 年
 * @returns 節分の日付文字列 (YYYY-MM-DD)
 */
export function getSetsubunDate(year: number): string {
  // 立春は2月4日頃（簡易版）
  const risshun = new Date(year, 1, 4); // 2月4日
  const setsubun = new Date(risshun);
  setsubun.setDate(setsubun.getDate() - 1); // 前日

  const month = String(setsubun.getMonth() + 1).padStart(2, '0');
  const day = String(setsubun.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * お彼岸の日付を計算（春分の日・秋分の日を中心とした7日間）
 * @param year 年
 * @param isSpring 春分の日か秋分の日か
 * @returns 彼岸の開始日と終了日の配列 [startDate, endDate]
 */
export function getOhiganDates(year: number, isSpring: boolean = true): [string, string] {
  // 春分の日は3月20日頃、秋分の日は9月23日頃（簡易版）
  const equinoxDay = isSpring ? 20 : 23;
  const equinoxMonth = isSpring ? 3 : 9;
  const equinox = new Date(year, equinoxMonth - 1, equinoxDay);

  // 彼岸は春分の日・秋分の日の前後3日間（計7日間）
  const start = new Date(equinox);
  start.setDate(start.getDate() - 3);
  const end = new Date(equinox);
  end.setDate(end.getDate() + 3);

  const formatDate = (d: Date): string => {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${m}-${day}`;
  };

  return [formatDate(start), formatDate(end)];
}

/**
 * 指定した日付がお彼岸かどうか判定
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns お彼岸ならtrue
 */
export function isOhigan(dateStr: string): boolean {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 春分の日（3月20日頃）と秋分の日（9月23日頃）の前後3日間
  const springEquinox = 20;
  const autumnEquinox = 23;

  if (month === 3 && day >= 17 && day <= 23) {
    return Math.abs(day - springEquinox) <= 3;
  }
  if (month === 9 && day >= 20 && day <= 26) {
    return Math.abs(day - autumnEquinox) <= 3;
  }

  return false;
}
