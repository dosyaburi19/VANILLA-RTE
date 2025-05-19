# VANILLA-RTE

Vanilla-JS 기반으로 리치 텍스트 에디터를 만들어 보았습니다.

## 다른 언어어

[english](README.md) | [日本語](README.ja.md)

## 소개

안녕하세요. dosyaburi19 입니다.
제 첫 라이브러리이고, 사용해주서셔 정말 감사합니다.

먼저, 이 라이브러리는 오직 vanilla JavaScript 로 만들었으며, 외부 의존성이 없는 라이브러리입니다.

아직 완벽하지는 않지만, 앞으로 기능 추가를 하여 더욱 완성도 높은 라이브러리로 만들겠습니다.

감사합니다.

## 인스톨

```bash
npm install vanilla-rte
```

## 사용법법

VANILLA-RTE는 별도의 `createEditor`와 같은 **초기화 함수가 없는** 유틸리티 함수 형태의 라이브러리입니다. HTML의 `contentEditable` 속성을 가진 요소에 직접 연결하여 사용합니다.

### Including the Library

라이브러리를 프로젝트에 포함시키는 방법입니다. 빌드된 JavaScript 파일을 제공하는 방식에 따라 선택하세요.

**옵션 1: `<script>` 태그 사용 (가장 간단한 방식)**

```html
<script src="path/to/your/vanilla-rte.min.js"></script>
```

**옵션 2: 모듈 번들러 사용 (npm 설치 시 일반적)**

```javascript
// JavaScript 또는 TypeScript 파일에서 import 하여 사용
import { enrichText, onDeleteKeyUpProtectedLine } from "vanilla-rte";
```

### Core Functions

이 라이브러리가 제공하는 주요 함수는 다음과 같습니다. 이 함수들은 `contentEditable` 속성을 가진 요소 및 현재 선택 영역에 대해 작동합니다.

#### `enrichText(styleName: string, styleValue: string);`

-   **역할:** `contentEditable` 속성을 가진 요소 안에서 **현재 드래그(선택)된 텍스트 범위**에 CSS 스타일을 적용합니다.
-   **동작 방식:** 드래그된 텍스트를 `<span>` 태그로 감싼 후, 해당 `<span>` 태그에 지정된 CSS 속성(`styleName`)과 값(`styleValue`)을 직접 적용합니다.
-   **인자:**
    -   `styleName` (string): 적용할 CSS 속성 이름 (예: `"color"`, `"font-size"`, `"font-weight"`).
    -   `styleValue` (string): 적용할 CSS 속성 값 (예: `"#FF0000"`, `"34px"`, `"bold"`).
-   **사용 방법:** 보통 텍스트 선택 후, 버튼 클릭 이벤트 핸들러 등에서 이 함수를 호출하여 사용합니다. 이 함수를 호출할 때 대상 `contentEditable` div 요소를 따로 넘겨줄 필요는 없습니다. (현재 활성화된/선택 영역이 있는 `contentEditable` 영역에 대해 동작합니다.)

#### `onDeleteKeyUpProtectedLine(event: KeyboardEvent);`

-   **역할:** Delete 또는 Backspace 키 입력 시, `contentEditable` 속성을 가진 요소 안에서 특정 구조(예: 비어있는 `<div><br></div>` 같은 기본 줄 구조)가 손상되는 것을 방지하여 에디터의 안정적인 구조를 유지하도록 돕습니다. `contentEditable` 사용 시 흔히 발생하는 문제를 해결합니다.
-   **인자:**
    -   `event` (KeyboardEvent): `onkeyup` 이벤트 핸들러로부터 전달받는 키보드 이벤트 객체. 이 함수는 이벤트 객체를 인자로 받아야 합니다.
-   **사용 방법:** 이 보호 기능을 적용하고 싶은 **각각의 `contentEditable` div 요소**에 `onkeyup` 이벤트 핸들러로 이 함수를 **수동으로 할당**해주어야 합니다.

#### `onPasteTextProtectedLine(event: ClipboardEvent);`

-   **역할:** `contentEditable` 요소에 대한 `onpaste` 이벤트를 처리하는 함수입니다. 에디터가 각 라인을 별도의 `div` 요소로 구성해야 하는 특정 형식을 가질 때, 사용자가 텍스트를 붙여넣었을 때 이 형식이 유지되도록 붙여넣기된 내용을 처리합니다. 이 함수는 필수 사항은 아니지만, 형식이 손상되어 `enrich` 함수 등 다른 에디터 기능이 정상 작동하지 않는 것을 방지하기 위해 사용됩니다.
-   **인자:**
    `event` (ClipboardEvent): `onpaste` 이벤트 핸들러로부터 전달되는 붙여넣기 이벤트 객체입니다. 이 함수는 반드시 이 이벤트 객체를 인자로 받아야 합니다.
-   **사용 방법:** 이 함수는 붙여넣기 시 해당 특정 형식(`한 라인당 한 div`)을 적용하고자 하는 `contentEditable` 요소의 `onpaste` 이벤트 핸들러로 할당되어야 합니다. 다른 웹사이트나 외부 소스에서 복사된 복잡한 서식의 텍스트를 붙여넣을 경우, 예상대로 작동하지 않거나 형식이 완벽하게 유지되지 않을 수도 있습니다.

### Full Example

다음은 HTML 설정, 라이브러리 포함, 그리고 주요 함수들을 실제로 연결하여 사용하는 전체 예시 코드입니다. 이 예시를 통해 VANILLA-RTE의 기본적인 사용 흐름을 파악할 수 있습니다.

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
                min-height: 150px; /* 최소 높이 설정 */
                /* 에디터 영역이 focus 되었을 때 시각적 표시 (선택 사항) */
                outline: none;
                /* 줄 높이 설정 등으로 기본 <br>의 높이 조절 가능 */
                line-height: 1.5;
            }
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
            <div>여기에 내용을 입력하세요.</div>
            <div>텍스트를 **드래그**하고 위에 버튼을 눌러보세요.</div>
        </div>

        <script src="path/to/your/vanilla-rte.min.js"></script>
        <script>
            // 이 스크립트는 <script src="..."> 방식으로 라이브러리를 포함하여
            // enrichText와 onDeleteKeyUpProtectedLine 함수가 전역으로 사용 가능하다고 가정합니다.
            // 만약 import 방식을 사용한다면, 이 로직을 import하는 파일 안에 넣어야 합니다.

            // 1. contentEditable div 요소를 가져옵니다.
            const rteElement = document.getElementById("rich-text-editor");

            // 2. onDeleteKeyUpProtectedLine 함수를 onkeyup 이벤트에 수동으로 연결합니다.
            // 이 보호 기능을 적용하고 싶은 모든 contentEditable div에 대해 이 작업을 해야 합니다.
            rteElement.onkeyup = onDeleteKeyUpProtectedLine;
            rteElement.onpaste = onPasteTextProtectedLine;

            // 3. 서식 적용 버튼들을 가져옵니다.
            const redColorBtn = document.getElementById("btn-red-color");
            const boldBtn = document.getElementById("btn-bold");
            const largeFontBtn = document.getElementById("btn-large-font");

            // 4. 버튼 클릭 시 enrichText 함수를 호출하도록 이벤트 핸들러를 연결합니다.
            // enrichText는 드래그된 영역에 스타일을 적용하므로, 클릭 시점에 드래그가 되어 있어야 효과가 있습니다.
            redColorBtn.onclick = () => enrichText("color", "#FF0000");
            boldBtn.onclick = () => enrichText("font-weight", "bold"); // 볼드체 적용 예시
            largeFontBtn.onclick = () => enrichText("font-size", "34px");
        </script>
    </body>
</html>
```
