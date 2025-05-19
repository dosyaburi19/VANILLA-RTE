# VANILLA-RTE

Vanilla JS をベースにして、リッチテキストエディタを作ってみました。

## 対応言語

[english](README.md) | [한국어](README.ko.md)

## イントロダクション

こんにちは。dosyaburi19 です。
このライブラリは私の初めてのライブラリです。ご利用いただきありがとうございます。

まず、このライブラリは Vanilla JS のみで構成されており、他のライブラリへの依存性はありません。

まだ不十分な点があるかもしれませんが、今後機能を追加してさらに完成度を高めていきたいと思います。

追伸) 日本語が苦手です。(翻訳機を使っています...)

## インストール

```bash
npm install vanilla-rte
```

## 使い方

VANILLA-RTE は、`createEditor`のような別途の**初期化関数を持たない**ユーティリティ関数形式のライブラリです。HTML の`contentEditable`属性を持つ要素に直接接続して使用します。

### Including the Library

ライブラリをプロジェクトに含める方法です。ビルドされた JavaScript ファイルの提供方法に応じて選択してください。

**オプション 1: `<script>` タグを使用 (最もシンプルな方法)**

```html
<script src="path/to/your/vanilla-rte.min.js"></script>
```

_この方法を使用すると、enrichText および onDeleteKeyUpProtectedLine 関数がグローバルに利用可能になります。_

**オプション 2: モジュールバンドラーを使用 (npm でインストールした場合に一般的)**

```javascript
// JavaScriptまたはTypeScriptファイルでインポートして使用します。
import { enrichText, onDeleteKeyUpProtectedLine } from "vanilla-rte";
```

### Core Functions

このライブラリが提供する主要な関数は以下の通りです。これらの関数は、`contentEditable`属性を持つ要素および現在の選択範囲に対して動作します。

#### `enrichText(styleName: string, styleValue: string);`

-   **役割:** `contentEditable`属性を持つ要素内で、**現在ドラッグ（選択）されているテキスト範囲**に CSS スタイルを適用します。
-   **動作方法:** ドラッグされたテキストを`<span>`タグで囲み、その`<span>`タグに指定された CSS プロパティ(`styleName`)と値(`styleValue`)を直接適用します。
-   **引数:**
    -   `styleName` (string): 適用する CSS プロパティ名（例: `"color"`, `"font-size"`, `"font-weight"`）。
    -   `styleValue` (string): 適用する CSS プロパティの値（例: `"#FF0000"`, `"34px"`, `"bold"`）。
-   **使い方:** 通常、テキストを選択した後、ボタンのクリックイベントハンドラーなどからこの関数を呼び出して使用します。この関数を呼び出す際に、対象となる`contentEditable` div 要素を別途渡す必要はありません。（現在アクティブな/選択範囲がある`contentEditable`領域に対して動作します。）

#### `onDeleteKeyUpProtectedLine(event: KeyboardEvent);`

-   **役割:** Delete または Backspace キーが押された際に、`contentEditable`属性を持つ要素内の特定の構造（例: 空の`<div><br></div>`のようなデフォルトの行構造）が破損するのを防ぎ、エディターの安定した構造を維持するのに役立ちます。これは`contentEditable`使用時によく発生する問題を解決します。
-   **引数:**
    -   `event` (KeyboardEvent): `onkeyup`イベントハンドラーから渡される KeyboardEvent オブジェクト。この関数はイベントオブジェクトを引数として受け取る必要があります。
-   **使い方:** この保護機能を適用したい**各`contentEditable` div 要素**の`onkeyup`イベントハンドラーとして、この関数を**手動で割り当てる**必要があります。

#### `onPasteTextProtectedLine(event: ClipboardEvent);`

-   **役割:** `contentEditable`要素の`onpaste`イベントを処理する関数です。エディターが各行を個別の`div`要素で構成する必要がある特定のフォーマットを持っている場合、貼り付けられたコンテンツを処理して、このフォーマットが維持されるようにします。厳密には必須ではありませんが、フォーマットが破損することによる他のエディター機能（例：`enrich`関数）の誤動作を防ぐために使用されます。
-   **引数:**
    -   `event` (ClipboardEvent): `onpaste`イベントハンドラーから渡される貼り付けイベントオブジェクトです。この関数は必ずこのイベントオブジェクトを引数として受け取る必要があります。
-   **使い方:** この関数は、貼り付け時にこの特定のフォーマット（`1行につき1つのdiv`）を強制したい`contentEditable`要素の`onpaste`イベントハンドラーとして割り当てる必要があります。他のウェブサイトや外部ソースからコピーされた複雑なフォーマットのテキストを貼り付ける場合、期待通りに動作しない場合や、フォーマットが完全に維持されない場合があることにご注意ください。

### Full Example

以下は、HTML の設定、ライブラリの組み込み、および主要な関数を実際に接続して使用する完全なサンプルコードです。この例を通じて、VANILLA-RTE の基本的な使用フローを把握できます。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>VANILLA-RTE Usage Example</title>
        <meta charset="utf-8" />
        <style>
            #rich-text-editor {
                border: 1px solid #ccc;
                padding: 10px;
                min-height: 150px; /* 最小高さ設定 */
                /* エディター領域がフォーカスされた際の視覚的な表示 (オプション) */
                outline: none;
                /* line-heightなどでデフォルトの<br>の高さを調整可能 */
                line-height: 1.5;
            }
            /* 注意: enrichTextはデフォルトでインラインスタイルを適用します。 */
            /* 必要に応じて、ライブラリをCSSクラスを適用するように変更することも可能です。 */
        </style>
    </head>
    <body>
        <h1>VANILLA-RTE Demo</h1>

        <button id="btn-red-color">Apply Red Color</button>
        <button id="btn-bold">Apply Bold</button>
        <button id="btn-large-font">Apply Large Font (34px)</button>

        <hr />
        <h2>Editor Area</h2>
        <div id="rich-text-editor" contenteditable="true">
            <div>ここに内容を入力してください。</div>
            <div>
                テキストを**ドラッグ**して、上記のボタンをクリックしてみてください。
            </div>
        </div>

        <script src="path/to/your/vanilla-rte.min.js"></script>
        <script>
            // このスクリプトは、<script src="...">方式でライブラリが組み込まれ、
            // enrichTextおよびonDeleteKeyUpProtectedLine関数がグローバルに利用可能であることを前提としています。
            // import方式を使用する場合は、このロジックをインポートするファイル内に記述する必要があります。

            // 1. contentEditable div要素を取得します。
            const rteElement = document.getElementById("rich-text-editor");

            // 2. onDeleteKeyUpProtectedLine関数をonkeyupイベントに手動で接続します。
            // この保護機能を適用したいすべてのcontentEditable divに対してこの作業を行う必要があります。
            rteElement.onkeyup = onDeleteKeyUpProtectedLine;
            rteElement.onpaste = onPasteTextProtectedLine;

            // 3. 書式適用ボタンを取得します。
            const redColorBtn = document.getElementById("btn-red-color");
            const boldBtn = document.getElementById("btn-bold");
            const largeFontBtn = document.getElementById("btn-large-font");

            // 4. ボタンがクリックされた際にenrichText関数を呼び出すイベントハンドラーを接続します。
            // enrichTextはドラッグされた領域にスタイルを適用するため、クリック時にテキストがドラッグされている場合にのみ効果があります。
            redColorBtn.onclick = () => enrichText("color", "#FF0000");
            boldBtn.onclick = () => enrichText("font-weight", "bold"); // 例: 太字を適用
            largeFontBtn.onclick = () => enrichText("font-size", "34px");
        </script>
    </body>
</html>
```
