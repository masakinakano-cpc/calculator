# NovaCalc 開発引継書

## プロジェクト概要

**プロジェクト名**: NovaCalc (けいさんノート)
**目的**: 小学生向けのビジュアル計算アプリ
**技術スタック**: React 19.2.0 + TypeScript + Vite + Blockly
**リポジトリ**: https://github.com/masakinakano-cpc/calculator
**開発環境**: http://localhost:3001/

---

## 最新の実装状況（2025-10-31時点）

### ✅ 完了している機能

1. **電卓機能**
   - 基本的な四則演算（+, -, ×, ÷）
   - ブロック参照による再利用（#ブロックID形式）
   - キーボード入力対応
   - **2回連続Enter（1秒以内）で計算実行** ← 誤操作防止機能

2. **マグネットシステム（C-Block）**
   - 計算結果が「マグネット」として黒板に自動配置
   - ドラッグ&ドロップで自由に配置可能
   - メモ機能（各マグネットにメモを追加可能）
   - 複数選択・一括削除対応
   - 依存関係の可視化（選択時に線で表示）

3. **ブロックプログラミング機能（Blockly統合）** ← 最新実装
   - Google Blockly統合完了
   - ポップでおしゃれなUIデザイン
   - 現在のブロック種類：
     - すうじ（math_number）
     - けいさん（math_arithmetic）
     - へんすう（variables_set, variables_get）
   - ワークスペース背景：パステルグラデーション＋アニメーション
   - カテゴリーボタン：丸みのあるカラフルなボタンデザイン

4. **設定機能**
   - 通貨記号（¥）の表示ON/OFF切り替え ← 最新追加
   - 小数点以下の桁数設定
   - 3桁カンマ区切り設定
   - 整数時は`.00`を表示しない仕様 ← 改善済み

5. **UI/UX**
   - 黒板風デザイン
   - ヘルプモーダル（?ボタンから表示）
   - **ブロックドロップ時の自動計算** ← 改善済み
     - 例: 「72+171+」の状態でマグネット「6」をドロップ → 「249」が自動表示
     - 途中式は「72+171+6」と表示（「=」は付かない）

6. **データ永続化**
   - IndexedDB (Dexie) でブロック・設定を保存
   - ブラウザを閉じても計算履歴が残る

---

## ファイル構成

```
電卓アプリ/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx         # 電卓UI（2回Enter検知、ブロックドロップ処理）
│   │   ├── Canvas.tsx              # マグネット配置キャンバス
│   │   ├── CBlock.tsx              # マグネットコンポーネント
│   │   └── BlocklyPlayground.tsx   # Blocklyエディタ（ブロックプログラミング）
│   ├── engine/
│   │   ├── calculator.ts           # 計算エンジン（整数時.00非表示）
│   │   ├── parser.ts               # 式のパース処理
│   │   └── dependencyGraph.ts      # 依存関係管理
│   ├── database/
│   │   └── index.ts                # IndexedDB操作（showCurrencySymbol追加済み）
│   ├── hooks/
│   │   └── useBlocks.ts            # ブロック管理フック
│   ├── utils/
│   │   └── helpers.ts              # ヘルパー関数（displayNumber更新済み）
│   ├── types/
│   │   └── index.ts                # 型定義（showCurrencySymbol追加済み）
│   ├── App.tsx                     # メインアプリ（モーダル管理、通貨トグル）
│   └── App.css                     # スタイル（Blocklyカスタムスタイル追加済み 1042-1167行目）
├── BLOCKLY_SPEC.md                 # Blockly拡張仕様書 ← NEW
├── HANDOVER.md                     # この引継書 ← NEW
└── package.json
```

---

## 重要な実装箇所

### 1. 2回連続Enterでの計算実行
**ファイル**: `src/components/Calculator.tsx`
**場所**: `useRef<number>(0)` と `handleKeyDown` 内の処理

```typescript
const lastEnterTimeRef = useRef<number>(0);

if (e.key === 'Enter') {
  const now = Date.now();
  const timeSinceLastEnter = now - lastEnterTimeRef.current;
  if (timeSinceLastEnter < 1000) {
    handleEquals(); // 1秒以内の2回目 → 実行
    lastEnterTimeRef.current = 0;
  } else {
    lastEnterTimeRef.current = now; // 1回目をタイムスタンプ記録
  }
}
```

### 2. ブロックドロップ時の自動計算
**ファイル**: `src/components/Calculator.tsx`
**場所**: `handleDrop` 関数内

```typescript
if (waitingForOperand && input.length > 0) {
  const fullFormula = input + blockValue;
  const result = calculateFormula(fullFormula, blockValues);
  if (result.success && result.value) {
    setDisplay(result.value);
    setInput(fullFormula);  // 「=」は付けない
    setWaitingForOperand(false);
  }
}
```

### 3. 整数時の.00非表示
**ファイル**: `src/engine/calculator.ts`
**場所**: `formatNumber` 関数内

```typescript
const isInteger = decimal.modulo(1).equals(0);
if (isInteger) {
  formatted = decimal.toFixed(0);  // 整数なら小数点なし
} else {
  formatted = decimal.toFixed(decimalPlaces);
}
```

### 4. 通貨記号のON/OFF切り替え
**ファイル**: `src/utils/helpers.ts` (displayNumber関数)

```typescript
const effectiveCurrencySymbol = settings?.showCurrencySymbol
  ? settings?.currencySymbol
  : '';
```

**ファイル**: `src/App.tsx` (トグルボタン)

```typescript
<button
  className="currency-toggle-btn"
  onClick={() => updateSettings({ showCurrencySymbol: !settings?.showCurrencySymbol })}
  style={{
    backgroundColor: settings?.showCurrencySymbol ? '#95e1d3' : '#ddd',
    color: settings?.showCurrencySymbol ? 'white' : '#666',
  }}
>
  ¥
</button>
```

### 5. Blocklyのカスタムスタイル
**ファイル**: `src/App.css`
**場所**: 1042-1167行目

- カテゴリーボタンのグラデーション（すうじ=ブルー、けいさん=グリーン、へんすう=パープル）
- ホバー・クリックアニメーション
- ワークスペース背景のアニメーショングラデーション
- ドット模様のオーバーレイ

---

## 次回の作業内容（予定）

### 🎯 目標: Blocklyブロックの種類を増やす

詳細は **BLOCKLY_SPEC.md** を参照してください。

推奨する追加順序：
1. **すうがく** (数学関数：√, sin, cos, π など)
2. **じょうけん** (条件分岐：if/else)
3. **くりかえし** (ループ：繰り返し処理)
4. **ひかく** (比較・論理演算)
5. **もじ** (テキスト操作)
6. **リスト** (配列操作)

### 実装手順

1. `src/components/BlocklyPlayground.tsx` の `toolbox` オブジェクト（24-65行目）にカテゴリーとブロックを追加
2. `src/App.css` の1100行目以降に新しいカテゴリーの色スタイルを追加
3. 動作確認：ブロックを組み立てて「じっこう」ボタンで実行
4. 問題なければコミット＆プッシュ

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:3001/

# ビルド
npm run build

# プレビュー
npm run preview

# Git操作
git status
git add .
git commit -m "メッセージ"
git push
```

---

## よくある問題と対処法

### 1. Blocklyのツールボックスが表示されない
- **原因**: モーダルサイズが小さすぎる
- **対処**: `src/App.css` の `.blockly-modal` を `width: 95vw; height: 95vh;` に設定済み
- **追加対処**: `BlocklyPlayground.tsx` で `Blockly.svgResize(workspace)` を呼び出し済み

### 2. ブロックドロップで計算式に「=」が入る
- **原因**: 過去の実装ミス
- **対処済み**: `setInput(fullFormula + '=')` → `setInput(fullFormula)` に修正済み

### 3. 小数点が.00で表示される
- **原因**: 常に2桁表示していた
- **対処済み**: `calculator.ts` の `formatNumber` で整数判定を追加済み

### 4. React 19とBlocklyの互換性エラー
- **対処済み**: `react-blockly` ではなく、`blockly` コアライブラリを直接使用

---

## デザイン仕様

### カラーパレット

- **黒板**: `#2d5016` (緑), `#1a3010` (濃い緑)
- **木枠**: `#8b6f47` (茶色)
- **マグネット**:
  - 赤: `#ff6b6b`
  - 青: `#4ecdc4`
  - 黄: `#ffe66d`
  - 緑: `#95e1d3`
  - 紫: `#c7b8ea`
  - オレンジ: `#ffa726`

### Blocklyカテゴリー色

- すうじ (Number): `#5C81A6` → CSS: `#4fc3f7` (明るいブルー)
- けいさん (Math): `#5CA65C` → CSS: `#66bb6a` (フレッシュグリーン)
- へんすう (Variables): `#A55C9C` → CSS: `#ba68c8` (ポップパープル)

---

## 連絡事項

### Git管理
- **リポジトリ**: https://github.com/masakinakano-cpc/calculator
- **ブランチ**: `main`
- **最新コミット**: "ブロックプログラミングUIをポップでおしゃれにリデザイン" (bc5e177)

### 未実装の機能（将来の課題）
- [ ] 計算履歴のエクスポート/インポート
- [ ] マグネットのグループ化機能
- [ ] より高度な数式（分数、べき乗など）の視覚的入力
- [ ] スマホ対応（レスポンシブデザイン）
- [ ] Blocklyブロックの種類拡張 ← **次回の作業**

---

## まとめ

次回は **BLOCKLY_SPEC.md** を参考に、Blocklyのブロックを追加してください。
特に「すうがく」カテゴリー（√, sin, cos, π など）から始めるのがおすすめです。

実装場所は `src/components/BlocklyPlayground.tsx` の24-65行目のみで、
Blocklyの標準ブロックを使う限り、追加のコード生成処理は不要です。

何かあればこのドキュメントと `BLOCKLY_SPEC.md` を参照してください！

---

**作成日**: 2025-10-31
**作成者**: Claude Code
**バージョン**: v1.0
