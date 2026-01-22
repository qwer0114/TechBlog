/**
 * @fileoverview Notion 블록 타입 정의
 *
 * Notion API의 블록 타입들을 TypeScript 타입으로 정의합니다.
 * 이 타입들은 블로그 콘텐츠를 렌더링하기 위해 사용됩니다.
 */

/**
 * Notion에서 지원하는 블록 타입들
 */
export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "quote"
  | "code"
  | "callout"
  | "divider"
  | "image"
  | "bookmark"
  | "toggle"
  | "to_do";

/**
 * 리치 텍스트 주석 (색상, 볼드, 이탤릭 등)
 */
export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

/**
 * Notion 리치 텍스트 객체
 */
export interface RichText {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link?: {
      url: string;
    } | null;
  };
  annotations: RichTextAnnotations;
  plain_text: string;
  href?: string | null;
}

/**
 * 파싱된 리치 텍스트 (간소화된 버전)
 */
export interface ParsedRichText {
  content: string;
  link?: string;
  annotations: RichTextAnnotations;
}

/**
 * 단락 블록
 */
export interface ParagraphBlock {
  type: "paragraph";
  content: ParsedRichText[];
  hasChildren: boolean;
}

/**
 * 제목 블록 (H1, H2, H3)
 */
export interface HeadingBlock {
  type: "heading_1" | "heading_2" | "heading_3";
  content: ParsedRichText[];
  isToggleable: boolean;
}

/**
 * 리스트 아이템 블록
 */
export interface ListItemBlock {
  type: "bulleted_list_item" | "numbered_list_item";
  content: ParsedRichText[];
  hasChildren: boolean;
}

/**
 * 인용구 블록
 */
export interface QuoteBlock {
  type: "quote";
  content: ParsedRichText[];
}

/**
 * 코드 블록
 */
export interface CodeBlock {
  type: "code";
  content: string;
  language: string;
  caption: ParsedRichText[];
}

/**
 * Callout 블록 (정보 박스)
 */
export interface CalloutBlock {
  type: "callout";
  content: ParsedRichText[];
  icon?: {
    type: "emoji" | "external" | "file";
    emoji?: string;
    url?: string;
  };
  color: string;
}

/**
 * 구분선 블록
 */
export interface DividerBlock {
  type: "divider";
}

/**
 * 이미지 블록
 */
export interface ImageBlock {
  type: "image";
  url: string;
  caption: ParsedRichText[];
}

/**
 * 북마크 블록
 */
export interface BookmarkBlock {
  type: "bookmark";
  url: string;
  caption: ParsedRichText[];
}

/**
 * 토글 블록
 */
export interface ToggleBlock {
  type: "toggle";
  content: ParsedRichText[];
  hasChildren: boolean;
}

/**
 * To-Do 블록
 */
export interface ToDoBlock {
  type: "to_do";
  content: ParsedRichText[];
  checked: boolean;
  hasChildren: boolean;
}

/**
 * 모든 블록 타입의 유니온
 */
export type ParsedBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListItemBlock
  | QuoteBlock
  | CodeBlock
  | CalloutBlock
  | DividerBlock
  | ImageBlock
  | BookmarkBlock
  | ToggleBlock
  | ToDoBlock;

/**
 * 블록 ID와 자식 블록을 포함한 완전한 블록 구조
 */
export interface BlockWithMetadata {
  id: string;
  block: ParsedBlock;
  children?: BlockWithMetadata[];
}
