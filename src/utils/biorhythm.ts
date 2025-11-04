/**
 * バイオリズムユーティリティ
 * 身体・感情・知性のリズムを計算
 */


/**
 * バイオリズムの種類
 */
export enum BiorhythmType {
  PHYSICAL = 'physical',   // 身体（23日周期）
  EMOTIONAL = 'emotional', // 感情（28日周期）
  INTELLECTUAL = 'intellectual', // 知性（33日周期）
}

/**
 * バイオリズムの状態
 */
export interface BiorhythmState {
  physical: number;    // -100 ～ 100
  emotional: number;
  intellectual: number;
  overall: number;     // 総合評価
  powerUp: boolean;    // パワーアップ日か
  caution: boolean;    // 注意日か
}

/**
 * 日ごとのバイオリズム
 */
export interface DailyBiorhythm {
  date: string; // YYYY-MM-DD
  state: BiorhythmState;
  advice: string;
}

/**
 * バイオリズムを計算
 * @param birthDate 生年月日
 * @param targetDate 対象日
 * @returns バイオリズムの状態
 */
export function calculateBiorhythm(birthDate: Date, targetDate: Date): BiorhythmState {
  const daysDiff = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

  // 各リズムを計算（サイン波）
  const physical = Math.round(Math.sin((2 * Math.PI * daysDiff) / 23) * 100);
  const emotional = Math.round(Math.sin((2 * Math.PI * daysDiff) / 28) * 100);
  const intellectual = Math.round(Math.sin((2 * Math.PI * daysDiff) / 33) * 100);

  // 総合評価（平均）
  const overall = Math.round((physical + emotional + intellectual) / 3);

  // パワーアップ日（すべてが高い）
  const powerUp = physical >= 70 && emotional >= 70 && intellectual >= 70;

  // 注意日（すべてが低い）
  const caution = physical <= -70 && emotional <= -70 && intellectual <= -70;

  return {
    physical,
    emotional,
    intellectual,
    overall,
    powerUp,
    caution,
  };
}

/**
 * 期間のバイオリズムを計算
 * @param birthDate 生年月日
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 日ごとのバイオリズム
 */
export function calculateBiorhythmRange(
  birthDate: Date,
  startDate: Date,
  endDate: Date
): DailyBiorhythm[] {
  const results: DailyBiorhythm[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const state = calculateBiorhythm(birthDate, current);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    let advice = '';
    if (state.powerUp) {
      advice = 'きょうはパワーアップデー！あたらしいことにちょうせんするのにぴったりだよ！';
    } else if (state.caution) {
      advice = 'きょうはちょっとちゅういが必要。ゆっくりとすごして、むりをしないでね。';
    } else if (state.overall >= 50) {
      advice = 'きょうはいいちょうし！たのしいことがありそうだよ。';
    } else if (state.overall <= -50) {
      advice = 'きょうはすこしゆっくりとすごすといいかも。リラックスしてね。';
    } else {
      advice = 'きょうはふつうのちょうし。じぶんのペースをまもってね。';
    }

    results.push({
      date: dateStr,
      state,
      advice,
    });

    current.setDate(current.getDate() + 1);
  }

  return results;
}

/**
 * 次のパワーアップ日を計算
 * @param birthDate 生年月日
 * @param fromDate 基準日
 * @returns 次のパワーアップ日
 */
export function getNextPowerUpDay(birthDate: Date, fromDate: Date): Date {
  const current = new Date(fromDate);

  // 最大365日先まで検索
  for (let i = 0; i < 365; i++) {
    const state = calculateBiorhythm(birthDate, current);
    if (state.powerUp) {
      return new Date(current);
    }
    current.setDate(current.getDate() + 1);
  }

  // 見つからなければ1年後を返す
  return new Date(fromDate.getTime() + 365 * 24 * 60 * 60 * 1000);
}
