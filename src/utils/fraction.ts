/**
 * Fraction utilities for visual fraction input and calculation
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Calculate GCD (Greatest Common Divisor)
 */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Simplify a fraction
 */
export function simplifyFraction(fraction: Fraction): Fraction {
  const { numerator, denominator } = fraction;
  if (denominator === 0) {
    throw new Error('Division by zero');
  }
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(numerator, denominator);
  const sign = (numerator < 0) !== (denominator < 0) ? -1 : 1;

  return {
    numerator: sign * Math.abs(numerator) / divisor,
    denominator: Math.abs(denominator) / divisor,
  };
}

/**
 * Add two fractions
 */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
}

/**
 * Subtract two fractions
 */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const numerator = a.numerator * b.denominator - b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
}

/**
 * Multiply two fractions
 */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
}

/**
 * Divide two fractions
 */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) {
    throw new Error('Division by zero');
  }
  const numerator = a.numerator * b.denominator;
  const denominator = a.denominator * b.numerator;
  return simplifyFraction({ numerator, denominator });
}

/**
 * Convert fraction to decimal
 */
export function fractionToDecimal(fraction: Fraction): number {
  if (fraction.denominator === 0) {
    throw new Error('Division by zero');
  }
  return fraction.numerator / fraction.denominator;
}

/**
 * Convert decimal to fraction (approximate)
 */
export function decimalToFraction(decimal: number, precision: number = 0.0001): Fraction {
  let numerator = 1;
  let denominator = 1;
  let error = Math.abs(decimal - numerator / denominator);

  for (let d = 1; d <= 10000; d++) {
    const n = Math.round(decimal * d);
    const newError = Math.abs(decimal - n / d);
    if (newError < error) {
      error = newError;
      numerator = n;
      denominator = d;
      if (error < precision) break;
    }
  }

  return simplifyFraction({ numerator, denominator });
}

/**
 * Format fraction as string
 */
export function formatFraction(fraction: Fraction, showMixed: boolean = false): string {
  const simplified = simplifyFraction(fraction);
  const { numerator, denominator } = simplified;

  if (denominator === 1) {
    return numerator.toString();
  }

  if (showMixed && Math.abs(numerator) > denominator) {
    const whole = Math.floor(Math.abs(numerator) / denominator);
    const remainder = Math.abs(numerator) % denominator;
    const sign = numerator < 0 ? '-' : '';
    if (remainder === 0) {
      return `${sign}${whole}`;
    }
    return `${sign}${whole} ${remainder}/${denominator}`;
  }

  return `${numerator}/${denominator}`;
}

/**
 * Parse fraction from string (e.g., "3/4", "1 1/2", "2")
 */
export function parseFraction(str: string): Fraction {
  str = str.trim();

  // Whole number
  if (!str.includes('/')) {
    const num = parseFloat(str);
    if (isNaN(num)) {
      throw new Error('Invalid fraction format');
    }
    return { numerator: num, denominator: 1 };
  }

  // Mixed number (e.g., "1 1/2")
  const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num = parseInt(mixedMatch[2]);
    const den = parseInt(mixedMatch[3]);
    return { numerator: whole * den + (whole < 0 ? -num : num), denominator: den };
  }

  // Simple fraction (e.g., "3/4")
  const fractionMatch = str.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]);
    const den = parseInt(fractionMatch[2]);
    if (den === 0) {
      throw new Error('Division by zero');
    }
    return { numerator: num, denominator: den };
  }

  throw new Error('Invalid fraction format');
}
