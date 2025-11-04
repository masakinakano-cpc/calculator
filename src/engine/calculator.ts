/**
 * NovaCalc - Calculation Engine
 * Core arithmetic evaluation with high precision using Decimal.js
 */

import Decimal from 'decimal.js';
import { substituteBlockValues, validateFormula } from './parser';

// Configure Decimal.js for high precision
Decimal.set({ precision: 50 });

/**
 * Evaluate a mathematical expression with proper operator precedence
 * Supports: +, -, *, /, %, ^ (power), parentheses
 */
export function evaluate(expression: string): Decimal {
  // Remove all whitespace
  const expr = expression.replace(/\s/g, '');

  // Parse and evaluate with proper precedence
  return parseExpression(expr, { pos: 0 });
}

/**
 * Parse expression (handles + and -)
 */
function parseExpression(expr: string, ctx: { pos: number }): Decimal {
  let result = parseTerm(expr, ctx);

  while (ctx.pos < expr.length) {
    const op = expr[ctx.pos];

    if (op === '+' || op === '-') {
      ctx.pos++;
      const right = parseTerm(expr, ctx);
      result = op === '+' ? result.plus(right) : result.minus(right);
    } else {
      break;
    }
  }

  return result;
}

/**
 * Parse term (handles *, /, %)
 */
function parseTerm(expr: string, ctx: { pos: number }): Decimal {
  let result = parsePower(expr, ctx);

  while (ctx.pos < expr.length) {
    const op = expr[ctx.pos];

    if (op === '*' || op === '/' || op === '%') {
      ctx.pos++;
      const right = parseFactor(expr, ctx);

      if (op === '*') {
        result = result.times(right);
      } else if (op === '/') {
        if (right.isZero()) {
          throw new Error('Division by zero');
        }
        result = result.dividedBy(right);
      } else if (op === '%') {
        result = result.modulo(right);
      }
    } else {
      break;
    }
  }

  return result;
}

/**
 * Parse power (handles ^ (power), highest precedence)
 */
function parsePower(expr: string, ctx: { pos: number }): Decimal {
  let result = parseFactor(expr, ctx);

  while (ctx.pos < expr.length && expr[ctx.pos] === '^') {
    ctx.pos++;
    const right = parseFactor(expr, ctx);
    // Decimal.js uses toPower for exponentiation
    result = result.toPower(right);
  }

  return result;
}

/**
 * Parse factor (handles numbers, unary minus, and parentheses)
 */
function parseFactor(expr: string, ctx: { pos: number }): Decimal {
  // Handle unary minus
  if (ctx.pos < expr.length && expr[ctx.pos] === '-') {
    ctx.pos++;
    return parseFactor(expr, ctx).negated();
  }

  // Handle unary plus
  if (ctx.pos < expr.length && expr[ctx.pos] === '+') {
    ctx.pos++;
    return parseFactor(expr, ctx);
  }

  // Handle parentheses
  if (ctx.pos < expr.length && expr[ctx.pos] === '(') {
    ctx.pos++;
    const result = parseExpression(expr, ctx);

    if (ctx.pos < expr.length && expr[ctx.pos] === ')') {
      ctx.pos++;
    } else {
      throw new Error('Missing closing parenthesis');
    }

    return result;
  }

  // Handle numbers
  return parseNumber(expr, ctx);
}

/**
 * Parse a number (including decimals)
 */
function parseNumber(expr: string, ctx: { pos: number }): Decimal {
  let numStr = '';
  const start = ctx.pos;

  while (
    ctx.pos < expr.length &&
    (/\d/.test(expr[ctx.pos]) || expr[ctx.pos] === '.')
  ) {
    numStr += expr[ctx.pos];
    ctx.pos++;
  }

  if (numStr.length === 0) {
    throw new Error(`Expected number at position ${start}`);
  }

  return new Decimal(numStr);
}

/**
 * Calculate with formula and block value substitution
 */
export function calculateFormula(
  formula: string,
  blockValues: Map<string, string>
): { success: boolean; value?: string; error?: string } {
  try {
    // Validate formula
    const validation = validateFormula(formula);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Substitute block references
    const substituted = substituteBlockValues(formula, blockValues);

    // Evaluate expression
    const result = evaluate(substituted);

    return {
      success: true,
      value: result.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Calculation error',
    };
  }
}

/**
 * Calculate percentage
 * percentOf(20, 100) = 20% of 100 = 20
 */
export function percentOf(percent: string, base: string): string {
  const p = new Decimal(percent);
  const b = new Decimal(base);
  return p.dividedBy(100).times(b).toString();
}

/**
 * Add tax to a value
 */
export function addTax(value: string, taxRate: number): string {
  const v = new Decimal(value);
  const rate = new Decimal(taxRate);
  return v.times(rate.plus(1)).toString();
}

/**
 * Remove tax from a value (calculate pre-tax amount)
 */
export function removeTax(value: string, taxRate: number): string {
  const v = new Decimal(value);
  const rate = new Decimal(taxRate);
  return v.dividedBy(rate.plus(1)).toString();
}

/**
 * Format number for display according to settings
 */
export function formatNumber(
  value: string,
  options: {
    currencySymbol?: string;
    useThousandsSeparator?: boolean;
    decimalPlaces?: number;
  } = {}
): string {
  const {
    currencySymbol = '',
    useThousandsSeparator = true,
    decimalPlaces = 2,
  } = options;

  const decimal = new Decimal(value);

  // Check if the number is an integer
  const isInteger = decimal.modulo(1).equals(0);

  // Format with appropriate decimal places
  let formatted: string;
  if (isInteger) {
    // For integers, don't show decimal places
    formatted = decimal.toFixed(0);
  } else {
    // For decimals, show specified decimal places
    formatted = decimal.toFixed(decimalPlaces);
  }

  if (useThousandsSeparator) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  return currencySymbol ? `${currencySymbol}${formatted}` : formatted;
}
