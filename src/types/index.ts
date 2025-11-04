/**
 * NovaCalc - Type Definitions
 * Core data structures for the next-generation visual calculator system
 */

/**
 * Calculation Block Type - defines the mode/context of the calculation
 */
export enum BlockType {
  STANDARD = 'STANDARD',      // Standard arithmetic calculator
  DATE = 'DATE',              // Date/period calculations
  ZODIAC = 'ZODIAC',          // Chinese zodiac calculations
  AGE = 'AGE',                // Age calculations
  UNIT = 'UNIT',              // Unit conversions
  CART = 'CART',              // Shopping cart/list functionality
  FORTUNE = 'FORTUNE',        // Comprehensive fortune telling
}

/**
 * Zodiac animals mapping
 */
export enum Zodiac {
  MONKEY = 'MONKEY',    // 申 (さる)
  ROOSTER = 'ROOSTER',  // 酉 (とり)
  DOG = 'DOG',          // 戌 (いぬ)
  PIG = 'PIG',          // 亥 (いのしし)
  RAT = 'RAT',          // 子 (ねずみ)
  OX = 'OX',            // 丑 (うし)
  TIGER = 'TIGER',      // 寅 (とら)
  RABBIT = 'RABBIT',    // 卯 (うさぎ)
  DRAGON = 'DRAGON',    // 辰 (たつ)
  SNAKE = 'SNAKE',      // 巳 (へび)
  HORSE = 'HORSE',      // 午 (うま)
  SHEEP = 'SHEEP',      // 未 (ひつじ)
}

/**
 * Unit conversion categories
 */
export enum UnitCategory {
  LENGTH = 'LENGTH',
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  TIME = 'TIME',
  TEMPERATURE = 'TEMPERATURE',
  CURRENCY = 'CURRENCY',
}

/**
 * Core Calculation Block (C-Block) structure
 * Represents a single calculation result with full metadata
 */
export interface CBlock {
  blockId: string;                    // UUID for unique identification
  type: BlockType;                    // Calculation mode/context
  value: string;                      // Final calculation result (stored as string for precision)
  formulaString: string;              // Original formula (e.g., "{{block-123}} * 5 + 20")
  memoText?: string;                  // Optional user memo/note
  parentIds: string[];                // C-Blocks this block depends on
  childIds: string[];                 // C-Blocks that depend on this block
  positionX: number;                  // Canvas X coordinate
  positionY: number;                  // Canvas Y coordinate
  createdAt: number;                  // Timestamp of creation
  updatedAt: number;                  // Timestamp of last update
  metadata?: BlockMetadata;           // Type-specific additional data
}

/**
 * Type-specific metadata for different calculation modes
 */
export interface BlockMetadata {
  // For DATE type
  dateCalculation?: {
    startDate?: string;               // ISO date string
    endDate?: string;                 // ISO date string
    operation?: 'add' | 'subtract' | 'difference';
    unit?: 'year' | 'month' | 'day' | 'week';
    amount?: number;
  };

  // For ZODIAC type
  zodiacCalculation?: {
    year: number;
    zodiac: Zodiac;
  };

  // For AGE type
  ageCalculation?: {
    birthDate: string;                // ISO date string
    referenceDate: string;            // ISO date string
    years: number;
    months: number;
    days: number;
  };

  // For UNIT type
  unitConversion?: {
    category: UnitCategory;
    fromUnit: string;
    toUnit: string;
    fromValue: string;
  };
}

/**
 * Calculation mode state
 */
export interface CalculatorMode {
  current: BlockType;
  previousResult?: string;            // Last calculation result for reuse
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  // Display settings
  currencySymbol: string;             // ¥, $, €, etc.
  showCurrencySymbol: boolean;        // Toggle currency symbol display
  useThousandsSeparator: boolean;     // Comma separator
  decimalPlaces: number;              // 0-5

  // Tax settings
  taxRates: TaxRate[];                // Multiple tax rate presets
  defaultTaxRateId?: string;

  // Visualization settings
  showDependencyLines: boolean;       // Show connection lines between blocks
  showUpdateAnimation: boolean;       // Animation during cascading recalculation

  // Audio settings
  soundEnabled: boolean;
  volume: number;                     // 0-100
}

/**
 * Tax rate preset
 */
export interface TaxRate {
  id: string;
  name: string;                       // e.g., "標準税率", "軽減税率"
  rate: number;                       // e.g., 0.10 for 10%
  isDefault: boolean;
}

/**
 * Canvas session state
 */
export interface CanvasSession {
  sessionId: string;
  blocks: CBlock[];
  viewportX: number;                  // Current viewport offset X
  viewportY: number;                  // Current viewport offset Y
  zoom: number;                       // Zoom level (1.0 = 100%)
  createdAt: number;
  updatedAt: number;
}

/**
 * Dependency graph edge
 */
export interface DependencyEdge {
  fromBlockId: string;                // Parent block
  toBlockId: string;                  // Child block
  fieldReference?: string;            // Specific field reference if applicable
}

/**
 * Calculation result with dependency information
 */
export interface CalculationResult {
  success: boolean;
  value?: string;
  error?: string;
  affectedBlocks?: string[];          // Block IDs that need recalculation
}

/**
 * Formula token types for parsing
 */
export enum TokenType {
  NUMBER = 'NUMBER',
  OPERATOR = 'OPERATOR',
  BLOCK_REF = 'BLOCK_REF',            // Reference to another C-Block
  FUNCTION = 'FUNCTION',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
}

/**
 * Parsed token
 */
export interface Token {
  type: TokenType;
  value: string;
  blockId?: string;                   // For BLOCK_REF tokens
}
