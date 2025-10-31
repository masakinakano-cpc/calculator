/**
 * NovaCalc - Dependency Graph Manager
 * Manages C-Block dependencies and cascading recalculation
 */

import { db } from '../database';
import { CalculationResult } from '../types';
import { extractBlockReferences } from './parser';
import { calculateFormula } from './calculator';

/**
 * Dependency Graph Manager
 * Handles topological sorting and cascading updates
 */
export class DependencyGraph {
  /**
   * Get all blocks that depend on the given block (children)
   */
  async getDescendants(blockId: string): Promise<string[]> {
    const descendants = new Set<string>();
    const queue: string[] = [blockId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      const block = await db.getBlock(currentId);
      if (block) {
        for (const childId of block.childIds) {
          descendants.add(childId);
          queue.push(childId);
        }
      }
    }

    return Array.from(descendants);
  }

  /**
   * Get all blocks that a given block depends on (parents/ancestors)
   */
  async getAncestors(blockId: string): Promise<string[]> {
    const ancestors = new Set<string>();
    const queue: string[] = [blockId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      const block = await db.getBlock(currentId);
      if (block) {
        for (const parentId of block.parentIds) {
          ancestors.add(parentId);
          queue.push(parentId);
        }
      }
    }

    return Array.from(ancestors);
  }

  /**
   * Perform topological sort on affected blocks
   * Returns blocks in order they should be recalculated
   */
  async topologicalSort(blockIds: string[]): Promise<string[]> {
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Build graph for the affected blocks
    for (const blockId of blockIds) {
      const block = await db.getBlock(blockId);
      if (!block) continue;

      // Initialize in-degree
      if (!inDegree.has(blockId)) {
        inDegree.set(blockId, 0);
      }

      // Build adjacency list (parent -> children)
      for (const childId of block.childIds) {
        if (blockIds.includes(childId)) {
          if (!adjacencyList.has(blockId)) {
            adjacencyList.set(blockId, []);
          }
          adjacencyList.get(blockId)!.push(childId);

          // Increment in-degree of child
          inDegree.set(childId, (inDegree.get(childId) || 0) + 1);
        }
      }
    }

    // Kahn's algorithm for topological sort
    const queue: string[] = [];
    const result: string[] = [];

    // Start with blocks that have no dependencies (in-degree = 0)
    for (const [blockId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(blockId);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const children = adjacencyList.get(current) || [];
      for (const child of children) {
        const newDegree = inDegree.get(child)! - 1;
        inDegree.set(child, newDegree);

        if (newDegree === 0) {
          queue.push(child);
        }
      }
    }

    // If not all blocks are in result, there's a cycle
    if (result.length !== blockIds.length) {
      throw new Error('Circular dependency detected');
    }

    return result;
  }

  /**
   * Recalculate a single block
   */
  async recalculateBlock(blockId: string): Promise<CalculationResult> {
    const block = await db.getBlock(blockId);
    if (!block) {
      return { success: false, error: 'Block not found' };
    }

    try {
      // Gather parent block values
      const blockValues = new Map<string, string>();

      for (const parentId of block.parentIds) {
        const parent = await db.getBlock(parentId);
        if (parent) {
          blockValues.set(parentId, parent.value);
        } else {
          return {
            success: false,
            error: `Referenced block ${parentId} not found`,
          };
        }
      }

      // Calculate new value
      const result = calculateFormula(block.formulaString, blockValues);

      if (result.success && result.value) {
        // Update block value
        await db.updateBlock(blockId, {
          value: result.value,
          updatedAt: Date.now(),
        });

        return {
          success: true,
          value: result.value,
          affectedBlocks: [blockId],
        };
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Calculation error',
      };
    }
  }

  /**
   * Cascade recalculation from a changed block to all its descendants
   */
  async cascadeRecalculation(changedBlockId: string): Promise<{
    success: boolean;
    affectedBlocks: string[];
    errors: Array<{ blockId: string; error: string }>;
  }> {
    const affectedBlocks: string[] = [];
    const errors: Array<{ blockId: string; error: string }> = [];

    try {
      // Get all descendants
      const descendants = await this.getDescendants(changedBlockId);

      if (descendants.length === 0) {
        return { success: true, affectedBlocks: [], errors: [] };
      }

      // Sort descendants in dependency order
      const sortedDescendants = await this.topologicalSort(descendants);

      // Recalculate each block in order
      for (const blockId of sortedDescendants) {
        const result = await this.recalculateBlock(blockId);

        if (result.success) {
          affectedBlocks.push(blockId);
        } else {
          errors.push({
            blockId,
            error: result.error || 'Unknown error',
          });
        }
      }

      return {
        success: errors.length === 0,
        affectedBlocks,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        affectedBlocks,
        errors: [{
          blockId: changedBlockId,
          error: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Update a block's formula and cascade recalculation
   */
  async updateBlockFormula(
    blockId: string,
    newFormula: string
  ): Promise<CalculationResult> {
    const block = await db.getBlock(blockId);
    if (!block) {
      return { success: false, error: 'Block not found' };
    }

    try {
      // Extract new dependencies from formula
      const newParentIds = extractBlockReferences(newFormula);

      // Check for circular dependencies
      for (const newParentId of newParentIds) {
        const hasCircular = await db.hasCircularDependency(blockId, newParentId);
        if (hasCircular) {
          return {
            success: false,
            error: 'Circular dependency detected',
          };
        }
      }

      // Remove old dependencies
      for (const oldParentId of block.parentIds) {
        if (!newParentIds.includes(oldParentId)) {
          await db.removeDependency(blockId, oldParentId);
        }
      }

      // Add new dependencies
      for (const newParentId of newParentIds) {
        if (!block.parentIds.includes(newParentId)) {
          await db.addDependency(blockId, newParentId);
        }
      }

      // Update formula
      await db.updateBlock(blockId, {
        formulaString: newFormula,
        parentIds: newParentIds,
      });

      // Recalculate this block
      const recalcResult = await this.recalculateBlock(blockId);

      if (!recalcResult.success) {
        return recalcResult;
      }

      // Cascade to descendants
      const cascadeResult = await this.cascadeRecalculation(blockId);

      return {
        success: cascadeResult.success,
        value: recalcResult.value,
        affectedBlocks: [blockId, ...cascadeResult.affectedBlocks],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      };
    }
  }

  /**
   * Safely delete a block, checking for dependencies
   */
  async deleteBlock(blockId: string): Promise<{
    success: boolean;
    error?: string;
    affectedChildren?: string[];
  }> {
    const block = await db.getBlock(blockId);
    if (!block) {
      return { success: false, error: 'Block not found' };
    }

    // Check if any blocks depend on this one
    if (block.childIds.length > 0) {
      return {
        success: false,
        error: 'Cannot delete: other blocks depend on this one',
        affectedChildren: block.childIds,
      };
    }

    // Remove this block from all parent blocks' childIds
    for (const parentId of block.parentIds) {
      await db.removeDependency(blockId, parentId);
    }

    // Delete the block
    await db.deleteBlock(blockId);

    return { success: true };
  }
}

// Create singleton instance
export const dependencyGraph = new DependencyGraph();
