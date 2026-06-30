const normalizeQuery = (first, second) => (
  typeof first === "string"
    ? [second || document, first]
    : [first || document, second]
);

const $ = (first, second) => {
  const [root, selector] = normalizeQuery(first, second);
  return root.querySelector(selector);
};

const $$ = (first, second) => {
  const [root, selector] = normalizeQuery(first, second);
  return [...root.querySelectorAll(selector)];
};

const setText = (root, selector, value) => {
  const target = $(root, selector);
  if (target) {
    target.textContent = value;
  }
};

const spreadExamples = {
  array: {
    code: `const base = ["ES6", "Module"];
const next = ["Overview", ...base, "Toolbox"];

console.log(next);`,
    result: '["Overview", "ES6", "Module", "Toolbox"]',
    note: "Array spread tạo array mới và mở từng phần tử của array cũ vào vị trí hiện tại."
  },
  object: {
    code: `const user = { id: 7, role: "guest" };
const nextUser = {
  ...user,
  role: "admin"
};

console.log(nextUser);`,
    result: '{ id: 7, role: "admin" }',
    note: "Object spread copy property từ trái sang phải. Property phía sau ghi đè property phía trước."
  },
  args: {
    code: `const scores = [7, 9, 8];
const highest = Math.max(...scores);

console.log(highest);`,
    result: "9",
    note: "Function call spread biến array thành danh sách argument."
  },
  nested: {
    code: `const order = {
  id: 1,
  customer: { name: "An", tier: "silver" }
};

const nextOrder = {
  ...order,
  customer: {
    ...order.customer,
    tier: "gold"
  }
};`,
    result: '{ id: 1, customer: { name: "An", tier: "gold" } }',
    note: "Spread là shallow copy. Với object lồng nhau, cần copy tiếp lớp nested được thay đổi."
  }
};

const spreadLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const answer = $("[data-spread-answer]", panel);
  const placeholder = $("[data-spread-placeholder]", panel);
  const toggle = $("[data-spread-toggle]", panel);
  let isAnswerVisible = false;

  const setAnswerVisible = (visible) => {
    isAnswerVisible = visible;
    answer.hidden = !visible;
    placeholder.hidden = visible;
    toggle.textContent = visible ? "Ẩn kết quả" : "Hiện kết quả";
    toggle.setAttribute("aria-expanded", String(visible));
  };

  const render = (key, shouldShowAnswer = false) => {
    const example = spreadExamples[key];
    setText(panel, "[data-spread-code]", example.code);
    setText(panel, "[data-spread-result]", example.result);
    setText(panel, "[data-spread-note]", example.note);
    setAnswerVisible(shouldShowAnswer);

    $$("[data-spread-case]", panel).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.spreadCase === key);
    });
  };

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-spread-case]");
    if (button) {
      render(button.dataset.spreadCase);
      return;
    }

    if (event.target.closest("[data-spread-toggle]")) {
      setAnswerVisible(!isAnswerVisible);
    }
  });

  render("array");
  panel.dataset.ready = "true";
};

const featureExamples = {
  includes: {
    code: `const roles = ["admin", "editor", "viewer"];

const canEdit = roles.includes("editor");
const canDelete = roles.includes("owner");

console.log({ canEdit, canDelete });`,
    result: "{ canEdit: true, canDelete: false }",
    note: "includes trả về boolean, dễ đọc hơn so với so sánh indexOf(...) !== -1."
  },
  flat: {
    code: `const groups = [
  ["An", "Binh"],
  ["Chi", ["Dung"]]
];

console.log(groups.flat());
console.log(groups.flat(2));`,
    result: 'flat(): ["An", "Binh", "Chi", ["Dung"]] | flat(2): ["An", "Binh", "Chi", "Dung"]',
    note: "flat tạo array mới và làm phẳng theo depth. Mặc định depth là 1."
  },
  flatMap: {
    code: `const orders = [
  { id: 1, tags: ["paid", "new"] },
  { id: 2, tags: ["refund"] }
];

const tags = orders.flatMap((order) => order.tags);

console.log(tags);`,
    result: '["paid", "new", "refund"]',
    note: "flatMap tương đương map rồi flat một cấp, hợp khi mỗi item sinh ra 0..n item mới."
  },
  entries: {
    code: `const stock = { keyboard: 3, mouse: 8 };

const rows = Object.entries(stock).map(([key, value]) => ({
  key,
  value
}));

console.log(rows);`,
    result: '[{ key: "keyboard", value: 3 }, { key: "mouse", value: 8 }]',
    note: "Object.entries trả về các cặp key/value enumerable của object."
  },
  values: {
    code: `const cart = {
  keyboard: 450000,
  mouse: 180000
};

const total = Object.values(cart)
  .reduce((sum, price) => sum + price, 0);

console.log(total);`,
    result: "630000",
    note: "Object.values hữu ích khi chỉ cần value để tính toán, không cần key."
  },
  fromEntries: {
    code: `const query = new URLSearchParams("page=2&sort=desc");
const params = Object.fromEntries(query.entries());

console.log(params);`,
    result: '{ page: "2", sort: "desc" }',
    note: "Object.fromEntries dựng object từ danh sách cặp key/value, rất hợp khi xử lý form hoặc query string."
  },
  optional: {
    code: `const response = {
  user: {
    profile: null
  }
};

const city = response.user.profile?.address?.city;

console.log(city);`,
    result: "undefined",
    note: "Optional chaining dừng khi phần bên trái là null hoặc undefined, giúp tránh lỗi Cannot read properties."
  },
  nullish: {
    code: `const pageSize = 0;
const user = { name: "An" };
const selectedTags = [];

const sizeByOr = pageSize || 20;
const sizeByNullish = pageSize ?? 20;
const displayName = user && user.name;
const hasTags = selectedTags.length && "Có tag";

console.log({
  sizeByOr,
  sizeByNullish,
  displayName,
  hasTags
});`,
    result: '{ sizeByOr: 20, sizeByNullish: 0, displayName: "An", hasTags: 0 }',
    note: "|| trả về vế phải khi vế trái falsy như 0, false, ''. ?? chỉ fallback khi null/undefined. && chỉ chạy/trả về vế phải khi vế trái truthy, nếu không trả về chính vế trái."
  },
  logical: {
    code: `const settings = {
  pageSize: 0,
  cache: undefined,
  debug: true,
  theme: ""
};

settings.pageSize ||= 20;
settings.cache ??= "memory";
settings.debug &&= "verbose";
settings.theme ??= "light";

console.log(settings);`,
    result: '{ pageSize: 20, cache: "memory", debug: "verbose", theme: "" }',
    note: "||= gán khi giá trị hiện tại falsy nên 0 bị đổi thành 20. ??= chỉ gán khi null/undefined nên theme rỗng vẫn giữ nguyên. &&= chỉ gán khi giá trị hiện tại truthy nên debug true đổi thành 'verbose'."
  },
  tla: {
    code: `// feature-flags.js
console.log("1. bắt đầu tải feature flags");

const response = await fetch("/feature-flags.json");
export const flags = await response.json();

console.log("2. feature flags đã sẵn sàng");

// app.js
import { flags } from "./feature-flags.js";

console.log("3. app chỉ chạy sau khi flags sẵn sàng", flags);`,
    result: "app.js phải đợi feature-flags.js fetch và parse JSON xong rồi mới chạy phần code phía sau import.",
    note: "Dùng tiết chế vì top-level await chặn các module import nó. Nếu request chậm, cả nhánh module phụ thuộc cũng chậm theo. Phù hợp cho setup bắt buộc trước khi app chạy; không phù hợp cho dữ liệu có thể tải sau trong UI."
  }
};

const featureLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const answer = $("[data-feature-answer]", panel);
  const placeholder = $("[data-feature-placeholder]", panel);
  const toggle = $("[data-feature-toggle]", panel);
  let isAnswerVisible = false;

  const setAnswerVisible = (visible) => {
    isAnswerVisible = visible;
    answer.hidden = !visible;
    placeholder.hidden = visible;
    toggle.textContent = visible ? "Ẩn kết quả" : "Hiện kết quả";
    toggle.setAttribute("aria-expanded", String(visible));
  };

  const render = (key, shouldShowAnswer = false) => {
    const example = featureExamples[key];
    setText(panel, "[data-feature-code]", example.code);
    setText(panel, "[data-feature-result]", example.result);
    setText(panel, "[data-feature-note]", example.note);
    setAnswerVisible(shouldShowAnswer);

    $$("[data-feature]", panel).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.feature === key);
    });
  };

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-feature]");
    if (button) {
      render(button.dataset.feature);
      return;
    }

    if (event.target.closest("[data-feature-toggle]")) {
      setAnswerVisible(!isAnswerVisible);
    }
  });

  render("includes");
  panel.dataset.ready = "true";
};

const packageCommands = {
  npm: {
    lock: "package-lock.json",
    install: ["npm install", "Cài dependency theo package.json và package-lock.json nếu có."],
    add: ["npm install axios", "Thêm axios vào dependencies."],
    dev: ["npm install -D vite", "Thêm vite vào devDependencies."],
    remove: ["npm uninstall axios", "Gỡ package khỏi node_modules và package.json."],
    run: ["npm run dev", "Chạy script dev trong package.json."]
  },
  yarn: {
    lock: "yarn.lock",
    install: ["yarn install", "Cài dependency theo package.json và yarn.lock."],
    add: ["yarn add axios", "Thêm axios vào dependencies."],
    dev: ["yarn add -D vite", "Thêm vite vào devDependencies."],
    remove: ["yarn remove axios", "Gỡ package khỏi project."],
    run: ["yarn dev", "Chạy script dev trong package.json."]
  },
  pnpm: {
    lock: "pnpm-lock.yaml",
    install: ["pnpm install", "Cài dependency qua pnpm store và symlink vào node_modules."],
    add: ["pnpm add axios", "Thêm axios vào dependencies."],
    dev: ["pnpm add -D vite", "Thêm vite vào devDependencies."],
    remove: ["pnpm remove axios", "Gỡ package khỏi project."],
    run: ["pnpm dev", "Chạy script dev trong package.json."]
  }
};

const packageLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const managerInput = $("[data-package-manager]", panel);
  const actionInput = $("[data-package-action]", panel);

  const render = () => {
    const manager = managerInput.value;
    const action = actionInput.value;
    const [command, note] = packageCommands[manager][action];
    setText(panel, "[data-package-command]", command);
    setText(panel, "[data-package-lock]", packageCommands[manager].lock);
    setText(panel, "[data-package-note]", note);
  };

  managerInput.addEventListener("change", render);
  actionInput.addEventListener("change", render);

  render();
  panel.dataset.ready = "true";
};

const nvmLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const versionInput = $("[data-node-version]", panel);
  const shellInput = $("[data-shell-kind]", panel);

  const render = () => {
    const version = versionInput.value;
    const target = version === "lts" ? "lts/*" : version;
    const isAuto = shellInput.value === "auto";
    const manualCode = `echo "${target}" > .nvmrc
nvm install
nvm use
node -v
npm -v`;
    const autoCode = `# Sau khi project đã có .nvmrc
echo "${target}" > .nvmrc

# Thêm hook auto-use vào shell profile theo hướng dẫn nvm
# Khi cd vào project:
nvm use --silent`;

    setText(panel, "[data-nvm-command]", isAuto ? autoCode : manualCode);
    setText(panel, "[data-nvm-title]", `.nvmrc = ${target}`);
    setText(
      panel,
      "[data-nvm-note]",
      isAuto
        ? "Auto-use tiện cho team lớn, nhưng nên thống nhất hook trong hướng dẫn setup của dự án."
        : "Manual rõ ràng và dễ debug: vào project, chạy nvm use trước khi npm/yarn/pnpm install."
    );
  };

  versionInput.addEventListener("change", render);
  shellInput.addEventListener("change", render);

  render();
  panel.dataset.ready = "true";
};

const quizQuestions = [
  {
    question: "Live binding import trong ES module nghĩa là gì?",
    options: [
      "Import là liên kết tới binding export gốc, nên khi module gốc đổi giá trị thì nơi import đọc được giá trị mới",
      "Import copy giá trị một lần tại thời điểm file được load",
      "Import chỉ dùng được với default export",
      "Import tự động chuyển mọi module CommonJS thành ESM"
    ],
    answer: 0,
    explain: "Live binding nghĩa là import giống một đường link tới binding export gốc, không phải bản copy tĩnh."
  },
  {
    question: "Arrow function khác function thường ở điểm nào quan trọng nhất khi nói về this?",
    options: [
      "Arrow function luôn bind this vào window",
      "Arrow function lấy this theo lexical scope bên ngoài",
      "Arrow function có this riêng theo lúc được gọi",
      "Arrow function không thể nhận parameter"
    ],
    answer: 1,
    explain: "Arrow function không tạo this riêng; this được lấy từ scope bao quanh."
  },
  {
    question: "Spread object có đặc điểm nào cần nhớ khi object có dữ liệu lồng nhau?",
    options: [
      "Spread luôn clone sâu toàn bộ object nested",
      "Spread luôn mutate object gốc",
      "Spread chỉ copy shallow, object lồng nhau vẫn cần xử lý riêng",
      "Spread chỉ dùng được với array, không dùng được với object"
    ],
    answer: 2,
    explain: "Object spread tạo object mới ở lớp ngoài, nhưng object nested vẫn giữ reference cũ nếu không spread tiếp."
  },
  {
    question: "Nhóm API/toán tử nào giúp giảm code phòng thủ khi đọc dữ liệu có thể thiếu?",
    options: [
      "class và extends",
      "Math.max và parseInt",
      "setTimeout và setInterval",
      "Optional chaining ?. và nullish coalescing ??"
    ],
    answer: 3,
    explain: "?. giúp đọc an toàn qua object có thể thiếu; ?? đặt fallback chỉ khi giá trị là null hoặc undefined."
  },
  {
    question: "Object.fromEntries(entries) dùng để làm gì?",
    options: [
      "Đổi object thành array value",
      "Làm phẳng array nhiều cấp",
      "Kiểm tra array có chứa một giá trị",
      "Dựng object từ danh sách cặp [key, value]"
    ],
    answer: 3,
    explain: "entries là danh sách các cặp [key, value]. Object.fromEntries biến danh sách đó trở lại thành object."
  },
  {
    question: "Async/await cải thiện gì so với callback hoặc chuỗi then/catch trong nhiều luồng xử lý tuần tự?",
    options: [
      "Làm code bất đồng bộ chạy thành đồng bộ thật sự",
      "Loại bỏ hoàn toàn Promise khỏi JavaScript",
      "Giúp code đọc từ trên xuống dưới hơn và có thể gom lỗi bằng try/catch",
      "Bắt buộc mọi request phải chạy song song"
    ],
    answer: 2,
    explain: "async/await vẫn dựa trên Promise, nhưng giúp code nhiều bước async đọc giống luồng tuần tự và xử lý lỗi bằng try/catch."
  },
  {
    question: "Với Fetch API, vì sao thường cần kiểm tra response.ok?",
    options: [
      "Vì fetch reject với mọi HTTP 404/500",
      "Vì fetch thường không reject chỉ vì HTTP status là 404/500",
      "Vì response.json() chỉ chạy khi status là 200",
      "Vì response.ok tự parse JSON"
    ],
    answer: 1,
    explain: "fetch reject chủ yếu với lỗi network. HTTP error vẫn trả về Response, nên cần kiểm tra response.ok."
  },
  {
    question: "dependencies và devDependencies khác nhau như thế nào?",
    options: [
      "dependencies cần khi app/package chạy thật; devDependencies chỉ phục vụ lúc phát triển, build hoặc test",
      "dependencies chỉ dùng cho CSS; devDependencies chỉ dùng cho JavaScript",
      "dependencies không được commit; devDependencies bắt buộc phải commit",
      "dependencies chỉ cài global; devDependencies chỉ cài local"
    ],
    answer: 0,
    explain: "Ví dụ React/axios thường là dependencies; Vite, ESLint, test runner thường là devDependencies."
  },
  {
    question: "Ưu điểm nổi bật của pnpm so với cách cài truyền thống là gì?",
    options: [
      "Tái dùng package từ store chung và link vào project, giúp tiết kiệm dung lượng và thường cài nhanh hơn",
      "Không cần package.json",
      "Chỉ chạy được với browser, không chạy với Node.js",
      "Tự động đổi mọi package sang TypeScript"
    ],
    answer: 0,
    explain: "pnpm dùng store chung và symlink/hard link, nên nhiều project có thể tái dùng cùng một package thay vì copy lặp lại."
  },
  {
    question: "File .nvmrc trong project dùng để làm gì?",
    options: [
      "Chứa danh sách package production",
      "Khai báo Node.js version mà project nên dùng",
      "Thay thế package-lock.json",
      "Chạy script test tự động"
    ],
    answer: 1,
    explain: ".nvmrc ghi version như 22, lts/* hoặc một alias để nvm install/use đúng Node version cho project."
  }
];

const quizLab = (root) => {
  const shell = $("[data-quiz]", root);
  if (!shell || shell.dataset.ready) {
    return;
  }

  const list = $("[data-quiz-list]", shell);
  const score = $("[data-quiz-score]", shell);
  const message = $("[data-quiz-message]", shell);
  const selected = new Map();

  const renderScore = () => {
    const correct = [...selected.entries()].filter(([index, option]) => quizQuestions[index].answer === option).length;
    score.textContent = `${correct}/${quizQuestions.length}`;
    message.textContent = selected.size === quizQuestions.length
      ? `Hoàn thành ${quizQuestions.length} câu.`
      : `Đã trả lời ${selected.size}/${quizQuestions.length} câu.`;
  };

  quizQuestions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${item.question}`;

    const options = document.createElement("div");
    options.className = "quiz-options";

    const explain = document.createElement("p");
    explain.className = "quiz-explain";
    explain.textContent = item.explain;

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => {
        selected.set(index, optionIndex);
        card.classList.add("is-answered");
        $$(".quiz-option", card).forEach((other, otherIndex) => {
          other.classList.toggle("is-correct", otherIndex === optionIndex && optionIndex === item.answer);
          other.classList.toggle("is-wrong", otherIndex === optionIndex && optionIndex !== item.answer);
        });
        renderScore();
      });
      options.append(button);
    });

    card.append(title, options, explain);
    list.append(card);
  });

  renderScore();
  shell.dataset.ready = "true";
};

document.querySelectorAll("[data-code-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const codeBlock = document.getElementById(button.getAttribute("aria-controls"));
    const isHidden = codeBlock.hidden;
    codeBlock.hidden = !isHidden;
    button.setAttribute("aria-expanded", String(isHidden));
    button.textContent = isHidden ? "Ẩn code" : "Hiện code";
  });
});

document.querySelectorAll("[data-demo]").forEach((panel) => {
  const demos = {
    spreadLab,
    featureLab,
    packageLab,
    nvmLab
  };

  demos[panel.dataset.demo]?.(panel);
});

quizLab(document);
