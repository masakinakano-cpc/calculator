/**
 * NovaCalc - Calculator Component
 * Enhanced Zodiac calculator with animations, compatibility checker, quiz mode, and more!
 */

import { useState, useEffect, useRef } from 'react';
import { BlockType, UnitCategory } from '../types';
import { UnitConverter } from '../engine/specializedCalculations';
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
import {
  calculateOverallCompatibility,
  type CompatibilityResult,
} from '../utils/compatibility';
import {
  calculateMonthlyFortune,
  calculateYearlyFortune,
} from '../utils/monthlyFortune';
import {
  calculateBiorhythm,
  calculateBiorhythmRange,
  getNextPowerUpDay,
} from '../utils/biorhythm';
import {
  getPowerStoneFromConstellation,
  getPowerStoneFromNumerology,
  getPowerStoneFromZodiac,
  getLuckyItems,
} from '../utils/powerStone';
import {
  calculateWishAchievement,
  WISH_TYPE_NAMES,
  WishType,
} from '../utils/wishAchievement';
import {
  calculateLuckyTime,
} from '../utils/luckyTime';
import {
  drawTodayCard,
} from '../utils/tarot';
import {
  getLuckyColorFromBirthDate,
  getTodayColor,
} from '../utils/colorFortune';
import {
  getNineStarFromBirthDate,
  getTodayLuckyDirection,
  NINE_STAR_CHARACTERISTICS,
} from '../utils/nineStar';
import {
  generateFortuneChart,
  FortuneCategory,
} from '../utils/fortuneChart';
import {
  calculateFourPillars,
  TENKAN_NAMES,
  JYUNISHI_NAMES,
} from '../utils/fourPillars';
import {
  interpretDream,
  getDreamTypeFromKeyword,
  DREAM_TYPE_NAMES,
  type DreamFortuneResult,
} from '../utils/dreamFortune';
import {
  addDays,
  addMonths,
  addYears,
  dateDifference,
  formatDateJapanese,
  isValidDate,
} from '../utils/dateCalculator';
import {
  addWeeks,
  dateDifferenceDetailed,
  getJapaneseEra,
  getWeekdayFromDate,
  getWeekdayEmojiFromDate,
  isLeapYear,
  getDayOfYear,
  getSeason,
  calculateAge as calculateAgeFromDate,
  getGrade,
  getGraduationYear,
  daysUntilAnniversary,
  daysUntilEvent,
} from '../utils/dateCalculatorExtended';
import {
  getDateTrivia,
} from '../utils/dateTrivia';
import {
  getRokuyo,
  ROKUYO_DESCRIPTIONS,
  getSolarTerm,
  getSetsubunDate,
  getOhiganDates,
  isOhigan,
} from '../utils/japaneseCulture';
import {
  isBusinessDay,
  addBusinessDays,
  getWeekdayPosition,
  getPastYear,
  compareMultipleDates,
  getBirthdayAtAge,
  getAgeAfterDays,
} from '../utils/dateAdvanced';
import {
  toLunarDate,
  formatLunarDate,
} from '../utils/lunarCalendar';
import {
  formatDaysMultiple,
} from '../utils/dateDisplay';
import {
  calculateBusinessHours,
  calculateBusinessDaysWithHours,
  type BusinessHours,
} from '../utils/businessHours';
import {
  getCalculationHistory,
  saveCalculationHistory,
  deleteCalculationHistory,
  clearCalculationHistory,
} from '../utils/calculationHistory';
import {
  getJapaneseHolidays,
  getHolidayName,
} from '../utils/japaneseHolidays';
import {
  getSemester,
  getQuarter,
} from '../utils/semesterQuarter';
import {
  getWeekRange,
} from '../utils/weekRange';
import {
  calculateDateRange,
} from '../utils/dateRange';
import {
  getAnniversaryList,
  addAnniversary,
  deleteAnniversary,
  clearAnniversaryList,
  getDaysUntilAnniversary,
} from '../utils/anniversaryManager';
import {
  exportHistoryToCSV,
  exportHistoryToJSON,
  exportAnniversariesToCSV,
  exportAnniversariesToJSON,
  downloadFile,
  exportStandardHistoryToCSV,
  exportStandardHistoryToJSON,
  importHistoryFromCSV,
  importHistoryFromJSON,
  importStandardHistoryFromCSV,
  importStandardHistoryFromJSON,
  importAnniversariesFromCSV,
  importAnniversariesFromJSON,
} from '../utils/dataExport';
import {
  getStandardCalculationHistory,
  saveStandardCalculationHistory,
  deleteStandardCalculationHistory,
  clearStandardCalculationHistory,
  getStandardBlocksHistory,
} from '../utils/standardCalculatorHistory';
import {
  getAgeDetails,
  compareAges,
} from '../utils/ageVisualization';
import {
  getAgeChartData,
  getAgeComparisonChartData,
} from '../utils/ageChart';
import {
  isCustomBusinessDay,
  countCustomBusinessDays,
  type CustomBusinessDaysConfig,
  DEFAULT_CUSTOM_BUSINESS_DAYS,
} from '../utils/customBusinessDays';
import {
  TIMEZONES,
  convertTimezone,
  getTimezoneOffset,
} from '../utils/timezone';
import { getThemeText } from '../utils/themeText';

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
  theme?: 'kids' | 'business';
}

type ZodiacTab = 'main' | 'age' | 'compatibility' | 'info' | 'quiz';
type FortuneTab = 'diagnosis' | 'constellation' | 'numerology' | 'weekday' | 'omikuji' | 'compatibility' | 'monthly' | 'biorhythm' | 'powerstone' | 'wish' | 'luckytime' | 'tarot' | 'color' | 'ninestar' | 'chart' | 'fourpillars' | 'dream';
type DateTab = 'basic' | 'age' | 'info' | 'anniversary' | 'trivia' | 'culture' | 'calendar' | 'advanced' | 'timeline' | 'history' | 'countdown' | 'yearly' | 'weekly' | 'range' | 'anniversary-list' | 'export';
type CartTab = 'list' | 'calc' | 'history';

export function Calculator({ mode, onCreateBlock, blockValues, theme = 'kids' }: CalculatorProps) {
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
  // 相性診断用
  const [compatYear1, setCompatYear1] = useState('');
  const [compatMonth1, setCompatMonth1] = useState('');
  const [compatDay1, setCompatDay1] = useState('');
  const [compatYear2, setCompatYear2] = useState('');
  const [compatMonth2, setCompatMonth2] = useState('');
  const [compatDay2, setCompatDay2] = useState('');
  // 願い事用
  const [wishType, setWishType] = useState<'love' | 'work' | 'health' | 'money' | 'study' | 'friendship' | 'family' | 'dream'>('love');
  // 夢占い用
  const [dreamKeyword, setDreamKeyword] = useState('');
  // 単位変換用
  const [unitCategory, setUnitCategory] = useState<UnitCategory>(UnitCategory.LENGTH);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [unitInputValue, setUnitInputValue] = useState('');
  const [unitResult, setUnitResult] = useState<string | null>(null);
  // 分数入力用
  const [showFractionInput, setShowFractionInput] = useState(false);
  const [fractionNumerator, setFractionNumerator] = useState('');
  const [fractionDenominator, setFractionDenominator] = useState('');
  // 電卓モードの履歴・エクスポート用
  const [showStandardHistory, setShowStandardHistory] = useState(false);

  // Date-specific states
  const [dateTab, setDateTab] = useState<DateTab>('basic');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [date3, setDate3] = useState('');
  const [dateAmount, setDateAmount] = useState('');
  const [dateUnit, setDateUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [dateOperation, setDateOperation] = useState<'add' | 'subtract' | 'difference'>('add');
  const [dateResult, setDateResult] = useState<string | null>(null);
  const [countdownTarget, setCountdownTarget] = useState('');
  const [countdownTime, setCountdownTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [anniversaryName, setAnniversaryName] = useState('');
  const [anniversaryType, setAnniversaryType] = useState<'birthday' | 'anniversary' | 'event' | 'custom'>('custom');
  const [customBusinessHours, setCustomBusinessHours] = useState({ startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 });
  const [fromTimezone, setFromTimezone] = useState('Asia/Tokyo');
  const [toTimezone, setToTimezone] = useState('Asia/Tokyo');
  const [customBusinessDaysConfig, setCustomBusinessDaysConfig] = useState<CustomBusinessDaysConfig>(DEFAULT_CUSTOM_BUSINESS_DAYS);

  const displayRef = useRef<HTMLDivElement>(null);
  const lastEnterTimeRef = useRef<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // カウントダウンタイマー
  useEffect(() => {
    if (!countdownTarget || !isValidDate(countdownTarget)) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(countdownTarget);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdownTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownTarget]);

  useEffect(() => {
    setInput('');
    setDisplay('0');
    setError(null);
    setWaitingForOperand(false);
    setZodiacTab('main');
    setSelectedZodiac(null);
    setDateTab('basic');
    setDate1('');
    setDate2('');
    setDateAmount('');
    setDateResult(null);
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
      // 計算履歴を保存
      saveStandardCalculationHistory({
        formula: fullFormula,
        result: result.value,
        input: fullFormula,
      });
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
      setError(getThemeText(theme, 'ERROR_INVALID_YEAR_RANGE'));
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
      setError(getThemeText(theme, 'ERROR_INVALID_AGE'));
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
      setError(getThemeText(theme, 'ERROR_INVALID_YEAR'));
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
      setError(getThemeText(theme, 'ERROR_QUIZ_WRONG'));
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
        <>
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

            <button className="calc-btn" onClick={() => handleNumberClick('0')} style={{ gridColumn: 'span 2' }}>
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0.5rem 1.25rem',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              className="calc-btn operator"
              onClick={() => handleOperatorClick('^')}
              title="べき乗（例: 2^3 = 8）"
              style={{
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                minWidth: 'auto',
                flex: '0 0 auto'
              }}
            >
              {getThemeText(theme, 'POWER')}
            </button>
            <button
              className="calc-btn operator"
              onClick={() => setShowFractionInput(!showFractionInput)}
              title={theme === 'kids' ? '分数入力' : '分数入力'}
              style={{
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                minWidth: 'auto',
                flex: '0 0 auto',
                background: showFractionInput ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                color: showFractionInput ? '#fff' : undefined
              }}
            >
              {getThemeText(theme, 'FRACTION')}
            </button>
          </div>

          {showFractionInput && (
            <div style={{
              padding: '1rem',
              margin: '0.5rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '2px solid rgba(102, 126, 234, 0.3)'
            }}>
              <h4 style={{ color: '#000', marginBottom: '0.5rem' }}>分数を入力</h4>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  placeholder="分子"
                  value={fractionNumerator}
                  onChange={(e) => setFractionNumerator(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '80px'
                  }}
                />
                <span style={{ fontSize: '1.5rem', color: '#000' }}>/</span>
                <input
                  type="number"
                  placeholder="分母"
                  value={fractionDenominator}
                  onChange={(e) => setFractionDenominator(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '80px'
                  }}
                />
                <button
                  onClick={() => {
                    const num = parseFloat(fractionNumerator);
                    const den = parseFloat(fractionDenominator);
                    if (!isNaN(num) && !isNaN(den) && den !== 0) {
                      const decimal = num / den;
                      setInput(input + (input && !input.match(/[+\-*/^]$/) ? '+' : '') + decimal.toString());
                      setFractionNumerator('');
                      setFractionDenominator('');
                      setShowFractionInput(false);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {getThemeText(theme, 'CART_ADD')}
                </button>
              </div>
              {fractionNumerator && fractionDenominator && parseFloat(fractionDenominator) !== 0 && (
                <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                  = {parseFloat(fractionNumerator) / parseFloat(fractionDenominator)}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {mode === BlockType.STANDARD && showStandardHistory && (
        <div className="calculator-panel" style={{ marginTop: '1rem', maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#000', margin: 0 }}>📋 {getThemeText(theme, 'DATE_HISTORY_VIEW')}</h3>
            <button
              onClick={() => setShowStandardHistory(false)}
              style={{
                padding: '0.5rem 1rem',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              とじる
            </button>
          </div>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={async () => {
                const blocksHistory = await getStandardBlocksHistory();
                const localHistory = getStandardCalculationHistory();
                const allHistory = [...blocksHistory, ...localHistory].sort((a, b) => b.timestamp - a.timestamp);
                const csv = exportStandardHistoryToCSV(allHistory);
                downloadFile(csv, `計算履歴_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              CSVでエクスポート
            </button>
            <button
              onClick={async () => {
                const blocksHistory = await getStandardBlocksHistory();
                const localHistory = getStandardCalculationHistory();
                const allHistory = [...blocksHistory, ...localHistory].sort((a, b) => b.timestamp - a.timestamp);
                const json = exportStandardHistoryToJSON(allHistory);
                downloadFile(json, `計算履歴_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#95e1d3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              JSONでエクスポート
            </button>
            <button
              onClick={() => {
                if (confirm(getThemeText(theme, 'DELETE_ALL_CONFIRM'))) {
                  clearStandardCalculationHistory();
                  setShowStandardHistory(false);
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {getThemeText(theme, 'DELETE_ALL')}
            </button>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
            <h4 style={{ color: '#000', marginBottom: '0.5rem' }}>📥 インポート</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const csv = event.target?.result as string;
                      const result = importStandardHistoryFromCSV(csv);
                      if (result.success) {
                        alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                        setShowStandardHistory(false);
                        setTimeout(() => setShowStandardHistory(true), 100);
                      } else {
                        alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#4ecdc4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {getThemeText(theme, 'DATE_IMPORT_CSV')}
              </button>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const json = event.target?.result as string;
                      const result = importStandardHistoryFromJSON(json);
                      if (result.success) {
                        alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                        setShowStandardHistory(false);
                        setTimeout(() => setShowStandardHistory(true), 100);
                      } else {
                        alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#95e1d3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {getThemeText(theme, 'DATE_IMPORT_JSON')}
              </button>
            </div>
          </div>
          <div style={{ maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: '0.5rem' }}>
            {(() => {
              const history = getStandardCalculationHistory();
              if (history.length === 0) {
                return <p style={{ color: '#000', textAlign: 'center' }}>{getThemeText(theme, 'DATE_HISTORY_EMPTY')}</p>;
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1, color: '#000' }}>
                          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                            {new Date(item.timestamp).toLocaleString('ja-JP')}
                          </div>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.formula}</div>
                          <div style={{ color: '#0066CC' }}>= {formatDisplayNumber(item.result)}</div>
                        </div>
                        <button
                          onClick={() => {
                            deleteStandardCalculationHistory(item.id);
                            setShowStandardHistory(false);
                            setTimeout(() => setShowStandardHistory(true), 100);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          {getThemeText(theme, 'CANVAS_DELETE')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {mode === BlockType.STANDARD && !showStandardHistory && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowStandardHistory(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            📋 {getThemeText(theme, 'DATE_HISTORY_VIEW')}
          </button>
        </div>
      )}

      {mode === BlockType.DATE && (
        <div className="date-calculator">
          {/* Tab Navigation */}
          <div className="date-tabs">
            <button
              className={`date-tab ${dateTab === 'basic' ? 'active' : ''}`}
              onClick={() => setDateTab('basic')}
            >
              📅 {getThemeText(theme, 'DATE_BASIC')}
            </button>
            <button
              className={`date-tab ${dateTab === 'age' ? 'active' : ''}`}
              onClick={() => setDateTab('age')}
            >
              🎂 {getThemeText(theme, 'DATE_AGE')}
            </button>
            <button
              className={`date-tab ${dateTab === 'info' ? 'active' : ''}`}
              onClick={() => setDateTab('info')}
            >
              📆 {getThemeText(theme, 'DATE_INFO')}
            </button>
            <button
              className={`date-tab ${dateTab === 'anniversary' ? 'active' : ''}`}
              onClick={() => setDateTab('anniversary')}
            >
              🎉 {getThemeText(theme, 'DATE_ANNIVERSARY')}
            </button>
            <button
              className={`date-tab ${dateTab === 'trivia' ? 'active' : ''}`}
              onClick={() => setDateTab('trivia')}
            >
              📚 {getThemeText(theme, 'DATE_TRIVIA')}
            </button>
            <button
              className={`date-tab ${dateTab === 'culture' ? 'active' : ''}`}
              onClick={() => setDateTab('culture')}
            >
              🎌 {getThemeText(theme, 'DATE_CULTURE')}
            </button>
            <button
              className={`date-tab ${dateTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setDateTab('calendar')}
            >
              📅 {getThemeText(theme, 'DATE_CALENDAR')}
            </button>
            <button
              className={`date-tab ${dateTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setDateTab('advanced')}
            >
              ⚙️ {getThemeText(theme, 'DATE_ADVANCED')}
            </button>
            <button
              className={`date-tab ${dateTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setDateTab('timeline')}
            >
              📊 {getThemeText(theme, 'DATE_TIMELINE')}
            </button>
            <button
              className={`date-tab ${dateTab === 'history' ? 'active' : ''}`}
              onClick={() => setDateTab('history')}
            >
              📝 {getThemeText(theme, 'DATE_HISTORY')}
            </button>
            <button
              className={`date-tab ${dateTab === 'countdown' ? 'active' : ''}`}
              onClick={() => setDateTab('countdown')}
            >
              ⏰ {getThemeText(theme, 'DATE_COUNTDOWN')}
            </button>
            <button
              className={`date-tab ${dateTab === 'yearly' ? 'active' : ''}`}
              onClick={() => setDateTab('yearly')}
            >
              📆 {getThemeText(theme, 'DATE_YEARLY')}
            </button>
            <button
              className={`date-tab ${dateTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setDateTab('weekly')}
            >
              📅 {getThemeText(theme, 'DATE_WEEKLY')}
            </button>
            <button
              className={`date-tab ${dateTab === 'range' ? 'active' : ''}`}
              onClick={() => setDateTab('range')}
            >
              📊 {getThemeText(theme, 'DATE_RANGE')}
            </button>
            <button
              className={`date-tab ${dateTab === 'anniversary-list' ? 'active' : ''}`}
              onClick={() => setDateTab('anniversary-list')}
            >
              🎉 {getThemeText(theme, 'DATE_ANNIVERSARY_LIST')}
            </button>
            <button
              className={`date-tab ${dateTab === 'export' ? 'active' : ''}`}
              onClick={() => setDateTab('export')}
            >
              💾 {getThemeText(theme, 'DATE_EXPORT')}
            </button>
          </div>

          {/* Basic Tab - 日付の加減算、差分計算 */}
          {dateTab === 'basic' && (
            <div className="date-tab-content fade-in">
              <h3>📅 {getThemeText(theme, 'DATE_BASIC_TITLE')}</h3>

              <div className="date-input-section">
                <div className="date-operation-selector">
                  <button
                    className={`date-op-btn ${dateOperation === 'add' ? 'active' : ''}`}
                    onClick={() => setDateOperation('add')}
                  >
                    ＋ {getThemeText(theme, 'DATE_ADD')}
                  </button>
                  <button
                    className={`date-op-btn ${dateOperation === 'subtract' ? 'active' : ''}`}
                    onClick={() => setDateOperation('subtract')}
                  >
                    － {getThemeText(theme, 'DATE_SUBTRACT')}
                  </button>
                  <button
                    className={`date-op-btn ${dateOperation === 'difference' ? 'active' : ''}`}
                    onClick={() => setDateOperation('difference')}
                  >
                    ＝ {getThemeText(theme, 'DATE_DIFFERENCE')}
                  </button>
                </div>

                {dateOperation !== 'difference' ? (
                  <>
                    <div className="date-input-group">
                      <label className="date-label">{getThemeText(theme, 'DATE_START_DATE')}</label>
                      <input
                        type="date"
                        className="date-input"
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                      />
                    </div>

                    <div className="date-input-group">
                      <label className="date-label">{getThemeText(theme, 'DATE_AMOUNT')}</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={dateAmount || '0'}
                          onChange={(e) => setDateAmount(e.target.value)}
                          style={{ flex: 1, minWidth: '150px' }}
                        />
                        <input
                          type="number"
                          className="date-amount-input"
                          value={dateAmount}
                          onChange={(e) => setDateAmount(e.target.value)}
                          placeholder={getThemeText(theme, 'DATE_NUMBER_INPUT')}
                          style={{ width: '80px' }}
                        />
                        <select
                          className="date-unit-select"
                          value={dateUnit}
                          onChange={(e) => setDateUnit(e.target.value as 'days' | 'weeks' | 'months' | 'years')}
                        >
                          <option value="days">{getThemeText(theme, 'DATE_UNIT_DAYS')}</option>
                          <option value="weeks">{getThemeText(theme, 'DATE_UNIT_WEEKS_TEXT')}</option>
                          <option value="months">{getThemeText(theme, 'DATE_UNIT_MONTHS_TEXT')}</option>
                          <option value="years">{getThemeText(theme, 'DATE_YEAR')}</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: theme === 'kids' ? 'rgba(255,255,255,0.8)' : '#666' }}>
                        {getThemeText(theme, 'DATE_SLIDER')}
                      </div>
                    </div>

                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        if (!date1 || !dateAmount || !isValidDate(date1)) {
                          setError(theme === 'kids' ? 'せいかくなひづけをにゅうりょくしてね' : '正しい日付を入力してください');
                          return;
                        }

                        const amount = parseInt(dateAmount);
                        if (isNaN(amount)) {
                          setError(getThemeText(theme, 'ERROR_INVALID_NUMBER'));
                          return;
                        }

                        let result: string;
                        if (dateOperation === 'add') {
                          if (dateUnit === 'days') {
                            result = addDays(date1, amount);
                          } else if (dateUnit === 'weeks') {
                            result = addWeeks(date1, amount);
                          } else if (dateUnit === 'months') {
                            result = addMonths(date1, amount);
                          } else {
                            result = addYears(date1, amount);
                          }
                        } else {
                          if (dateUnit === 'days') {
                            result = addDays(date1, -amount);
                          } else if (dateUnit === 'weeks') {
                            result = addWeeks(date1, -amount);
                          } else if (dateUnit === 'months') {
                            result = addMonths(date1, -amount);
                          } else {
                            result = addYears(date1, -amount);
                          }
                        }

                        const unitText = dateUnit === 'days'
                          ? getThemeText(theme, 'DATE_UNIT_DAYS_TEXT')
                          : dateUnit === 'weeks'
                          ? getThemeText(theme, 'DATE_UNIT_WEEKS_TEXT')
                          : dateUnit === 'months'
                          ? getThemeText(theme, 'DATE_UNIT_MONTHS_TEXT')
                          : getThemeText(theme, 'DATE_UNIT_YEARS_TEXT');
                        const formula = `${formatDateJapanese(date1)} ${dateOperation === 'add' ? '+' : '-'} ${amount}${unitText} = ${formatDateJapanese(result)}`;
                        onCreateBlock(formula);
                        saveCalculationHistory({
                          type: '日付計算',
                          input: `${date1} ${dateOperation === 'add' ? '+' : '-'} ${amount}${dateUnit}`,
                          result: formatDateJapanese(result),
                          formula,
                        });
                        // 日付の差分を計算して複数形式で表示
                        const diffDays = dateDifference(date1, result);
                        const resultFormats = formatDaysMultiple(Math.abs(diffDays));
                        setDateResult(`${formatDateJapanese(result)}\n\n複数形式: ${resultFormats.full}`);
                        setError(null);
                      }}
                    >
                      {getThemeText(theme, 'DATE_CALCULATE')}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="date-input-group">
                      <label className="date-label">{getThemeText(theme, 'DATE_FIRST_DATE')}</label>
                      <input
                        type="date"
                        className="date-input"
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                      />
                    </div>

                    <div className="date-input-group">
                      <label className="date-label">{getThemeText(theme, 'DATE_SECOND_DATE')}</label>
                      <input
                        type="date"
                        className="date-input"
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                      />
                    </div>

                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        if (!date1 || !date2 || !isValidDate(date1) || !isValidDate(date2)) {
                          setError(getThemeText(theme, 'ERROR_INVALID_DATE'));
                          return;
                        }

                        const diff = dateDifferenceDetailed(date1, date2);
                        const formula = `${formatDateJapanese(date1)} と ${formatDateJapanese(date2)} のちがい: ${diff.totalDays}${getThemeText(theme, 'DATE_DAY')} (${diff.years}${getThemeText(theme, 'DATE_YEAR')}${diff.months}${getThemeText(theme, 'DATE_MONTH')}${diff.days}${getThemeText(theme, 'DATE_DAY')})`;
                        onCreateBlock(formula);
                        saveCalculationHistory({
                          type: '日付差分',
                          input: `${date1} - ${date2}`,
                          result: `${diff.totalDays}日`,
                          formula,
                        });
                        const resultFormats = formatDaysMultiple(Math.abs(diff.totalDays));
                        setDateResult(`${diff.totalDays}${getThemeText(theme, 'DATE_DAY')} (${diff.years}${getThemeText(theme, 'DATE_YEAR')}${diff.months}${getThemeText(theme, 'DATE_MONTH')}${diff.days}${getThemeText(theme, 'DATE_DAY')}、${diff.weeks}${getThemeText(theme, 'DATE_UNIT_WEEKS_TEXT')})\n\n複数形式: ${resultFormats.full}`);
                        setError(null);
                      }}
                    >
                      {getThemeText(theme, 'DATE_DIFFERENCE_CALC')}
                    </button>
                  </>
                )}

                {dateResult && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'RESULT')}</h4>
                    <p>{dateResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Age Tab - 年齢計算、学年・卒業年度 */}
          {dateTab === 'age' && (
            <div className="date-tab-content fade-in">
              <h3>🎂 {getThemeText(theme, 'DATE_AGE_TITLE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_BIRTH_DATE')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                    if (!date1 || !isValidDate(date1)) {
                      setError(getThemeText(theme, 'ERROR_INVALID_DATE'));
                      return;
                    }

                    const age = calculateAgeFromDate(date1);
                    const formula = `${formatDateJapanese(date1)}${getThemeText(theme, 'DATE_BORN')} → ${getThemeText(theme, 'DATE_NOW')} ${age.years}${getThemeText(theme, 'DATE_AGE_YEARS')}${age.months}${getThemeText(theme, 'DATE_AGE_MONTHS')}${age.days}${getThemeText(theme, 'DATE_AGE_DAYS')}`;
                    onCreateBlock(formula);
                    setDateResult(`${age.years}${getThemeText(theme, 'DATE_AGE_YEARS')}${age.months}${getThemeText(theme, 'DATE_AGE_MONTHS')}${age.days}${getThemeText(theme, 'DATE_AGE_DAYS')} (${getThemeText(theme, 'DATE_AGE_TOTAL')}${age.totalDays}${getThemeText(theme, 'DATE_AGE_DAYS')})`);
                    setError(null);
                  }}
                >
                  {getThemeText(theme, 'DATE_CALC_AGE')}
                </button>

                {dateResult && date1 && isValidDate(date1) && (() => {
                  const ageDetails = getAgeDetails(date1);
                  const grade = getGrade(date1);
                  const eleGraduation = getGraduationYear(date1, 'elementary');
                  const jrGraduation = getGraduationYear(date1, 'junior');
                  const highGraduation = getGraduationYear(date1, 'high');
                  const uniGraduation = getGraduationYear(date1, 'university');

                  return (
                    <div className="date-result">
                      <h4>{getThemeText(theme, 'DATE_RESULT')}</h4>
                      <p>{dateResult}</p>

                      {/* 年齢の可視化 */}
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                        <h5 style={{ color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'DATE_AGE_DETAILS')}</h5>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{getThemeText(theme, 'DATE_YEAR')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{ageDetails.years}{getThemeText(theme, 'DATE_AGE_YEARS')}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{getThemeText(theme, 'DATE_MONTH')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{ageDetails.months}{getThemeText(theme, 'DATE_AGE_MONTHS')}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{getThemeText(theme, 'DATE_DAY')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{ageDetails.days}{getThemeText(theme, 'DATE_AGE_DAYS')}</div>
                          </div>
                        </div>

                        {/* プログレスバー（年） */}
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: '0.3rem' }}>
                            {getThemeText(theme, 'DATE_YEAR_PROGRESS').replace('%', String(Math.round(ageDetails.percentageOfYear * 100)))}
                          </div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(ageDetails.percentageOfYear * 100, 100)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                transition: 'width 0.3s',
                              }}
                            />
                          </div>
                        </div>

                        {/* プログレスバー（月） */}
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: '0.3rem' }}>
                            {getThemeText(theme, 'DATE_MONTH_PROGRESS').replace('%', String(Math.round(ageDetails.percentageOfMonth * 100)))}
                          </div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(ageDetails.percentageOfMonth * 100, 100)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #f093fb 0%, #764ba2 50%, #667eea 100%)',
                                transition: 'width 0.3s',
                              }}
                            />
                          </div>
                        </div>

                        {/* 円グラフ（年・月） */}
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                          {(() => {
                            const chartData = getAgeChartData(date1);
                            const yearPercentage = chartData.percentageOfYear;
                            const monthPercentage = chartData.percentageOfMonth;
                            const radius = 50;
                            const circumference = 2 * Math.PI * radius;

                            const yearOffset = circumference - (yearPercentage / 100) * circumference;
                            const monthOffset = circumference - (monthPercentage / 100) * circumference;

                            return (
                              <>
                                {/* 年の円グラフ */}
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'DATE_YEAR_PROGRESS').replace('%', '')}</div>
                                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      fill="none"
                                      stroke="rgba(255,255,255,0.3)"
                                      strokeWidth="10"
                                    />
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      fill="none"
                                      stroke="url(#yearGradient)"
                                      strokeWidth="10"
                                      strokeDasharray={circumference}
                                      strokeDashoffset={yearOffset}
                                      strokeLinecap="round"
                                    />
                                    <defs>
                                      <linearGradient id="yearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="50%" stopColor="#764ba2" />
                                        <stop offset="100%" stopColor="#f093fb" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000', marginTop: '-60px', transform: 'rotate(90deg)' }}>
                                    {Math.round(yearPercentage)}%
                                  </div>
                                </div>

                                {/* 月の円グラフ */}
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.8rem', color: '#000', marginBottom: '0.5rem' }}>げつのけいか</div>
                                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      fill="none"
                                      stroke="rgba(255,255,255,0.3)"
                                      strokeWidth="10"
                                    />
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r={radius}
                                      fill="none"
                                      stroke="url(#monthGradient)"
                                      strokeWidth="10"
                                      strokeDasharray={circumference}
                                      strokeDashoffset={monthOffset}
                                      strokeLinecap="round"
                                    />
                                    <defs>
                                      <linearGradient id="monthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f093fb" />
                                        <stop offset="50%" stopColor="#764ba2" />
                                        <stop offset="100%" stopColor="#667eea" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#000', marginTop: '-60px', transform: 'rotate(90deg)' }}>
                                    {Math.round(monthPercentage)}%
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#000', opacity: 0.8 }}>
                          そうにちすう: {ageDetails.totalDays}にち ({ageDetails.totalMonths}かげつ)
                        </div>
                      </div>

                      <div className="grade-info">
                        <p><strong>がくねん:</strong> {grade.schoolType} {grade.grade}ねんせい ({grade.schoolYear}ねんど)</p>
                        <p><strong>そつぎょうねんど:</strong></p>
                        <p>しょうがっこう: {eleGraduation}ねん</p>
                        <p>ちゅうがっこう: {jrGraduation}ねん</p>
                        <p>こうこう: {highGraduation}ねん</p>
                        <p>だいがく: {uniGraduation}ねん</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Info Tab - 曜日、和暦、季節など */}
          {dateTab === 'info' && (
            <div className="date-tab-content fade-in">
              <h3>📆 {getThemeText(theme, 'DATE_INFO_TITLE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_INFO_DATE')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                    if (!date1 || !isValidDate(date1)) {
                      setError(getThemeText(theme, 'ERROR_INVALID_DATE'));
                      return;
                    }

                    const era = getJapaneseEra(date1);
                    const weekday = getWeekdayFromDate(date1);
                    const weekdayEmoji = getWeekdayEmojiFromDate(date1);
                    const year = new Date(date1).getFullYear();
                    const isLeap = isLeapYear(year);
                    const dayOfYear = getDayOfYear(date1);
                    const season = getSeason(date1);
                    const lunarDate = toLunarDate(date1);
                    const lunarDateStr = formatLunarDate(lunarDate);
                    const holidayName = getHolidayName(date1);
                    const semester = getSemester(date1);
                    const quarter = getQuarter(date1);
                    const weekRange = getWeekRange(date1);

                    let result = `${era.fullString} ${weekdayEmoji}${weekday} ${season} ${isLeap ? '(うるうどし)' : ''} ${year}ねんの${dayOfYear}にちめ\n`;
                    result += `旧暦: ${lunarDateStr}\n`;
                    if (holidayName) {
                      result += `祝日: ${holidayName}\n`;
                    }
                    result += `学期: ${semester}, 四半期: ${quarter}\n`;
                    result += `週: 月の第${weekRange.weekOfMonth}週、年の第${weekRange.weekOfYear}週\n`;
                    result += `週の範囲: ${formatDateJapanese(weekRange.start)} 〜 ${formatDateJapanese(weekRange.end)}`;

                    const formula = `${formatDateJapanese(date1)} → ${era.fullString} ${weekdayEmoji}${weekday}`;
                    onCreateBlock(formula);
                    saveCalculationHistory({
                      type: '日付情報',
                      input: date1,
                      result: `${era.fullString} ${weekdayEmoji}${weekday}`,
                      formula,
                    });
                    setDateResult(result);
                    setError(null);
                  }}
                >
                  {getThemeText(theme, 'DATE_INFO_SEARCH')}
                </button>

                {dateResult && date1 && isValidDate(date1) && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'DATE_INFO_RESULT')}</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#000' }}>{dateResult}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Anniversary Tab - 記念日までの日数 */}
          {dateTab === 'anniversary' && (
            <div className="date-tab-content fade-in">
              <h3>🎉 {getThemeText(theme, 'DATE_ANNIVERSARY_TITLE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_ANNIVERSARY_DATE')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                        if (!date1 || !isValidDate(date1)) {
                      setError(getThemeText(theme, 'ERROR_INVALID_DATE'));
                      return;
                    }

                    const days = daysUntilAnniversary(date1);
                    const formula = `${formatDateJapanese(date1)} まであと ${days}にち`;
                    onCreateBlock(formula);
                    setDateResult(`${getThemeText(theme, 'DATE_ANNIVERSARY_DAYS_UNTIL').replace('%', String(days))} (${Math.floor(days / 7)}${getThemeText(theme, 'DATE_UNIT_WEEKS_TEXT')}${days % 7}${getThemeText(theme, 'DATE_DAY')})`);
                    setError(null);
                  }}
                >
                  {getThemeText(theme, 'DATE_ANNIVERSARY_CALC')}
                </button>

                {dateResult && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'RESULT')}</h4>
                    <p>{dateResult}</p>
                  </div>
                )}

                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                  <h4>{getThemeText(theme, 'DATE_EVENT_DAYS_UNTIL')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[
                      { name: 'おしょうがつ', month: 1, day: 1 },
                      { name: 'バレンタインデー', month: 2, day: 14 },
                      { name: 'ひなまつり', month: 3, day: 3 },
                      { name: 'ゴールデンウィーク', month: 5, day: 5 },
                      { name: 'たなばた', month: 7, day: 7 },
                      { name: 'おぼん', month: 8, day: 15 },
                      { name: 'クリスマス', month: 12, day: 25 },
                    ].map((event) => {
                      const days = daysUntilEvent(event.month, event.day);
                      return (
                        <button
                          key={event.name}
                          className="event-btn"
                          onClick={() => {
                            const formula = `${event.name}まであと ${days}にち`;
                            onCreateBlock(formula);
                          }}
                        >
                          {event.name}: あと {days}にち
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trivia Tab - 今日は何の日 */}
          {dateTab === 'trivia' && (
            <div className="date-tab-content fade-in">
              <h3>📚 {getThemeText(theme, 'DATE_TRIVIA')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1 || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                    const targetDate = date1 || new Date().toISOString().split('T')[0];
                    if (!isValidDate(targetDate)) {
                      setError('せいかくなひづけをにゅうりょくしてね');
                      return;
                    }

                    const trivia = getDateTrivia(targetDate);
                    if (trivia.length > 0) {
                      const formula = `${formatDateJapanese(targetDate)}は${trivia.join('、')}`;
                      onCreateBlock(formula);
                      setDateResult(trivia.join('、'));
                      setError(null);
                    } else {
                      setDateResult('この日は特別な記念日は登録されていません');
                      setError(null);
                    }
                  }}
                >
                  きょうはなんのひ？
                </button>

                {dateResult && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'RESULT')}</h4>
                    <p>{dateResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Culture Tab - 日本の文化・行事 */}
          {dateTab === 'culture' && (
            <div className="date-tab-content fade-in">
              <h3>🎌 {getThemeText(theme, 'DATE_CULTURE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                    if (!date1 || !isValidDate(date1)) {
                      setError('せいかくなひづけをにゅうりょくしてね');
                      return;
                    }

                    const rokuyo = getRokuyo(date1);
                    const solarTerm = getSolarTerm(date1);
                    const ohigan = isOhigan(date1);
                    const year = new Date(date1).getFullYear();
                    const springOhigan = getOhiganDates(year, true);
                    const autumnOhigan = getOhiganDates(year, false);
                    const setsubun = getSetsubunDate(year);

                    let result = `六曜: ${rokuyo} - ${ROKUYO_DESCRIPTIONS[rokuyo]}\n`;
                    if (solarTerm) {
                      result += `二十四節気: ${solarTerm}\n`;
                    }
                    if (ohigan) {
                      result += `お彼岸期間中です\n`;
                    }
                    result += `\n${year}年の行事:\n`;
                    result += `節分: ${formatDateJapanese(setsubun)}\n`;
                    result += `春彼岸: ${formatDateJapanese(springOhigan[0])} 〜 ${formatDateJapanese(springOhigan[1])}\n`;
                    result += `秋彼岸: ${formatDateJapanese(autumnOhigan[0])} 〜 ${formatDateJapanese(autumnOhigan[1])}`;

                    const formula = `${formatDateJapanese(date1)}の六曜は${rokuyo}`;
                    onCreateBlock(formula);
                    setDateResult(result);
                    setError(null);
                  }}
                >
                  ぶんかをしらべる
                </button>

                {dateResult && (
                  <div className="date-result">
                    <h4>じょうほう</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', color: '#000000' }}>{dateResult}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calendar Tab - カレンダー表示 */}
          {dateTab === 'calendar' && (
            <div className="date-tab-content fade-in">
              <h3>📅 {getThemeText(theme, 'DATE_CALENDAR')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_YEAR_MONTH')}</label>
                  <input
                    type="month"
                    className="date-input"
                    value={date1 || new Date().toISOString().slice(0, 7)}
                    onChange={(e) => setDate1(e.target.value + '-01')}
                  />
                </div>

                {(() => {
                  const targetDate = date1 || new Date().toISOString().slice(0, 7) + '-01';
                  const [year, month] = targetDate.split('-').map(Number);
                  const firstDay = new Date(year, month - 1, 1);
                  const lastDay = new Date(year, month, 0);
                  const daysInMonth = lastDay.getDate();
                  const startWeekday = firstDay.getDay();
                  const today = new Date();
                  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;

                  const weeks: Date[][] = [];
                  let week: Date[] = [];

                  // 空白を埋める
                  for (let i = 0; i < startWeekday; i++) {
                    week.push(new Date(year, month - 1, 0));
                  }

                  // 日付を埋める
                  for (let day = 1; day <= daysInMonth; day++) {
                    week.push(new Date(year, month - 1, day));
                    if (week.length === 7) {
                      weeks.push(week);
                      week = [];
                    }
                  }

                  // 最後の週を埋める
                  if (week.length > 0) {
                    while (week.length < 7) {
                      week.push(new Date(year, month, week.length));
                    }
                    weeks.push(week);
                  }

                  return (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center' }}>
                        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                          <div key={day} style={{ fontWeight: 'bold', padding: '0.5rem', background: 'rgba(255,255,255,0.2)' }}>
                            {day}
                          </div>
                        ))}
                        {weeks.map((week, weekIdx) =>
                          week.map((date, dayIdx) => {
                            const isToday = isCurrentMonth && date.getDate() === today.getDate();
                            const isOtherMonth = date.getMonth() !== month - 1;
                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            const isBizDay = isBusinessDay(dateStr);
                            const rokuyo = !isOtherMonth ? getRokuyo(dateStr) : null;

                            return (
                              <div
                                key={`${weekIdx}-${dayIdx}`}
                                onClick={() => {
                                  setDate1(dateStr);
                                  const formula = `${formatDateJapanese(dateStr)}`;
                                  onCreateBlock(formula);
                                }}
                                style={{
                                  padding: '0.5rem',
                                  background: isToday
                                    ? 'rgba(255, 215, 0, 0.3)'
                                    : isOtherMonth
                                      ? 'rgba(255,255,255,0.1)'
                                      : isBizDay
                                        ? 'rgba(255,255,255,0.2)'
                                        : 'rgba(255,100,100,0.2)',
                                  border: isToday ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '0.25rem',
                                  cursor: 'pointer',
                                  opacity: isOtherMonth ? 0.5 : 1,
                                }}
                              >
                                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{date.getDate()}</div>
                                {rokuyo && !isOtherMonth && (
                                  <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: '#000' }}>{rokuyo}</div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                        <p>{getThemeText(theme, 'DATE_CALENDAR_LEGEND')}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Advanced Tab - 高度な機能 */}
          {dateTab === 'advanced' && (
            <div className="date-tab-content fade-in">
              <h3>⚙️ {getThemeText(theme, 'DATE_ADVANCED')}</h3>
              <div className="date-input-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 営業日計算 */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_BUSINESS_DAYS_TITLE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_BUSINESS_DAYS')}</label>
                    <input
                      type="number"
                      className="date-input"
                      value={dateAmount}
                      onChange={(e) => setDateAmount(e.target.value)}
                      placeholder={getThemeText(theme, 'DATE_BUSINESS_DAYS_PLACEHOLDER')}
                    />
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!date1 || !isValidDate(date1) || !dateAmount) {
                        setError('せいかくなにゅうりょくをしてね');
                        return;
                      }
                      const result = addBusinessDays(date1, parseInt(dateAmount));
                      const formula = `${formatDateJapanese(date1)}から${dateAmount}営業日後は${formatDateJapanese(result)}`;
                      onCreateBlock(formula);
                      setDateResult(formatDateJapanese(result));
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_BUSINESS_DAYS_CALC')}
                  </button>
                </div>

                {/* 週の何日目か */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_WEEK_POSITION')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!date1 || !isValidDate(date1)) {
                        setError('せいかくなひづけをにゅうりょくしてね');
                        return;
                      }
                      const position = getWeekdayPosition(date1);
                      const formula = `${formatDateJapanese(date1)}は${position}`;
                      onCreateBlock(formula);
                      setDateResult(position);
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_WEEK_POSITION_CALC')}
                  </button>
                </div>

                {/* 何年前は何年？ */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_YEARS_BEFORE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_YEARS')}</label>
                    <input
                      type="number"
                      className="date-input"
                      value={dateAmount}
                      onChange={(e) => setDateAmount(e.target.value)}
                      placeholder={theme === 'kids' ? '何年前' : '何年前'}
                    />
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!dateAmount) {
                        setError('ねんすうをにゅうりょくしてね');
                        return;
                      }
                      const pastYear = getPastYear(parseInt(dateAmount));
                      const formula = `${dateAmount}ねんまえは${pastYear}ねん`;
                      onCreateBlock(formula);
                      setDateResult(`${pastYear}ねん`);
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_YEARS_BEFORE_CALC')}
                  </button>
                </div>

                {/* 複数日付の比較（3つ以上対応） */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_COMPARE_TITLE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_DATE1')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_DATE2')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date2}
                      onChange={(e) => setDate2(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_DATE3')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date3}
                      onChange={(e) => setDate3(e.target.value)}
                    />
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      const dates = [date1, date2, date3].filter(d => d && isValidDate(d));
                      if (dates.length < 2) {
                        setError(getThemeText(theme, 'ERROR_NAME_DATE_REQUIRED'));
                        return;
                      }
                      try {
                        const comparison = compareMultipleDates(dates);
                        const ageComparison = compareAges(dates);
                        const chartData = getAgeComparisonChartData(
                          dates.map((date, idx) => ({ date, name: `${getThemeText(theme, 'DATE_LABEL')}${idx + 1}` }))
                        );
                        const maxAge = Math.max(...chartData.map(d => d.age.totalDays));

                        let result = `最も古い: ${formatDateJapanese(comparison.oldest)}\n最も新しい: ${formatDateJapanese(comparison.newest)}\n\n年齢差（詳細）:\n`;
                        ageComparison.forEach((item, idx) => {
                          const age = item.age;
                          result += `${getThemeText(theme, 'DATE_LABEL')}${idx + 1} (${formatDateJapanese(item.date)}): ${age.years}${getThemeText(theme, 'DATE_AGE_YEARS')}${age.months}${getThemeText(theme, 'DATE_AGE_MONTHS')}${age.days}${getThemeText(theme, 'DATE_AGE_DAYS')} (${age.totalDays}${getThemeText(theme, 'DATE_AGE_DAYS')})\n`;
                          if (idx > 0) {
                            result += `  → 最も若い人との差: ${item.difference.years}ねん${item.difference.months}かげつ${item.difference.days}にち\n`;
                          }
                        });
                        result += `\n日付間の差:\n`;
                        comparison.differences.forEach((diff) => {
                          result += `${formatDateJapanese(diff.date1)} と ${formatDateJapanese(diff.date2)}: ${diff.days}にち\n`;
                        });

                        const formula = `${dates.length}${getThemeText(theme, 'DATE_COMPARE_FORMULA')}`;
                        onCreateBlock(formula);
                        setDateResult(result);

                        // グラフ表示を後で追加
                        setTimeout(() => {
                          const resultElement = document.querySelector('.date-result');
                          if (resultElement && !resultElement.querySelector('.age-comparison-chart')) {
                            const graphDiv = document.createElement('div');
                            graphDiv.className = 'age-comparison-chart';
                            graphDiv.style.marginTop = '1rem';
                            graphDiv.style.padding = '1rem';
                            graphDiv.style.background = 'rgba(255,255,255,0.1)';
                            graphDiv.style.borderRadius = '0.5rem';

                            const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
                            graphDiv.innerHTML = `
                              <h5 style="color: #000; margin-bottom: 0.5rem;">{getThemeText(theme, 'DATE_AGE_CHART')}</h5>
                              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                ${chartData.map((item, idx) => {
                              const percentage = (item.age.totalDays / maxAge) * 100;
                              const color = colors[idx % colors.length];
                              return `
                                    <div style="margin-bottom: 0.5rem;">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                                        <span style="color: #000; font-size: 0.9rem;">${item.name}</span>
                                        <span style="color: #000; font-size: 0.9rem; font-weight: bold;">${item.age.years}${getThemeText(theme, 'DATE_AGE_YEARS')} (${item.age.totalDays}${getThemeText(theme, 'DATE_AGE_DAYS')})</span>
                                      </div>
                                      <div style="width: 100%; height: 25px; background: rgba(255,255,255,0.3); border-radius: 12px; overflow: hidden; position: relative;">
                                        <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s; display: flex; align-items: center; justify-content: flex-end; padding-right: 0.5rem;">
                                          ${percentage > 10 ? `<span style="color: #fff; font-size: 0.75rem; font-weight: bold;">${Math.round(percentage)}%</span>` : ''}
                                        </div>
                                      </div>
                                    </div>
                                  `;
                            }).join('')}
                              </div>
                            `;
                            resultElement.appendChild(graphDiv);
                          }
                        }, 100);

                        saveCalculationHistory({
                          type: '複数日付比較',
                          input: dates.join(', '),
                          result: `最も古い: ${formatDateJapanese(comparison.oldest)}, 最も新しい: ${formatDateJapanese(comparison.newest)}`,
                          formula,
                        });
                        setError(null);
                      } catch (err) {
                        setError(getThemeText(theme, 'DATE_COMPARE_ERROR'));
                      }
                    }}
                  >
                    {getThemeText(theme, 'DATE_COMPARE_CALC')}
                  </button>
                </div>

                {/* 営業時間計算（カスタム営業時間対応） */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_BUSINESS_HOURS_TITLE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_START')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_END')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date2}
                      onChange={(e) => setDate2(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">営業時間の設定</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={customBusinessHours.startHour}
                        onChange={(e) => setCustomBusinessHours({ ...customBusinessHours, startHour: parseInt(e.target.value) || 9 })}
                        style={{ width: '60px', padding: '0.5rem' }}
                      />
                      <span>:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={customBusinessHours.startMinute}
                        onChange={(e) => setCustomBusinessHours({ ...customBusinessHours, startMinute: parseInt(e.target.value) || 0 })}
                        style={{ width: '60px', padding: '0.5rem' }}
                      />
                      <span>〜</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={customBusinessHours.endHour}
                        onChange={(e) => setCustomBusinessHours({ ...customBusinessHours, endHour: parseInt(e.target.value) || 17 })}
                        style={{ width: '60px', padding: '0.5rem' }}
                      />
                      <span>:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={customBusinessHours.endMinute}
                        onChange={(e) => setCustomBusinessHours({ ...customBusinessHours, endMinute: parseInt(e.target.value) || 0 })}
                        style={{ width: '60px', padding: '0.5rem' }}
                      />
                    </div>
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!date1 || !date2 || !isValidDate(date1) || !isValidDate(date2)) {
                        setError('せいかくなひづけをにゅうりょくしてね');
                        return;
                      }
                      const businessHours: BusinessHours = {
                        startHour: customBusinessHours.startHour,
                        startMinute: customBusinessHours.startMinute,
                        endHour: customBusinessHours.endHour,
                        endMinute: customBusinessHours.endMinute,
                      };
                      const totalHours = calculateBusinessHours(date1, date2, businessHours);
                      const businessInfo = calculateBusinessDaysWithHours(date1, date2, businessHours);
                      const formula = `${formatDateJapanese(date1)}から${formatDateJapanese(date2)}までの営業時間（${businessHours.startHour}:${String(businessHours.startMinute).padStart(2, '0')}〜${businessHours.endHour}:${String(businessHours.endMinute).padStart(2, '0')}）`;
                      onCreateBlock(formula);
                      setDateResult(`営業日数: ${businessInfo.days}にち\n営業時間: ${totalHours.toFixed(1)}じかん (${businessInfo.hours}じかん${businessInfo.minutes}ふん)`);
                      saveCalculationHistory({
                        type: '営業時間計算（カスタム）',
                        input: `${date1} - ${date2}`,
                        result: `${businessInfo.days}営業日、${totalHours.toFixed(1)}時間`,
                        formula,
                      });
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_BUSINESS_HOURS_CALC')}
                  </button>
                </div>

                {/* カスタム営業日設定 */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_BUSINESS_CUSTOM_TITLE')}</h4>
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                    <div style={{ marginBottom: '0.5rem', color: '#000' }}>{getThemeText(theme, 'DATE_BUSINESS_CUSTOM_WEEKDAYS')}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      {[
                        { key: 'sunday', label: '日曜日' },
                        { key: 'monday', label: '月曜日' },
                        { key: 'tuesday', label: '火曜日' },
                        { key: 'wednesday', label: '水曜日' },
                        { key: 'thursday', label: '木曜日' },
                        { key: 'friday', label: '金曜日' },
                        { key: 'saturday', label: '土曜日' },
                      ].map(({ key, label }) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000' }}>
                          <input
                            type="checkbox"
                            checked={customBusinessDaysConfig.weekdays[key as keyof typeof customBusinessDaysConfig.weekdays]}
                            onChange={(e) => {
                              setCustomBusinessDaysConfig({
                                ...customBusinessDaysConfig,
                                weekdays: {
                                  ...customBusinessDaysConfig.weekdays,
                                  [key]: e.target.checked,
                                },
                              });
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_BUSINESS_CUSTOM_HOLIDAYS')}</label>
                    <input
                      type="text"
                      className="date-input"
                      placeholder="例: 2024-12-31, 2025-01-01"
                      value={customBusinessDaysConfig.customHolidays.join(', ')}
                      onChange={(e) => {
                        const holidays = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        setCustomBusinessDaysConfig({
                          ...customBusinessDaysConfig,
                          customHolidays: holidays,
                        });
                      }}
                    />
                  </div>

                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_BUSINESS_CUSTOM_BUSINESS_DAYS')}</label>
                    <input
                      type="text"
                      className="date-input"
                      placeholder="例: 2024-12-30, 2025-01-02"
                      value={customBusinessDaysConfig.customBusinessDays.join(', ')}
                      onChange={(e) => {
                        const businessDays = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        setCustomBusinessDaysConfig({
                          ...customBusinessDaysConfig,
                          customBusinessDays: businessDays,
                        });
                      }}
                    />
                  </div>

                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_TEST')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>

                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!date1 || !isValidDate(date1)) {
                        setError('せいかくなひづけをにゅうりょくしてね');
                        return;
                      }
                      const isBusiness = isCustomBusinessDay(date1, customBusinessDaysConfig);
                      const formula = `${formatDateJapanese(date1)}はカスタム営業日${isBusiness ? 'です' : 'ではありません'}`;
                      onCreateBlock(formula);
                      setDateResult(`${formatDateJapanese(date1)}は${isBusiness ? '営業日' : '休業日'}です`);
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_BUSINESS_TEST')}
                  </button>

                  {date1 && date2 && isValidDate(date1) && isValidDate(date2) && (
                    <>
                      <div className="date-input-group" style={{ marginTop: '1rem' }}>
                        <label className="date-label">{getThemeText(theme, 'DATE_LABEL_START')}</label>
                        <input
                          type="date"
                          className="date-input"
                          value={date1}
                          onChange={(e) => setDate1(e.target.value)}
                        />
                      </div>
                      <div className="date-input-group">
                        <label className="date-label">{getThemeText(theme, 'DATE_LABEL_END')}</label>
                        <input
                          type="date"
                          className="date-input"
                          value={date2}
                          onChange={(e) => setDate2(e.target.value)}
                        />
                      </div>
                      <button
                        className="date-calculate-btn"
                        onClick={() => {
                          const count = countCustomBusinessDays(date1, date2, customBusinessDaysConfig);
                          const formula = `${formatDateJapanese(date1)}から${formatDateJapanese(date2)}までのカスタム営業日数`;
                          onCreateBlock(formula);
                          setDateResult(`カスタム営業日数: ${count}にち`);
                          saveCalculationHistory({
                            type: 'カスタム営業日計算',
                            input: `${date1} - ${date2}`,
                            result: `${count}営業日`,
                            formula,
                          });
                          setError(null);
                        }}
                      >
                        {getThemeText(theme, 'DATE_BUSINESS_CUSTOM_DAYS')}
                      </button>
                    </>
                  )}
                </div>

                {/* タイムゾーン変換 */}
                <div>
                  <h4>たいむぞーんへんかん</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">もとのたいむぞーん</label>
                    <select
                      className="date-input"
                      value={fromTimezone}
                      onChange={(e) => setFromTimezone(e.target.value)}
                    >
                      {Object.entries(TIMEZONES).map(([tz, name]) => (
                        <option key={tz} value={tz}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">へんかんさきのたいむぞーん</label>
                    <select
                      className="date-input"
                      value={toTimezone}
                      onChange={(e) => setToTimezone(e.target.value)}
                    >
                      {Object.entries(TIMEZONES).map(([tz, name]) => (
                        <option key={tz} value={tz}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!date1 || !isValidDate(date1)) {
                        setError('せいかくなひづけをにゅうりょくしてね');
                        return;
                      }
                      const converted = convertTimezone(date1, fromTimezone, toTimezone);
                      const offset = getTimezoneOffset(fromTimezone, toTimezone);
                      const formula = `${formatDateJapanese(date1)} (${TIMEZONES[fromTimezone as keyof typeof TIMEZONES]}) → ${formatDateJapanese(converted)} (${TIMEZONES[toTimezone as keyof typeof TIMEZONES]})`;
                      onCreateBlock(formula);
                      setDateResult(`${formatDateJapanese(converted)}\n時差: ${offset > 0 ? '+' : ''}${offset}時間`);
                      saveCalculationHistory({
                        type: 'タイムゾーン変換',
                        input: `${date1} ${fromTimezone} → ${toTimezone}`,
                        result: converted,
                        formula,
                      });
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'UNIT_CONVERT')}
                  </button>
                </div>

                {/* 計画・予測機能 */}
                <div>
                  <h4>{getThemeText(theme, 'DATE_PLAN_PREDICT_TITLE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">うまれたひ</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_LABEL_YEARS_OR_AGE')}</label>
                    <input
                      type="number"
                      className="date-input"
                      value={dateAmount}
                      onChange={(e) => setDateAmount(e.target.value)}
                      placeholder="日数または年齢"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        if (!date1 || !isValidDate(date1) || !dateAmount) {
                          setError('せいかくなにゅうりょくをしてね');
                          return;
                        }
                        const targetAge = parseInt(dateAmount);
                        const result = getBirthdayAtAge(date1, targetAge);
                        const formula = `${formatDateJapanese(date1)}${getThemeText(theme, 'DATE_BORN')}のひとは${targetAge}${getThemeText(theme, 'DATE_AGE_YEARS')}になるのは${formatDateJapanese(result)}`;
                        onCreateBlock(formula);
                        setDateResult(formatDateJapanese(result));
                        setError(null);
                      }}
                    >
                      {dateAmount}{getThemeText(theme, 'DATE_AGE_AT')}
                    </button>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        if (!date1 || !isValidDate(date1) || !dateAmount) {
                          setError('せいかくなにゅうりょくをしてね');
                          return;
                        }
                        const days = parseInt(dateAmount);
                        const age = getAgeAfterDays(date1, days);
                        const formula = `${formatDateJapanese(date1)}${getThemeText(theme, 'DATE_BORN')}のひとは${days}${getThemeText(theme, 'DATE_AGE_DAYS')}ごには${age}${getThemeText(theme, 'DATE_AGE_YEARS')}`;
                        onCreateBlock(formula);
                        setDateResult(`${age}${getThemeText(theme, 'DATE_AGE_YEARS')}`);
                        setError(null);
                      }}
                    >
                      {dateAmount}{getThemeText(theme, 'DATE_AGE_AFTER')}
                    </button>
                  </div>
                </div>

                {dateResult && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'RESULT')}</h4>
                    <p>{dateResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Tab - タイムライン表示 */}
          {dateTab === 'timeline' && (
            <div className="date-tab-content fade-in">
              <h3>📊 {getThemeText(theme, 'DATE_TIMELINE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_START')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_END')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                  />
                </div>

                {date1 && date2 && isValidDate(date1) && isValidDate(date2) && (() => {
                  const start = new Date(date1);
                  const end = new Date(date2);
                  const diff = dateDifference(date1, date2);
                  const totalDays = Math.abs(diff);
                  const today = new Date();
                  const todayTime = today.getTime();
                  const startTime = start.getTime();
                  const endTime = end.getTime();
                  const progress = Math.max(0, Math.min(100, ((todayTime - startTime) / (endTime - startTime)) * 100));

                  return (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4>けいかじつすう: {totalDays}にち</h4>
                        <div style={{
                          width: '100%',
                          height: '30px',
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          position: 'relative',
                          marginTop: '0.5rem',
                        }}>
                          <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #4ecdc4, #44a08d)',
                            transition: 'width 0.3s ease',
                          }} />
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                          }}>
                            {progress.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        marginTop: '1rem',
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{theme === 'kids' ? 'はじまり' : '開始'}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{formatDateJapanese(date1)}</div>
                        </div>
                        <div style={{ flex: 1, margin: '0 1rem' }}>
                          <div style={{
                            height: '3px',
                            background: 'linear-gradient(90deg, #4ecdc4, #44a08d)',
                            borderRadius: '2px',
                          }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{theme === 'kids' ? 'おわり' : '終了'}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{formatDateJapanese(date2)}</div>
                        </div>
                      </div>

                      {formatDaysMultiple(totalDays).full && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: '0.5rem' }}>
                          <h4>ふくすうけいしき</h4>
                          <p style={{ color: '#000', margin: '0.5rem 0' }}>{formatDaysMultiple(totalDays).full}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* History Tab - 計算履歴 */}
          {dateTab === 'history' && (
            <div className="date-tab-content fade-in">
              <h3>📝 {getThemeText(theme, 'DATE_HISTORY_TITLE')}</h3>
              <div className="date-input-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>{getThemeText(theme, 'DATE_HISTORY_TITLE')}</h4>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      clearCalculationHistory();
                      setDateResult(null);
                    }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    ぜんぶけす
                  </button>
                </div>

                {(() => {
                  const history = getCalculationHistory();
                  if (history.length === 0) {
                    return <p style={{ textAlign: 'center', opacity: 0.7 }}>{getThemeText(theme, 'DATE_HISTORY_EMPTY')}</p>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {history.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>{item.type}</div>
                            <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{item.input}</div>
                            <div style={{ fontSize: '0.85rem', color: '#000', marginTop: '0.3rem' }}>{item.result}</div>
                          </div>
                          <button
                            onClick={() => {
                              deleteCalculationHistory(item.id);
                              setDateResult(null);
                            }}
                            style={{
                              padding: '0.3rem 0.6rem',
                              background: 'rgba(255,100,100,0.8)',
                              border: 'none',
                              borderRadius: '0.3rem',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            けす
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Countdown Tab - カウントダウンタイマー */}
          {dateTab === 'countdown' && (
            <div className="date-tab-content fade-in">
              <h3>⏰ {getThemeText(theme, 'DATE_COUNTDOWN')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_TARGET')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={countdownTarget}
                    onChange={(e) => setCountdownTarget(e.target.value)}
                  />
                </div>

                {countdownTarget && isValidDate(countdownTarget) && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(168, 237, 234, 0.3) 0%, rgba(254, 214, 227, 0.3) 100%)',
                    borderRadius: '1rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000' }}>
                      {formatDateJapanese(countdownTarget)}まで
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{countdownTime.days}</div>
                        <div style={{ fontSize: '0.9rem', color: '#000' }}>にち</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{countdownTime.hours}</div>
                        <div style={{ fontSize: '0.9rem', color: '#000' }}>じかん</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{countdownTime.minutes}</div>
                        <div style={{ fontSize: '0.9rem', color: '#000' }}>ふん</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{countdownTime.seconds}</div>
                        <div style={{ fontSize: '0.9rem', color: '#000' }}>びょう</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Yearly Calendar Tab - 年間カレンダー */}
          {dateTab === 'yearly' && (
            <div className="date-tab-content fade-in">
              <h3>📆 {getThemeText(theme, 'DATE_YEARLY')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">ねん</label>
                  <input
                    type="number"
                    className="date-input"
                    value={dateAmount || new Date().getFullYear()}
                    onChange={(e) => setDateAmount(e.target.value)}
                    placeholder="年"
                  />
                </div>

                {(() => {
                  const year = parseInt(dateAmount) || new Date().getFullYear();
                  const holidays = getJapaneseHolidays(year);

                  return (
                    <div style={{ marginTop: '1rem' }}>
                      <h4>{year}ねんのしゅくじつ</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {holidays.map((holiday) => (
                          <div
                            key={holiday.date}
                            style={{
                              padding: '0.5rem',
                              background: 'rgba(255,255,255,0.15)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(255,255,255,0.2)',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setDate1(holiday.date);
                              const formula = `${formatDateJapanese(holiday.date)}は${holiday.name}`;
                              onCreateBlock(formula);
                            }}
                          >
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>{holiday.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{formatDateJapanese(holiday.date)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Weekly Calendar Tab - 週間カレンダー */}
          {dateTab === 'weekly' && (
            <div className="date-tab-content fade-in">
              <h3>📅 {getThemeText(theme, 'DATE_WEEKLY')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1 || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>

                {date1 && isValidDate(date1) && (() => {
                  const weekRange = getWeekRange(date1);
                  const start = new Date(weekRange.start);
                  const days: Date[] = [];

                  for (let i = 0; i < 7; i++) {
                    const day = new Date(start);
                    day.setDate(start.getDate() + i);
                    days.push(day);
                  }

                  return (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                        <p style={{ color: '#000', margin: '0.3rem 0' }}>月の第{weekRange.weekOfMonth}週、年の第{weekRange.weekOfYear}週</p>
                        <p style={{ color: '#000', margin: '0.3rem 0' }}>{formatDateJapanese(weekRange.start)} 〜 {formatDateJapanese(weekRange.end)}</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                        {['月', '火', '水', '木', '金', '土', '日'].map((dayName, idx) => {
                          const day = days[idx];
                          const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                          const isToday = dateStr === new Date().toISOString().split('T')[0];
                          const rokuyo = getRokuyo(dateStr);
                          const holidayName = getHolidayName(dateStr);

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setDate1(dateStr);
                                onCreateBlock(formatDateJapanese(dateStr));
                              }}
                              style={{
                                padding: '0.75rem',
                                background: isToday ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.15)',
                                borderRadius: '0.5rem',
                                border: isToday ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#000' }}>{dayName}</div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', margin: '0.3rem 0' }}>{day.getDate()}</div>
                              {rokuyo && <div style={{ fontSize: '0.7rem', color: '#000' }}>{rokuyo}</div>}
                              {holidayName && <div style={{ fontSize: '0.7rem', color: '#ff6b6b', fontWeight: 'bold' }}>{holidayName}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Date Range Tab - 日付の範囲指定 */}
          {dateTab === 'range' && (
            <div className="date-tab-content fade-in">
              <h3>📊 {getThemeText(theme, 'DATE_RANGE')}</h3>
              <div className="date-input-section">
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_START')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'DATE_LABEL_END')}</label>
                  <input
                    type="date"
                    className="date-input"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                  />
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={() => {
                    if (!date1 || !date2 || !isValidDate(date1) || !isValidDate(date2)) {
                      setError('せいかくなひづけをにゅうりょくしてね');
                      return;
                    }

                    const rangeInfo = calculateDateRange(date1, date2);
                    const formula = `${formatDateJapanese(date1)} 〜 ${formatDateJapanese(date2)}の範囲`;
                    onCreateBlock(formula);
                    setDateResult(`総日数: ${rangeInfo.totalDays}にち\n営業日数: ${rangeInfo.businessDays}にち\n週末: ${rangeInfo.weekends}にち\n祝日: ${rangeInfo.holidays}にち`);
                    saveCalculationHistory({
                      type: '日付範囲',
                      input: `${date1} - ${date2}`,
                      result: `${rangeInfo.totalDays}日（営業日: ${rangeInfo.businessDays}日）`,
                      formula,
                    });
                    setError(null);
                  }}
                >
                  はんいをけいさん
                </button>

                {dateResult && (
                  <div className="date-result">
                    <h4>{getThemeText(theme, 'RESULT')}</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#000' }}>{dateResult}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Anniversary List Tab - 記念日リスト管理 */}
          {dateTab === 'anniversary-list' && (
            <div className="date-tab-content fade-in">
              <h3>🎉 {getThemeText(theme, 'DATE_ANNIVERSARY_LIST_TITLE')}</h3>
              <div className="date-input-section">
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                  <h4>{getThemeText(theme, 'DATE_ANNIVERSARY_REGISTER_TITLE')}</h4>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_ANNIVERSARY_NAME_LABEL')}</label>
                    <input
                      type="text"
                      className="date-input"
                      value={anniversaryName}
                      onChange={(e) => setAnniversaryName(e.target.value)}
                      placeholder={getThemeText(theme, 'DATE_ANNIVERSARY_NAME')}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_INFO_DATE')}</label>
                    <input
                      type="date"
                      className="date-input"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label className="date-label">{getThemeText(theme, 'DATE_ANNIVERSARY_TYPE')}</label>
                    <select
                      className="date-input"
                      value={anniversaryType}
                      onChange={(e) => setAnniversaryType(e.target.value as typeof anniversaryType)}
                    >
                      <option value="birthday">{getThemeText(theme, 'DATE_ANNIVERSARY_BIRTHDAY')}</option>
                      <option value="anniversary">{getThemeText(theme, 'DATE_ANNIVERSARY_ANNIVERSARY')}</option>
                      <option value="event">{getThemeText(theme, 'DATE_ANNIVERSARY_EVENT')}</option>
                      <option value="custom">{getThemeText(theme, 'DATE_ANNIVERSARY_CUSTOM')}</option>
                    </select>
                  </div>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      if (!anniversaryName || !date1 || !isValidDate(date1)) {
                        setError(getThemeText(theme, 'ERROR_NAME_DATE_REQUIRED'));
                        return;
                      }
                      addAnniversary({ name: anniversaryName, date: date1, type: anniversaryType });
                      setAnniversaryName('');
                      setDate1('');
                      setError(null);
                    }}
                  >
                    {getThemeText(theme, 'DATE_ANNIVERSARY_REGISTER')}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>{getThemeText(theme, 'DATE_ANNIVERSARY_LIST_TITLE')}</h4>
                  <button
                    className="date-calculate-btn"
                    onClick={() => {
                      clearAnniversaryList();
                      setDateResult(null);
                    }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    {getThemeText(theme, 'DATE_ANNIVERSARY_CLEAR_ALL')}
                  </button>
                </div>

                {(() => {
                  const anniversaries = getAnniversaryList();
                  if (anniversaries.length === 0) {
                    return <p style={{ textAlign: 'center', opacity: 0.7, color: '#000' }}>{getThemeText(theme, 'DATE_ANNIVERSARY_EMPTY')}</p>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {anniversaries.map((item) => {
                        const daysUntil = getDaysUntilAnniversary(item.date);
                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '0.75rem',
                              background: 'rgba(255,255,255,0.15)',
                              borderRadius: '0.5rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>{item.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{formatDateJapanese(item.date)}</div>
                              <div style={{ fontSize: '0.85rem', color: '#000', marginTop: '0.3rem' }}>
                                {daysUntil > 0 ? getThemeText(theme, 'DATE_ANNIVERSARY_DAYS_UNTIL').replace('%', String(daysUntil)) : daysUntil === 0 ? getThemeText(theme, 'DATE_ANNIVERSARY_TODAY') : getThemeText(theme, 'DATE_ANNIVERSARY_DAYS_PAST').replace('%', String(Math.abs(daysUntil)))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                deleteAnniversary(item.id);
                                setDateResult(null);
                              }}
                              style={{
                                padding: '0.3rem 0.6rem',
                                background: 'rgba(255,100,100,0.8)',
                                border: 'none',
                                borderRadius: '0.3rem',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              けす
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Export Tab - データエクスポート */}
          {dateTab === 'export' && (
            <div className="date-tab-content fade-in">
              <h3>💾 データエクスポート</h3>
              <div className="date-input-section">
                <div>
                  <h4>けいさんれきしのエクスポート</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        const csv = exportHistoryToCSV();
                        downloadFile(csv, `calculation_history_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
                      }}
                    >
                      CSVでダウンロード
                    </button>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        const json = exportHistoryToJSON();
                        downloadFile(json, `calculation_history_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
                      }}
                    >
                      JSONでダウンロード
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h4>きねんびリストのエクスポート</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        const csv = exportAnniversariesToCSV();
                        downloadFile(csv, `anniversaries_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
                      }}
                    >
                      CSVでダウンロード
                    </button>
                    <button
                      className="date-calculate-btn"
                      onClick={() => {
                        const json = exportAnniversariesToJSON();
                        downloadFile(json, `anniversaries_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
                      }}
                    >
                      JSONでダウンロード
                    </button>
                  </div>
                </div>

                <hr style={{ margin: '2rem 0', border: 'none', borderTop: '2px solid #ddd' }} />

                <div>
                  <h4>📥 データインポート</h4>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                    エクスポートしたCSVまたはJSONファイルを読み込んで履歴を復元できます
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <h5>けいさんれきしのインポート</h5>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'inline-block' }}>
                        <input
                          type="file"
                          accept=".csv"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const csv = event.target?.result as string;
                              const result = importHistoryFromCSV(csv);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                            e.target.value = '';
                          }}
                        />
                        <button className="date-calculate-btn" type="button" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.csv';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const csv = event.target?.result as string;
                              const result = importHistoryFromCSV(csv);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                          };
                          input.click();
                        }}>
                          {getThemeText(theme, 'DATE_IMPORT_CSV')}
                        </button>
                      </label>
                      <label style={{ display: 'inline-block' }}>
                        <input
                          type="file"
                          accept=".json"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const json = event.target?.result as string;
                              const result = importHistoryFromJSON(json);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                            e.target.value = '';
                          }}
                        />
                        <button className="date-calculate-btn" type="button" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.json';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const json = event.target?.result as string;
                              const result = importHistoryFromJSON(json);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_HISTORY_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                          };
                          input.click();
                        }}>
                          {getThemeText(theme, 'DATE_IMPORT_JSON')}
                        </button>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <h5>きねんびリストのインポート</h5>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="date-calculate-btn"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.csv';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const csv = event.target?.result as string;
                              const result = importAnniversariesFromCSV(csv);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                          };
                          input.click();
                        }}
                      >
                        {getThemeText(theme, 'DATE_IMPORT_CSV')}
                      </button>
                      <button
                        className="date-calculate-btn"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.json';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const json = event.target?.result as string;
                              const result = importAnniversariesFromJSON(json);
                              if (result.success) {
                                alert(getThemeText(theme, 'DATE_IMPORT_SUCCESS').replace('%', String(result.count)));
                                window.location.reload();
                              } else {
                                alert(getThemeText(theme, 'DATE_IMPORT_ERROR').replace('%', result.error || ''));
                              }
                            };
                            reader.readAsText(file);
                          };
                          input.click();
                        }}
                      >
                        {getThemeText(theme, 'DATE_IMPORT_JSON')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              🎯 {getThemeText(theme, 'ZODIAC_MAIN')}
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'age' ? 'active' : ''}`}
              onClick={() => setZodiacTab('age')}
            >
              🎂 {getThemeText(theme, 'ZODIAC_AGE')}
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'compatibility' ? 'active' : ''}`}
              onClick={() => setZodiacTab('compatibility')}
            >
              💕 {getThemeText(theme, 'ZODIAC_COMPATIBILITY')}
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'info' ? 'active' : ''}`}
              onClick={() => setZodiacTab('info')}
            >
              📚 {getThemeText(theme, 'ZODIAC_INFO')}
            </button>
            <button
              className={`zodiac-tab ${zodiacTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setZodiacTab('quiz')}
            >
              🎮 {getThemeText(theme, 'ZODIAC_QUIZ')}
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
                ⭐ {getThemeText(theme, 'ZODIAC_TITLE')}
              </button>

              {selectedZodiac && (
                <div className="zodiac-years-list fade-in">
                  <div className="zodiac-years-header">
                    <h3>{getThemeText(theme, 'ZODIAC_YEARS_PEOPLE').replace('%', ZODIAC_NAMES_JA[selectedZodiac])}</h3>
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
                        <div className="age-text">{getThemeText(theme, 'ZODIAC_CURRENT_AGE').replace('%', String(age))}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="zodiac-input-group">
                <label className="zodiac-label">{getThemeText(theme, 'ZODIAC_BIRTH_YEAR')}</label>
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
                {getThemeText(theme, 'ZODIAC_SEARCH')} 🔍
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
                          {year}年{getThemeText(theme, 'DATE_BORN')} → {getThemeText(theme, 'DATE_NOW')} {age}{getThemeText(theme, 'DATE_AGE_YEARS')}
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
              <h3>{getThemeText(theme, 'ZODIAC_AGE_SEARCH')}</h3>
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
                {getThemeText(theme, 'DATE_CALCULATE')}
              </button>

              <div className="family-section">
                <h3>{getThemeText(theme, 'ZODIAC_FAMILY_LIST')}</h3>
                <div className="add-member-form">
                  <input
                    type="text"
                    className="member-name-input"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder={getThemeText(theme, 'DATE_ANNIVERSARY_NAME_LABEL')}
                  />
                  <button className="add-member-btn" onClick={handleAddFamilyMember}>
                    {getThemeText(theme, 'CART_ADD')}
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
              <h3>{getThemeText(theme, 'ZODIAC_COMPATIBILITY_CHECK')}</h3>

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
                {getThemeText(theme, 'ZODIAC_COMPATIBILITY_CHECK_BUTTON')}
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
        <div className="calculator-panel">
          <h2 style={{ marginBottom: '1rem', color: '#000' }}>📏 {getThemeText(theme, 'UNIT_TITLE')}</h2>
          {(() => {
            const unitNames: Record<string, string> = {
              // 長さ
              mm: 'ミリメートル',
              cm: 'センチメートル',
              m: 'メートル',
              km: 'キロメートル',
              inch: 'インチ',
              ft: 'フィート',
              yard: 'ヤード',
              mile: 'マイル',
              // 重さ
              mg: 'ミリグラム',
              g: 'グラム',
              kg: 'キログラム',
              ton: 'トン',
              oz: 'オンス',
              lb: 'ポンド',
              // かさ
              ml: 'ミリリットル',
              l: 'リットル',
              kl: 'キロリットル',
              cup: 'カップ',
              pint: 'パイント',
              quart: 'クォート',
              gallon: 'ガロン',
              // 時間
              ms: 'ミリ秒',
              s: '秒',
              min: '分',
              hour: '時間',
              day: '日',
              week: '週',
              // 温度
              C: 'せししおん（℃）',
              F: 'かしおん（℉）',
              K: 'けるびん（K）',
              // お金
              JPY: 'えん',
              USD: 'ドル',
              EUR: 'ユーロ',
              GBP: 'ポンド',
              CNY: 'げん',
            };

            const availableUnits = UnitConverter.getUnitsForCategory(unitCategory);

            const handleConvert = () => {
              if (!unitInputValue || !fromUnit || !toUnit) {
                alert('すうじとたんいをにゅうりょくしてね！');
                return;
              }

              const value = parseFloat(unitInputValue);
              if (isNaN(value)) {
                alert('すうじをにゅうりょくしてね！');
                return;
              }

              try {
                const convertedValue = UnitConverter.convert(value, fromUnit, toUnit, unitCategory);
                // 小数点が不要な場合は表示しない
                const isInteger = Math.abs(convertedValue - Math.round(convertedValue)) < 0.000001;
                let formattedValue = isInteger ? convertedValue.toString() : convertedValue.toFixed(6);
                // カンマ区切りを追加（4桁以上の場合）
                if (Math.abs(convertedValue) >= 1000) {
                  const parts = formattedValue.split('.');
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  formattedValue = parts.join('.');
                }
                setUnitResult(formattedValue);
                onCreateBlock(`${value}${unitNames[fromUnit] || fromUnit} = ${formattedValue}${unitNames[toUnit] || toUnit}`);
              } catch (error) {
                alert('へんかんできませんでした');
              }
            };

            return (
              <div>
                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'UNIT_CATEGORY')}</label>
                  <select
                    className="date-input"
                    value={unitCategory}
                    onChange={(e) => {
                      setUnitCategory(e.target.value as UnitCategory);
                      setFromUnit('');
                      setToUnit('');
                      setUnitResult(null);
                    }}
                  >
                    <option value={UnitCategory.LENGTH}>{getThemeText(theme, 'UNIT_CATEGORY_LENGTH')}</option>
                    <option value={UnitCategory.WEIGHT}>{getThemeText(theme, 'UNIT_CATEGORY_WEIGHT')}</option>
                    <option value={UnitCategory.VOLUME}>{getThemeText(theme, 'UNIT_CATEGORY_VOLUME')}</option>
                    <option value={UnitCategory.TIME}>{getThemeText(theme, 'UNIT_CATEGORY_TIME')}</option>
                    <option value={UnitCategory.TEMPERATURE}>{getThemeText(theme, 'UNIT_CATEGORY_TEMPERATURE')}</option>
                    <option value={UnitCategory.CURRENCY}>{getThemeText(theme, 'UNIT_CATEGORY_CURRENCY')}</option>
                  </select>
                </div>

                <div className="date-input-group" style={{ marginTop: '1rem' }}>
                  <label className="date-label">{getThemeText(theme, 'UNIT_NUMBER')}</label>
                  <input
                    type="number"
                    className="date-input"
                    value={unitInputValue}
                    onChange={(e) => setUnitInputValue(e.target.value)}
                    placeholder={getThemeText(theme, 'UNIT_INPUT')}
                    step="any"
                  />
                </div>

                <div className="date-input-group" style={{ marginTop: '1rem' }}>
                  <label className="date-label">{getThemeText(theme, 'UNIT_FROM')}</label>
                  <select
                    className="date-input"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                  >
                    <option value="">{getThemeText(theme, 'UNIT_SELECT')}</option>
                    {availableUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unitNames[unit] || unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.5rem', color: '#000' }}>→</div>

                <div className="date-input-group">
                  <label className="date-label">{getThemeText(theme, 'UNIT_TO')}</label>
                  <select
                    className="date-input"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                  >
                    <option value="">{getThemeText(theme, 'UNIT_SELECT')}</option>
                    {availableUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unitNames[unit] || unit}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="date-calculate-btn"
                  onClick={handleConvert}
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  {getThemeText(theme, 'UNIT_CONVERT')}
                </button>

                {unitResult && (
                  <div className="date-result" style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000', marginBottom: '0.5rem' }}>
                      {unitResult} {unitNames[toUnit] || toUnit}
                    </div>
                    <div style={{ color: '#000' }}>
                      {unitInputValue} {unitNames[fromUnit] || fromUnit} = {unitResult} {unitNames[toUnit] || toUnit}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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
              ✨ {getThemeText(theme, 'FORTUNE_DIAGNOSIS')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'constellation' ? 'active' : ''}`}
              onClick={() => setFortuneTab('constellation')}
            >
              🌙 {getThemeText(theme, 'FORTUNE_CONSTELLATION')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'numerology' ? 'active' : ''}`}
              onClick={() => setFortuneTab('numerology')}
            >
              🔢 {getThemeText(theme, 'FORTUNE_NUMEROLOGY')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'weekday' ? 'active' : ''}`}
              onClick={() => setFortuneTab('weekday')}
            >
              📅 {getThemeText(theme, 'FORTUNE_WEEKDAY')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'omikuji' ? 'active' : ''}`}
              onClick={() => setFortuneTab('omikuji')}
            >
              🎴 {getThemeText(theme, 'FORTUNE_OMIKUJI')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'compatibility' ? 'active' : ''}`}
              onClick={() => setFortuneTab('compatibility')}
            >
              💕 {getThemeText(theme, 'ZODIAC_COMPATIBILITY')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setFortuneTab('monthly')}
            >
              📅 {getThemeText(theme, 'FORTUNE_MONTHLY')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'biorhythm' ? 'active' : ''}`}
              onClick={() => setFortuneTab('biorhythm')}
            >
              📊 {getThemeText(theme, 'FORTUNE_BIORHYTHM')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'powerstone' ? 'active' : ''}`}
              onClick={() => setFortuneTab('powerstone')}
            >
              💎 {getThemeText(theme, 'FORTUNE_POWERSTONE')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'wish' ? 'active' : ''}`}
              onClick={() => setFortuneTab('wish')}
            >
              ⭐ {getThemeText(theme, 'FORTUNE_WISH')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'luckytime' ? 'active' : ''}`}
              onClick={() => setFortuneTab('luckytime')}
            >
              ⏰ {getThemeText(theme, 'FORTUNE_LUCKYTIME')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'tarot' ? 'active' : ''}`}
              onClick={() => setFortuneTab('tarot')}
            >
              🃏 {getThemeText(theme, 'FORTUNE_TAROT')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'color' ? 'active' : ''}`}
              onClick={() => setFortuneTab('color')}
            >
              🎨 {getThemeText(theme, 'FORTUNE_COLOR')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'ninestar' ? 'active' : ''}`}
              onClick={() => setFortuneTab('ninestar')}
            >
              ⭐ {getThemeText(theme, 'FORTUNE_NINESTAR')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'chart' ? 'active' : ''}`}
              onClick={() => setFortuneTab('chart')}
            >
              📈 {getThemeText(theme, 'FORTUNE_CHART')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'fourpillars' ? 'active' : ''}`}
              onClick={() => setFortuneTab('fourpillars')}
            >
              🔮 {getThemeText(theme, 'FORTUNE_FOURPILLARS')}
            </button>
            <button
              className={`fortune-tab ${fortuneTab === 'dream' ? 'active' : ''}`}
              onClick={() => setFortuneTab('dream')}
            >
              💤 {getThemeText(theme, 'FORTUNE_DREAM')}
            </button>
          </div>

          {/* Birthday Input Section (shared across tabs) */}
          <div className="fortune-input-section">
            <h3>{getThemeText(theme, 'FORTUNE_BIRTH_DATE')}</h3>
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
              {getThemeText(theme, 'FORTUNE_TELL')}
            </button>
          </div>

          {/* Tab Content */}
          {fortuneTab === 'diagnosis' && (
            <div className="fortune-tab-content fade-in">
              <h3>✨ {getThemeText(theme, 'FORTUNE_DIAGNOSIS_TITLE')}</h3>
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
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
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

          {/* Compatibility Tab - 相性診断 */}
          {fortuneTab === 'compatibility' && (
            <div className="fortune-tab-content fade-in">
              <h3>💕 あいしょうしんだん</h3>
              <div className="fortune-input-section">
                <h4>ひとめのうまれたひ</h4>
                <div className="fortune-date-inputs">
                  <input type="number" placeholder="年" value={compatYear1} onChange={(e) => setCompatYear1(e.target.value)} className="fortune-input" min="1900" max="2100" />
                  <span>年</span>
                  <input type="number" placeholder="月" value={compatMonth1} onChange={(e) => setCompatMonth1(e.target.value)} className="fortune-input" min="1" max="12" />
                  <span>月</span>
                  <input type="number" placeholder="日" value={compatDay1} onChange={(e) => setCompatDay1(e.target.value)} className="fortune-input" min="1" max="31" />
                  <span>日</span>
                </div>
                <h4 style={{ marginTop: '1rem' }}>ふたりめのうまれたひ</h4>
                <div className="fortune-date-inputs">
                  <input type="number" placeholder="年" value={compatYear2} onChange={(e) => setCompatYear2(e.target.value)} className="fortune-input" min="1900" max="2100" />
                  <span>年</span>
                  <input type="number" placeholder="月" value={compatMonth2} onChange={(e) => setCompatMonth2(e.target.value)} className="fortune-input" min="1" max="12" />
                  <span>月</span>
                  <input type="number" placeholder="日" value={compatDay2} onChange={(e) => setCompatDay2(e.target.value)} className="fortune-input" min="1" max="31" />
                  <span>日</span>
                </div>
                <button
                  className="fortune-calc-btn"
                  onClick={() => {
                    const year1 = parseInt(compatYear1);
                    const month1 = parseInt(compatMonth1);
                    const day1 = parseInt(compatDay1);
                    const year2 = parseInt(compatYear2);
                    const month2 = parseInt(compatMonth2);
                    const day2 = parseInt(compatDay2);

                    if (isNaN(year1) || isNaN(month1) || isNaN(day1) || isNaN(year2) || isNaN(month2) || isNaN(day2)) {
                      alert('せいねんがっぴをにゅうりょくしてね！');
                      return;
                    }

                    const result = calculateOverallCompatibility(year1, month1, day1, year2, month2, day2);
                    setDateResult(JSON.stringify(result, null, 2));
                    onCreateBlock(`${year1}年${month1}月${day1}日と${year2}年${month2}月${day2}日の相性`);
                  }}
                >
                  あいしょうをしんだん
                </button>

                {dateResult && (() => {
                  try {
                    const result: CompatibilityResult = JSON.parse(dateResult);
                    const levelColors: Record<string, string> = {
                      excellent: '#FFD700',
                      good: '#90EE90',
                      normal: '#FFA500',
                      challenging: '#FF6B6B',
                    };
                    return (
                      <div className="fortune-comprehensive" style={{ marginTop: '1rem' }}>
                        <div className="fortune-card" style={{ background: levelColors[result.level] }}>
                          <h4>そうごうあいしょう</h4>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{result.overallScore}てん</div>
                          <p style={{ color: '#000' }}>{result.advice}</p>
                        </div>
                        <div className="fortune-card">
                          <h4>せいざのあいしょう</h4>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{result.constellation.score}てん</div>
                          <p style={{ color: '#000' }}>{result.constellation.message}</p>
                        </div>
                        <div className="fortune-card">
                          <h4>すうじじゅつのあいしょう</h4>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{result.numerology.score}てん</div>
                          <p style={{ color: '#000' }}>{result.numerology.message}</p>
                        </div>
                        <div className="fortune-card">
                          <h4>ようびのあいしょう</h4>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{result.weekday.score}てん</div>
                          <p style={{ color: '#000' }}>{result.weekday.message}</p>
                        </div>
                        <div className="fortune-card">
                          <h4>えとのあいしょう</h4>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{result.zodiac.score}てん</div>
                          <p style={{ color: '#000' }}>{result.zodiac.message}</p>
                        </div>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
        </div>
      )}

          {/* Monthly Fortune Tab - 月間・年間運勢 */}
          {fortuneTab === 'monthly' && (
            <div className="fortune-tab-content fade-in">
              <h3>📅 げつかん・ねんかんうんせい</h3>
              {fortuneResult ? (() => {
                const today = new Date();
                const monthly = calculateMonthlyFortune(
                  fortuneResult.constellation!,
                  fortuneResult.lifePathNumber!,
                  fortuneResult.weekday!,
                  fortuneResult.zodiac!,
                  today.getFullYear(),
                  today.getMonth() + 1
                );
                const yearly = calculateYearlyFortune(
                  fortuneResult.constellation!,
                  fortuneResult.lifePathNumber!,
                  fortuneResult.weekday!,
                  fortuneResult.zodiac!,
                  today.getFullYear()
                );
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>{today.getFullYear()}ねんのうんせい</h4>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ color: '#000' }}><strong>そうごう：</strong>{'⭐'.repeat(yearly.overall)}</div>
                        <div style={{ color: '#000' }}><strong>れんあい：</strong>{'💕'.repeat(yearly.love)}</div>
                        <div style={{ color: '#000' }}><strong>おしごと：</strong>{'📚'.repeat(yearly.work)}</div>
                        <div style={{ color: '#000' }}><strong>おかね：</strong>{'💰'.repeat(yearly.money)}</div>
                        <div style={{ color: '#000' }}><strong>けんこう：</strong>{'❤️'.repeat(yearly.health)}</div>
                      </div>
                      <p style={{ marginTop: '0.5rem', color: '#000' }}>{yearly.yearlyAdvice}</p>
                      <div style={{ marginTop: '0.5rem', color: '#000' }}>
                        <strong>らっきーげつ：</strong>{yearly.luckyMonths.map(m => `${m}がつ`).join(', ')}
                      </div>
                      <div style={{ marginTop: '0.5rem', color: '#000' }}>
                        <strong>ちゅういげつ：</strong>{yearly.cautionMonths.map(m => `${m}がつ`).join(', ') || 'なし'}
                      </div>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>{today.getMonth() + 1}がつのうんせい</h4>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ color: '#000' }}><strong>そうごう：</strong>{'⭐'.repeat(monthly.overall)}</div>
                        <div style={{ color: '#000' }}><strong>れんあい：</strong>{'💕'.repeat(monthly.love)}</div>
                        <div style={{ color: '#000' }}><strong>おしごと：</strong>{'📚'.repeat(monthly.work)}</div>
                        <div style={{ color: '#000' }}><strong>おかね：</strong>{'💰'.repeat(monthly.money)}</div>
                        <div style={{ color: '#000' }}><strong>けんこう：</strong>{'❤️'.repeat(monthly.health)}</div>
                      </div>
                      <p style={{ marginTop: '0.5rem', color: '#000' }}>{monthly.monthlyAdvice}</p>
                      <div style={{ marginTop: '0.5rem', color: '#000' }}>
                        <strong>らっきーび：</strong>{monthly.luckyDays.slice(0, 5).map(d => formatDateJapanese(d)).join(', ')}
                      </div>
                      <div style={{ marginTop: '0.5rem', color: '#000' }}>
                        <strong>ちゅういび：</strong>{monthly.cautionDays.slice(0, 5).map(d => formatDateJapanese(d)).join(', ') || 'なし'}
                      </div>
                    </div>
    </div>
  );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Biorhythm Tab - バイオリズム */}
          {fortuneTab === 'biorhythm' && (
            <div className="fortune-tab-content fade-in">
              <h3>📊 ばいおりずむ</h3>
              {fortuneResult ? (() => {
                const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
                const today = new Date();
                const todayState = calculateBiorhythm(birthDate, today);
                const nextPowerUp = getNextPowerUpDay(birthDate, today);
                const range = calculateBiorhythmRange(birthDate, new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));

                return (
                  <div>
                    <div className="fortune-card">
                      <h4>きょうのばいおりずむ</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.8rem', color: '#000' }}>からだ</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayState.physical}</div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
                            <div style={{ width: `${Math.abs(todayState.physical)}%`, height: '100%', background: todayState.physical >= 0 ? '#90EE90' : '#FF6B6B' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.8rem', color: '#000' }}>かんじょう</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayState.emotional}</div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
                            <div style={{ width: `${Math.abs(todayState.emotional)}%`, height: '100%', background: todayState.emotional >= 0 ? '#90EE90' : '#FF6B6B' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.8rem', color: '#000' }}>ちせい</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayState.intellectual}</div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
                            <div style={{ width: `${Math.abs(todayState.intellectual)}%`, height: '100%', background: todayState.intellectual >= 0 ? '#90EE90' : '#FF6B6B' }} />
                          </div>
                        </div>
                      </div>
                      {todayState.powerUp && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#FFD700', borderRadius: '0.3rem', color: '#000' }}>
                          ⚡ きょうはパワーアップデー！
                        </div>
                      )}
                      {todayState.caution && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#FF6B6B', borderRadius: '0.3rem', color: '#fff' }}>
                          ⚠️ きょうはちゅういび
                        </div>
                      )}
                      <div style={{ marginTop: '0.5rem', color: '#000' }}>
                        <strong>つぎのパワーアップデー：</strong>{formatDateJapanese(`${nextPowerUp.getFullYear()}-${String(nextPowerUp.getMonth() + 1).padStart(2, '0')}-${String(nextPowerUp.getDate()).padStart(2, '0')}`)}
                      </div>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>60にちのばいおりずむグラフ</h4>
                      <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '2px', marginTop: '0.5rem' }}>
                        {range.slice(0, 60).map((day, idx) => {
                          const physical = Math.abs(day.state.physical);
                          const emotional = Math.abs(day.state.emotional);
                          const intellectual = Math.abs(day.state.intellectual);
                          return (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center' }}>
                              <div style={{ width: '100%', height: `${(physical / 100) * 60}px`, background: '#90EE90', borderRadius: '2px 2px 0 0' }} title={`からだ: ${day.state.physical}`} />
                              <div style={{ width: '100%', height: `${(emotional / 100) * 60}px`, background: '#FFD700', borderRadius: '2px' }} title={`かんじょう: ${day.state.emotional}`} />
                              <div style={{ width: '100%', height: `${(intellectual / 100) * 60}px`, background: '#87CEEB', borderRadius: '0 0 2px 2px' }} title={`ちせい: ${day.state.intellectual}`} />
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#000' }}>
                        <div><span style={{ display: 'inline-block', width: '15px', height: '15px', background: '#90EE90', borderRadius: '2px' }} /> からだ</div>
                        <div><span style={{ display: 'inline-block', width: '15px', height: '15px', background: '#FFD700', borderRadius: '2px' }} /> かんじょう</div>
                        <div><span style={{ display: 'inline-block', width: '15px', height: '15px', background: '#87CEEB', borderRadius: '2px' }} /> ちせい</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Power Stone Tab - パワーストーン */}
          {fortuneTab === 'powerstone' && (
            <div className="fortune-tab-content fade-in">
              <h3>💎 ぱわーすとーん・らっきーあいてむ</h3>
              {fortuneResult ? (() => {
                const constellationStone = getPowerStoneFromConstellation(fortuneResult.constellation!);
                const numerologyStone = getPowerStoneFromNumerology(fortuneResult.lifePathNumber!);
                const zodiacStone = getPowerStoneFromZodiac(fortuneResult.zodiac!);
                const luckyItems = getLuckyItems(fortuneResult.constellation!, fortuneResult.lifePathNumber!);

                return (
                  <div>
                    <div className="fortune-card">
                      <h4>せいざのぱわーすとーん</h4>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{constellationStone.emoji}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>{constellationStone.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>いみ：</strong>{constellationStone.meaning}</p>
                      <p style={{ color: '#000' }}><strong>こうか：</strong>{constellationStone.effect}</p>
                      <p style={{ color: '#000' }}><strong>いろ：</strong>{constellationStone.color}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>すうじじゅつのぱわーすとーん</h4>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{numerologyStone.emoji}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>{numerologyStone.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>いみ：</strong>{numerologyStone.meaning}</p>
                      <p style={{ color: '#000' }}><strong>こうか：</strong>{numerologyStone.effect}</p>
                      <p style={{ color: '#000' }}><strong>いろ：</strong>{numerologyStone.color}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>えとのぱわーすとーん</h4>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{zodiacStone.emoji}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>{zodiacStone.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>いみ：</strong>{zodiacStone.meaning}</p>
                      <p style={{ color: '#000' }}><strong>こうか：</strong>{zodiacStone.effect}</p>
                      <p style={{ color: '#000' }}><strong>いろ：</strong>{zodiacStone.color}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>らっきーあいてむ</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {luckyItems.map((item, idx) => (
                          <div key={idx} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.3rem' }}>
                            <div style={{ fontSize: '1.5rem' }}>{item.emoji}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>{item.nameHiragana}</div>
                            <div style={{ fontSize: '0.8rem', color: '#000', marginTop: '0.3rem' }}>{item.meaning}</div>
                            <div style={{ fontSize: '0.75rem', color: '#000', marginTop: '0.3rem', opacity: 0.8 }}>{item.whenToUse}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Wish Achievement Tab - 願い事成就度 */}
          {fortuneTab === 'wish' && (
            <div className="fortune-tab-content fade-in">
              <h3>⭐ ねがいごとじょうじゅど</h3>
              {fortuneResult ? (
                <div>
                  <div className="date-input-group">
                    <label className="date-label">ねがいごとのしゅるい</label>
                    <select
                      className="date-input"
                      value={wishType}
                      onChange={(e) => setWishType(e.target.value as typeof wishType)}
                    >
                      <option value="love">れんあい</option>
                      <option value="work">おしごと</option>
                      <option value="health">けんこう</option>
                      <option value="money">おかね</option>
                      <option value="study">べんきょう</option>
                      <option value="friendship">ゆうじょう</option>
                      <option value="family">かぞく</option>
                      <option value="dream">ゆめ</option>
                    </select>
                  </div>
                  {(() => {
                    const achievement = calculateWishAchievement(
                      fortuneResult.constellation!,
                      fortuneResult.lifePathNumber!,
                      fortuneResult.weekday!,
                      fortuneResult.zodiac!,
                      wishType as WishType
                    );
                    const levelColors: Record<string, string> = {
                      excellent: '#FFD700',
                      good: '#90EE90',
                      normal: '#FFA500',
                      challenging: '#FF6B6B',
                    };
                    return (
                      <div className="fortune-card" style={{ marginTop: '1rem', background: levelColors[achievement.level] }}>
                        <h4>{WISH_TYPE_NAMES[achievement.type as WishType]}のねがいごと</h4>
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.9rem', color: '#000' }}>きょうのじょうじゅど</div>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{achievement.today}%</div>
                          <div style={{ width: '100%', height: '30px', background: 'rgba(255,255,255,0.3)', borderRadius: '15px', overflow: 'hidden', marginTop: '0.5rem' }}>
                            <div style={{ width: `${achievement.today}%`, height: '100%', background: '#fff', transition: 'width 0.3s' }} />
                          </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.9rem', color: '#000' }}>こんげつのじょうじゅど</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{achievement.thisMonth}%</div>
                          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
                            <div style={{ width: `${achievement.thisMonth}%`, height: '100%', background: '#fff', transition: 'width 0.3s' }} />
                          </div>
                        </div>
                        <p style={{ marginTop: '0.5rem', color: '#000' }}>{achievement.advice}</p>
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong style={{ color: '#000' }}>らっきーこうどう：</strong>
                          <ul style={{ marginTop: '0.3rem', paddingLeft: '1.5rem', color: '#000' }}>
                            {achievement.luckyActions.map((action, idx) => (
                              <li key={idx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Lucky Time Tab - 今日のラッキータイム */}
          {fortuneTab === 'luckytime' && (
            <div className="fortune-tab-content fade-in">
              <h3>⏰ きょうのらっきーたいむ</h3>
              {fortuneResult ? (() => {
                const luckyTime = calculateLuckyTime(
                  fortuneResult.constellation!,
                  fortuneResult.lifePathNumber!,
                  fortuneResult.weekday!,
                  fortuneResult.zodiac!
                );
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>ベストタイム</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000', marginTop: '0.5rem' }}>{luckyTime.bestTime}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}>このじかんたいに、とくにいいことがおこりそうだよ！</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>じかんたいべつらっきーすこあ</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {luckyTime.timeSlots.map((slot, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.3rem' }}>
                            <div style={{ color: '#000' }}>{slot.time}</div>
                            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                              <span style={{ color: '#000' }}>{'⭐'.repeat(slot.score)}</span>
                              <span style={{ fontSize: '0.8rem', color: '#000', opacity: 0.8 }}>{slot.activity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>そのたのらっきーじょうほう</h4>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ color: '#000' }}><strong>らっきーほうい：</strong>{luckyTime.luckyDirection}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>らっきーカラー：</strong>{luckyTime.luckyColor}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>らっきーナンバー：</strong>{luckyTime.luckyNumber}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>らっきーアクション：</strong>{luckyTime.luckyAction}</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Tarot Tab - タロットカード */}
          {fortuneTab === 'tarot' && (
            <div className="fortune-tab-content fade-in">
              <h3>🃏 たろっとかーど</h3>
              {fortuneResult ? (() => {
                const todayCard = drawTodayCard(parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay));
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>あなたのメインカード</h4>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{todayCard.emoji}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayCard.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>いみ：</strong>{todayCard.meaning}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>アドバイス：</strong>{todayCard.advice}</p>
                      {todayCard.isReversed && (
                        <div style={{ marginTop: '0.3rem', padding: '0.3rem', background: '#FFA500', borderRadius: '0.3rem', color: '#000', fontSize: '0.8rem' }}>
                          ⚠️ ぎゃく
                        </div>
                      )}
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>きょうのカード</h4>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{todayCard.emoji}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayCard.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>いみ：</strong>{todayCard.meaning}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>アドバイス：</strong>{todayCard.advice}</p>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Color Fortune Tab - 色占い */}
          {fortuneTab === 'color' && (
            <div className="fortune-tab-content fade-in">
              <h3>🎨 いろうらない</h3>
              {fortuneResult ? (() => {
                const luckyColor = getLuckyColorFromBirthDate(
                  fortuneResult.constellation!,
                  fortuneResult.lifePathNumber!,
                  fortuneResult.zodiac!
                );
                const todayColor = getTodayColor(
                  fortuneResult.constellation!,
                  fortuneResult.lifePathNumber!,
                  fortuneResult.zodiac!
                );
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>あなたのらっきーカラー</h4>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{luckyColor.emoji}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{luckyColor.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>いみ：</strong>{luckyColor.meaning}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>こうか：</strong>{luckyColor.effect}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>つかうとき：</strong>{luckyColor.whenToUse}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>きょうきるべきカラー</h4>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{todayColor.emoji}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{todayColor.nameHiragana}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>いみ：</strong>{todayColor.meaning}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>こうか：</strong>{todayColor.effect}</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>つかうとき：</strong>{todayColor.whenToUse}</p>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Nine Star Tab - 九星気学 */}
          {fortuneTab === 'ninestar' && (
            <div className="fortune-tab-content fade-in">
              <h3>⭐ きゅうせいきがく</h3>
              {fortuneResult ? (() => {
                const nineStar = getNineStarFromBirthDate(parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay));
                const characteristics = NINE_STAR_CHARACTERISTICS[nineStar];
                const luckyDirection = getTodayLuckyDirection(nineStar);
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>あなたのきゅうせい</h4>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{characteristics.name}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>ごげんそ：</strong>{characteristics.element}</p>
                      <p style={{ color: '#000' }}><strong>らっきーカラー：</strong>{characteristics.color}</p>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>せいかく：</strong>{characteristics.personality}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>きょうのらっきーほうい</h4>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧭</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{luckyDirection}</div>
                      <p style={{ color: '#000', marginTop: '0.5rem' }}>このほういへいくと、いいことがおこりそうだよ！</p>
                      <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>ちゅういほうい：</strong>{characteristics.unluckyDirection}</p>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Fortune Chart Tab - 運勢グラフ */}
          {fortuneTab === 'chart' && (
            <div className="fortune-tab-content fade-in">
              <h3>📈 うんせいグラフ</h3>
              {fortuneResult ? (() => {
                const today = new Date();
                const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                const chartData = generateFortuneChart(
                  fortuneResult.constellation!,
                  fortuneResult.weekday!,
                  startDate,
                  endDate
                );
                return (
                  <div>
                    {chartData.map((category, idx) => {
                      const categoryNames: Record<FortuneCategory, string> = {
                        [FortuneCategory.OVERALL]: 'そうごう',
                        [FortuneCategory.LOVE]: 'れんあい',
                        [FortuneCategory.WORK]: 'おしごと',
                        [FortuneCategory.MONEY]: 'おかね',
                        [FortuneCategory.HEALTH]: 'けんこう',
                      };
                      const trendEmojis = { up: '📈', down: '📉', stable: '➡️' };
                      return (
                        <div key={idx} className="fortune-card" style={{ marginTop: idx > 0 ? '1rem' : 0 }}>
                          <h4>{categoryNames[category.category]}のうんせい</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#000', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>へいきん：{category.average}てん</div>
                            <div>さいこう：{category.max}てん</div>
                            <div>さいてい：{category.min}てん</div>
                            <div>{trendEmojis[category.trend]}</div>
                          </div>
                          <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '2px', marginTop: '0.5rem' }}>
                            {category.data.slice(0, 60).map((point, i) => (
                              <div
                                key={i}
                                style={{
                                  flex: 1,
                                  height: `${(point.value / 5) * 100}%`,
                                  background: point.value >= 4 ? '#90EE90' : point.value >= 3 ? '#FFD700' : '#FF6B6B',
                                  borderRadius: '2px',
                                }}
                                title={`${point.date}: ${point.value}てん`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Four Pillars Tab - 四柱推命 */}
          {fortuneTab === 'fourpillars' && (
            <div className="fortune-tab-content fade-in">
              <h3>🔮 よちゅうすいめい</h3>
              {fortuneResult ? (() => {
                const fourPillars = calculateFourPillars(parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay));
                return (
                  <div>
                    <div className="fortune-card">
                      <h4>よちゅう</h4>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ color: '#000' }}><strong>ねんちゅう：</strong>{TENKAN_NAMES[fourPillars.year.tenkan]} {JYUNISHI_NAMES[fourPillars.year.jyunishi]}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>げつちゅう：</strong>{TENKAN_NAMES[fourPillars.month.tenkan]} {JYUNISHI_NAMES[fourPillars.month.jyunishi]}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>にっちゅう：</strong>{TENKAN_NAMES[fourPillars.day.tenkan]} {JYUNISHI_NAMES[fourPillars.day.jyunishi]}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>じちゅう：</strong>{TENKAN_NAMES[fourPillars.hour.tenkan]} {JYUNISHI_NAMES[fourPillars.hour.jyunishi]}</div>
                      </div>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>せいかくぶんせき</h4>
                      <p style={{ color: '#000' }}>{fourPillars.personality}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>うんせい</h4>
                      <p style={{ color: '#000' }}>{fourPillars.fortune}</p>
                    </div>
                    <div className="fortune-card" style={{ marginTop: '1rem' }}>
                      <h4>あいしょう</h4>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ color: '#000' }}><strong>さいこう：</strong>{fourPillars.compatibility.excellent.join(', ')}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>いい：</strong>{fourPillars.compatibility.good.join(', ')}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>ふつう：</strong>{fourPillars.compatibility.normal.join(', ')}</div>
                        <div style={{ color: '#000', marginTop: '0.3rem' }}><strong>チャレンジ：</strong>{fourPillars.compatibility.challenging.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="fortune-placeholder">
                  <p>{getThemeText(theme, 'FORTUNE_DIAGNOSIS_DESC')}</p>
                </div>
              )}
            </div>
          )}

          {/* Dream Fortune Tab - 夢占い */}
          {fortuneTab === 'dream' && (
            <div className="fortune-tab-content fade-in">
              <h3>💤 ゆめうらない</h3>
              <div className="fortune-input-section">
                <div className="date-input-group">
                  <label className="date-label">みたゆめのないよう</label>
                  <input
                    type="text"
                    className="date-input"
                    value={dreamKeyword}
                    onChange={(e) => setDreamKeyword(e.target.value)}
                    placeholder="例: ねこ、はな、みず、など"
                  />
                </div>
                <button
                  className="fortune-calc-btn"
                  onClick={() => {
                    if (!dreamKeyword) {
                      alert('ゆめのないようをにゅうりょくしてね！');
                      return;
                    }
                    const dreamType = getDreamTypeFromKeyword(dreamKeyword);
                    if (!dreamType) {
                      alert('ゆめのないようがにんしきできませんでした。ちがうことばをためしてみてね！');
                      return;
                    }
                    const result = interpretDream(dreamType);
                    setDateResult(JSON.stringify(result, null, 2));
                    onCreateBlock(`${dreamKeyword}のゆめ`);
                  }}
                >
                  ゆめをかいどく
                </button>

                {dateResult && (() => {
                  try {
                    const result: DreamFortuneResult = JSON.parse(dateResult);
                    const fortuneColors: Record<string, string> = {
                      excellent: '#FFD700',
                      good: '#90EE90',
                      normal: '#FFA500',
                      challenging: '#FF6B6B',
                    };
                    return (
                      <div className="fortune-card" style={{ marginTop: '1rem', background: fortuneColors[result.fortune] }}>
                        <h4>{DREAM_TYPE_NAMES[result.dreamType]}のゆめ</h4>
                        <p style={{ color: '#000', marginTop: '0.5rem' }}><strong>いみ：</strong>{result.meaning}</p>
                        <p style={{ color: '#000', marginTop: '0.3rem' }}><strong>アドバイス：</strong>{result.advice}</p>
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.3)', borderRadius: '0.3rem', color: '#000' }}>
                          <strong>うんせい：</strong>
                          {result.fortune === 'excellent' ? '🌟 とってもいい！' :
                            result.fortune === 'good' ? '✨ いい！' :
                              result.fortune === 'normal' ? '⭐ ふつう' : '⚠️ ちょっとチャレンジ'}
                        </div>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === BlockType.CART && (
        <CartCalculator onCreateBlock={onCreateBlock} theme={theme} />
      )}
    </div>
  );
}

// CARTモード用のコンポーネント
function CartCalculator({ onCreateBlock, theme = 'kids' }: { onCreateBlock: (formula: string) => void; theme?: 'kids' | 'business' }) {
  const [cartTab, setCartTab] = useState<CartTab>('list');
  const [cartItems, setCartItems] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [taxRate, setTaxRate] = useState(10); // 10% or 8%
  const [discountRate, setDiscountRate] = useState(0);
  const [cartHistory, setCartHistory] = useState<Array<{ id: string; date: string; total: number; items: typeof cartItems }>>([]);

  const addItem = () => {
    if (!newItemName || !newItemPrice || parseFloat(newItemPrice) <= 0) {
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      quantity: parseInt(newItemQuantity) || 1,
    };
    setCartItems([...cartItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQuantity('1');
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (discountRate / 100);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return (subtotal - discount) * (taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const saveCart = () => {
    const total = calculateTotal();
    const newHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ja-JP'),
      total,
      items: [...cartItems],
    };
    setCartHistory([newHistory, ...cartHistory].slice(0, 10));
    onCreateBlock(`カート合計: ¥${Math.round(total).toLocaleString()}`);
    setCartItems([]);
    setDiscountRate(0);
  };

  const deleteHistory = (id: string) => {
    setCartHistory(cartHistory.filter(h => h.id !== id));
  };

  return (
    <div className="calculator-panel">
      <h2 style={{ marginBottom: '1rem', color: '#000' }}>🛒 {getThemeText(theme, 'CART_TITLE')}</h2>

      <div className="cart-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          className={`cart-tab ${cartTab === 'list' ? 'active' : ''}`}
          onClick={() => setCartTab('list')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            background: cartTab === 'list' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
            color: cartTab === 'list' ? '#fff' : '#000',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: cartTab === 'list' ? 'bold' : 'normal',
          }}
        >
          {getThemeText(theme, 'CART_LIST')}
        </button>
        <button
          className={`cart-tab ${cartTab === 'calc' ? 'active' : ''}`}
          onClick={() => setCartTab('calc')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            background: cartTab === 'calc' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
            color: cartTab === 'calc' ? '#fff' : '#000',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: cartTab === 'calc' ? 'bold' : 'normal',
          }}
        >
          {getThemeText(theme, 'CART_CALC')}
        </button>
        <button
          className={`cart-tab ${cartTab === 'history' ? 'active' : ''}`}
          onClick={() => setCartTab('history')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            background: cartTab === 'history' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
            color: cartTab === 'history' ? '#fff' : '#000',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: cartTab === 'history' ? 'bold' : 'normal',
          }}
        >
          📋 {getThemeText(theme, 'CART_HISTORY')}
        </button>
      </div>

      {cartTab === 'list' && (
        <div style={{ color: '#000' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'CART_ADD_ITEM')}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder={getThemeText(theme, 'CART_ITEM_NAME')}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  flex: '1',
                  minWidth: '120px',
                }}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <input
                type="number"
                placeholder={getThemeText(theme, 'CART_ITEM_PRICE')}
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '100px',
                }}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <input
                type="number"
                placeholder={getThemeText(theme, 'CART_QUANTITY')}
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '80px',
                }}
                min="1"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                onClick={addItem}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {getThemeText(theme, 'CART_ADD')}
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {getThemeText(theme, 'CART_EMPTY')}
            </div>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'CART_ITEMS')} ({cartItems.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: '1', minWidth: '150px' }}>
                      <strong>{item.name}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>¥{item.price.toLocaleString()}</span>
                      <span>×</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#f0f0f0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#f0f0f0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'right' }}>
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: '#ff6b6b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {cartTab === 'calc' && (
        <div style={{ color: '#000' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'CART_SETTINGS')}</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>{getThemeText(theme, 'CART_TAX_RATE')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setTaxRate(8)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: taxRate === 8 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
                      color: taxRate === 8 ? '#fff' : '#000',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    8%
                  </button>
                  <button
                    onClick={() => setTaxRate(10)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: taxRate === 10 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.9)',
                      color: taxRate === 10 ? '#fff' : '#000',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    10%
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>{getThemeText(theme, 'CART_DISCOUNT_RATE')}</label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  min="0"
                  max="100"
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '100px',
                  }}
                />
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {getThemeText(theme, 'CART_ADD_ITEM_PROMPT')}
            </div>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{getThemeText(theme, 'CART_SUBTOTAL')}:</span>
                  <strong>¥{Math.round(calculateSubtotal()).toLocaleString()}</strong>
                </div>
                {discountRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4caf50' }}>
                    <span>{getThemeText(theme, 'CART_DISCOUNT')} ({discountRate}%):</span>
                    <strong>-¥{Math.round(calculateDiscount()).toLocaleString()}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{getThemeText(theme, 'CART_TAX')} ({taxRate}%):</span>
                  <strong>¥{Math.round(calculateTax()).toLocaleString()}</strong>
                </div>
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '2px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  <span>{getThemeText(theme, 'CART_TOTAL')}:</span>
                  <span>¥{Math.round(calculateTotal()).toLocaleString()}</span>
                </div>
                <button
                  onClick={saveCart}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  💾 マグネットに保存
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {cartTab === 'history' && (
        <div style={{ color: '#000' }}>
          <h3 style={{ color: '#000', marginBottom: '0.5rem' }}>{getThemeText(theme, 'CART_HISTORY_TITLE')}</h3>
          {cartHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              {getThemeText(theme, 'CART_HISTORY_EMPTY')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cartHistory.map((history) => (
                <div
                  key={history.id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <strong>{history.date}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#667eea' }}>
                        ¥{Math.round(history.total).toLocaleString()}
                      </strong>
                      <button
                        onClick={() => deleteHistory(history.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#ff6b6b',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {history.items.length}個のアイテム
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
