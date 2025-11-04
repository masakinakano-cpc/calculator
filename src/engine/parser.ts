/**
 * NovaCalc - Formula Parser
 * Tokenizer and parser for mathematical expressions with C-Block references
 */

import { Token, TokenType } from '../types';

/**
 * Tokenize a formula string into tokens
 * Supports: numbers, operators (+, -, *, /, %), parentheses, and block references {{blockId}}
 */
export function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < formula.length) {
    const char = formula[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/\d/.test(char) || (char === '.' && i + 1 < formula.length && /\d/.test(formula[i + 1]))) {
      let numStr = '';
      while (i < formula.length && (/\d/.test(formula[i]) || formula[i] === '.')) {
        numStr += formula[i];
        i++;
      }
      tokens.push({ type: TokenType.NUMBER, value: numStr });
      continue;
    }

    // Block references: {{blockId}}
    if (char === '{' && i + 1 < formula.length && formula[i + 1] === '{') {
      let blockId = '';
      i += 2; // Skip {{
      while (i < formula.length && !(formula[i] === '}' && i + 1 < formula.length && formula[i + 1] === '}')) {
        blockId += formula[i];
        i++;
      }
      if (i < formula.length) {
        i += 2; // Skip }}
      }
      tokens.push({ type: TokenType.BLOCK_REF, value: blockId.trim(), blockId: blockId.trim() });
      continue;
    }

    // Operators (including ^ for power)
    if (['+', '-', '*', '/', '%', '^'].includes(char)) {
      tokens.push({ type: TokenType.OPERATOR, value: char });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: TokenType.LPAREN, value: char });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: TokenType.RPAREN, value: char });
      i++;
      continue;
    }

    // Unknown character - skip
    i++;
  }

  return tokens;
}

/**
 * Extract all block IDs referenced in a formula
 */
export function extractBlockReferences(formula: string): string[] {
  const tokens = tokenize(formula);
  return tokens
    .filter(token => token.type === TokenType.BLOCK_REF)
    .map(token => token.blockId!)
    .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
}

/**
 * Replace block references with their actual values
 */
export function substituteBlockValues(
  formula: string,
  blockValues: Map<string, string>
): string {
  let result = formula;

  blockValues.forEach((value, blockId) => {
    const pattern = new RegExp(`\\{\\{${blockId}\\}\\}`, 'g');
    result = result.replace(pattern, `(${value})`);
  });

  return result;
}

/**
 * Validate formula syntax
 */
export function validateFormula(formula: string): { valid: boolean; error?: string } {
  if (!formula || formula.trim().length === 0) {
    return { valid: false, error: 'Formula cannot be empty' };
  }

  const tokens = tokenize(formula);

  if (tokens.length === 0) {
    return { valid: false, error: 'No valid tokens found' };
  }

  // Check parentheses balance
  let parenCount = 0;
  for (const token of tokens) {
    if (token.type === TokenType.LPAREN) parenCount++;
    if (token.type === TokenType.RPAREN) parenCount--;
    if (parenCount < 0) {
      return { valid: false, error: 'Unmatched closing parenthesis' };
    }
  }

  if (parenCount !== 0) {
    return { valid: false, error: 'Unmatched opening parenthesis' };
  }

  // Check for consecutive operators (except unary minus)
  for (let i = 0; i < tokens.length - 1; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];

    if (current.type === TokenType.OPERATOR && next.type === TokenType.OPERATOR) {
      // Allow unary minus: "5 * -3"
      if (!(current.value !== '-' && next.value === '-')) {
        return { valid: false, error: 'Consecutive operators not allowed' };
      }
    }
  }

  return { valid: true };
}
