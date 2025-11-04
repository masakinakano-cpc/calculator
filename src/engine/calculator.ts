/**
 * NovaCalc - Calculation Engine
 * Core arithmetic evaluation with high precision using Decimal.js
 */

import Decimal from 'decimal.js';
import { substituteBlockValues, validateFormula } from './parser';

// Configure Decimal.js for high precision
Decimal.set({ precision: 50 });

/**
 * Evaluate a mathematical expression left-to-right (like a typical calculator)
 * Supports: +, -, *, /, %, ^ (power), parentheses
 * Note: This evaluates left-to-right without operator precedence, except for parentheses
 */
export function evaluate(expression: string): Decimal {
  // Remove all whitespace
  const expr = expression.replace(/\s/g, '');

  // Parse and evaluate left-to-right
  return evaluateLeftToRight(expr, { pos: 0 });
}

/**
 * Evaluate expression left-to-right (like a typical calculator)
 * Processes operators in the order they appear, from left to right
 */
function evaluateLeftToRight(expr: string, ctx: { pos: number }): Decimal {
  // Start with the first value
  let result = parseValue(expr, ctx);

  // Process operators left-to-right
  while (ctx.pos < expr.length) {
    const op = expr[ctx.pos];

    // Skip if we hit a closing parenthesis (handled in parseValue)
    if (op === ')') {
      break;
    }

    // Handle all operators in order of appearance
    if (['+', '-', '*', '/', '%', '^'].includes(op)) {
      ctx.pos++;
      const right = parseValue(expr, ctx);

      if (op === '+') {
        result = result.plus(right);
      } else if (op === '-') {
        result = result.minus(right);
      } else if (op === '*') {
        result = result.times(right);
      } else if (op === '/') {
        if (right.isZero()) {
          throw new Error('Division by zero');
        }
        result = result.dividedBy(right);
      } else if (op === '%') {
        result = result.modulo(right);
      } else if (op === '^') {
        // Decimal.js uses toPower for exponentiation
        result = result.toPower(right);
      }
    } else {
      break;
    }
  }

  return result;
}

/**
 * Parse a value (number, unary minus, or parentheses)
 */
function parseValue(expr: string, ctx: { pos: number }): Decimal {
  // Handle unary minus
  if (ctx.pos < expr.length && expr[ctx.pos] === '-') {
    ctx.pos++;
    return parseValue(expr, ctx).negated();
  }

  // Handle unary plus
  if (ctx.pos < expr.length && expr[ctx.pos] === '+') {
    ctx.pos++;
    return parseValue(expr, ctx);
  }

  // Handle parentheses - evaluate contents left-to-right
  if (ctx.pos < expr.length && expr[ctx.pos] === '(') {
    ctx.pos++; // Skip '('
    const result = evaluateLeftToRight(expr, ctx);
    
    if (ctx.pos < expr.length && expr[ctx.pos] === ')') {
      ctx.pos++; // Skip ')'
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
