# Bài giảng ReactJS: State, Events và Forms

Thư mục này chứa bài giảng ReactJS tiếng Việt theo phong cách trực quan của folder `CSS/`. Bài giảng chạy hoàn toàn trên trình duyệt, không cần cài thêm package hay chạy dev server.

## Cấu trúc thư mục

```text
ReactJS/
├── index.html                  # Trang bài giảng chính
├── styles.css                  # Giao diện và responsive layout
├── assets/
│   ├── main.js                 # Logic cho interactive demos và quiz
│   └── react-state-map.svg     # Sơ đồ lộ trình học React state
└── README.md
```

## Cách mở

Mở trực tiếp file `index.html` bằng trình duyệt:

```bash
open ReactJS/index.html
```

## Nội dung chính

1. **useState Hook** - cú pháp, next render, updater function, Rules of Hooks, tránh direct mutation, object/array state và lazy initializer.
2. **Event handling** - truyền function vào event prop, đọc event object, đặt tên handler và truyền handler qua props.
3. **Sharing State Between Components** - lifting state up, common parent làm source of truth, truyền value và handler qua props.
4. **Controlled components** - input dùng `value`/`checked` cùng `onChange`, preview state sống và JSON state.
5. **Forms** - so sánh controlled form với uncontrolled + `FormData`, demo submit và React DOM `<form action={fn}>`.
6. **Quiz** - 8 câu hỏi tự chấm điểm và giải thích đáp án.
7. **Tips** - checklist lỗi thường gặp khi làm state, events và forms.

## Nguồn tham khảo

- React docs: `useState` - https://react.dev/reference/react/useState
- React docs: Responding to Events - https://react.dev/learn/responding-to-events
- React docs: Sharing State Between Components - https://react.dev/learn/sharing-state-between-components
- React docs: `<input>` - https://react.dev/reference/react-dom/components/input
- React docs: `<form>` - https://react.dev/reference/react-dom/components/form
