/**
 * NovaCalc - C-Block Component
 * Visual representation of a Calculation Block with drag & drop support
 */

import { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CBlock, Theme } from '../types';
import { getBlockTypeColor, displayNumber, truncate } from '../utils/helpers';
import { getThemeText } from '../utils/themeText';

interface CBlockProps {
  block: CBlock;
  onUpdateMemo: (blockId: string, memo: string) => void;
  onDelete: (blockId: string) => void;
  onSelect: (blockId: string, ctrlKey: boolean) => void;
  selected: boolean;
  settings?: {
    currencySymbol?: string;
    showCurrencySymbol?: boolean;
    useThousandsSeparator?: boolean;
    decimalPlaces?: number;
  };
  theme?: Theme;
}

export function CBlockComponent({
  block,
  onUpdateMemo,
  onDelete,
  onSelect,
  selected,
  settings,
  theme = 'kids',
}: CBlockProps) {
  const [editingMemo, setEditingMemo] = useState(false);
  const [memoValue, setMemoValue] = useState(block.memoText || '');
  const memoInputRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.blockId,
    data: {
      type: 'c-block',
      block,
      blockId: block.blockId,
      blockValue: block.value,
    },
  });

  // Additional drag handler for native drag events (for calculator drop)
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('blockId', block.blockId);
    e.dataTransfer.setData('blockValue', block.value);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${block.positionX}px`,
    top: `${block.positionY}px`,
  };

  const blockColor = getBlockTypeColor(block.type);

  // グループ化されている場合、視覚的な表示を追加
  const hasGroup = block.groupId !== undefined;

  const handleMemoSave = () => {
    onUpdateMemo(block.blockId, memoValue);
    setEditingMemo(false);
  };

  const handleMemoCancel = () => {
    setMemoValue(block.memoText || '');
    setEditingMemo(false);
  };

  const handleDoubleClick = () => {
    setEditingMemo(true);
    setTimeout(() => {
      memoInputRef.current?.focus();
    }, 0);
  };

  return (
    <div
      ref={setNodeRef}
      className={`c-block ${isDragging ? 'dragging' : ''} ${selected ? 'selected' : ''} ${hasGroup ? 'grouped' : ''}`}
      style={{
        ...style,
        border: hasGroup ? '2px solid #ffd700' : undefined,
        boxShadow: hasGroup ? '0 0 8px rgba(255, 215, 0, 0.5)' : undefined,
      }}
      onClick={(e) => onSelect(block.blockId, e.ctrlKey || e.metaKey)}
      onDragStart={handleDragStart}
      draggable
    >
      {hasGroup && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: '#ffd700',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          zIndex: 10,
        }}>
          📦
        </div>
      )}
      <div
        className="c-block-header"
        style={{ backgroundColor: blockColor }}
        {...listeners}
        {...attributes}
      >
        <span className="c-block-type">{block.type}</span>
        <div className="c-block-actions">
          <button
            className="c-block-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleDoubleClick();
            }}
            title={getThemeText(theme, 'CBLOCK_MEMO_WRITE')}
          >
            ✎
          </button>
          <button
            className="c-block-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(getThemeText(theme, 'CBLOCK_DELETE_CONFIRM'))) {
                onDelete(block.blockId);
              }
            }}
            title={getThemeText(theme, 'CBLOCK_DELETE')}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="c-block-content">
        <div className="c-block-formula" title={block.formulaString}>
          {truncate(block.formulaString, 50)}
        </div>

        <div className="c-block-value">
          {displayNumber(block.value, settings)}
        </div>

        {editingMemo ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              ref={memoInputRef}
              className="c-block-memo-edit"
              value={memoValue}
              onChange={(e) => setMemoValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleMemoSave();
                } else if (e.key === 'Escape') {
                  handleMemoCancel();
                }
              }}
              placeholder={getThemeText(theme, 'CBLOCK_MEMO_PLACEHOLDER')}
              rows={4}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleMemoSave}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#95e1d3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ほぞん
              </button>
              <button
                onClick={handleMemoCancel}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div
            className="c-block-memo"
            onClick={(e) => {
              e.stopPropagation();
              handleDoubleClick();
            }}
            style={{
              cursor: 'text',
              minHeight: block.memoText ? 'auto' : '2rem',
            }}
            title="クリックしてメモをかく"
          >
            {block.memoText || 'メモをかく...'}
          </div>
        )}
      </div>
    </div>
  );
}
