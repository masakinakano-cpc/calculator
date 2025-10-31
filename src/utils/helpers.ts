/**
 * NovaCalc - Utility Functions
 * Helper functions for formatting, validation, and common operations
 */

import { formatNumber } from '../engine/calculator';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Format a block reference for formula
 */
export function formatBlockReference(blockId: string): string {
  return `{{${blockId}}}`;
}

/**
 * Parse block reference from formula token
 */
export function parseBlockReference(token: string): string | null {
  const match = token.match(/\{\{([^}]+)\}\}/);
  return match ? match[1] : null;
}

/**
 * Truncate string to maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format date to YYYY/MM/DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Parse date string (supports multiple formats)
 */
export function parseDate(dateStr: string): Date | null {
  // Try ISO format
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try YYYY/MM/DD format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get contrasting text color for background
 */
export function getContrastColor(bgColor: string): 'black' | 'white' {
  // Simple luminance calculation
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Format number for display with settings
 */
export function displayNumber(
  value: string,
  settings?: {
    currencySymbol?: string;
    showCurrencySymbol?: boolean;
    useThousandsSeparator?: boolean;
    decimalPlaces?: number;
  }
): string {
  // Only include currency symbol if showCurrencySymbol is true
  const effectiveCurrencySymbol = settings?.showCurrencySymbol ? settings?.currencySymbol : '';

  return formatNumber(value, {
    ...settings,
    currencySymbol: effectiveCurrencySymbol,
  });
}

/**
 * Get block type color
 */
export function getBlockTypeColor(type: string): string {
  const colors: Record<string, string> = {
    STANDARD: '#3b82f6',    // Blue
    DATE: '#10b981',        // Green
    ZODIAC: '#8b5cf6',      // Purple
    AGE: '#f59e0b',         // Amber
    UNIT: '#ef4444',        // Red
    CART: '#ec4899',        // Pink
  };
  return colors[type] || '#6b7280'; // Default gray
}

/**
 * Calculate optimal position for new block
 */
export function calculateNewBlockPosition(
  existingBlocks: Array<{ positionX: number; positionY: number }>,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const BLOCK_WIDTH = 200;
  const BLOCK_HEIGHT = 150;
  const MARGIN = 20;

  // Try to find a non-overlapping position
  for (let y = MARGIN; y < canvasHeight - BLOCK_HEIGHT; y += BLOCK_HEIGHT + MARGIN) {
    for (let x = MARGIN; x < canvasWidth - BLOCK_WIDTH; x += BLOCK_WIDTH + MARGIN) {
      const overlaps = existingBlocks.some((block) => {
        const dx = Math.abs(block.positionX - x);
        const dy = Math.abs(block.positionY - y);
        return dx < BLOCK_WIDTH && dy < BLOCK_HEIGHT;
      });

      if (!overlaps) {
        return { x, y };
      }
    }
  }

  // Fallback: center with random offset
  return {
    x: canvasWidth / 2 + Math.random() * 100 - 50,
    y: canvasHeight / 2 + Math.random() * 100 - 50,
  };
}
