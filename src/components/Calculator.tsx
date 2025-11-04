/**
 * NovaCalc - Calculator Component
 * Enhanced Zodiac calculator with animations, compatibility checker, quiz mode, and more!
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
  getYearFromAge,
  calculateCompatibility,
  ZODIAC_EMOJI,
  ZODIAC_NAMES_JA,
  ZODIAC_NAMES_EN,
  ZODIAC_KANJI,
  ZODIAC_CHARACTERISTICS,
  ZODIAC_ELEMENTS,
  ZODIAC_HISTORY,
  ELEMENT_NAMES_JA,
} from '../utils/zodiacCalculator';
import { Zodiac } from '../types';
import {
  Constellation,
  getConstellation,
  getTodaysFortune,
  CONSTELLATION_NAMES_HIRAGANA,
  CONSTELLATION_SYMBOLS,
  CONSTELLATION_CHARACTERISTICS,
} from '../utils/astrology';
import {
  calculateLifePathNumber,
  getNumerologyInsights,
  LIFE_PATH_NAMES,
  LIFE_PATH_CHARACTERISTICS,
  type LifePathNumber,
} from '../utils/numerology';
import {
  getWeekday,
  getTodaysWeekdayFortune,
  WEEKDAY_NAMES_HIRAGANA,
  WEEKDAY_CHARACTERISTICS,
  WEEKDAY_COLORS,
  type Weekday,
} from '../utils/weekdayFortune';
import {
  drawOmikujiFromBirthDate,
  OMIKUJI_NAMES_HIRAGANA,
  OMIKUJI_EMOJIS,
  OMIKUJI_COLORS,
  type OmikujiFortune,
} from '../utils/omikuji';

/**
 * Format display number with thousands separator
 */
function formatDisplayNumber(value: string): string {
  if (value.endsWith('.') || value === '' || value === '-') {
    return value;
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return value;
  }

  const parts = value.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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

type ZodiacTab = 'main' | 'age' | 'compatibility' | 'info' | 'quiz';
type FortuneTab = 'diagnosis' | 'constellation' | 'numerology' | 'weekday' | 'omikuji';

export function Calculator({ mode, onCreateBlock, blockValues }: CalculatorProps) {
  const [input, setInput] = useState('');
  const [display, setDisplay] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Zodiac-specific states
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac | null>(null);
  const [zodiacTab, setZodiacTab] = useState<ZodiacTab>('main');
  const [ageInput, setAgeInput] = useState('');
  const [compatZodiac1, setCompatZodiac1] = useState<Zodiac | null>(null);
  const [compatZodiac2, setCompatZodiac2] = useState<Zodiac | null>(null);
  const [quizMode, setQuizMode] = useState<'year-to-zodiac' | 'zodiac-to-year'>('year-to-zodiac');
  const [quizQuestion, setQuizQuestion] = useState<{ year?: number; zodiac?: Zodiac } | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<Array<{ name: string; year: number; zodiac: Zodiac }>>([]);
  const [newMemberName, setNewMemberName] = useState('');

  // Fortune-specific states
  const [fortuneTab, setFortuneTab] = useState<FortuneTab>('diagnosis');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [fortuneResult, setFortuneResult] = useState<{
    constellation?: Constellation;
    lifePathNumber?: LifePathNumber;
    weekday?: Weekday;
    zodiac?: Zodiac;
    omikuji?: OmikujiFortune;
  } | null>(null);

  const displayRef = useRef<HTMLDivElement>(null);
  const lastEnterTimeRef = useRef<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput('');
    setDisplay('0');
    setError(null);
    setWaitingForOperand(false);
    setZodiacTab('main');
    setSelectedZodiac(null);
  }, [mode]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      if (
        /^[0-9.]$/.test(e.key) ||
        ['+', '-', '*', '/', 'Enter', 'Escape', 'Backspace'].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperatorClick('+');
      } else if (e.key === '-') {
        handleOperatorClick('-');
      } else if (e.key === '*') {
        handleOperatorClick('*');
      } else if (e.key === '/') {
        handleOperatorClick('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        if (e.key === '=') {
          handleEquals();
        } else {
          const now = Date.now();
          const timeSinceLastEnter = now - lastEnterTimeRef.current;

          if (timeSinceLastEnter < 1000) {
            handleEquals();
            lastEnterTimeRef.current = 0;
          } else {
            lastEnterTimeRef.current = now;
          }
        }
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, input, waitingForOperand]);

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
      const newFormula = input + display + op;
      setInput(newFormula);
      setWaitingForOperand(true);
    } else if (input.length === 0) {
      const newFormula = display + op;
      setInput(newFormula);
      setWaitingForOperand(true);
    } else {
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
      if (waitingForOperand && input.length > 0) {
        setDisplay(blockValue);
        setWaitingForOperand(false);
      } else {
        setInput('');
        setDisplay(blockValue);
        setWaitingForOperand(false);
      }
    }
  };

  const handleEquals = () => {
    setError(null);
    const fullFormula = input + display;

    if (!fullFormula || fullFormula === '0') {
      return;
    }

    const validation = validateFormula(fullFormula);
    if (!validation.valid) {
      setError(validation.error || 'Invalid formula');
      return;
    }

    const result = calculateFormula(fullFormula, blockValues);

    if (result.success && result.value) {
      onCreateBlock(fullFormula);
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

  // Zodiac calculation
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

    onCreateBlock(formula);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 2000);
  };

  // Handle zodiac wheel click
  const handleZodiacClick = (zodiac: Zodiac) => {
    setSelectedZodiac(zodiac);
  };

  const handleYearSelect = (year: number) => {
    setDisplay(year.toString());
    setSelectedZodiac(null);
  };

  // Current year zodiac highlight
  const handleThisYearClick = () => {
    const currentYear = new Date().getFullYear();
    setDisplay(currentYear.toString());
    const zodiac = getZodiacFromYear(currentYear);
    handleZodiacClick(zodiac);
  };

  // Age to zodiac calculation
  const handleAgeCalculate = () => {
    const age = parseInt(ageInput);
    if (isNaN(age) || age < 0 || age > 125) {
      setError('0から125のねんれいをいれてね');
      return;
    }

    const years = getYearFromAge(age);
    if (years.length > 0) {
      setDisplay(years[0].toString());
      setZodiacTab('main');
    }
  };

  // Family member management
  const handleAddFamilyMember = () => {
    if (!newMemberName.trim()) return;

    const year = parseInt(display);
    if (isNaN(year) || year < 1900 || year > 2100) {
      setError('せいかくな年をいれてね');
      return;
    }

    const zodiac = getZodiacFromYear(year);
    setFamilyMembers([...familyMembers, { name: newMemberName, year, zodiac }]);
    setNewMemberName('');
    setDisplay('0');
  };

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  // Compatibility checker
  const handleCompatibilityCheck = () => {
    if (!compatZodiac1 || !compatZodiac2) {
      setError('2つの干支をえらんでね');
      return;
    }

    const result = calculateCompatibility(compatZodiac1, compatZodiac2);
    const formula = `${ZODIAC_KANJI[compatZodiac1]}×${ZODIAC_KANJI[compatZodiac2]} → ${result.message}`;
    onCreateBlock(formula);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 3000);
  };

  // Quiz mode
  const generateQuizQuestion = () => {
    if (quizMode === 'year-to-zodiac') {
      const year = Math.floor(Math.random() * 100) + 1950;
      setQuizQuestion({ year });
    } else {
      const zodiacs = Object.values(Zodiac);
      const zodiac = zodiacs[Math.floor(Math.random() * zodiacs.length)];
      setQuizQuestion({ zodiac });
    }
  };

  const handleQuizAnswer = (answer: Zodiac | number) => {
    if (!quizQuestion) return;

    let correct = false;
    if (quizMode === 'year-to-zodiac' && quizQuestion.year) {
      const correctZodiac = getZodiacFromYear(quizQuestion.year);
      correct = answer === correctZodiac;
    } else if (quizMode === 'zodiac-to-year' && quizQuestion.zodiac) {
      // Check if the year matches the zodiac
      const zodiacOfAnswer = getZodiacFromYear(answer as number);
      correct = zodiacOfAnswer === quizQuestion.zodiac;
    }

    setQuizScore({
      correct: quizScore.correct + (correct ? 1 : 0),
      total: quizScore.total + 1
    });

    if (correct) {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        generateQuizQuestion();
      }, 1500);
    } else {
      setError('ざんねん！もういちどチャレンジ！');
      setTimeout(() => {
        setError(null);
        generateQuizQuestion();
      }, 1500);
    }
  };

  useEffect(() => {
    if (zodiacTab === 'quiz' && !quizQuestion) {
      generateQuizQuestion();
    }
  }, [zodiacTab]);

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
          <div style={{ fontSize: '0.875rem', color: 'var(--magnet-red)' }}>
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
          {/* Tab Navigation */}
          <div className="zodiac-tabs">
            <button
              className={`zodiac-tab ${zodiacTab === 'main' ? 'active' : ''}`}
              onClick={() => setZodiacTab('main')}
            >
              🎯 かんたん
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'age' ? 'active' : ''}`}
              onClick={() => setZodiacTab('age')}
            >
              🎂 ねんれい
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'compatibility' ? 'active' : ''}`}
              onClick={() => setZodiacTab('compatibility')}
            >
              💕 あいしょう
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'info' ? 'active' : ''}`}
              onClick={() => setZodiacTab('info')}
            >
              📚 おべんきょう
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setZodiacTab('quiz')}
            >
              🎮 クイズ
            </button>
          </div>

          {/* Main Tab - Year to Zodiac */}
          {zodiacTab === 'main' && (
            <>
              <div className="zodiac-wheel-container" ref={wheelRef}>
                <img
                  src="/calculator/zodiac-wheel.png"
                  alt="十二支の円盤"
                  className="zodiac-wheel-image"
                />
                <div className="zodiac-wheel-buttons">
                  {Object.values(Zodiac).map((zodiac) => {
                    const positions: Record<Zodiac, string> = {
                      [Zodiac.RAT]: 'zodiac-rat',
                      [Zodiac.OX]: 'zodiac-ox',
                      [Zodiac.TIGER]: 'zodiac-tiger',
                      [Zodiac.RABBIT]: 'zodiac-rabbit',
                      [Zodiac.DRAGON]: 'zodiac-dragon',
                      [Zodiac.SNAKE]: 'zodiac-snake',
                      [Zodiac.HORSE]: 'zodiac-horse',
                      [Zodiac.SHEEP]: 'zodiac-sheep',
                      [Zodiac.MONKEY]: 'zodiac-monkey',
                      [Zodiac.ROOSTER]: 'zodiac-rooster',
                      [Zodiac.DOG]: 'zodiac-dog',
                      [Zodiac.PIG]: 'zodiac-pig',
                    };

                    const currentYearZodiac = getZodiacFromYear(new Date().getFullYear());
                    const isCurrentYear = zodiac === currentYearZodiac;

                    return (
                      <button
                        key={zodiac}
                        className={`zodiac-wheel-btn ${positions[zodiac]} ${isCurrentYear ? 'current-year' : ''} ${selectedZodiac === zodiac ? 'selected-zodiac' : ''}`}
                        onClick={() => handleZodiacClick(zodiac)}
                        title={ZODIAC_NAMES_JA[zodiac] + '年'}
                      >
                        {ZODIAC_EMOJI[zodiac]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button className="this-year-btn" onClick={handleThisYearClick}>
                ⭐ 今年の干支
              </button>

              {selectedZodiac && (
                <div className="zodiac-years-list fade-in">
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
                十二支をしらべる 🔍
              </button>

              <div className="zodiac-result">
                {display !== '0' && (() => {
                  const year = parseInt(display);
                  if (!isNaN(year)) {
                    const zodiac = getZodiacFromYear(year);
                    const age = calculateAge(year);
                    const zodiacStr = getZodiacDisplayString(zodiac);
                    const element = ZODIAC_ELEMENTS[zodiac];
                    const characteristics = ZODIAC_CHARACTERISTICS[zodiac];

                    return (
                      <div className={`zodiac-info ${showResult ? 'fade-in' : ''}`}>
                        <div className="zodiac-display">{zodiacStr}</div>
                        <div className="age-display">
                          {year}年うまれ → いま {age}さい
                        </div>
                        <div className="zodiac-details">
                          <p><strong>五行:</strong> {ELEMENT_NAMES_JA[element]}</p>
                          <p><strong>English:</strong> {ZODIAC_NAMES_EN[zodiac]}</p>
                          <p><strong>せいかく:</strong> {characteristics.personality}</p>
                          <p><strong>ラッキーカラー:</strong> {characteristics.luckyColors.join('、')}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </>
          )}

          {/* Age Tab */}
          {zodiacTab === 'age' && (
            <div className="zodiac-age-calculator fade-in">
              <h3>ねんれいから干支をさがす</h3>
              <div className="zodiac-input-group">
                <label className="zodiac-label">ねんれい</label>
                <input
                  type="number"
                  className="zodiac-year-input"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  placeholder="れい: 25"
                  min="0"
                  max="125"
                />
              </div>
              <button className="zodiac-calculate-btn" onClick={handleAgeCalculate}>
                けいさんする
              </button>

              <div className="family-section">
                <h3>かぞくの干支リスト</h3>
                <div className="add-member-form">
                  <input
                    type="text"
                    className="member-name-input"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="なまえ"
                  />
                  <button className="add-member-btn" onClick={handleAddFamilyMember}>
                    ついか
                  </button>
                </div>
                <div className="family-list">
                  {familyMembers.map((member, index) => (
                    <div key={index} className="family-member">
                      <span className="member-emoji">{ZODIAC_EMOJI[member.zodiac]}</span>
                      <span className="member-name">{member.name}</span>
                      <span className="member-year">({member.year}年)</span>
                      <button
                        className="remove-member-btn"
                        onClick={() => handleRemoveFamilyMember(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compatibility Tab */}
          {zodiacTab === 'compatibility' && (
            <div className="zodiac-compatibility fade-in">
              <h3>干支のあいしょうチェック</h3>

              <div className="compat-selector">
                <div className="compat-group">
                  <label>1つめの干支</label>
                  <div className="zodiac-grid">
                    {Object.values(Zodiac).map((zodiac) => (
                      <button
                        key={zodiac}
                        className={`zodiac-grid-btn ${compatZodiac1 === zodiac ? 'selected' : ''}`}
                        onClick={() => setCompatZodiac1(zodiac)}
                      >
                        {ZODIAC_EMOJI[zodiac]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="compat-vs">×</div>

                <div className="compat-group">
                  <label>2つめの干支</label>
                  <div className="zodiac-grid">
                    {Object.values(Zodiac).map((zodiac) => (
                      <button
                        key={zodiac}
                        className={`zodiac-grid-btn ${compatZodiac2 === zodiac ? 'selected' : ''}`}
                        onClick={() => setCompatZodiac2(zodiac)}
                      >
                        {ZODIAC_EMOJI[zodiac]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="zodiac-calculate-btn"
                onClick={handleCompatibilityCheck}
                disabled={!compatZodiac1 || !compatZodiac2}
              >
                あいしょうをチェック！
              </button>

              {compatZodiac1 && compatZodiac2 && (
                <div className={`compatibility-result ${showResult ? 'fade-in' : ''}`}>
                  {(() => {
                    const result = calculateCompatibility(compatZodiac1, compatZodiac2);
                    const levelColors = {
                      excellent: 'var(--magnet-green)',
                      good: 'var(--magnet-blue)',
                      normal: 'var(--magnet-yellow)',
                      challenging: 'var(--magnet-orange)',
                    };

                    return (
                      <div style={{ backgroundColor: levelColors[result.level] }}>
                        <h4>{ZODIAC_KANJI[compatZodiac1]} × {ZODIAC_KANJI[compatZodiac2]}</h4>
                        <p>{result.message}</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Info Tab */}
          {zodiacTab === 'info' && (
            <div className="zodiac-info-section fade-in">
              <h3>十二支について</h3>
              <div className="info-content">
                <div className="info-box">
                  <h4>📖 十二支のゆらい</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{ZODIAC_HISTORY}</p>
                </div>

                <div className="info-box">
                  <h4>🌟 十二支いちらん</h4>
                  <div className="zodiac-list">
                    {Object.values(Zodiac).map((zodiac) => (
                      <div key={zodiac} className="zodiac-list-item">
                        <span className="zodiac-emoji-large">{ZODIAC_EMOJI[zodiac]}</span>
                        <div className="zodiac-list-info">
                          <div><strong>{ZODIAC_KANJI[zodiac]}</strong> ({ZODIAC_NAMES_JA[zodiac]})</div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            {ZODIAC_NAMES_EN[zodiac]} - {ELEMENT_NAMES_JA[ZODIAC_ELEMENTS[zodiac]]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {zodiacTab === 'quiz' && (
            <div className="zodiac-quiz fade-in">
              <h3>十二支クイズ</h3>

              <div className="quiz-score">
                せいかい: {quizScore.correct} / {quizScore.total}
              </div>

              <div className="quiz-mode-selector">
                <button
                  className={quizMode === 'year-to-zodiac' ? 'active' : ''}
                  onClick={() => {
                    setQuizMode('year-to-zodiac');
                    generateQuizQuestion();
                  }}
                >
                  年→干支
                </button>
                <button
                  className={quizMode === 'zodiac-to-year' ? 'active' : ''}
                  onClick={() => {
                    setQuizMode('zodiac-to-year');
                    generateQuizQuestion();
                  }}
                >
                  干支→年
                </button>
              </div>

              {quizQuestion && (
                <div className="quiz-question">
                  {quizMode === 'year-to-zodiac' ? (
                    <>
                      <h4>{quizQuestion.year}年は、なに年？</h4>
                      <div className="zodiac-grid">
                        {Object.values(Zodiac).map((zodiac) => (
                          <button
                            key={zodiac}
                            className="zodiac-grid-btn"
                            onClick={() => handleQuizAnswer(zodiac)}
                          >
                            {ZODIAC_EMOJI[zodiac]}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4>{ZODIAC_EMOJI[quizQuestion.zodiac!]} {ZODIAC_NAMES_JA[quizQuestion.zodiac!]}年は？</h4>
                      <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        最近の{ZODIAC_NAMES_JA[quizQuestion.zodiac!]}年を選んでね
                      </p>
                      <div className="year-options">
                        {getAllYearsForZodiac(quizQuestion.zodiac!).slice(0, 6).map(({ year }) => (
                          <button
                            key={year}
                            className="year-option-btn"
                            onClick={() => handleQuizAnswer(year)}
                          >
                            {year}年
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {showResult && (
                <div className="quiz-correct fade-in">
                  🎉 せいかい！
                </div>
              )}
            </div>
          )}
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

      {mode === BlockType.FORTUNE && (
        <div className="fortune-calculator">
          {/* Tab Navigation */}
          <div className="fortune-tabs">
            <button
              className={`fortune-tab ${fortuneTab === 'diagnosis' ? 'active' : ''}`}
              onClick={() => setFortuneTab('diagnosis')}
            >
              ✨ そうごう
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'constellation' ? 'active' : ''}`}
              onClick={() => setFortuneTab('constellation')}
            >
              🌙 せいざ
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'numerology' ? 'active' : ''}`}
              onClick={() => setFortuneTab('numerology')}
            >
              🔢 すうじ
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'weekday' ? 'active' : ''}`}
              onClick={() => setFortuneTab('weekday')}
            >
              📅 ようび
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'omikuji' ? 'active' : ''}`}
              onClick={() => setFortuneTab('omikuji')}
            >
              🎴 おみくじ
            </button>
          </div>

          {/* Birthday Input Section (shared across tabs) */}
          <div className="fortune-input-section">
            <h3>うまれたひをいれてね</h3>
            <div className="fortune-date-inputs">
              <input
                type="number"
                placeholder="年"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="fortune-input"
                min="1900"
                max="2100"
              />
              <span>年</span>
              <input
                type="number"
                placeholder="月"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="fortune-input"
                min="1"
                max="12"
              />
              <span>月</span>
              <input
                type="number"
                placeholder="日"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="fortune-input"
                min="1"
                max="31"
              />
              <span>日</span>
            </div>
            <button
              className="fortune-calc-btn"
              onClick={() => {
                const year = parseInt(birthYear);
                const month = parseInt(birthMonth);
                const day = parseInt(birthDay);

                if (isNaN(year) || isNaN(month) || isNaN(day)) {
                  alert('せいねんがっぴをにゅうりょくしてね！');
                  return;
                }

                if (month < 1 || month > 12 || day < 1 || day > 31) {
                  alert('ただしいひづけをにゅうりょくしてね！');
                  return;
                }

                const constellation = getConstellation(month, day);
                const lifePathNumber = calculateLifePathNumber(year, month, day);
                const weekday = getWeekday(year, month, day);
                const zodiac = getZodiacFromYear(year);
                const omikuji = drawOmikujiFromBirthDate(year, month, day);

                setFortuneResult({
                  constellation,
                  lifePathNumber,
                  weekday,
                  zodiac,
                  omikuji,
                });
              }}
            >
              うらなう！
            </button>
          </div>

          {/* Tab Content */}
          {fortuneTab === 'diagnosis' && (
            <div className="fortune-tab-content fade-in">
              <h3>✨ そうごううんせいしんだん</h3>
              {fortuneResult ? (
                <div className="fortune-comprehensive">
                  <div className="fortune-card">
                    <h4>🌙 あなたのせいざ</h4>
                    <div className="constellation-badge">
                      {CONSTELLATION_SYMBOLS[fortuneResult.constellation!]} {CONSTELLATION_NAMES_HIRAGANA[fortuneResult.constellation!]}
                    </div>
                    <p>{CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation!].personality}</p>
                  </div>

                  <div className="fortune-card">
                    <h4>🔢 すうじじゅつナンバー</h4>
                    <div className="numerology-badge">
                      {fortuneResult.lifePathNumber} {LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber!].emoji}
                    </div>
                    <p><strong>{LIFE_PATH_NAMES[fortuneResult.lifePathNumber!]}</strong></p>
                    <p>{LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber!].description}</p>
                  </div>

                  <div className="fortune-card">
                    <h4>📅 うまれたようび</h4>
                    <div className="weekday-badge" style={{ backgroundColor: WEEKDAY_COLORS[fortuneResult.weekday!] }}>
                      {WEEKDAY_CHARACTERISTICS[fortuneResult.weekday!].emoji} {WEEKDAY_NAMES_HIRAGANA[fortuneResult.weekday!]}
                    </div>
                    <p>{WEEKDAY_CHARACTERISTICS[fortuneResult.weekday!].personality}</p>
                  </div>

                  <div className="fortune-card">
                    <h4>🐉 えと（干支）</h4>
                    <div className="zodiac-badge">
                      {ZODIAC_EMOJI[fortuneResult.zodiac!]} {ZODIAC_NAMES_JA[fortuneResult.zodiac!]}
                    </div>
                    <p>{ZODIAC_CHARACTERISTICS[fortuneResult.zodiac!].personality}</p>
                  </div>

                  <div className="fortune-card">
                    <h4>🎴 きょうのおみくじ</h4>
                    <div className="omikuji-badge" style={{ backgroundColor: OMIKUJI_COLORS[fortuneResult.omikuji!.level] }}>
                      {OMIKUJI_EMOJIS[fortuneResult.omikuji!.level]} {OMIKUJI_NAMES_HIRAGANA[fortuneResult.omikuji!.level]}
                    </div>
                    <p>{fortuneResult.omikuji!.message}</p>
                    <p><strong>ラッキーアイテム：</strong>{fortuneResult.omikuji!.luckyItem}</p>
                  </div>

                  <div className="fortune-summary">
                    <h4>💫 そうごうひょうか</h4>
                    <p>あなたはとってもユニークなそんざい！それぞれのとくちょうをいかして、すてきなまいにちをすごしてね！</p>
                  </div>
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>うえにうまれたひをいれて「うらなう！」ボタンをおしてね</p>
                </div>
              )}
            </div>
          )}

          {fortuneTab === 'constellation' && (
            <div className="fortune-tab-content fade-in">
              <h3>🌙 せいざうらない</h3>
              {fortuneResult?.constellation ? (
                <div className="constellation-detail">
                  <div className="constellation-header">
                    <span className="constellation-symbol">{CONSTELLATION_SYMBOLS[fortuneResult.constellation]}</span>
                    <h4>{CONSTELLATION_NAMES_HIRAGANA[fortuneResult.constellation]}</h4>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>せいかく</h5>
                    <p>{CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation].personality}</p>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>よいところ</h5>
                    <ul>
                      {CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation].strengths.map((s, i) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>きをつけること</h5>
                    <ul>
                      {CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation].weaknesses.map((w, i) => (
                        <li key={i}>⚠ {w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>ラッキーカラー</h5>
                    <div className="lucky-colors">
                      {CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation].luckyColors.map((color, i) => (
                        <span key={i} className="lucky-color-badge">{color}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>ラッキーナンバー</h5>
                    <div className="lucky-numbers">
                      {CONSTELLATION_CHARACTERISTICS[fortuneResult.constellation].luckyNumbers.map((num, i) => (
                        <span key={i} className="lucky-number-badge">{num}</span>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const todayFortune = getTodaysFortune(fortuneResult.constellation);
                    return (
                      <div className="fortune-detail-card">
                        <h5>きょうのうんせい</h5>
                        <div className="today-fortune-grid">
                          <div>
                            <strong>そうごう：</strong>
                            {'⭐'.repeat(todayFortune.overall)}
                          </div>
                          <div>
                            <strong>れんあい：</strong>
                            {'💕'.repeat(todayFortune.love)}
                          </div>
                          <div>
                            <strong>べんきょう：</strong>
                            {'📚'.repeat(todayFortune.work)}
                          </div>
                          <div>
                            <strong>おかね：</strong>
                            {'💰'.repeat(todayFortune.money)}
                          </div>
                          <div>
                            <strong>けんこう：</strong>
                            {'❤️'.repeat(todayFortune.health)}
                          </div>
                        </div>
                        <p><strong>ラッキーアイテム：</strong>{todayFortune.luckyItem}</p>
                        <p><strong>アドバイス：</strong>{todayFortune.advice}</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>うまれたひをいれて、うらなってね！</p>
                </div>
              )}
            </div>
          )}

          {fortuneTab === 'numerology' && (
            <div className="fortune-tab-content fade-in">
              <h3>🔢 すうじじゅつうらない</h3>
              {fortuneResult?.lifePathNumber ? (
                <div className="numerology-detail">
                  <div className="numerology-header">
                    <span className="life-path-number">{fortuneResult.lifePathNumber}</span>
                    <span className="life-path-emoji">{LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].emoji}</span>
                    <h4>{LIFE_PATH_NAMES[fortuneResult.lifePathNumber]}</h4>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>あなたのタイプ</h5>
                    <p>{LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].description}</p>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>つよみ</h5>
                    <ul>
                      {LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].strengths.map((s, i) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>チャレンジ</h5>
                    <ul>
                      {LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].challenges.map((c, i) => (
                        <li key={i}>⚡ {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>じんせいのミッション</h5>
                    <p>{LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].mission}</p>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>ラッキーナンバー</h5>
                    <div className="lucky-numbers">
                      {LIFE_PATH_CHARACTERISTICS[fortuneResult.lifePathNumber].luckyNumbers.map((num, i) => (
                        <span key={i} className="lucky-number-badge">{num}</span>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const year = parseInt(birthYear);
                    const month = parseInt(birthMonth);
                    const day = parseInt(birthDay);
                    const insights = getNumerologyInsights(year, month, day);
                    return (
                      <div className="fortune-detail-card">
                        <h5>ことしのうんせい</h5>
                        <p><strong>パーソナルイヤー {insights.personalYear}：</strong></p>
                        <p><strong>{insights.personalYearMeaning.theme}</strong></p>
                        <p>{insights.personalYearMeaning.description}</p>
                        <p><em>{insights.personalYearMeaning.advice}</em></p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>うまれたひをいれて、うらなってね！</p>
                </div>
              )}
            </div>
          )}

          {fortuneTab === 'weekday' && (
            <div className="fortune-tab-content fade-in">
              <h3>📅 ようびうらない</h3>
              {fortuneResult?.weekday !== undefined ? (
                <div className="weekday-detail">
                  <div className="weekday-header" style={{ backgroundColor: WEEKDAY_COLORS[fortuneResult.weekday] }}>
                    <span className="weekday-emoji">{WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].emoji}</span>
                    <h4>{WEEKDAY_NAMES_HIRAGANA[fortuneResult.weekday]}うまれ</h4>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>せいかく</h5>
                    <p>{WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].personality}</p>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>つよみ</h5>
                    <ul>
                      {WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].strengths.map((s, i) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>よわみ</h5>
                    <ul>
                      {WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].weaknesses.map((w, i) => (
                        <li key={i}>⚠ {w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>ラッキーアイテム</h5>
                    <div className="lucky-items">
                      {WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].luckyItems.map((item, i) => (
                        <span key={i} className="lucky-item-badge">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>アドバイス</h5>
                    <p>{WEEKDAY_CHARACTERISTICS[fortuneResult.weekday].advice}</p>
                  </div>

                  {(() => {
                    const todayFortune = getTodaysWeekdayFortune(fortuneResult.weekday);
                    return (
                      <div className="fortune-detail-card">
                        <h5>きょうのうんせい</h5>
                        <div className="today-fortune-grid">
                          <div>
                            <strong>そうごう：</strong>
                            {'⭐'.repeat(todayFortune.overall)}
                          </div>
                          <div>
                            <strong>れんあい：</strong>
                            {'💕'.repeat(todayFortune.love)}
                          </div>
                          <div>
                            <strong>べんきょう：</strong>
                            {'📚'.repeat(todayFortune.work)}
                          </div>
                          <div>
                            <strong>おかね：</strong>
                            {'💰'.repeat(todayFortune.money)}
                          </div>
                          <div>
                            <strong>けんこう：</strong>
                            {'❤️'.repeat(todayFortune.health)}
                          </div>
                        </div>
                        <p><strong>ラッキーこうどう：</strong>{todayFortune.luckyAction}</p>
                        <p><strong>アドバイス：</strong>{todayFortune.advice}</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>うまれたひをいれて、うらなってね！</p>
                </div>
              )}
            </div>
          )}

          {fortuneTab === 'omikuji' && (
            <div className="fortune-tab-content fade-in">
              <h3>🎴 おみくじ</h3>
              {fortuneResult?.omikuji ? (
                <div className="omikuji-detail">
                  <div className="omikuji-slip" style={{ backgroundColor: OMIKUJI_COLORS[fortuneResult.omikuji.level] }}>
                    <div className="omikuji-level">
                      <span className="omikuji-emoji">{OMIKUJI_EMOJIS[fortuneResult.omikuji.level]}</span>
                      <h2>{OMIKUJI_NAMES_HIRAGANA[fortuneResult.omikuji.level]}</h2>
                    </div>
                    <div className="omikuji-poem">
                      {fortuneResult.omikuji.poem}
                    </div>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>メッセージ</h5>
                    <p>{fortuneResult.omikuji.message}</p>
                  </div>

                  <div className="omikuji-grid">
                    <div className="fortune-detail-card">
                      <h5>ねがいごと</h5>
                      <p>{fortuneResult.omikuji.wish}</p>
                    </div>

                    <div className="fortune-detail-card">
                      <h5>けんこう</h5>
                      <p>{fortuneResult.omikuji.health}</p>
                    </div>

                    <div className="fortune-detail-card">
                      <h5>がくもん</h5>
                      <p>{fortuneResult.omikuji.study}</p>
                    </div>

                    <div className="fortune-detail-card">
                      <h5>りょこう</h5>
                      <p>{fortuneResult.omikuji.travel}</p>
                    </div>

                    <div className="fortune-detail-card">
                      <h5>うせもの</h5>
                      <p>{fortuneResult.omikuji.lostItem}</p>
                    </div>

                    <div className="fortune-detail-card">
                      <h5>ともだち</h5>
                      <p>{fortuneResult.omikuji.friendship}</p>
                    </div>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>こううんのほうがく</h5>
                    <p className="lucky-direction">{fortuneResult.omikuji.luckyDirection}</p>
                  </div>

                  <div className="fortune-detail-card">
                    <h5>こううんのアイテム</h5>
                    <p className="lucky-item">{fortuneResult.omikuji.luckyItem}</p>
                  </div>

                  <button
                    className="omikuji-redraw-btn"
                    onClick={() => {
                      const year = parseInt(birthYear);
                      const month = parseInt(birthMonth);
                      const day = parseInt(birthDay);
                      const newOmikuji = drawOmikujiFromBirthDate(year, month, day + Date.now() % 100);
                      setFortuneResult({ ...fortuneResult, omikuji: newOmikuji });
                    }}
                  >
                    もういちどひく
                  </button>
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>うまれたひをいれて、おみくじをひいてね！</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
