## 개요
Notion API를 활용한 블로그 글 상세 페이지를 구현했습니다. TDD 방식으로 테스트를 먼저 작성하고, Notion 블록 파서와 렌더러를 구축했습니다.

## 주요 변경사항

### 1️⃣ 테스트 환경 설정
- ✅ Vitest + Testing Library 설치 및 설정
- ✅ 47개 테스트 케이스 작성 및 모두 통과

### 2️⃣ Notion 블록 파서 시스템
**타입 정의** (`api/blocks/block-types.ts`)
- 14가지 Notion 블록 타입 정의
- TypeScript 완전 타입 안정성

**파서 로직** (`api/blocks/block-parser.ts`)
- `NotionBlockParser` 클래스 구현
- 각 블록 타입별 파싱 메서드
- 리치 텍스트 파싱 (볼드, 이탤릭, 링크 등)

**렌더러** (`api/blocks/block-renderer.tsx`)
- React 컴포넌트로 블록 렌더링
- 재귀적 자식 블록 지원
- 14가지 블록 타입 렌더링

### 3️⃣ API 함수
**포스트 상세 API** (`api/post-detail.ts`)
- `getPostById()` - 페이지 정보 가져오기
- `getPageBlocks()` - 블록 재귀적으로 가져오기
- `getPostWithBlocks()` - 페이지와 블록 동시 가져오기

### 4️⃣ 블로그 상세 페이지
**페이지 구현** (`/app/blog/[id]/page.tsx`)
- 기존 디자인 시스템과 일관된 UI
- 다크모드 완벽 지원
- 썸네일, 제목, 메타정보, 카테고리 표시
- Notion 블록 렌더링

**스타일링** (`app/globals.css`)
- 14가지 블록 타입별 스타일
- 코드 블록, Callout, 이미지 등 특수 블록 지원
- 다크모드 대응
- 기존 디자인과 조화

### 5️⃣ 에러 핸들링
- 환경 변수 누락 시 graceful degradation
- API 에러 핸들링
- TypeScript 타입 안정성 강화

## 지원하는 Notion 블록 타입
- ✅ 단락 (Paragraph)
- ✅ 제목 (Heading 1, 2, 3)
- ✅ 리스트 (Bulleted, Numbered)
- ✅ 인용구 (Quote)
- ✅ 코드 블록 (Code)
- ✅ Callout (6가지 컬러)
- ✅ 이미지 (Image)
- ✅ 북마크 (Bookmark)
- ✅ 토글 (Toggle)
- ✅ To-Do
- ✅ 구분선 (Divider)
- ✅ 텍스트 스타일 (Bold, Italic, Link, Inline Code 등)

## 테스트 결과
```
✅ 단위 테스트: 47개 통과
✅ 빌드: 성공
✅ TypeScript: 에러 없음
```

## 파일 구조
```
api/
├── blocks/
│   ├── block-types.ts           # 타입 정의
│   ├── block-parser.ts          # 파싱 로직
│   ├── block-parser.test.ts     # 파서 테스트 (24개)
│   ├── block-renderer.tsx       # 렌더링 컴포넌트
│   └── block-renderer.test.tsx  # 렌더러 테스트 (23개)
└── post-detail.ts               # API 함수

app/
└── blog/
    └── [id]/
        └── page.tsx             # 블로그 상세 페이지
```

## 다음 단계
- [ ] 코드 블록 Syntax Highlighting (예: Prism.js, Shiki)
- [ ] 목차(Table of Contents) 자동 생성
- [ ] 블로그 목록 페이지 (`/blog`)
- [ ] 시리즈별 페이지
- [ ] SEO 메타데이터 추가
