/**
 * NovaCalc - React Hooks
 * Custom hooks for C-Block and application state management
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '../database';
import { CBlock, BlockType, UserSettings } from '../types';
import { dependencyGraph } from '../engine/dependencyGraph';
import { extractBlockReferences } from '../engine/parser';
import { calculateFormula } from '../engine/calculator';

/**
 * Hook for managing C-Blocks
 */
export function useBlocks() {
  const [blocks, setBlocks] = useState<CBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Load blocks from database
  const loadBlocks = useCallback(async () => {
    try {
      const allBlocks = await db.getAllBlocks();
      setBlocks(allBlocks);
    } catch (error) {
      console.error('Failed to load blocks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  /**
   * Create a new C-Block
   */
  const createBlock = useCallback(
    async (
      formula: string,
      type: BlockType = BlockType.STANDARD,
      position: { x: number; y: number } = { x: 100, y: 100 }
    ): Promise<CBlock | null> => {
      try {
        // Extract parent block references
        const parentIds = extractBlockReferences(formula);

        // Gather parent block values
        const blockValues = new Map<string, string>();
        for (const parentId of parentIds) {
          const parent = await db.getBlock(parentId);
          if (parent) {
            blockValues.set(parentId, parent.value);
          }
        }

        // Calculate value
        const result = calculateFormula(formula, blockValues);

        if (!result.success) {
          console.error('Calculation failed:', result.error);
          return null;
        }

        // Create new block
        const newBlock: CBlock = {
          blockId: crypto.randomUUID(),
          type,
          value: result.value || '0',
          formulaString: formula,
          parentIds,
          childIds: [],
          positionX: position.x,
          positionY: position.y,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Save to database
        await db.createBlock(newBlock);

        // Establish dependencies
        for (const parentId of parentIds) {
          await db.addDependency(newBlock.blockId, parentId);
        }

        // Refresh blocks
        await loadBlocks();

        return newBlock;
      } catch (error) {
        console.error('Failed to create block:', error);
        return null;
      }
    },
    [loadBlocks]
  );

  /**
   * Update a C-Block's formula
   */
  const updateBlock = useCallback(
    async (blockId: string, newFormula: string): Promise<boolean> => {
      try {
        const result = await dependencyGraph.updateBlockFormula(blockId, newFormula);

        if (result.success) {
          await loadBlocks();
          return true;
        } else {
          console.error('Update failed:', result.error);
          return false;
        }
      } catch (error) {
        console.error('Failed to update block:', error);
        return false;
      }
    },
    [loadBlocks]
  );

  /**
   * Update block position
   */
  const updateBlockPosition = useCallback(
    async (blockId: string, x: number, y: number): Promise<void> => {
      try {
        await db.updateBlock(blockId, { positionX: x, positionY: y });
        await loadBlocks();
      } catch (error) {
        console.error('Failed to update block position:', error);
      }
    },
    [loadBlocks]
  );

  /**
   * Update block memo
   */
  const updateBlockMemo = useCallback(
    async (blockId: string, memo: string): Promise<void> => {
      try {
        await db.updateBlock(blockId, { memoText: memo });
        await loadBlocks();
      } catch (error) {
        console.error('Failed to update block memo:', error);
      }
    },
    [loadBlocks]
  );

  /**
   * Delete a C-Block
   */
  const deleteBlock = useCallback(
    async (blockId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await dependencyGraph.deleteBlock(blockId);

        if (result.success) {
          await loadBlocks();
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error('Failed to delete block:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Delete failed',
        };
      }
    },
    [loadBlocks]
  );

  /**
   * Get block by ID
   */
  const getBlock = useCallback(
    (blockId: string): CBlock | undefined => {
      return blocks.find((b) => b.blockId === blockId);
    },
    [blocks]
  );

  return {
    blocks,
    loading,
    createBlock,
    updateBlock,
    updateBlockPosition,
    updateBlockMemo,
    deleteBlock,
    getBlock,
    refreshBlocks: loadBlocks,
  };
}

/**
 * Hook for managing user settings
 */
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load settings from database
  const loadSettings = useCallback(async () => {
    try {
      const userSettings = await db.getSettings();
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Update settings
   */
  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>): Promise<void> => {
      try {
        await db.updateSettings(updates);
        await loadSettings();
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    },
    [loadSettings]
  );

  return {
    settings,
    loading,
    updateSettings,
  };
}

/**
 * Hook for managing calculator mode
 */
export function useCalculatorMode() {
  const [mode, setMode] = useState<BlockType>(BlockType.STANDARD);
  const [input, setInput] = useState<string>('');

  const switchMode = useCallback((newMode: BlockType) => {
    setMode(newMode);
    setInput('');
  }, []);

  const appendToInput = useCallback((value: string) => {
    setInput((prev) => prev + value);
  }, []);

  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  const deleteLastChar = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  return {
    mode,
    input,
    switchMode,
    setInput,
    appendToInput,
    clearInput,
    deleteLastChar,
  };
}
