/**
 * NovaCalc - Calculator Component
 * Standard calculator UI with support for block references and drag & drop
 */

import { useState, useEffect, useRef } from 'react';
import { BlockType } from '../types';
import { validateFormula } from '../engine/parser';
import { calculateFormula } from '../engine/calculator';
import {
  getZodiacFromYear,
  getZodiacDisplayString,
  calculateAge,
  getAllYearsForZodiac,
  ZODIAC_EMOJI,
  ZODIAC_NAMES_JA,
} from '../utils/zodiacCalculator';
import { Zodiac } from '../types';

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
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac | null>(null);
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
      // If we're waiting for an operand (after an operator), use the block value as operand
      if (waitingForOperand && input.length > 0) {
        // Insert the block value as the operand
        setDisplay(blockValue);
        setWaitingForOperand(false);
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

  const handleZodiacCalculate = () => {
    setError(null);

    const year = parseInt(display);
    if (isNaN(year) || year < 1 || year > 9999) {
      setError('1から9999のねんをいれてね');
      return;
    }

    const zodiac = getZodiacFromYear(year);
    const zodiacStr = getZodiacDisplayString(zodiac);
    const formula = `${year}年 → ${zodiacStr}`;

    // Create C-Block with zodiac result
    onCreateBlock(formula);

    // Clear display
    setDisplay('0');
  };

  // Handle zodiac wheel click - show all years for selected zodiac
  const handleZodiacClick = (zodiac: Zodiac) => {
    setSelectedZodiac(zodiac);
  };

  // Handle year selection from zodiac list
  const handleYearSelect = (year: number) => {
    setDisplay(year.toString());
    setSelectedZodiac(null); // Close the list after selection
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
        <div className="zodiac-calculator">
          {/* Zodiac Wheel */}
          <div className="zodiac-wheel-container">
            <img
              src="/calculator/zodiac-wheel.png"
              alt="十二支の円盤"
              className="zodiac-wheel-image"
            />
            <div className="zodiac-wheel-buttons">
              {/* 12時位置から時計回りに配置 */}
              <button
                className="zodiac-wheel-btn zodiac-rat"
                onClick={() => handleZodiacClick(Zodiac.RAT)}
                title="ねずみ年"
              >
                {ZODIAC_EMOJI[Zodiac.RAT]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-ox"
                onClick={() => handleZodiacClick(Zodiac.OX)}
                title="うし年"
              >
                {ZODIAC_EMOJI[Zodiac.OX]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-tiger"
                onClick={() => handleZodiacClick(Zodiac.TIGER)}
                title="とら年"
              >
                {ZODIAC_EMOJI[Zodiac.TIGER]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-rabbit"
                onClick={() => handleZodiacClick(Zodiac.RABBIT)}
                title="うさぎ年"
              >
                {ZODIAC_EMOJI[Zodiac.RABBIT]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-dragon"
                onClick={() => handleZodiacClick(Zodiac.DRAGON)}
                title="たつ年"
              >
                {ZODIAC_EMOJI[Zodiac.DRAGON]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-snake"
                onClick={() => handleZodiacClick(Zodiac.SNAKE)}
                title="へび年"
              >
                {ZODIAC_EMOJI[Zodiac.SNAKE]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-horse"
                onClick={() => handleZodiacClick(Zodiac.HORSE)}
                title="うま年"
              >
                {ZODIAC_EMOJI[Zodiac.HORSE]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-sheep"
                onClick={() => handleZodiacClick(Zodiac.SHEEP)}
                title="ひつじ年"
              >
                {ZODIAC_EMOJI[Zodiac.SHEEP]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-monkey"
                onClick={() => handleZodiacClick(Zodiac.MONKEY)}
                title="さる年"
              >
                {ZODIAC_EMOJI[Zodiac.MONKEY]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-rooster"
                onClick={() => handleZodiacClick(Zodiac.ROOSTER)}
                title="とり年"
              >
                {ZODIAC_EMOJI[Zodiac.ROOSTER]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-dog"
                onClick={() => handleZodiacClick(Zodiac.DOG)}
                title="いぬ年"
              >
                {ZODIAC_EMOJI[Zodiac.DOG]}
              </button>
              <button
                className="zodiac-wheel-btn zodiac-pig"
                onClick={() => handleZodiacClick(Zodiac.PIG)}
                title="いのしし年"
              >
                {ZODIAC_EMOJI[Zodiac.PIG]}
              </button>
            </div>
          </div>

          {/* 選択された干支の年リスト */}
          {selectedZodiac && (
            <div className="zodiac-years-list">
              <div className="zodiac-years-header">
                <h3>{ZODIAC_NAMES_JA[selectedZodiac]}年 の人たち</h3>
                <button
                  className="zodiac-close-btn"
                  onClick={() => setSelectedZodiac(null)}
                >
                  ✕
                </button>
              </div>
              <div className="zodiac-years-grid">
                {getAllYearsForZodiac(selectedZodiac).map(({ year, age }) => (
                  <button
                    key={year}
                    className="zodiac-year-item"
                    onClick={() => handleYearSelect(year)}
                  >
                    <div className="year-text">{year}年</div>
                    <div className="age-text">→ いま {age}さい</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="zodiac-input-group">
            <label className="zodiac-label">うまれた年 (西暦)</label>
            <select
              className="zodiac-year-select"
              value={display === '0' ? new Date().getFullYear().toString() : display}
              onChange={(e) => setDisplay(e.target.value)}
            >
              {Array.from({ length: 125 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                );
              })}
            </select>
          </div>

          <button
            className="zodiac-calculate-btn"
            onClick={handleZodiacCalculate}
          >
            十二支としらべる 🔍
          </button>

          <div className="zodiac-result">
            {display !== '0' && (() => {
              const year = parseInt(display);
              if (!isNaN(year)) {
                const zodiac = getZodiacFromYear(year);
                const age = calculateAge(year);
                const zodiacStr = getZodiacDisplayString(zodiac);
                return (
                  <div className="zodiac-info">
                    <div className="zodiac-display">{zodiacStr}</div>
                    <div className="age-display">
                      {year}年うまれ → いま {age}さい
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="zodiac-help">
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
              円盤の動物をクリックするか、年をえらんで、ボタンをおすと、マグネットができるよ！
            </p>
          </div>
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
