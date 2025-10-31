# Blocklyブロック拡張仕様書

## 現状の実装

### 現在のブロック構成

BlocklyPlayground.tsx の `toolbox` で定義されています（24-65行目）

現在は以下の3カテゴリー・4種類のブロックのみ：

1. **すうじ** (数字カテゴリー - ブルー #5C81A6)
   - `math_number`: 数値入力ブロック

2. **けいさん** (計算カテゴリー - グリーン #5CA65C)
   - `math_arithmetic`: 四則演算ブロック（+, -, ×, ÷）

3. **へんすう** (変数カテゴリー - パープル #A55C9C)
   - `variables_set`: 変数に値を代入
   - `variables_get`: 変数の値を取得

### 動作フロー

1. ユーザーがブロックを組み立てる
2. 「じっこう」ボタンをクリック
3. `javascriptGenerator.workspaceToCode()` でJavaScriptコードを生成
4. `eval()` で実行して結果を取得
5. 結果が数値なら、`onCreateBlock(result.toString())` で電卓アプリのマグネットを作成

---

## 次回追加したいブロック候補

### 1. 数学関数カテゴリー「すうがく」(オレンジ #FF9800)

```javascript
{
  kind: 'category',
  name: 'すうがく',
  colour: '#FF9800',
  contents: [
    {
      kind: 'block',
      type: 'math_round',  // 四捨五入
    },
    {
      kind: 'block',
      type: 'math_single',  // √, 絶対値, -, ln, log10, e^, 10^
      fields: {
        OP: 'ROOT'  // デフォルトは平方根
      }
    },
    {
      kind: 'block',
      type: 'math_trig',  // sin, cos, tan, asin, acos, atan
      fields: {
        OP: 'SIN'
      }
    },
    {
      kind: 'block',
      type: 'math_constant',  // π, e, φ, √2, √½, ∞
      fields: {
        CONSTANT: 'PI'
      }
    },
  ],
}
```

### 2. 比較・論理カテゴリー「ひかく」(ライトブルー #03A9F4)

```javascript
{
  kind: 'category',
  name: 'ひかく',
  colour: '#03A9F4',
  contents: [
    {
      kind: 'block',
      type: 'logic_compare',  // =, ≠, <, ≤, >, ≥
    },
    {
      kind: 'block',
      type: 'logic_operation',  // AND, OR
    },
    {
      kind: 'block',
      type: 'logic_negate',  // NOT
    },
    {
      kind: 'block',
      type: 'logic_boolean',  // true/false
    },
  ],
}
```

### 3. 条件分岐カテゴリー「じょうけん」(イエロー #FFEB3B)

```javascript
{
  kind: 'category',
  name: 'じょうけん',
  colour: '#FFEB3B',
  contents: [
    {
      kind: 'block',
      type: 'controls_if',  // if / if-else
    },
    {
      kind: 'block',
      type: 'logic_ternary',  // 三項演算子 (test ? if_true : if_false)
    },
  ],
}
```

### 4. ループカテゴリー「くりかえし」(ライトグリーン #8BC34A)

```javascript
{
  kind: 'category',
  name: 'くりかえし',
  colour: '#8BC34A',
  contents: [
    {
      kind: 'block',
      type: 'controls_repeat_ext',  // n回繰り返し
      inputs: {
        TIMES: {
          shadow: {
            type: 'math_number',
            fields: { NUM: 10 }
          }
        }
      }
    },
    {
      kind: 'block',
      type: 'controls_whileUntil',  // while / until
    },
    {
      kind: 'block',
      type: 'controls_for',  // カウンターループ
      inputs: {
        FROM: {
          shadow: { type: 'math_number', fields: { NUM: 1 } }
        },
        TO: {
          shadow: { type: 'math_number', fields: { NUM: 10 } }
        },
        BY: {
          shadow: { type: 'math_number', fields: { NUM: 1 } }
        }
      }
    },
  ],
}
```

### 5. テキストカテゴリー「もじ」(ピンク #E91E63)

```javascript
{
  kind: 'category',
  name: 'もじ',
  colour: '#E91E63',
  contents: [
    {
      kind: 'block',
      type: 'text',  // 文字列
    },
    {
      kind: 'block',
      type: 'text_join',  // 文字列結合
    },
    {
      kind: 'block',
      type: 'text_length',  // 長さ
    },
    {
      kind: 'block',
      type: 'text_isEmpty',  // 空チェック
    },
  ],
}
```

### 6. リストカテゴリー「リスト」(ディープパープル #673AB7)

```javascript
{
  kind: 'category',
  name: 'リスト',
  colour: '#673AB7',
  contents: [
    {
      kind: 'block',
      type: 'lists_create_with',  // リスト作成
      extraState: {
        itemCount: 3  // デフォルト3要素
      }
    },
    {
      kind: 'block',
      type: 'lists_length',  // リストの長さ
    },
    {
      kind: 'block',
      type: 'lists_isEmpty',  // 空チェック
    },
    {
      kind: 'block',
      type: 'lists_indexOf',  // インデックス検索
    },
    {
      kind: 'block',
      type: 'lists_getIndex',  // 要素取得
    },
  ],
}
```

---

## カスタムブロック作成例

もし標準ブロックにない特殊な計算（例：消費税計算、割引計算）を追加したい場合：

```javascript
// 消費税計算ブロックの定義例
Blockly.Blocks['calc_tax'] = {
  init: function() {
    this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('ねだん');
    this.appendValueInput('TAX_RATE')
        .setCheck('Number')
        .appendField('しょうひぜい');
    this.appendDummyInput()
        .appendField('%');
    this.setOutput(true, 'Number');
    this.setColour('#4CAF50');
    this.setTooltip('消費税込みの金額を計算します');
  }
};

// JavaScript生成コード
javascriptGenerator['calc_tax'] = function(block) {
  const amount = javascriptGenerator.valueToCode(block, 'AMOUNT', javascriptGenerator.ORDER_ATOMIC) || '0';
  const taxRate = javascriptGenerator.valueToCode(block, 'TAX_RATE', javascriptGenerator.ORDER_ATOMIC) || '10';
  const code = `(${amount} * (1 + ${taxRate} / 100))`;
  return [code, javascriptGenerator.ORDER_MULTIPLICATION];
};
```

---

## 実装時の注意点

### 1. ブロックの追加場所
- **ファイル**: `src/components/BlocklyPlayground.tsx`
- **場所**: 24-65行目の `toolbox` オブジェクト

### 2. 色の管理
- 各カテゴリーに固有の色を割り当て
- CSS (`src/App.css` 1102行目以降) でカテゴリーボタンのスタイルを追加

### 3. JavaScript生成の確認
- Blocklyの標準ブロックは自動的にJavaScript生成対応済み
- カスタムブロックを作る場合のみ、生成コードを定義する必要あり

### 4. eval()のセキュリティ
- 現在は`eval()`を使用しているが、教育用途なので問題なし
- 将来的により安全な実装にする場合は、許可されたコードのみ実行する仕組みを検討

### 5. エラーハンドリング
- 現在は`try-catch`で基本的なエラー処理済み (108-136行目)
- ブロックが組み立てられていない場合のメッセージ表示済み

---

## 推奨する追加順序

1. **すうがく** (数学関数) - 教育的価値が高く、すぐ使える
2. **じょうけん** (条件分岐) - プログラミング学習の基本
3. **くりかえし** (ループ) - より高度な計算が可能に
4. **ひかく** (比較・論理) - 条件分岐に必要
5. **もじ** (テキスト) - 応用的な使い方
6. **リスト** (配列) - より高度なプログラミング

---

## 参考リンク

- Blockly公式ドキュメント: https://developers.google.com/blockly
- 標準ブロック一覧: https://developers.google.com/blockly/guides/configure/web/toolbox
- カスタムブロック作成: https://developers.google.com/blockly/guides/create-custom-blocks/overview
