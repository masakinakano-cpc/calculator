/**
 * NovaCalc - Database Layer
 * Dexie-based IndexedDB implementation for C-Block persistence
 */

import Dexie, { Table } from 'dexie';
import type { CBlock, CanvasSession, UserSettings } from '../types';

/**
 * NovaCalc Database Schema
 */
export class NovaCalcDatabase extends Dexie {
  // Tables
  blocks!: Table<CBlock, string>;
  sessions!: Table<CanvasSession, string>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('NovaCalcDB');

    // Define schema version 1
    this.version(1).stores({
      blocks: 'blockId, type, createdAt, updatedAt, *parentIds, *childIds',
      sessions: 'sessionId, createdAt, updatedAt',
      settings: '++id'
    });
  }

  /**
   * Initialize default settings if none exist
   */
  async initializeSettings(): Promise<void> {
    const count = await this.settings.count();
    if (count === 0) {
      await this.settings.add({
        currencySymbol: '¥',
        showCurrencySymbol: false,
        useThousandsSeparator: true,
        decimalPlaces: 2,
        taxRates: [
          {
            id: 'standard',
            name: '標準税率',
            rate: 0.10,
            isDefault: true,
          },
          {
            id: 'reduced',
            name: '軽減税率',
            rate: 0.08,
            isDefault: false,
          },
        ],
        defaultTaxRateId: 'standard',
        showDependencyLines: true,
        showUpdateAnimation: true,
        soundEnabled: true,
        volume: 50,
      });
    }
  }

  /**
   * Get current user settings
   */
  async getSettings(): Promise<UserSettings | undefined> {
    return await this.settings.toCollection().first();
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    const current = await this.getSettings();
    if (current) {
      await this.settings.update(1, settings);
    }
  }

  /**
   * Create a new C-Block
   */
  async createBlock(block: CBlock): Promise<string> {
    await this.blocks.add(block);
    return block.blockId;
  }

  /**
   * Get a C-Block by ID
   */
  async getBlock(blockId: string): Promise<CBlock | undefined> {
    return await this.blocks.get(blockId);
  }

  /**
   * Update a C-Block
   */
  async updateBlock(blockId: string, updates: Partial<CBlock>): Promise<void> {
    await this.blocks.update(blockId, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  /**
   * Delete a C-Block
   */
  async deleteBlock(blockId: string): Promise<void> {
    await this.blocks.delete(blockId);
  }

  /**
   * Get all C-Blocks
   */
  async getAllBlocks(): Promise<CBlock[]> {
    return await this.blocks.toArray();
  }

  /**
   * Get blocks by parent ID (find all children of a block)
   */
  async getBlocksByParent(parentId: string): Promise<CBlock[]> {
    return await this.blocks.where('parentIds').equals(parentId).toArray();
  }

  /**
   * Get blocks by child ID (find all parents of a block)
   */
  async getBlocksByChild(childId: string): Promise<CBlock[]> {
    return await this.blocks.where('childIds').equals(childId).toArray();
  }

  /**
   * Update block dependencies when establishing new references
   */
  async addDependency(childId: string, parentId: string): Promise<void> {
    const child = await this.getBlock(childId);
    const parent = await this.getBlock(parentId);

    if (!child || !parent) {
      throw new Error('Block not found');
    }

    // Add parent to child's parentIds if not already present
    if (!child.parentIds.includes(parentId)) {
      child.parentIds.push(parentId);
      await this.updateBlock(childId, { parentIds: child.parentIds });
    }

    // Add child to parent's childIds if not already present
    if (!parent.childIds.includes(childId)) {
      parent.childIds.push(childId);
      await this.updateBlock(parentId, { childIds: parent.childIds });
    }
  }

  /**
   * Remove dependency relationship
   */
  async removeDependency(childId: string, parentId: string): Promise<void> {
    const child = await this.getBlock(childId);
    const parent = await this.getBlock(parentId);

    if (child) {
      child.parentIds = child.parentIds.filter(id => id !== parentId);
      await this.updateBlock(childId, { parentIds: child.parentIds });
    }

    if (parent) {
      parent.childIds = parent.childIds.filter(id => id !== childId);
      await this.updateBlock(parentId, { childIds: parent.childIds });
    }
  }

  /**
   * Check for circular dependencies
   */
  async hasCircularDependency(blockId: string, potentialParentId: string): Promise<boolean> {
    const visited = new Set<string>();
    const queue: string[] = [potentialParentId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (currentId === blockId) {
        return true; // Circular dependency detected
      }

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      const current = await this.getBlock(currentId);
      if (current) {
        queue.push(...current.parentIds);
      }
    }

    return false;
  }

  /**
   * Create or get current canvas session
   */
  async getCurrentSession(): Promise<CanvasSession> {
    const sessions = await this.sessions.toArray();

    if (sessions.length === 0) {
      // Create new session
      const newSession: CanvasSession = {
        sessionId: crypto.randomUUID(),
        blocks: [],
        viewportX: 0,
        viewportY: 0,
        zoom: 1.0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await this.sessions.add(newSession);
      return newSession;
    }

    // Return most recent session
    return sessions.sort((a: CanvasSession, b: CanvasSession) => b.updatedAt - a.updatedAt)[0];
  }

  /**
   * Update canvas session
   */
  async updateSession(sessionId: string, updates: Partial<CanvasSession>): Promise<void> {
    await this.sessions.update(sessionId, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  /**
   * Clear all data (useful for testing or reset)
   */
  async clearAllData(): Promise<void> {
    await this.blocks.clear();
    await this.sessions.clear();
    await this.settings.clear();
    await this.initializeSettings();
  }
}

// Create singleton instance
export const db = new NovaCalcDatabase();

// Initialize settings on first load
db.initializeSettings().catch(console.error);
