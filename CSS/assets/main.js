const getControl = (panel, name) => panel.querySelector(`[data-control="${name}"]`);
const getTarget = (panel, name) => panel.querySelector(`[data-target="${name}"]`);
const getValue = (panel, name) => getControl(panel, name).value;
const isChecked = (panel, name) => getControl(panel, name).checked;
const toSeconds = (value) => `${(Number(value) / 100).toFixed(2).replace(/0$/, "").replace(/\.0$/, "")}s`;

const setOutput = (panel, name, value) => {
  const output = panel.querySelector(`[data-output="${name}"]`);
  if (output) {
    output.textContent = value;
  }
};

const setCode = (panel, css) => {
  const code = panel.querySelector("[data-live-code]");
  if (code) {
    code.textContent = css.trim();
  }
};

const setMetric = (panel, name, value) => {
  const metric = panel.querySelector(`[data-metric="${name}"]`);
  if (metric) {
    metric.textContent = value;
  }
};

const demoUpdaters = {
  cascadePriority(panel) {
    const rules = [
      {
        id: "tag",
        label: "tag selector",
        control: "cascadeTag",
        color: "#64748b",
        result: "Tag selector đang thắng vì chưa có rule mạnh hơn được bật."
      },
      {
        id: "class",
        label: "class selector",
        control: "cascadeClass",
        color: "#2563eb",
        result: "Class selector thắng tag selector vì class cụ thể hơn tag."
      },
      {
        id: "classLate",
        label: "class viết sau",
        control: "cascadeClassLate",
        color: "#0f9f8f",
        result: "Rule class viết sau đang thắng vì cùng specificity nhưng xuất hiện sau."
      },
      {
        id: "id",
        label: "id selector",
        control: "cascadeId",
        color: "#f59e0b",
        result: "ID selector đang thắng vì id cụ thể hơn class và tag."
      },
      {
        id: "inline",
        label: "inline style",
        control: "cascadeInline",
        color: "#16a34a",
        result: "Inline style đang thắng vì nó nằm trực tiếp trên element."
      },
      {
        id: "important",
        label: "!important",
        control: "cascadeImportant",
        color: "#e11d48",
        result: "!important đang thắng vì importance được xét trước specificity."
      }
    ];
    const enabledRules = rules.filter((rule) => isChecked(panel, rule.control));
    const winner = enabledRules[enabledRules.length - 1];
    const button = getTarget(panel, "cascadeButton");
    const result = panel.querySelector('[data-output="cascadeWinner"]');

    panel.querySelectorAll("[data-rule]").forEach((card) => {
      const rule = rules.find((item) => item.id === card.dataset.rule);
      const isEnabled = rule && isChecked(panel, rule.control);
      const isWinner = winner && card.dataset.rule === winner.id;

      card.classList.toggle("is-off", !isEnabled);
      card.classList.toggle("is-lost", Boolean(isEnabled && !isWinner));
      card.classList.toggle("is-winner", Boolean(isWinner));
    });

    if (winner) {
      button.style.background = winner.color;
      button.textContent = `Button mẫu - ${winner.label}`;
      result.textContent = winner.result;
    } else {
      button.style.background = "#ffffff";
      button.style.color = "#0f172a";
      button.textContent = "Button mẫu";
      result.textContent = "Chưa bật rule nào nên button chỉ còn style mặc định.";
      return;
    }

    button.style.color = "#ffffff";
  },

  background(panel) {
    const target = getTarget(panel, "background");
    const bgColor = getValue(panel, "bgColor");
    const bgSize = getValue(panel, "bgSize");
    const borderOn = isChecked(panel, "borderOn");
    const borderWidth = getValue(panel, "borderWidth");
    const borderColor = getValue(panel, "borderColor");
    const hasImage = isChecked(panel, "bgImage");

    setOutput(panel, "borderWidth", `${borderWidth}px`);
    target.style.backgroundColor = bgColor;
    target.style.backgroundImage = hasImage
      ? `radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 7px, transparent 8px),
           linear-gradient(135deg, ${bgColor}, #0f9f8f)`
      : "none";
    target.style.backgroundRepeat = hasImage ? "repeat, no-repeat" : "no-repeat";
    target.style.backgroundSize = hasImage ? `${bgSize}, cover` : "auto";
    target.style.border = borderOn ? `${borderWidth}px solid ${borderColor}` : "0";

    setCode(panel, `.bg-surface {
  background-color: ${bgColor};
${hasImage ? `  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 7px, transparent 8px),
    linear-gradient(135deg, ${bgColor}, #0f9f8f);
  background-repeat: repeat, no-repeat;
  background-size: ${bgSize}, cover;` : "  background-image: none;"}
  border: ${borderOn ? `${borderWidth}px solid ${borderColor}` : "0"};
}`);
  },

  flex(panel) {
    const target = getTarget(panel, "flex");
    const displayFlex = isChecked(panel, "displayFlex");
    const direction = getValue(panel, "flexDirection");
    const alignItems = getValue(panel, "alignItems");
    const justifyContent = getValue(panel, "justifyContent");
    const gap = getValue(panel, "gap");

    setOutput(panel, "gap", `${gap}px`);
    target.style.display = displayFlex ? "flex" : "block";
    target.style.flexDirection = direction;
    target.style.alignItems = alignItems;
    target.style.justifyContent = justifyContent;
    target.style.gap = `${gap}px`;
    target.querySelectorAll("b").forEach((item) => {
      item.style.width = displayFlex && alignItems === "stretch" ? "auto" : "48px";
    });

    setCode(panel, `.flex-action {
  display: ${displayFlex ? "flex" : "block"};
${displayFlex ? `  flex-direction: ${direction};
  align-items: ${alignItems};
  justify-content: ${justifyContent};
  gap: ${gap}px;` : "  /* flex-direction, align-items, justify-content và gap cần display: flex */"}
}`);
  },

  layoutCompare(panel) {
    const target = getTarget(panel, "layoutCompare");
    const items = [...target.querySelectorAll("span")];
    const mode = getValue(panel, "layoutMode");
    const itemCount = getValue(panel, "layoutItems");
    const columns = getValue(panel, "gridColumns");
    const flexItemWidth = getValue(panel, "flexItemWidth");
    const gap = getValue(panel, "layoutGap");

    setOutput(panel, "layoutItems", itemCount);
    setOutput(panel, "gridColumns", columns);
    setOutput(panel, "flexItemWidth", `${flexItemWidth}px`);
    setOutput(panel, "layoutGap", `${gap}px`);

    target.style.display = mode;
    target.style.gap = `${gap}px`;
    target.style.gridTemplateColumns = mode === "grid" ? `repeat(${columns}, minmax(0, 1fr))` : "";
    target.style.flexWrap = mode === "flex" ? "wrap" : "";
    target.style.alignContent = mode === "flex" ? "flex-start" : "";

    items.forEach((item, index) => {
      item.hidden = index >= Number(itemCount);
      item.style.flex = mode === "flex" ? `0 0 ${flexItemWidth}px` : "";
      item.style.width = "";
    });

    setCode(panel, mode === "grid"
      ? `.layout-compare {
  display: grid;
  grid-template-columns: repeat(${columns}, minmax(0, 1fr));
  gap: ${gap}px;
}`
      : `.layout-compare {
  display: flex;
  flex-wrap: wrap;
  gap: ${gap}px;
}

.layout-compare span {
  flex: 0 0 ${flexItemWidth}px;
}`);
  },

  position(panel) {
    const badge = getTarget(panel, "positionBadge");
    const absoluteOn = isChecked(panel, "absoluteOn");
    const horizontal = getValue(panel, "horizontal");
    const vertical = getValue(panel, "vertical");
    const xOffset = getValue(panel, "xOffset");
    const yOffset = getValue(panel, "yOffset");

    setOutput(panel, "xOffset", `${xOffset}px`);
    setOutput(panel, "yOffset", `${yOffset}px`);

    badge.style.position = absoluteOn ? "absolute" : "static";
    badge.style.top = "auto";
    badge.style.right = "auto";
    badge.style.bottom = "auto";
    badge.style.left = "auto";

    if (absoluteOn) {
      badge.style[horizontal] = `${xOffset}px`;
      badge.style[vertical] = `${yOffset}px`;
    }

    setCode(panel, `.position-stage {
  position: relative;
}

.position-stage em {
  position: ${absoluteOn ? "absolute" : "static"};
${absoluteOn ? `  ${horizontal}: ${xOffset}px;
  ${vertical}: ${yOffset}px;` : "  /* top/right/bottom/left không có tác dụng khi position: static */"}
}`);
  },

  spacing(panel) {
    const box = getTarget(panel, "spacingBox");
    const content = getTarget(panel, "spacingContent");
    const width = getValue(panel, "boxWidth");
    const height = getValue(panel, "boxHeight");
    const padding = getValue(panel, "boxPadding");
    const margin = getValue(panel, "boxMargin");
    const boxSizing = getValue(panel, "boxSizing");
    const border = getValue(panel, "boxBorder");
    const contentWidth = getValue(panel, "contentWidth");
    const contentHeight = getValue(panel, "contentHeight");

    setOutput(panel, "boxWidth", `${width}px`);
    setOutput(panel, "boxHeight", `${height}px`);
    setOutput(panel, "boxPadding", `${padding}px`);
    setOutput(panel, "boxMargin", `${margin}px`);
    setOutput(panel, "boxBorder", `${border}px`);
    setOutput(panel, "contentWidth", `${contentWidth}px`);
    setOutput(panel, "contentHeight", `${contentHeight}px`);

    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
    box.style.padding = `${padding}px`;
    box.style.marginTop = `${margin}px`;
    box.style.boxSizing = boxSizing;
    box.style.borderWidth = `${border}px`;
    content.style.width = `${contentWidth}px`;
    content.style.height = `${contentHeight}px`;

    const declaredWidth = Number(width);
    const paddingTotal = Number(padding) * 2;
    const borderTotal = Number(border) * 2;
    const visualWidth = boxSizing === "content-box"
      ? declaredWidth + paddingTotal + borderTotal
      : declaredWidth;
    const contentArea = boxSizing === "content-box"
      ? declaredWidth
      : Math.max(0, declaredWidth - paddingTotal - borderTotal);

    setMetric(panel, "declaredWidth", `${declaredWidth}px`);
    setMetric(panel, "paddingTotal", `${paddingTotal}px`);
    setMetric(panel, "borderTotal", `${borderTotal}px`);
    setMetric(panel, "visualWidth", `${visualWidth}px`);
    setMetric(panel, "contentArea", `${contentArea}px`);
    setMetric(
      panel,
      "formula",
      boxSizing === "content-box"
        ? `content-box: total = width + padding*2 + border*2 = ${declaredWidth} + ${paddingTotal} + ${borderTotal} = ${visualWidth}px`
        : `border-box: total = width = ${visualWidth}px; content tự co còn ${contentArea}px`
    );

    setCode(panel, `.spacing-action > div {
  width: ${width}px;
  height: ${height}px;
  padding: ${padding}px;
  border: ${border}px solid #f97316;
  margin-top: ${margin}px;
  box-sizing: ${boxSizing};
}

.spacing-action span {
  width: ${contentWidth}px;
  height: ${contentHeight}px;
}`);
  },

  overflow(panel) {
    const target = getTarget(panel, "overflow");
    const overflow = getValue(panel, "overflow");
    const maxHeight = getValue(panel, "maxHeight");
    const opacity = (Number(getValue(panel, "opacity")) / 100).toFixed(2);

    setOutput(panel, "maxHeight", `${maxHeight}px`);
    setOutput(panel, "opacity", opacity);
    target.style.maxHeight = `${maxHeight}px`;
    target.style.overflow = overflow;
    target.style.opacity = opacity;

    setCode(panel, `.overflow-action {
  max-height: ${maxHeight}px;
  overflow: ${overflow};
  opacity: ${opacity};
}`);
  },

  text(panel) {
    const target = getTarget(panel, "text");
    const paragraph = target.querySelector("p");
    const list = target.querySelector("ul");
    const chip = getTarget(panel, "floatChip");
    const fontSize = getValue(panel, "fontSize");
    const fontWeight = getValue(panel, "fontWeight");
    const lineHeight = (Number(getValue(panel, "lineHeight")) / 10).toFixed(1);
    const listStyle = getValue(panel, "listStyle");
    const floatValue = getValue(panel, "float");

    setOutput(panel, "fontSize", `${fontSize}px`);
    setOutput(panel, "lineHeight", lineHeight);
    paragraph.style.fontSize = `${fontSize}px`;
    paragraph.style.fontWeight = fontWeight;
    paragraph.style.lineHeight = lineHeight;
    list.style.listStyleType = listStyle;
    chip.style.float = floatValue;

    setCode(panel, `.text-action p {
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  line-height: ${lineHeight};
}

.text-action ul {
  list-style: ${listStyle};
}

.float-chip {
  float: ${floatValue};
}`);
  },

  animation(panel) {
    const target = getTarget(panel, "animation");
    const dot = target.querySelector("i");
    const status = getTarget(panel, "animationStatus");
    const animationOn = isChecked(panel, "animationOn");
    const duration = toSeconds(getValue(panel, "duration"));
    const delay = toSeconds(getValue(panel, "delay"));
    const timing = getValue(panel, "timing");
    const direction = getValue(panel, "direction");
    const iteration = getValue(panel, "iteration");

    setOutput(panel, "duration", duration);
    setOutput(panel, "delay", delay);
    dot.style.animation = animationOn ? `slide ${duration} ${timing} ${delay} ${iteration} ${direction}` : "none";
    status.textContent = animationOn
      ? `animation: slide ${duration} ${timing} ${delay} ${iteration} ${direction}`
      : "animation: none";

    setCode(panel, `.motion-track i {
  animation: ${animationOn ? `slide ${duration} ${timing} ${delay} ${iteration} ${direction}` : "none"};
}

@keyframes slide {
  from {
    left: 24px;
  }
  to {
    left: calc(100% - 54px);
  }
}`);
  },

  display(panel) {
    const target = getTarget(panel, "display");
    const chips = target.querySelectorAll(".display-chip");
    const display = getValue(panel, "display");
    const center = isChecked(panel, "centerItems");
    const width = getValue(panel, "displayWidth");
    const height = getValue(panel, "displayHeight");
    const gap = getValue(panel, "displayGap");

    setOutput(panel, "displayWidth", `${width}px`);
    setOutput(panel, "displayHeight", `${height}px`);
    setOutput(panel, "displayGap", `${gap}px`);
    chips.forEach((chip) => {
      chip.style.display = display;
      chip.style.margin = display === "none" ? "" : `${gap}px`;
      chip.style.width = display === "inline" || display === "none" ? "" : `${width}px`;
      chip.style.height = display === "inline" || display === "none" ? "" : `${height}px`;
      chip.style.textAlign = center ? "center" : "left";
      chip.style.alignItems = center && display === "flex" ? "center" : "";
      chip.style.justifyContent = center && display === "flex" ? "center" : "";
      chip.style.placeItems = center && display === "grid" ? "center" : "";
      chip.style.lineHeight = center && (display === "block" || display === "inline-block") ? `${Math.max(0, Number(height) - 16)}px` : "";
    });

    const sizeCode = display === "inline"
      ? "  /* width/height không có tác dụng với display: inline */"
      : display === "none"
        ? "  /* element biến mất khỏi layout */"
        : `  width: ${width}px;
  height: ${height}px;`;

    setCode(panel, `.display-action .display-chip {
  display: ${display};
${display !== "none" ? `  margin: ${gap}px;` : ""}
${sizeCode}
${center ? "  text-align: center;" : ""}
}`);
  },

  statePseudo(panel) {
    if (!panel.dataset.stateReady) {
      const setToken = (name, isOn) => {
        const token = panel.querySelector(`[data-state-readout="${name}"]`);
        if (token) {
          token.classList.toggle("is-on", isOn);
        }
      };
      const hoverTrigger = panel.querySelector(".pseudo-link-demo");
      const activeTrigger = getTarget(panel, "activePseudo");
      const focusTrigger = getTarget(panel, "focusPseudo");

      hoverTrigger.addEventListener("mouseenter", () => setToken("hover", true));
      hoverTrigger.addEventListener("mouseover", () => setToken("hover", true));
      hoverTrigger.addEventListener("mouseleave", () => setToken("hover", false));
      hoverTrigger.addEventListener("mouseout", () => setToken("hover", false));

      activeTrigger.addEventListener("pointerdown", () => setToken("active", true));
      activeTrigger.addEventListener("mousedown", () => setToken("active", true));
      activeTrigger.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          setToken("active", true);
        }
      });
      ["pointerup", "mouseup", "mouseleave", "blur", "keyup", "click"].forEach((eventName) => {
        activeTrigger.addEventListener(eventName, () => setToken("active", false));
      });

      focusTrigger.addEventListener("focus", () => setToken("focus", true));
      focusTrigger.addEventListener("focusin", () => setToken("focus", true));
      focusTrigger.addEventListener("click", () => setToken("focus", true));
      focusTrigger.addEventListener("blur", () => setToken("focus", false));
      focusTrigger.addEventListener("focusout", () => setToken("focus", false));

      panel.dataset.stateReady = "true";
    }

    setCode(panel, `/* :link áp dụng cho link chưa từng được truy cập */
.pseudo-link-demo:link {
  color: #2563eb;
}

/* :visited áp dụng cho link đã được trình duyệt ghi nhận là đã truy cập */
.pseudo-link-demo:visited {
  color: #7c3aed;
}

/* :hover bật khi con trỏ đang nằm trên phần tử */
.pseudo-link-demo:hover,
.pseudo-button-demo:hover {
  background: #0f9f8f;
  color: #ffffff;
}

/* :active chỉ tồn tại trong lúc đang nhấn giữ */
.pseudo-button-demo:active {
  transform: translateY(2px) scale(0.98);
}

/* :focus bật khi input đang nhận bàn phím */
.pseudo-input-demo:focus {
  border-color: #2563eb;
  outline: 3px solid rgba(37, 99, 235, 0.18);
}

/* Dòng mô tả trong demo sáng lên nhờ sibling selector */
.pseudo-link-demo:hover + .state-token,
.pseudo-button-demo:active + .state-token,
.pseudo-input-demo:focus + .state-token {
  background: #ecfdf5;
  border-color: #86efac;
}`);
  },

  formPseudo(panel) {
    const checked = isChecked(panel, "checkedState");
    const disabled = isChecked(panel, "disableState");
    const empty = isChecked(panel, "emptyState");
    const disabledButton = getTarget(panel, "disabledPseudo");
    const emptyBox = getTarget(panel, "emptyPseudo");

    disabledButton.disabled = disabled;
    emptyBox.textContent = empty ? "" : "Có nội dung";

    setCode(panel, `/* Checkbox hiện tại: ${checked ? "checked" : "unchecked"} */
.pseudo-check-demo input:checked + span {
  color: #16a34a;
  font-weight: 900;
}

/* Button hiện tại: ${disabled ? "disabled" : "enabled"} */
.pseudo-disabled-demo:disabled {
  background: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

/* Ô demo hiện tại: ${empty ? "empty" : "có nội dung"} */
.pseudo-empty-demo:empty {
  background: repeating-linear-gradient(
    45deg,
    #fef3c7 0 10px,
    #fde68a 10px 20px
  );
}`);
  },

  generatedPseudo(panel) {
    const badge = getTarget(panel, "generatedBadge");
    const beforeOn = isChecked(panel, "beforeOn");
    const afterOn = isChecked(panel, "afterOn");
    const afterText = getValue(panel, "afterText").replace(/["\\]/g, "").trim() || "NEW";
    const tone = getValue(panel, "badgeTone");

    badge.classList.toggle("no-before", !beforeOn);
    badge.classList.toggle("no-after", !afterOn);
    badge.dataset.after = afterText;
    badge.style.setProperty("--badge-bg", tone);

    setCode(panel, `.generated-badge {
  background: ${tone};
}

.generated-badge::before {
  content: ${beforeOn ? "\"★\"" : "none"};
}

.generated-badge::after {
  content: ${afterOn ? `"${afterText}"` : "none"};
}

.generated-quote::before {
  content: "\u201c";
}

.generated-quote::after {
  content: "\u201d";
}`);
  },

  textPseudo(panel) {
    const target = getTarget(panel, "textPseudo");
    const size = getValue(panel, "letterSize");
    const color = getValue(panel, "letterColor");
    const dropCap = isChecked(panel, "dropCap");

    setOutput(panel, "letterSize", `${size}px`);
    target.style.setProperty("--first-letter-size", `${size}px`);
    target.style.setProperty("--first-letter-color", color);
    target.style.setProperty("--first-letter-float", dropCap ? "left" : "none");
    target.style.setProperty("--first-letter-margin", dropCap ? "8px" : "0");

    setCode(panel, `.first-letter-demo::first-letter {
  float: ${dropCap ? "left" : "none"};
  margin-right: ${dropCap ? "8px" : "0"};
  color: ${color};
  font-size: ${size}px;
  font-weight: 900;
  line-height: 0.9;
}`);
  },

  nthPseudo(panel) {
    const selector = getValue(panel, "nthSelector");
    const target = getTarget(panel, "nthPseudo");
    const items = [...target.children];
    const selected = target.querySelectorAll(`:scope > ${selector}`);

    items.forEach((item) => item.classList.remove("is-selected"));
    selected.forEach((item) => item.classList.add("is-selected"));

    setCode(panel, `.nth-playground > ${selector} {
  background: #e11d48;
  color: #ffffff;
  border-color: #e11d48;
}`);
  }
};

document.querySelectorAll("[data-demo]").forEach((panel) => {
  const update = () => demoUpdaters[panel.dataset.demo]?.(panel);

  panel.querySelectorAll("[data-control]").forEach((control) => {
    control.addEventListener("input", update);
    control.addEventListener("change", update);
  });

  update();
});

document.querySelectorAll("[data-code-toggle]").forEach((button) => {
  const codeBlock = document.getElementById(button.getAttribute("aria-controls"));

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "Show code" : "Hide code";

    if (codeBlock) {
      codeBlock.hidden = isOpen;
    }
  });
});

const quizCards = [...document.querySelectorAll(".quiz-card")];
const quizScore = document.querySelector("[data-quiz-score]");
const quizNote = document.querySelector("[data-quiz-note]");

const updateQuiz = () => {
  let answered = 0;
  let correct = 0;

  quizCards.forEach((card) => {
    const answer = card.dataset.answer;
    const selected = card.querySelector("input:checked");
    const labels = [...card.querySelectorAll("label")];

    card.classList.toggle("is-answered", Boolean(selected));
    card.dataset.state = "";

    labels.forEach((label) => {
      const input = label.querySelector("input");
      const isSelected = selected === input;
      const isAnswer = input.value === answer;

      label.classList.toggle("is-selected", isSelected);
      label.classList.toggle("is-answer", Boolean(selected) && isAnswer);
      label.classList.toggle("is-missed", Boolean(selected) && isSelected && !isAnswer);
    });

    if (selected) {
      answered += 1;
      if (selected.value === answer) {
        correct += 1;
        card.dataset.state = "correct";
      } else {
        card.dataset.state = "wrong";
      }
    }
  });

  if (quizScore) {
    quizScore.textContent = `${correct}/${quizCards.length}`;
  }

  if (quizNote) {
    quizNote.textContent = answered === 0
      ? "Chưa chọn đáp án nào."
      : answered === quizCards.length
        ? `Đã trả lời đủ ${quizCards.length} câu.`
        : `Đã chọn ${answered}/${quizCards.length} câu.`;
  }
};

quizCards.forEach((card) => {
  card.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", updateQuiz);
  });
});

updateQuiz();
