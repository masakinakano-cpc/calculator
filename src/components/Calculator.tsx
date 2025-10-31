/**
 * NovaCalc - Calculator Component
 * Standard calculator UI with support for block references and drag & drop
 */

import { useState, useEffect, useRef } from 'react';
import { BlockType } from '../types';
import { validateFormula } from '../engine/parser';
import { calculateFormula } from '../engine/calculator';

/**
 * Format display number with thousands separator
 */
function formatDisplayNumber(value: string): string {
  // 入力中（末尾がドットや演算子の場合）はフォーマットしない
  if (value.endsWith('.') || value === '' || value === '-') {
    return value;
  }

  // 数値に変換できない場合はそのまま返す
  const num = parseFloat(value);
  if (isNaN(num)) {
    return value;
  }

  // 小数点がある場合は分割
  const parts = value.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // 整数部分に3桁カンマ区切りを追加
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 小数部分がある場合は結合
  if (decimalPart !== undefined) {
    return formattedInteger + '.' + decimalPart;
  }

  return formattedInteger;
}

interface CalculatorProps {
  mode: BlockType;
  onCreateBlock: (formula: string) => void;
  blockValues: Map<string, string>;
}

export function Calculator({ mode, onCreateBlock, blockValues }: CalculatorProps) {
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);
  const lastEnterTimeRef = useRef<number>(0);

  useEffect(() => {
    // Clear input when mode changes
    setInput('');
    setDisplay('0');
    setError(null);
    setWaitingForOperand(false);
  }, [mode]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキストエリアやインプット内では動作させない
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      // Prevent default for keys we handle
      if (
        /^[0-9.]$/.test(e.key) ||
        ['+', '-', '*', '/', 'Enter', 'Escape', 'Backspace'].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(e.key);
      }
      // Decimal point
      else if (e.key === '.') {
        handleDecimal();
      }
      // Operators
      else if (e.key === '+') {
        handleOperatorClick('+');
      } else if (e.key === '-') {
        handleOperatorClick('-');
      } else if (e.key === '*') {
        handleOperatorClick('*');
      } else if (e.key === '/') {
        handleOperatorClick('/');
      }
      // Equals (Enter requires double press within 1 second)
      else if (e.key === 'Enter' || e.key === '=') {
        if (e.key === '=') {
          // = key always works immediately
          handleEquals();
        } else {
          // Enter key requires double press within 1 second
          const now = Date.now();
          const timeSinceLastEnter = now - lastEnterTimeRef.current;

          if (timeSinceLastEnter < 1000) {
            // Second Enter within 1 second - execute
            handleEquals();
            lastEnterTimeRef.current = 0; // Reset
          } else {
            // First Enter - just record the time
            lastEnterTimeRef.current = now;
          }
        }
      }
      // Clear
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
      // Backspace
      else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, input, waitingForOperand]); // Add dependencies

  const handleNumberClick = (num: string) => {
    setError(null);
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else if (display === '0' && num !== '.') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperatorClick = (op: string) => {
    setError(null);

    if (!waitingForOperand) {
      // Normal case: add current display value and operator
      const newFormula = input + display + op;
      setInput(newFormula);
      setWaitingForOperand(true);
    } else if (input.length === 0) {
      // Special case: starting fresh with operator (use current display as first operand)
      const newFormula = display + op;
      setInput(newFormula);
      setWaitingForOperand(true);
    } else {
      // Already have an operator, replace it
      const newFormula = input.slice(0, -1) + op;
      setInput(newFormula);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setInput('');
    setDisplay('0');
    setError(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (!waitingForOperand && display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setWaitingForOperand(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const blockValue = e.dataTransfer.getData('blockValue');
    const blockId = e.dataTransfer.getData('blockId');

    if (blockValue && blockId) {
      // If we're waiting for an operand (after an operator), calculate intermediate result
      if (waitingForOperand && input.length > 0) {
        // Complete the current formula with the dropped value
        const fullFormula = input + blockValue;

        // Calculate the intermediate result
        const result = calculateFormula(fullFormula, blockValues);

        if (result.success && result.value) {
          // Show the calculated result and keep the formula visible
          setDisplay(result.value);
          setInput(fullFormula);
          setWaitingForOperand(false);
        } else {
          // If calculation failed, just insert the value
          setDisplay(blockValue);
          setWaitingForOperand(false);
        }
      } else {
        // Starting a new calculation - clear previous state
        setInput('');
        setDisplay(blockValue);
        setWaitingForOperand(false);
      }
    }
  };

  const handleEquals = () => {
    setError(null);

    // Complete formula with current display value
    const fullFormula = input + display;

    // 何も入力されていないか、0だけの場合は何もしない
    if (!fullFormula || fullFormula === '0') {
      return;
    }

    // Validate formula
    const validation = validateFormula(fullFormula);
    if (!validation.valid) {
      setError(validation.error || 'Invalid formula');
      return;
    }

    // Calculate result
    const result = calculateFormula(fullFormula, blockValues);

    if (result.success && result.value) {
      // Create a new C-Block
      onCreateBlock(fullFormula);
      // Clear display like pressing C button
      setInput('');
      setDisplay('0');
      setWaitingForOperand(false);
    } else {
      setError(result.error || 'Calculation error');
    }
  };

  const handlePercentage = () => {
    if (display !== '0' && display !== '') {
      const value = parseFloat(display) / 100;
      setDisplay(value.toString());
      setInput(input.slice(0, -display.length) + value.toString());
    }
  };

  const handleNegate = () => {
    if (display !== '0' && display !== '') {
      const value = parseFloat(display) * -1;
      setDisplay(value.toString());
      setInput(input.slice(0, -display.length) + value.toString());
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setInput(input + '.');
    }
  };

  return (
    <div className="calculator-panel">
      <div
        ref={displayRef}
        className={`calculator-display ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="drop-indicator">
            マグネットをここにおいてね
          </div>
        )}
        <div className="calculator-formula">{input || '\u00A0'}</div>
        <div className="calculator-value">{formatDisplayNumber(display)}</div>
        {error && (
          <div style={{ fontSize: '0.875rem', color: 'var(--accent-red)' }}>
            {error}
          </div>
        )}
      </div>

      {mode === BlockType.STANDARD && (
        <div className="calculator-buttons">
          <button className="calc-btn clear" onClick={handleClear}>
            C
          </button>
          <button className="calc-btn" onClick={handleNegate}>
            +/-
          </button>
          <button className="calc-btn" onClick={handlePercentage}>
            %
          </button>
          <button className="calc-btn operator" onClick={() => handleOperatorClick('/')}>
            ÷
          </button>

          <button className="calc-btn" onClick={() => handleNumberClick('7')}>
            7
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('8')}>
            8
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('9')}>
            9
          </button>
          <button className="calc-btn operator" onClick={() => handleOperatorClick('*')}>
            ×
          </button>

          <button className="calc-btn" onClick={() => handleNumberClick('4')}>
            4
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('5')}>
            5
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('6')}>
            6
          </button>
          <button className="calc-btn operator" onClick={() => handleOperatorClick('-')}>
            -
          </button>

          <button className="calc-btn" onClick={() => handleNumberClick('1')}>
            1
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('2')}>
            2
          </button>
          <button className="calc-btn" onClick={() => handleNumberClick('3')}>
            3
          </button>
          <button className="calc-btn operator" onClick={() => handleOperatorClick('+')}>
            +
          </button>

          <button className="calc-btn" onClick={() => handleNumberClick('0')}>
            0
          </button>
          <button className="calc-btn" onClick={handleDecimal}>
            .
          </button>
          <button className="calc-btn" onClick={handleBackspace}>
            ⌫
          </button>
          <button className="calc-btn equals" onClick={handleEquals}>
            =
          </button>
        </div>
      )}

      {mode === BlockType.DATE && (
        <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
          <p>日づけのけいさんモード</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            じゅんびちゅう：日づけのたしざん・ひきざん・ちがいをけいさんできるよ
          </p>
        </div>
      )}

      {mode === BlockType.ZODIAC && (
        <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
          <p>十二支のけいさんモード</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            じゅんびちゅう：年から十二支をしらべられるよ
          </p>
        </div>
      )}

      {mode === BlockType.UNIT && (
        <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
          <p>たんいへんかんモード</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            じゅんびちゅう：ながさ・おもさ・かさ・おんど・おかねのへんかんができるよ
          </p>
        </div>
      )}
    </div>
  );
}
