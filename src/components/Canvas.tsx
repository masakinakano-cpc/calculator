/**
 * NovaCalc - Canvas Component
 * Free-form canvas for dragging and arranging C-Blocks
 */

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import type { CBlock, UserSettings } from '../types';
import { CBlockComponent } from './CBlock';

interface CanvasProps {
  blocks: CBlock[];
  onUpdateBlockPosition: (blockId: string, x: number, y: number) => void;
  onUpdateBlockMemo: (blockId: string, memo: string) => void;
  onDeleteBlock: (blockId: string) => void;
  settings: UserSettings | null;
}

export function Canvas({
  blocks,
  onUpdateBlockPosition,
  onUpdateBlockMemo,
  onDeleteBlock,
  settings,
}: CanvasProps) {
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());

  // キーボードショートカット（Delete/Backspaceで削除、Ctrl+Aで全選択）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace to delete selected blocks
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockIds.size > 0) {
        // テキストエリアやインプット内では動作させない
        if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
          return;
        }
        e.preventDefault();
        handleDeleteSelected();
      }
      // Ctrl+A to select all blocks
      else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        const allIds = new Set(blocks.map(b => b.blockId));
        setSelectedBlockIds(allIds);
      }
      // Escape to deselect all
      else if (e.key === 'Escape') {
        setSelectedBlockIds(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockIds, blocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    if (active.data.current?.type === 'c-block') {
      const block = active.data.current.block as CBlock;
      const newX = block.positionX + delta.x;
      const newY = block.positionY + delta.y;

      // Clamp to canvas bounds (minimum 0)
      const clampedX = Math.max(0, newX);
      const clampedY = Math.max(0, newY);

      onUpdateBlockPosition(block.blockId, clampedX, clampedY);
    }
  };

  const handleBlockSelect = (blockId: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      // Ctrl押しながらクリック：複数選択
      const newSelected = new Set(selectedBlockIds);
      if (newSelected.has(blockId)) {
        newSelected.delete(blockId);
      } else {
        newSelected.add(blockId);
      }
      setSelectedBlockIds(newSelected);
    } else {
      // 通常クリック：単一選択
      setSelectedBlockIds(new Set([blockId]));
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect blocks if clicking on canvas background
    if (e.target === e.currentTarget) {
      setSelectedBlockIds(new Set());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedBlockIds.size === 0) return;

    const count = selectedBlockIds.size;
    const message = count === 1
      ? 'このマグネットをけしますか？'
      : `${count}このマグネットをけしますか？`;

    if (confirm(message)) {
      selectedBlockIds.forEach(id => onDeleteBlock(id));
      setSelectedBlockIds(new Set());
    }
  };

  const handleSelectAll = () => {
    const allIds = new Set(blocks.map(b => b.blockId));
    setSelectedBlockIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedBlockIds(new Set());
  };

  // Render dependency lines
  const renderDependencyLines = () => {
    if (!settings?.showDependencyLines || selectedBlockIds.size === 0) {
      return null;
    }

    const lines: React.ReactElement[] = [];

    // 選択されているすべてのブロックの依存関係を表示
    selectedBlockIds.forEach((selectedId) => {
      const selectedBlock = blocks.find((b) => b.blockId === selectedId);
      if (!selectedBlock) return;

      // Draw lines to parents
      selectedBlock.parentIds.forEach((parentId) => {
        const parentBlock = blocks.find((b) => b.blockId === parentId);
        if (parentBlock) {
          const x1 = selectedBlock.positionX + 96; // Center of block (192px / 2)
          const y1 = selectedBlock.positionY + 56;
          const x2 = parentBlock.positionX + 96;
          const y2 = parentBlock.positionY + 56;

          lines.push(
            <svg
              key={`parent-${selectedId}-${parentId}`}
              className="dependency-line highlighted"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
            </svg>
          );
        }
      });

      // Draw lines to children
      selectedBlock.childIds.forEach((childId) => {
        const childBlock = blocks.find((b) => b.blockId === childId);
        if (childBlock) {
          const x1 = selectedBlock.positionX + 96;
          const y1 = selectedBlock.positionY + 56;
          const x2 = childBlock.positionX + 96;
          const y2 = childBlock.positionY + 56;

          lines.push(
            <svg
              key={`child-${selectedId}-${childId}`}
              className="dependency-line highlighted"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
            </svg>
          );
        }
      });
    });

    return lines;
  };

  return (
    <div className="canvas-container" onClick={handleCanvasClick}>
      {/* ツールバー */}
      {selectedBlockIds.size > 0 && (
        <div className="canvas-toolbar">
          <div className="toolbar-info">
            {selectedBlockIds.size}この マグネット をせんたくちゅう
          </div>
          <button
            className="toolbar-btn toolbar-btn-danger"
            onClick={handleDeleteSelected}
            title="選択したブロックを削除"
          >
            🗑️ けす
          </button>
          <button
            className="toolbar-btn"
            onClick={handleSelectAll}
            title="すべて選択 (Ctrl+A)"
          >
            ☑️ ぜんぶ
          </button>
          <button
            className="toolbar-btn"
            onClick={handleClearSelection}
            title="選択解除 (Esc)"
          >
            ✕ とりけし
          </button>
        </div>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="canvas">
          {renderDependencyLines()}

          {blocks.map((block) => (
            <CBlockComponent
              key={block.blockId}
              block={block}
              onUpdateMemo={onUpdateBlockMemo}
              onDelete={onDeleteBlock}
              onSelect={handleBlockSelect}
              selected={selectedBlockIds.has(block.blockId)}
              settings={
                settings
                  ? {
                      currencySymbol: settings.currencySymbol,
                      showCurrencySymbol: settings.showCurrencySymbol,
                      useThousandsSeparator: settings.useThousandsSeparator,
                      decimalPlaces: settings.decimalPlaces,
                    }
                  : undefined
              }
            />
          ))}

          {blocks.length === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                けいさんノートへようこそ！
              </h2>
              <p style={{ fontSize: '1rem' }}>
                ひだりのでんたくで、けいさんしてみよう
              </p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                けっかがマグネットになって、こっちにでてくるよ！
              </p>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}
