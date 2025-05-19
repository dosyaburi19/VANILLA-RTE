# VANILLA-RTE

I tried making a [Rich Text-Editor] based on Vanilla-JS.

## Languages

[日本語](README.ja.md) | [한국어](README.ko.md)

## Introduction

Hello, I'm dosyaburi19.
This is my very first library, and I sincerely thank you for using it!

First off, this library is built using only vanilla JavaScript and has no external dependencies.

It might not be perfect yet, but I plan to add more features in the future to make it more complete and robust.

P.S. I'm not very good at English (currently using a translator).

## Installation

```bash
npm install vanilla-rte
```

## Usage

VANILLA-RTE is a utility function type library **without** a separate initialization function like `createEditor`. It is used by connecting directly to elements with the `contentEditable` attribute in HTML.

### Including the Library

How to include the library in your project. Choose according to the method of providing the built JavaScript file.

**Option 1: Using `<script>` Tag (Simplest Method)**

```html
<script src="path/to/your/vanilla-rte.min.js"></script>
```

_Using this method makes the enrichText and onDeleteKeyUpProtectedLine functions available globally._

**Option 2: Using a Module Bundler (Common when installed via npm)**

```javascript
// Import and use in your JavaScript or TypeScript file
import { enrichText, onDeleteKeyUpProtectedLine } from "vanilla-rte";
```

### Core Functions

This library provides the following functions that operate on `contentEditable` elements and the current selection.

#### `enrichText(styleName: string, styleValue: string);`

-   **Role:** Applies CSS style to the **currently dragged (selected) text range** within an element with the `contentEditable` attribute.
-   **Operation Method:** After wrapping the dragged text with a `<span>` tag, directly applies the specified CSS property (`styleName`) and value (`styleValue`) to that `<span>` tag.
-   **Parameters:**
    -   `styleName` (string): CSS property name to apply (e.g., `"color"`, `"font-size"`, `"font-weight"`).
    -   `styleValue` (string): CSS property value to apply (e.g., `"#FF0000"`, `"34px"`, `"bold"`).
-   **How to Use:** Typically used by calling this function from button click event handlers, etc., after selecting text. You do not need to pass the target `contentEditable` div element separately when calling this function. (It operates on the currently active/selected `contentEditable` area.)

#### `onDeleteKeyUpProtectedLine(event: KeyboardEvent);`

-   **Role:** When the Delete or Backspace key is pressed, it helps maintain the stable structure of the editor by preventing certain structures (e.g., empty `<div><br></div>` like default line structures) within an element with the `contentEditable` attribute from being damaged. It resolves common issues when using `contentEditable`.
-   **Parameters:**
    -   `event` (KeyboardEvent): Keyboard event object passed from the `onkeyup` event handler. This function must receive the event object as an argument.
-   **How to Use:** You **must manually assign** this function as the `onkeyup` event handler for **each** `contentEditable` div element where you want to apply this protective feature.

#### `onPasteTextProtectedLine(event: ClipboardEvent);`

-   **Role:** This function handles the `onpaste` event for a `contentEditable` element. When the editor has a specific format requiring each line to be composed of a separate `div` element, it processes the pasted content to ensure this format is maintained. Although not strictly required, this function is used to prevent other editor functions (like the `enrich` function) from malfunctioning due to damaged format.
-   **Parameters:**
    -   `event` (ClipboardEvent): The paste event object passed from the `onpaste` event handler. This function must receive the event object as an argument.
-   **How to Use:** This function should be assigned as the `onpaste` event handler to the `contentEditable` element where you want to enforce this specific format (`one line per div`) upon pasting. Please note that when pasting text with complex formatting copied from other websites or external sources, it may not always work as expected or the format may not be perfectly maintained.

### Full Example

The following is a complete example code showing how to set up HTML, include the library, and actually connect and use the main functions. Through this example, you can understand the basic usage flow of VANILLA-RTE.

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
                min-height: 150px; /* Set minimum height */
                /* Visual indicator when the editor area is focused (Optional) */
                outline: none;
                /* Adjust default <br> height with line-height etc. */
                line-height: 1.5;
            }
            /* Note: enrichText applies inline style by default. */
            /* You can modify the library to apply CSS classes if needed. */
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
            <div>Enter content here.</div>
            <div>**Drag** the text and click the buttons above.</div>
        </div>

        <script src="path/to/your/vanilla-rte.min.js"></script>
        <script>
            // This script assumes enrichText and onDeleteKeyUpProtectedLine are globally available
            // after including the script tag above, OR if using modules, they are imported
            // in your-main-script.js which then calls this setup logic.

            // 1. Get the contentEditable div element.
            const rteElement = document.getElementById("rich-text-editor");

            // 2. Manually connect the onDeleteKeyUpProtectedLine function to the onkeyup event.
            // You must do this for every contentEditable div where you want to apply this protective feature.
            rteElement.onkeyup = onDeleteKeyUpProtectedLine;
            rteElement.onpaste = onPasteTextProtectedLine;

            // 3. Get the formatting apply buttons.
            const redColorBtn = document.getElementById("btn-red-color");
            const boldBtn = document.getElementById("btn-bold");
            const largeFontBtn = document.getElementById("btn-large-font");

            // 4. Connect event handlers to call the enrichText function when buttons are clicked.
            // Since enrichText applies style to the dragged area, it will only be effective if text is dragged when clicked.
            redColorBtn.onclick = () => enrichText("color", "#FF0000");
            boldBtn.onclick = () => enrichText("font-weight", "bold"); // Example: Apply bold
            largeFontBtn.onclick = () => enrichText("font-size", "34px");
        </script>
    </body>
</html>
```
