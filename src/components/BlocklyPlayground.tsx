/**
 * NovaCalc - Blockly Playground Component
 * Visual programming interface for learning calculations
 */

import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

interface BlocklyPlaygroundProps {
  onCreateBlock: (formula: string) => void;
}

export function BlocklyPlayground({ onCreateBlock }: BlocklyPlaygroundProps) {
  const blocklyDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    // Blockly toolbox configuration (ブロックの種類を定義)
    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'すうじ',
          colour: '#5C81A6',
          contents: [
            {
              kind: 'block',
              type: 'math_number',
            },
          ],
        },
        {
          kind: 'category',
          name: 'けいさん',
          colour: '#5CA65C',
          contents: [
            {
              kind: 'block',
              type: 'math_arithmetic',
            },
          ],
        },
        {
          kind: 'category',
          name: 'へんすう',
          colour: '#A55C9C',
          contents: [
            {
              kind: 'block',
              type: 'variables_set',
            },
            {
              kind: 'block',
              type: 'variables_get',
            },
          ],
        },
      ],
    };

    // Initialize Blockly workspace
    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: toolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
    });

    workspaceRef.current = workspace;

    // Cleanup on unmount
    return () => {
      workspace.dispose();
    };
  }, []);

  const handleRun = () => {
    if (!workspaceRef.current) return;

    try {
      setError(null);

      // Generate JavaScript code from blocks
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

      if (!code || code.trim() === '') {
        setError('ブロックをくみたててね！');
        return;
      }

      // Evaluate the code safely
      // eslint-disable-next-line no-eval
      const result = eval(code);

      if (typeof result === 'number') {
        setOutput(result.toString());

        // Create a magnet from the result
        onCreateBlock(result.toString());
      } else {
        setError('けいさんできませんでした');
      }
    } catch (err) {
      setError(`エラー: ${err instanceof Error ? err.message : 'けいさんできませんでした'}`);
    }
  };

  const handleClear = () => {
    if (!workspaceRef.current) return;
    workspaceRef.current.clear();
    setOutput('');
    setError(null);
  };

  return (
    <div className="blockly-playground">
      <div className="blockly-header">
        <h2>ブロックプログラミング</h2>
        <p>ブロックをくみたてて、けいさんしてみよう！</p>
      </div>

      <div className="blockly-content">
        <div ref={blocklyDivRef} className="blockly-workspace" />

        <div className="blockly-controls">
          <button className="blockly-btn blockly-btn-run" onClick={handleRun}>
            ▶ じっこう
          </button>
          <button className="blockly-btn blockly-btn-clear" onClick={handleClear}>
            🗑️ クリア
          </button>
        </div>

        {output && (
          <div className="blockly-output">
            <h3>けっか:</h3>
            <div className="output-value">{output}</div>
          </div>
        )}

        {error && (
          <div className="blockly-error">
            {error}
          </div>
        )}
      </div>

      <div className="blockly-guide">
        <h3>つかいかた:</h3>
        <ol>
          <li>ひだりから「すうじ」ブロックをドラッグ</li>
          <li>「けいさん」ブロックをつかって、しきをくむ</li>
          <li>「じっこう」ボタンでけいさん！</li>
          <li>けっかがマグネットになってでてくるよ</li>
        </ol>
      </div>
    </div>
  );
}
