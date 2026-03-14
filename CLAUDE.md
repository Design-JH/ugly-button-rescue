# CLAUDE.md — Ugly Button Rescue 코딩 가이드

이 파일은 AI 코딩 어시스턴트(Claude)가 이 프로젝트에서 코드를 작성할 때 반드시 따라야 할 규칙을 정의합니다.

---

## 1. 스타일링 원칙 — Tailwind CSS 우선

- **인라인 `style` 속성 사용 금지.** 동적 값(사용자 토큰)을 적용할 때는 CSS 변수(`--token-*`)를 통해 주입하고, Tailwind 유틸리티로 참조한다.
- Tailwind 클래스는 논리적 순서로 정렬한다: `layout → spacing → sizing → typography → color → border → effect → state`.
- 커스텀 색상, 간격, 반경 등 디자인 토큰은 `tailwind.config.ts`의 `theme.extend`에 등록해서 재사용한다.
- `@apply`는 컴포넌트 단위 CSS 파일에서만 허용하고, 전역 스타일(`globals.css`)에는 최소한만 작성한다.

## 2. 미니멀리즘 원칙

- 컴포넌트는 **단일 책임**을 가진다. 하나의 컴포넌트가 UI 렌더링과 비즈니스 로직을 동시에 담당하지 않는다.
- Props는 필요한 것만 받는다. 미래를 위한 `reserved` 필드를 미리 추가하지 않는다.
- 상태(state)는 가능한 한 위로 올리지 말고, 실제로 필요한 컴포넌트에 가장 가깝게 둔다.
- 파일 하나당 컴포넌트 하나. 관련 타입 정의는 같은 파일 하단 또는 `types/` 디렉터리에 분리한다.

## 3. 주석 원칙 — 설명이 필요한 것만

- **자명한 코드에 주석을 달지 않는다.** `// 버튼 렌더링` 같은 주석은 소음이다.
- 주석은 **왜(Why)** 이 코드가 이렇게 생겼는지를 설명한다. 무엇(What)은 코드가 말한다.
- 복잡한 토큰 계산 로직, 브라우저 호환성 핵(hack), 의도적인 타입 캐스팅에는 반드시 한 줄 이유를 남긴다.
- JSDoc은 외부에 노출되는 유틸리티 함수에만 작성한다.

```ts
// 좋은 예: 왜 이 값인지 설명
// Safari는 focus-visible을 지원하지 않으므로 :focus 폴백을 병행한다
outline: token.focusRing ? `2px solid ${token.color}` : 'none',

// 나쁜 예: 코드가 이미 말하고 있음
// color 값을 설정한다
color: token.color,
```

## 4. TypeScript 규칙

- `any` 타입 사용 금지. 불확실한 경우 `unknown`을 쓰고 타입 가드를 작성한다.
- 디자인 토큰 구조는 반드시 인터페이스로 정의한다 (`DesignToken`, `ButtonPreset` 등).
- 컴포넌트 Props 타입은 `type ButtonProps = { ... }` 형식으로, 파일 상단에 선언한다.
- 선택적 Props에는 기본값을 명시한다.

## 5. 파일 구조

```
src/
  app/          # Next.js App Router 페이지
  components/   # 재사용 가능한 UI 컴포넌트
    ui/         # 원자 단위 컴포넌트 (Button, Slider, ColorPicker)
    panels/     # 패널 단위 컴포넌트 (TokenEditor, CodeOutput)
  lib/          # 순수 유틸리티 함수 (토큰 변환, 코드 생성)
  types/        # 공유 타입 정의
```

## 6. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `ButtonPreview.tsx` |
| 유틸리티 함수 | camelCase | `generateTailwindClass` |
| 디자인 토큰 키 | camelCase | `borderRadius`, `primaryColor` |
| CSS 변수 | kebab-case with prefix | `--token-border-radius` |
| 상수 | UPPER_SNAKE_CASE | `DEFAULT_PRESETS` |

## 7. 금지 사항

- `console.log` 를 커밋에 포함하지 않는다. 디버깅 후 반드시 제거한다.
- `!important` 사용 금지. 스타일 우선순위 문제는 선택자 구조로 해결한다.
- 하드코딩된 픽셀 값을 컴포넌트 내부에 직접 쓰지 않는다. 반드시 토큰 또는 Tailwind 스케일을 통한다.
