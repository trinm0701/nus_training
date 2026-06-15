# Bài giảng CSS căn bản

Thư mục này chứa toàn bộ tài liệu cho buổi training CSS tiếng Việt. Bài giảng chạy hoàn toàn trên trình duyệt, không cần cài thêm gì.

## Cấu trúc thư mục

```
CSS/
├── index.html          # Trang bài giảng chính
├── styles.css          # Toàn bộ CSS của trang
├── assets/
│   ├── main.js         # Logic JavaScript (interactive demos và quiz)
│   └── css-learning-map.svg  # Sơ đồ lộ trình học CSS
└── README.md
```

## Cách mở

Mở file `index.html` trực tiếp bằng trình duyệt:

```bash
open CSS/index.html
```

Hoặc kéo thả file `index.html` vào cửa sổ trình duyệt. Không cần server.

## Nội dung chính (8 chặng)

Bài giảng được chia theo 8 mục trên thanh điều hướng, theo thứ tự từ nền tảng đến nâng cao:

1. **Syntax** — Cú pháp một CSS rule: selector, property, value, declaration.
2. **Selectors** — Phân biệt `.class` và `#id`; cheat sheet 11 loại selector (element, group, descendant, child, attribute và các biến thể `^=`, `*=`, `~=`).
3. **How To** — 3 cách nhúng CSS (inline, internal, external) và lab tương tác **Cascading Order**: bật/tắt từng rule (tag → class → class viết sau → id → inline → `!important`) để thấy rule nào thắng và vì sao.
4. **Properties** — 10 nhóm property có ví dụ trực quan (background, border, color & cursor, display & flex, font, width/height/position, margin & padding, opacity & overflow, line-height/list-style/float, animation) kèm **Properties Lab** gồm 9 panel tương tác: mỗi panel có checkbox, select, slider và nút `Show code` sinh CSS live theo lựa chọn hiện tại.
5. **Pseudo** — 5 lab tương tác cho pseudo class và pseudo element: trạng thái tương tác (`:hover`, `:active`, `:focus`), form state (`:checked`, `:disabled`, `:empty`), nội dung ảo (`::before`, `::after`), text pseudo (`::first-letter`), và nhóm vị trí (`:first-child`, `:last-child`, `:nth-child()`, `:first-of-type`, `:not()` và các biến thể).
6. **Responsive** — Viewport meta tag, fluid layout (`%`, `fr`, `clamp()`), media query `@media`, xử lý ảnh và text tràn.
7. **Quiz** — 8 câu trắc nghiệm có chấm điểm tự động và giải thích đáp án ngay sau khi chọn.
8. **Tips** — 15 kinh nghiệm thực tế: debug với DevTools, tránh lạm dụng `!important`, dùng `gap` thay margin, `min-width: 0` cho flex/grid item, `prefers-reduced-motion` và các thói quen viết CSS dễ bảo trì.

## Gợi ý dùng trong buổi train

1. Đi theo thứ tự 8 mục trên thanh điều hướng.
2. Dừng ở **Selectors** để học viên tự đọc cheat sheet và đoán selector nào sẽ match với từng trường hợp.
3. Ở **How To**, bật/tắt từng checkbox trong lab Cascading Order để cả lớp cùng quan sát thứ tự ưu tiên.
4. Ở **Properties**, cho học viên tự kéo slider, đổi select, sau đó bấm `Show code` để đối chiếu CSS đang được apply.
5. Ở **Pseudo**, thao tác trực tiếp lên từng demo (hover link, nhấn giữ button, focus input) để thấy state thay đổi theo thời gian thực.
6. Kết thúc bằng **Quiz** để ôn lại nhanh — học viên chọn đáp án, điểm và giải thích hiện ngay.



