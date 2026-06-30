# Bài giảng ES6 + NPM/YARN/PNPM và NVM toolbox

Thư mục này chứa bài giảng tiếng Việt dạng mini site tĩnh, tham khảo phong cách trực quan từ `CSS/` và `ReactJS/`. Bài giảng chạy trực tiếp trên trình duyệt, không cần cài package hay chạy dev server.

## Cấu trúc thư mục

```text
ES6-NPM-NVM/
├── index.html                     # Trang bài giảng chính
├── styles.css                     # Giao diện và responsive layout
├── assets/
│   ├── main.js                    # Logic cho demo tương tác và quiz
│   └── es6-toolbox-map.svg        # Sơ đồ lộ trình ES6 + toolbox
└── README.md
```

## Cách mở

Mở trực tiếp file `index.html` bằng trình duyệt:

```bash
open ES6-NPM-NVM/index.html
```

## Lộ trình nội dung

1. **Overview**: vì sao ES6/ES2015 thay đổi cách viết JavaScript hiện đại.
2. **Arrow function, class, spread**: cú pháp, use case, giới hạn cần nhớ.
3. **OOP và module ES6**: class/prototype, import/export, ESM trong browser và Node.js.
4. **Modern JavaScript features**: array/object methods, optional chaining, nullish coalescing, logical assignment, top-level await.
5. **Practical patterns**: module patterns, async/await error handling, Fetch API, ESM vs CommonJS.
6. **NPM/YARN/PNPM và NVM toolbox**: package manager, `package.json`, package location, `.nvmrc`.
7. **Quiz**: 10 câu trắc nghiệm có chấm điểm và giải thích đáp án.

## Nội dung chính

- ES6 overview, arrow function, classes, spread syntax.
- OOP trong ES6 và quan hệ với prototype.
- Import/export module trong ES6.
- Modern JavaScript features từ ES2015+: `includes`, `flat`, `flatMap`, `Object.entries`, `Object.values`, `Object.fromEntries`, `?.`, `??`, `??=`, `||=`, `&&=`, top-level await.
- Practical patterns: module patterns, async/await error handling, Fetch API, ESM vs CommonJS.
- NPM/YARN/PNPM/NVM toolbox: package manager, nơi package được cài, `package.json`, cài và quản lý Node version bằng NVM, cấu hình `.nvmrc`.

## Nguồn tham khảo

- MDN: A re-introduction to JavaScript - https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
- MDN: Arrow function expressions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
- MDN: Classes - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- MDN: Spread syntax - https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Operators/Spread_syntax
- MDN: Details of the object model - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
- MDN: import / export - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import và https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
- MDN: Array `flat`, `flatMap` - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat và https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
- MDN: Object `entries`, `values`, `fromEntries` - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
- MDN: optional chaining, nullish coalescing, logical assignment - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
- MDN: Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Node.js Learn: npm package manager - https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager
- npm Docs: `package.json` - https://docs.npmjs.com/cli/v10/configuring-npm/package-json
- Yarn Docs - https://yarnpkg.com/
- pnpm Docs - https://pnpm.io/
- nvm - https://github.com/nvm-sh/nvm
