/**
 * NovaCalc - Specialized Calculation Modes
 * Date/time, zodiac, age, and unit conversion calculations
 */

import { Zodiac, UnitCategory } from '../types';

/**
 * Date/Time Calculations
 */
export class DateCalculator {
  /**
   * Add or subtract time from a date
   */
  static addToDate(
    startDate: Date,
    amount: number,
    unit: 'year' | 'month' | 'day' | 'week'
  ): Date {
    const result = new Date(startDate);

    switch (unit) {
      case 'year':
        result.setFullYear(result.getFullYear() + amount);
        break;
      case 'month':
        result.setMonth(result.getMonth() + amount);
        break;
      case 'day':
        result.setDate(result.getDate() + amount);
        break;
      case 'week':
        result.setDate(result.getDate() + amount * 7);
        break;
    }

    return result;
  }

  /**
   * Calculate difference between two dates
   */
  static dateDifference(startDate: Date, endDate: Date): {
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total days
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days, totalDays };
  }

  /**
   * Calculate age from birth date
   */
  static calculateAge(birthDate: Date, referenceDate: Date = new Date()): {
    years: number;
    months: number;
    days: number;
  } {
    const diff = this.dateDifference(birthDate, referenceDate);
    return {
      years: diff.years,
      months: diff.months,
      days: diff.days,
    };
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
}

/**
 * Chinese Zodiac Calculator
 */
export class ZodiacCalculator {
  private static readonly ZODIAC_MAP: Record<number, Zodiac> = {
    0: Zodiac.MONKEY,
    1: Zodiac.ROOSTER,
    2: Zodiac.DOG,
    3: Zodiac.PIG,
    4: Zodiac.RAT,
    5: Zodiac.OX,
    6: Zodiac.TIGER,
    7: Zodiac.RABBIT,
    8: Zodiac.DRAGON,
    9: Zodiac.SNAKE,
    10: Zodiac.HORSE,
    11: Zodiac.SHEEP,
  };

  private static readonly ZODIAC_NAMES_JA: Record<Zodiac, string> = {
    [Zodiac.MONKEY]: '申 (さる)',
    [Zodiac.ROOSTER]: '酉 (とり)',
    [Zodiac.DOG]: '戌 (いぬ)',
    [Zodiac.PIG]: '亥 (いのしし)',
    [Zodiac.RAT]: '子 (ねずみ)',
    [Zodiac.OX]: '丑 (うし)',
    [Zodiac.TIGER]: '寅 (とら)',
    [Zodiac.RABBIT]: '卯 (うさぎ)',
    [Zodiac.DRAGON]: '辰 (たつ)',
    [Zodiac.SNAKE]: '巳 (へび)',
    [Zodiac.HORSE]: '午 (うま)',
    [Zodiac.SHEEP]: '未 (ひつじ)',
  };

  /**
   * Calculate zodiac from year
   */
  static getZodiac(year: number): Zodiac {
    const remainder = year % 12;
    return this.ZODIAC_MAP[remainder];
  }

  /**
   * Get Japanese name for zodiac
   */
  static getZodiacNameJa(zodiac: Zodiac): string {
    return this.ZODIAC_NAMES_JA[zodiac];
  }

  /**
   * Get zodiac with Japanese name from year
   */
  static getZodiacWithName(year: number): { zodiac: Zodiac; nameJa: string } {
    const zodiac = this.getZodiac(year);
    return {
      zodiac,
      nameJa: this.getZodiacNameJa(zodiac),
    };
  }
}

/**
 * Unit Conversion Calculator
 */
export class UnitConverter {
  private static readonly CONVERSIONS: Record<
    UnitCategory,
    Record<string, { toBase: (v: number) => number; fromBase: (v: number) => number }>
  > = {
    [UnitCategory.LENGTH]: {
      mm: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cm: { toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      m: { toBase: (v) => v, fromBase: (v) => v },
      km: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      inch: { toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yard: { toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mile: { toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
    [UnitCategory.WEIGHT]: {
      mg: { toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      g: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      kg: { toBase: (v) => v, fromBase: (v) => v },
      ton: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      oz: { toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      lb: { toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    },
    [UnitCategory.VOLUME]: {
      ml: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      l: { toBase: (v) => v, fromBase: (v) => v },
      kl: { toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cup: { toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      pint: { toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      quart: { toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      gallon: { toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    },
    [UnitCategory.TIME]: {
      ms: { toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      s: { toBase: (v) => v, fromBase: (v) => v },
      min: { toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      hour: { toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      day: { toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      week: { toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    },
    [UnitCategory.TEMPERATURE]: {
      C: {
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      F: {
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      K: {
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
    [UnitCategory.CURRENCY]: {
      // Note: In a real application, these rates would be fetched from an API
      JPY: { toBase: (v) => v / 150, fromBase: (v) => v * 150 },
      USD: { toBase: (v) => v, fromBase: (v) => v },
      EUR: { toBase: (v) => v * 1.1, fromBase: (v) => v / 1.1 },
      GBP: { toBase: (v) => v * 1.3, fromBase: (v) => v / 1.3 },
      CNY: { toBase: (v) => v / 7, fromBase: (v) => v * 7 },
    },
  };

  /**
   * Convert between units
   */
  static convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): number {
    const conversions = this.CONVERSIONS[category];

    if (!conversions[fromUnit] || !conversions[toUnit]) {
      throw new Error(`Unknown unit: ${fromUnit} or ${toUnit}`);
    }

    // Convert to base unit, then to target unit
    const baseValue = conversions[fromUnit].toBase(value);
    return conversions[toUnit].fromBase(baseValue);
  }

  /**
   * Get available units for a category
   */
  static getUnitsForCategory(category: UnitCategory): string[] {
    return Object.keys(this.CONVERSIONS[category]);
  }
}
