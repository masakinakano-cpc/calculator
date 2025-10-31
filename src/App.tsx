/**
 * NovaCalc - Main Application Component
 */

import { useState, useCallback, useMemo } from 'react';
import { Calculator } from './components/Calculator';
import { Canvas } from './components/Canvas';
import { BlocklyPlayground } from './components/BlocklyPlayground';
import { useBlocks, useSettings } from './hooks/useBlocks';
import { BlockType } from './types';
import { calculateNewBlockPosition } from './utils/helpers';
import './App.css';

function App() {
  const [mode, setMode] = useState<BlockType>(BlockType.STANDARD);
  const [showHelp, setShowHelp] = useState(false);
  const [showBlockly, setShowBlockly] = useState(false);
  const {
    blocks,
    loading: blocksLoading,
    createBlock,
    updateBlockPosition,
    updateBlockMemo,
    deleteBlock,
  } = useBlocks();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();

  // Create block values map for calculator
  const blockValues = useMemo(() => {
    const map = new Map<string, string>();
    blocks.forEach((block) => {
      map.set(block.blockId, block.value);
    });
    return map;
  }, [blocks]);

  const handleCreateBlock = useCallback(
    async (formula: string) => {
      // Calculate optimal position for new block
      const position = calculateNewBlockPosition(blocks, window.innerWidth, window.innerHeight);

      await createBlock(formula, mode, position);
    },
    [blocks, createBlock, mode]
  );

  const handleModeChange = (newMode: BlockType) => {
    setMode(newMode);
  };

  const handleDeleteBlock = useCallback(
    async (blockId: string) => {
      const result = await deleteBlock(blockId);
      if (!result.success) {
        alert(result.error || 'Failed to delete block');
      }
    },
    [deleteBlock]
  );

  const handleCondenseAll = useCallback(async () => {
    if (blocks.length === 0) {
      alert('マグネットがありません');
      return;
    }

    // すべてのブロックの値を合計
    const sum = blocks.reduce((acc, block) => {
      const value = parseFloat(block.value);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    // 合計式を作成
    const formula = blocks.map(b => b.value).join('+');

    // 新しいブロックを作成
    await handleCreateBlock(formula);

    alert(`${blocks.length}このマグネットをまとめました！ごうけい: ${sum}`);
  }, [blocks, handleCreateBlock]);

  if (blocksLoading || settingsLoading) {
    return (
      <div className="app">
        <div className="loading">よみこみ中...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">電卓ver2</h1>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === BlockType.STANDARD ? 'active' : ''}`}
            onClick={() => handleModeChange(BlockType.STANDARD)}
          >
            ふつうのけいさん
          </button>
          <button
            className={`mode-btn ${mode === BlockType.DATE ? 'active' : ''}`}
            onClick={() => handleModeChange(BlockType.DATE)}
          >
            日づけ
          </button>
          <button
            className={`mode-btn ${mode === BlockType.ZODIAC ? 'active' : ''}`}
            onClick={() => handleModeChange(BlockType.ZODIAC)}
          >
            十二支
          </button>
          <button
            className={`mode-btn ${mode === BlockType.UNIT ? 'active' : ''}`}
            onClick={() => handleModeChange(BlockType.UNIT)}
          >
            たんい
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="currency-toggle-btn"
            onClick={() => updateSettings({ showCurrencySymbol: !settings?.showCurrencySymbol })}
            title="えんマークひょうじ"
            style={{
              backgroundColor: settings?.showCurrencySymbol ? '#95e1d3' : '#ddd',
              color: settings?.showCurrencySymbol ? 'white' : '#666',
            }}
          >
            ¥
          </button>
          <button
            className="blockly-link-btn"
            onClick={() => setShowBlockly(!showBlockly)}
            title="ブロックプログラミング"
          >
            🧩 ブロック
          </button>
          <button
            className="help-btn"
            onClick={() => setShowHelp(!showHelp)}
            title="つかいかた"
          >
            ？
          </button>
        </div>
      </header>

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="help-close" onClick={() => setShowHelp(false)}>
              ✕
            </button>
            <h2>けいさんノートのつかいかた</h2>

            <div className="help-section">
              <h3>📱 きほんのけいさん</h3>
              <ul>
                <li>すうじをおして、+、-、×、÷でけいさんしよう</li>
                <li>=ボタンか、Enterキーを2かいれんぞくでおすと、けっかがでるよ</li>
                <li>Cボタンか、Escキーでクリアできるよ</li>
              </ul>
            </div>

            <div className="help-section">
              <h3>🧲 マグネットのつかいかた</h3>
              <ul>
                <li>けいさんけっかがマグネットになって、みぎがわにでてくるよ</li>
                <li>マグネットをクリックして、えらんだり、うごかしたりできるよ</li>
                <li>えんぴつボタンで、メモをかけるよ（Ctrl+Enterでほぞん）</li>
                <li>ゴミばこボタンで、マグネットをけせるよ</li>
              </ul>
            </div>

            <div className="help-section">
              <h3>⌨️ キーボードそうさ</h3>
              <ul>
                <li>すうじキー：すうじをにゅうりょく</li>
                <li>+、-、*、/：えんざんし</li>
                <li>Enter 2かい：けいさんじっこう</li>
                <li>Esc：クリア / せんたくかいじょ</li>
                <li>Ctrl+クリック：ふくすうせんたく</li>
                <li>Ctrl+A：ぜんぶせんたく</li>
                <li>Delete：せんたくしたマグネットをけす</li>
              </ul>
            </div>

            <div className="help-section">
              <h3>🎨 モードのせつめい</h3>
              <ul>
                <li><strong>ふつうのけいさん：</strong>すうじのけいさんができるよ</li>
                <li><strong>日づけ：</strong>じゅんびちゅう</li>
                <li><strong>十二支：</strong>じゅんびちゅう</li>
                <li><strong>たんい：</strong>じゅんびちゅう</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {showBlockly && (
        <div className="help-overlay" onClick={() => setShowBlockly(false)}>
          <div className="blockly-modal" onClick={(e) => e.stopPropagation()}>
            <button className="help-close" onClick={() => setShowBlockly(false)}>
              ✕
            </button>
            <BlocklyPlayground onCreateBlock={handleCreateBlock} />
          </div>
        </div>
      )}

      <main className="app-main">
        <Calculator
          mode={mode}
          onCreateBlock={handleCreateBlock}
          blockValues={blockValues}
        />

        <Canvas
          blocks={blocks}
          onUpdateBlockPosition={updateBlockPosition}
          onUpdateBlockMemo={updateBlockMemo}
          onDeleteBlock={handleDeleteBlock}
          onCondenseAll={handleCondenseAll}
          settings={settings}
        />
      </main>
    </div>
  );
}

export default App;
