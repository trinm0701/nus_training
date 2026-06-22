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

const setLiveCode = (panel, code) => {
  const target = $(panel, "[data-live-code]");
  if (target) {
    target.textContent = code.trim();
  }
};

const stateLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  let count = 0;
  let render = 1;

  const examples = {
    directOne: {
      label: "setCount(count + 1)",
      getQueue: (base) => [`setCount(${base} + 1) -> ${base + 1}`],
      getNext: (base) => base + 1,
      note: "Truyền next state trực tiếp phù hợp khi chỉ cần một update đơn giản."
    },
    updaterOne: {
      label: "setCount(c => c + 1)",
      getQueue: (base) => [`c = ${base}; return c + 1 -> ${base + 1}`],
      getNext: (base) => base + 1,
      note: "Updater nhận pending state và tính ra next state."
    },
    directThree: {
      label: "setCount(count + 1) gọi 3 lần",
      getQueue: (base) => [
        `Lần 1: setCount(${base} + 1) -> ${base + 1}`,
        `Lần 2: setCount(${base} + 1) -> ${base + 1}`,
        `Lần 3: setCount(${base} + 1) -> ${base + 1}`
      ],
      getNext: (base) => base + 1,
      note: "Cả 3 lệnh đọc cùng một count trong event hiện tại, nên kết quả chỉ tăng 1."
    },
    updaterThree: {
      label: "setCount(c => c + 1) gọi 3 lần",
      getQueue: (base) => [
        `Lần 1: c = ${base}; return ${base + 1}`,
        `Lần 2: c = ${base + 1}; return ${base + 2}`,
        `Lần 3: c = ${base + 2}; return ${base + 3}`
      ],
      getNext: (base) => base + 3,
      note: "Mỗi updater nhận kết quả pending của updater trước, nên tăng đúng 3."
    }
  };

  const renderQueue = (items) => {
    const list = $(panel, "[data-state-queue]");
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
  };

  const update = (queue = ["Chưa có update nào."], note = "Click một nút để thấy cách React tính next state.", codeKey = "directOne") => {
    setText(panel, "[data-state-count]", count);
    setText(panel, "[data-state-render]", render);
    renderQueue(queue);
    setText(panel, "[data-state-note]", note);

    const codeByKey = {
      directOne: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }
}`,
      updaterOne: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
  }
}`,
      directThree: `function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // Nếu count là ${count}, lần render sau chỉ thành ${count + 1}
}`,
      updaterThree: `function handleClick() {
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
  // Nếu count là ${count}, lần render sau thành ${count + 3}
}`
    };

    setLiveCode(panel, codeByKey[codeKey]);
  };

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-state-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.stateAction;

    if (action === "reset") {
      count = 0;
      render += 1;
      update(["setCount(0)"], "Reset về 0 và render lại component.", "directOne");
      return;
    }

    const example = examples[action];
    const base = count;
    count = example.getNext(base);
    render += 1;
    update(example.getQueue(base), `${example.label}: ${example.note}`, action);
  });

  update();
  panel.dataset.ready = "true";
};

const eventLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const log = $(panel, "[data-event-log]");
  const addLog = (message) => {
    const li = document.createElement("li");
    li.textContent = message;
    log.prepend(li);
    while (log.children.length > 5) {
      log.lastElementChild.remove();
    }
  };

  const describe = (event, label) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value || target.textContent.trim();
    const message = `${label}: type=${event.type}, target=${target.tagName.toLowerCase()}, value=${value}`;
    setText(panel, "[data-event-current]", message);
    addLog(message);
  };

  const button = $(panel, '[data-event-source="button"]');
  const input = $(panel, '[data-event-source="input"]');
  const checkbox = $(panel, '[data-event-source="checkbox"]');

  button.addEventListener("click", (event) => describe(event, "onClick"));
  input.addEventListener("input", (event) => describe(event, "onChange"));
  checkbox.addEventListener("change", (event) => describe(event, "onChange checkbox"));

  setLiveCode(panel, `function Demo() {
  function handleClick(event) {
    console.log(event.type, event.currentTarget);
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}`);

  panel.dataset.ready = "true";
};

const sharingLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const modeInput = $(panel, "[data-sharing-mode]");
  const shippingButtons = $$("[data-shipping-id]", panel);
  const shippingData = {
    standard: {
      label: "Tiêu chuẩn",
      fee: 25000,
      date: "Thứ 5, 25/06",
      note: "Phù hợp đơn không gấp."
    },
    express: {
      label: "Hỏa tốc",
      fee: 60000,
      date: "Ngày mai, 23/06",
      note: "Ưu tiên khi khách cần nhận sớm."
    }
  };
  const subtotal = 420000;
  let sharedShippingId = "standard";
  let localOptionsShippingId = "standard";
  let localSummaryShippingId = "standard";

  const formatMoney = (value) => `${value.toLocaleString("vi-VN")}đ`;

  const render = () => {
    const mode = modeInput.value;
    const optionsShippingId = mode === "shared" ? sharedShippingId : localOptionsShippingId;
    const summaryShippingId = mode === "shared" ? sharedShippingId : localSummaryShippingId;
    const preview = shippingData[optionsShippingId];
    const summary = shippingData[summaryShippingId];

    shippingButtons.forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.shippingId === optionsShippingId);
    });

    const source = mode === "shared"
      ? `Source of truth: CheckoutPage.shippingId = ${sharedShippingId}`
      : `Local state bị lệch: ShippingOptions = ${localOptionsShippingId}, OrderSummary = ${localSummaryShippingId}`;
    setText(panel, "[data-sharing-source]", source);
    setText(panel, "[data-delivery-date]", preview.date);
    setText(panel, "[data-delivery-note]", preview.note);
    setText(panel, "[data-shipping-fee]", formatMoney(summary.fee));
    setText(panel, "[data-order-total]", formatMoney(subtotal + summary.fee));

    setLiveCode(panel, mode === "shared"
      ? `const shippingMethods = [
  { id: 'standard', label: 'Tiêu chuẩn', fee: 25000 },
  { id: 'express', label: 'Hỏa tốc', fee: 60000 }
];

function CheckoutPage() {
  const [shippingId, setShippingId] = useState('standard');
  const shipping = shippingMethods.find(m => m.id === shippingId);

  return (
    <>
      <ShippingOptions
        selectedId={shippingId}
        onSelect={setShippingId}
      />
      <DeliveryPreview shipping={shipping} />
      <OrderSummary shippingFee={shipping.fee} />
    </>
  );
}`
      : `function ShippingOptions() {
  const [shippingId, setShippingId] = useState('standard');
  // Component này đổi sang ${localOptionsShippingId}
}

function OrderSummary() {
  const [shippingId] = useState('standard');
  // Component này vẫn đang tính theo ${localSummaryShippingId}
}

// Hai state riêng làm preview và tổng tiền có thể lệch nhau.`);
  };

  modeInput.addEventListener("change", () => {
    if (modeInput.value === "local") {
      localOptionsShippingId = sharedShippingId;
      localSummaryShippingId = "standard";
    }

    render();
  });

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-shipping-id]");
    if (!button) {
      return;
    }

    if (modeInput.value === "shared") {
      sharedShippingId = button.dataset.shippingId;
    } else {
      localOptionsShippingId = button.dataset.shippingId;
    }

    render();
  });

  render();
  panel.dataset.ready = "true";
};

const controlledLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const readState = () => ({
    fullName: $('[data-control="fullName"]', panel).value,
    email: $('[data-control="email"]', panel).value,
    role: $('[data-control="role"]', panel).value,
    newsletter: $('[data-control="newsletter"]', panel).checked
  });

  const writeState = (state) => {
    $('[data-control="fullName"]', panel).value = state.fullName;
    $('[data-control="email"]', panel).value = state.email;
    $('[data-control="role"]', panel).value = state.role;
    $('[data-control="newsletter"]', panel).checked = state.newsletter;
  };

  const render = () => {
    const state = readState();
    setText(panel, "[data-preview-name]", state.fullName || "Chưa có tên");
    setText(panel, "[data-preview-role]", state.role);
    setText(panel, "[data-preview-email]", state.email || "Chưa có email");
    setText(panel, "[data-preview-newsletter]", state.newsletter ? "Đã bật nhận tin." : "Đã tắt nhận tin.");
    setText(panel, "[data-controlled-json]", JSON.stringify(state, null, 2));

    setLiveCode(panel, `function ProfileForm() {
  const [form, setForm] = useState({
    fullName: '${state.fullName.replaceAll("'", "\\'")}',
    email: '${state.email.replaceAll("'", "\\'")}',
    role: '${state.role.replaceAll("'", "\\'")}',
    newsletter: ${state.newsletter}
  });

  function handleChange(event) {
    const { name, type, checked, value } = event.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  return (
    <form>
      <label>
        Họ tên
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Vai trò
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option>Frontend Developer</option>
          <option>React Learner</option>
          <option>Team Lead</option>
        </select>
      </label>

      <label>
        <input
          name="newsletter"
          type="checkbox"
          checked={form.newsletter}
          onChange={handleChange}
        />
        Nhận tin học React
      </label>

      <ProfilePreview form={form} />
    </form>
  );
}

function ProfilePreview({ form }) {
  return (
    <section>
      <h3>{form.fullName || 'Chưa có tên'}</h3>
      <p>{form.role}</p>
      <p>{form.email || 'Chưa có email'}</p>
      <p>
        {form.newsletter
          ? 'Đã bật nhận tin'
          : 'Đã tắt nhận tin'}
      </p>
    </section>
  );
}`);
  };

  $$("[data-control]", panel).forEach((control) => {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

  panel.addEventListener("click", (event) => {
    const action = event.target.closest("[data-controlled-action]")?.dataset.controlledAction;
    if (!action) {
      return;
    }

    writeState(action === "sample"
      ? {
        fullName: "Tran Bao Chau",
        email: "chau@react.dev",
        role: "Frontend Developer",
        newsletter: true
      }
      : {
        fullName: "",
        email: "",
        role: "React Learner",
        newsletter: false
      });
    render();
  });

  render();
  panel.dataset.ready = "true";
};

const formLab = (panel) => {
  if (panel.dataset.ready) {
    return;
  }

  const form = $("[data-training-form]", panel);
  const status = $("[data-form-status]", panel);
  const output = $("[data-form-output]", panel);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const intent = submitter?.value || "submit";
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());
    entries.intent = intent;

    status.textContent = intent === "draft" ? "Đang lưu nháp..." : "Đang gửi đăng ký...";
    output.textContent = JSON.stringify(entries, null, 2);

    window.setTimeout(() => {
      status.textContent = intent === "draft" ? "Đã lưu bản nháp." : "Đã gửi thành công.";
    }, 500);
  });

  setLiveCode(panel, `function SignupForm() {
  function handleSubmit(event) {
    // Chặn hành vi submit mặc định của browser:
    // không reload trang, không mất state, React tự xử lý dữ liệu.
    event.preventDefault();

    const form = event.currentTarget;
    const submitter = event.nativeEvent.submitter;
    const formData = new FormData(form);

    const data = {
      student: formData.get('student'),
      email: formData.get('email'),
      topic: formData.get('topic'),
      note: formData.get('note'),
      intent: submitter?.value || 'submit'
    };

    if (data.intent === 'draft') {
      saveDraft(data);
    } else {
      registerStudent(data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tên học viên
        <input name="student" required defaultValue="Minh Tri" />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          required
          defaultValue="tri@example.com"
        />
      </label>

      <label>
        Chủ đề muốn hỏi
        <select name="topic" defaultValue="Controlled components">
          <option>useState</option>
          <option>Controlled components</option>
          <option>Form action</option>
        </select>
      </label>

      <label>
        Ghi chú
        <textarea
          name="note"
          rows={4}
          defaultValue="Muốn hiểu rõ vì sao input controlled cần onChange."
        />
      </label>

      <button type="submit" value="submit">Gửi đăng ký</button>
      <button type="submit" value="draft" formNoValidate>
        Lưu nháp
      </button>
    </form>
  );
}`);

  panel.dataset.ready = "true";
};

const quizQuestions = [
  {
    question: "useState trả về gì?",
    options: ["Một cặp [state, setState]", "Một object { state, setState }", "Một Promise", "Một DOM node"],
    answer: 0,
    explain: "useState trả về array có hai phần tử: giá trị state hiện tại và function để cập nhật state."
  },
  {
    question: "Khi nào nên dùng setCount(c => c + 1)?",
    options: ["Khi muốn bỏ qua render", "Khi next state phụ thuộc state trước đó", "Khi muốn mutate object", "Chỉ khi dùng class component"],
    answer: 1,
    explain: "Updater function đọc pending state, rất hữu ích nếu có nhiều update trong cùng một event."
  },
  {
    question: "onClick={handleClick()} có vấn đề gì?",
    options: ["React không biết button", "Event bị preventDefault", "Function chạy ngay khi render", "State bị xóa"],
    answer: 2,
    explain: "Trong JSX, dấu () sẽ gọi function ngay. Cần truyền function: onClick={handleClick}."
  },
  {
    question: "Checkout có ShippingOptions và OrderSummary cùng cần shippingId, nên làm gì?",
    options: ["Mỗi component tự giữ shippingId", "Lưu shippingId trong CSS", "Đọc shippingId bằng document.querySelector", "Đưa shippingId lên CheckoutPage"],
    answer: 3,
    explain: "CheckoutPage là cha chung gần nhất, nên giữ source of truth và truyền selectedId/onSelect xuống các component con."
  },
  {
    question: "Text input controlled cần bộ đôi nào?",
    options: ["defaultValue và href", "checked và src", "children và dangerouslySetInnerHTML", "value và onChange"],
    answer: 3,
    explain: "value ép input hiện theo state, onChange cập nhật state khi user gõ phím."
  },
  {
    question: "Checkbox controlled nên đọc giá trị nào?",
    options: ["e.target.value", "e.target.innerHTML", "e.target.checked", "document.title"],
    answer: 2,
    explain: "Checkbox/radio dùng checked boolean, không dùng value để biết đang tick hay không."
  },
  {
    question: "Nếu xử lý submit bằng onSubmit, thường cần gọi gì?",
    options: ["event.reload()", "event.preventDefault()", "setState trong render", "new Promise() bắt buộc"],
    answer: 1,
    explain: "preventDefault ngăn browser submit mặc định và refresh trang."
  },
  {
    question: "React DOM <form action={fn}> truyền gì vào function action?",
    options: ["FormData", "MouseEvent", "CSSStyleDeclaration", "LocalStorage"],
    answer: 0,
    explain: "Khi action là function, React gọi function đó với FormData của form đã submit."
  },
  {
    question: "Vì sao không nên sửa trực tiếp object hoặc array trong state?",
    options: ["React cần reference mới để nhận ra thay đổi", "Vì object không dùng được trong JSX", "Vì setState chỉ nhận number", "Vì array luôn immutable trong JavaScript"],
    answer: 0,
    explain: "Khi tạo object/array mới, reference thay đổi nên React có thể nhận ra state đã cập nhật và render lại."
  },
  {
    question: "Trong controlled form, checkbox nên dùng prop nào để phản chiếu state?",
    options: ["value={form.newsletter}", "checked={form.newsletter}", "selected={form.newsletter}", "defaultChecked luôn đủ cho mọi trường hợp"],
    answer: 1,
    explain: "Checkbox controlled dùng checked để nhận boolean từ state và onChange để cập nhật lại state."
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
    card.innerHTML = `
      <h3>${index + 1}. ${item.question}</h3>
      <div class="quiz-options"></div>
      <p class="quiz-explain">${item.explain}</p>
    `;

    const options = $(".quiz-options", card);
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
    button.textContent = isHidden ? "Hide code" : "Show code";
  });
});

document.querySelectorAll("[data-demo]").forEach((panel) => {
  const demos = {
    stateCounter: stateLab,
    eventLab,
    sharingLab,
    controlledLab,
    formLab
  };

  demos[panel.dataset.demo]?.(panel);
});

quizLab(document);
