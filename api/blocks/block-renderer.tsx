/**
 * @fileoverview Notion 블록 렌더러 컴포넌트
 *
 * 파싱된 Notion 블록을 React 컴포넌트로 렌더링합니다.
 */

import React from "react";
import {
  ParsedBlock,
  ParsedRichText,
  BlockWithMetadata,
  ParagraphBlock,
  HeadingBlock,
  ListItemBlock,
  QuoteBlock,
  CodeBlock,
  CalloutBlock,
  ImageBlock,
  BookmarkBlock,
  ToggleBlock,
  ToDoBlock,
} from "./block-types";

/**
 * 리치 텍스트를 렌더링합니다.
 */
function RichTextRenderer({ content }: { content: ParsedRichText[] }) {
  return (
    <>
      {content.map((text, index) => {
        const { content: textContent, link, annotations } = text;
        let element: React.ReactNode = textContent;

        // 주석 적용
        if (annotations.bold) {
          element = <strong>{element}</strong>;
        }
        if (annotations.italic) {
          element = <em>{element}</em>;
        }
        if (annotations.strikethrough) {
          element = <s>{element}</s>;
        }
        if (annotations.underline) {
          element = <u>{element}</u>;
        }
        if (annotations.code) {
          element = <code className="inline-code">{element}</code>;
        }

        // 링크 적용
        if (link) {
          element = (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {element}
            </a>
          );
        }

        return <span key={index}>{element}</span>;
      })}
    </>
  );
}

/**
 * 단락 블록 렌더러
 */
function ParagraphBlockRenderer({ block }: { block: ParagraphBlock }) {
  return (
    <p className="notion-paragraph">
      <RichTextRenderer content={block.content} />
    </p>
  );
}

/**
 * 제목 블록 렌더러
 */
function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const HeadingTag = block.type === "heading_1" ? "h1" : block.type === "heading_2" ? "h2" : "h3";

  return (
    <HeadingTag className={`notion-${block.type}`}>
      <RichTextRenderer content={block.content} />
    </HeadingTag>
  );
}

/**
 * 리스트 아이템 블록 렌더러
 */
function ListItemBlockRenderer({ block }: { block: ListItemBlock }) {
  return (
    <li className={`notion-${block.type}`}>
      <RichTextRenderer content={block.content} />
    </li>
  );
}

/**
 * 인용구 블록 렌더러
 */
function QuoteBlockRenderer({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="notion-quote">
      <RichTextRenderer content={block.content} />
    </blockquote>
  );
}

/**
 * 코드 블록 렌더러
 */
function CodeBlockRenderer({ block }: { block: CodeBlock }) {
  return (
    <div className="notion-code">
      <pre>
        <code className={`language-${block.language}`}>{block.content}</code>
      </pre>
      {block.caption.length > 0 && (
        <figcaption className="notion-code-caption">
          <RichTextRenderer content={block.caption} />
        </figcaption>
      )}
    </div>
  );
}

/**
 * Callout 블록 렌더러
 */
function CalloutBlockRenderer({ block }: { block: CalloutBlock }) {
  return (
    <div className={`notion-callout notion-callout-${block.color}`}>
      {block.icon && (
        <span className="notion-callout-icon">
          {block.icon.type === "emoji" ? block.icon.emoji : "📌"}
        </span>
      )}
      <div className="notion-callout-content">
        <RichTextRenderer content={block.content} />
      </div>
    </div>
  );
}

/**
 * 구분선 블록 렌더러
 */
function DividerBlockRenderer() {
  return <hr className="notion-divider" />;
}

/**
 * 이미지 블록 렌더러
 */
function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  return (
    <figure className="notion-image">
      <img src={block.url} alt="" />
      {block.caption.length > 0 && (
        <figcaption className="notion-image-caption">
          <RichTextRenderer content={block.caption} />
        </figcaption>
      )}
    </figure>
  );
}

/**
 * 북마크 블록 렌더러
 */
function BookmarkBlockRenderer({ block }: { block: BookmarkBlock }) {
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="notion-bookmark"
    >
      <div className="notion-bookmark-title">{block.url}</div>
      {block.caption.length > 0 && (
        <div className="notion-bookmark-caption">
          <RichTextRenderer content={block.caption} />
        </div>
      )}
    </a>
  );
}

/**
 * 토글 블록 렌더러
 */
function ToggleBlockRenderer({ block }: { block: ToggleBlock }) {
  return (
    <details className="notion-toggle">
      <summary>
        <RichTextRenderer content={block.content} />
      </summary>
      {/* 자식 블록은 상위 컴포넌트에서 렌더링 */}
    </details>
  );
}

/**
 * To-Do 블록 렌더러
 */
function ToDoBlockRenderer({ block }: { block: ToDoBlock }) {
  return (
    <div className="notion-to-do">
      <input type="checkbox" checked={block.checked} readOnly />
      <span className={block.checked ? "notion-to-do-checked" : ""}>
        <RichTextRenderer content={block.content} />
      </span>
    </div>
  );
}

/**
 * 블록 타입에 따라 적절한 렌더러를 선택합니다.
 */
function BlockRenderer({ block }: { block: ParsedBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlockRenderer block={block} />;
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <HeadingBlockRenderer block={block} />;
    case "bulleted_list_item":
    case "numbered_list_item":
      return <ListItemBlockRenderer block={block} />;
    case "quote":
      return <QuoteBlockRenderer block={block} />;
    case "code":
      return <CodeBlockRenderer block={block} />;
    case "callout":
      return <CalloutBlockRenderer block={block} />;
    case "divider":
      return <DividerBlockRenderer />;
    case "image":
      return <ImageBlockRenderer block={block} />;
    case "bookmark":
      return <BookmarkBlockRenderer block={block} />;
    case "toggle":
      return <ToggleBlockRenderer block={block} />;
    case "to_do":
      return <ToDoBlockRenderer block={block} />;
    default:
      return null;
  }
}

/**
 * 메인 Notion 블록 렌더러 컴포넌트
 */
export function NotionBlocksRenderer({
  blocks,
}: {
  blocks: BlockWithMetadata[];
}) {
  return (
    <div className="notion-blocks">
      {blocks.map((blockWithMeta) => (
        <div key={blockWithMeta.id} className="notion-block">
          <BlockRenderer block={blockWithMeta.block} />
          {blockWithMeta.children && blockWithMeta.children.length > 0 && (
            <div className="notion-block-children">
              <NotionBlocksRenderer blocks={blockWithMeta.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 개별 렌더러들도 내보내기 (테스트용)
export {
  RichTextRenderer,
  ParagraphBlockRenderer,
  HeadingBlockRenderer,
  ListItemBlockRenderer,
  QuoteBlockRenderer,
  CodeBlockRenderer,
  CalloutBlockRenderer,
  DividerBlockRenderer,
  ImageBlockRenderer,
  BookmarkBlockRenderer,
  ToggleBlockRenderer,
  ToDoBlockRenderer,
};
