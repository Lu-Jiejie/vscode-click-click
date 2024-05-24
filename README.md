<p align="center">
<img src="./res/icon.png" height="180">
</p>

<h1 align="center">
Smart Select
</h1>

<p align="center">
Select the right code scope with double click.
</p>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=LuJiejie.smart-select" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/LuJiejie.smart-select?color=ddd&labelColor=444&logo=visualstudiocode&label=VS%20Code%20Marketplace" alt="Visual Studio Marketplace Version" /></a>
<a href="https://github.com/Lu-Jiejie/vscode-smart-select/blob/main/LICENSE" target="__blank"><img src="https://img.shields.io/github/license/Lu-Jiejie/vscode-smart-select?style=flat&color=ddd&labelColor=444" alt="LICENSE" /></a>
</p>

## Usage

**Double click** somewhere in the code, and the extension will select the right scope for you.

## Rules

More rules in the future...

### [js-arrow-function](./src/rules/js-arrow-function.ts)

Double click the center of `=>` to select the entire arrow function.

```javascript
                   ▼
const add = (a, b) => a + b
            └─────────────┘
```

### [js-assign](./src/rules/js-assign.ts)

Double click near the `=` to select the entire assignment.

```javascript
          ▼
const add = (a, b) => a + b
└─────────────────────────┘
```

### [js-block-statement](./src/rules/js-block-statement.ts)

Double click the pre-defined keyword to select the entire block statement.

```javascript
   ▼
function add(a, b) { return a + b }
└───────────────────────────────┘

 ▼
try { add(1, 2) } catch (e) {}
└────────────────────────────┘
```

Pre-defined keywords: `try`, `catch`, `finally`, `do`, `for`, `while`, `if`, `else`, `switch`, `case`, `default`, `function`, `class`.

### [js-block](./src/rules/js-block.ts)

Double click left of `{` to select the entire block.

```javascript
                   ▼
function add(a, b) { return a + b }
                   └──────────────┘
```

### [js-import-export](./src/rules/js-import-export.ts)

Double click the `import` or `export` keyword to select the entire statement.

```javascript
  ▼
import { add } from './math'
└──────────────────────────┘

  ▼
export function add(a, b) { return a + b }
└────────────────────────────────────────┘
```

## Inspiration

[Smart Clicks](https://github.com/antfu/vscode-smart-clicks)

~~Perhaps more user-friendly.~~


