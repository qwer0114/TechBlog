/**
 * @fileoverview Notion 블록 파서
 *
 * Notion API 응답을 파싱하여 일관된 구조로 변환합니다.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BlockType,
  ParsedBlock,
  ParsedRichText,
  RichText,
  ParagraphBlock,
  HeadingBlock,
  ListItemBlock,
  QuoteBlock,
  CodeBlock,
  CalloutBlock,
  DividerBlock,
  ImageBlock,
  BookmarkBlock,
  ToggleBlock,
  ToDoBlock,
  BlockWithMetadata,
} from "./block-types";

/**
 * Notion 블록 파서 클래스
 */
export class NotionBlockParser {
  /**
   * 리치 텍스트 배열을 파싱합니다.
   */
  static parseRichText(richTextArray: any[]): ParsedRichText[] {
    if (!richTextArray || !Array.isArray(richTextArray)) {
      return [];
    }

    return richTextArray.map((rt: any) => ({
      content: rt.plain_text || "",
      link: rt.text?.link?.url || undefined,
      annotations: {
        bold: rt.annotations?.bold || false,
        italic: rt.annotations?.italic || false,
        strikethrough: rt.annotations?.strikethrough || false,
        underline: rt.annotations?.underline || false,
        code: rt.annotations?.code || false,
        color: rt.annotations?.color || "default",
      },
    }));
  }

  /**
   * 단일 Notion 블록을 파싱합니다.
   */
  static parseBlock(block: any): ParsedBlock | null {
    const type = block.type as BlockType;

    switch (type) {
      case "paragraph":
        return this.parseParagraph(block);
      case "heading_1":
      case "heading_2":
      case "heading_3":
        return this.parseHeading(block);
      case "bulleted_list_item":
      case "numbered_list_item":
        return this.parseListItem(block);
      case "quote":
        return this.parseQuote(block);
      case "code":
        return this.parseCode(block);
      case "callout":
        return this.parseCallout(block);
      case "divider":
        return this.parseDivider(block);
      case "image":
        return this.parseImage(block);
      case "bookmark":
        return this.parseBookmark(block);
      case "toggle":
        return this.parseToggle(block);
      case "to_do":
        return this.parseToDo(block);
      default:
        return null;
    }
  }

  /**
   * 단락 블록을 파싱합니다.
   */
  private static parseParagraph(block: any): ParagraphBlock {
    return {
      type: "paragraph",
      content: this.parseRichText(block.paragraph?.rich_text || []),
      hasChildren: block.has_children || false,
    };
  }

  /**
   * 제목 블록을 파싱합니다.
   */
  private static parseHeading(block: any): HeadingBlock {
    const type = block.type as "heading_1" | "heading_2" | "heading_3";
    const headingData = block[type];

    return {
      type,
      content: this.parseRichText(headingData?.rich_text || []),
      isToggleable: headingData?.is_toggleable || false,
    };
  }

  /**
   * 리스트 아이템 블록을 파싱합니다.
   */
  private static parseListItem(block: any): ListItemBlock {
    const type = block.type as "bulleted_list_item" | "numbered_list_item";
    const listData = block[type];

    return {
      type,
      content: this.parseRichText(listData?.rich_text || []),
      hasChildren: block.has_children || false,
    };
  }

  /**
   * 인용구 블록을 파싱합니다.
   */
  private static parseQuote(block: any): QuoteBlock {
    return {
      type: "quote",
      content: this.parseRichText(block.quote?.rich_text || []),
    };
  }

  /**
   * 코드 블록을 파싱합니다.
   */
  private static parseCode(block: any): CodeBlock {
    const codeData = block.code;
    const richText = codeData?.rich_text || [];
    const content = richText.map((rt: any) => rt.plain_text).join("");

    return {
      type: "code",
      content,
      language: codeData?.language || "plain text",
      caption: this.parseRichText(codeData?.caption || []),
    };
  }

  /**
   * Callout 블록을 파싱합니다.
   */
  private static parseCallout(block: any): CalloutBlock {
    const calloutData = block.callout;
    let icon = undefined;

    if (calloutData?.icon) {
      const iconData = calloutData.icon;
      icon = {
        type: iconData.type,
        emoji: iconData.emoji,
        url: iconData.type === "external" ? iconData.external?.url : iconData.file?.url,
      };
    }

    return {
      type: "callout",
      content: this.parseRichText(calloutData?.rich_text || []),
      icon,
      color: calloutData?.color || "default",
    };
  }

  /**
   * 구분선 블록을 파싱합니다.
   */
  private static parseDivider(_block: any): DividerBlock {
    return {
      type: "divider",
    };
  }

  /**
   * 이미지 블록을 파싱합니다.
   */
  private static parseImage(block: any): ImageBlock | null {
    const imageData = block.image;
    if (!imageData) return null;

    const url =
      imageData.type === "external" ? imageData.external?.url : imageData.file?.url;

    if (!url) return null;

    return {
      type: "image",
      url,
      caption: this.parseRichText(imageData.caption || []),
    };
  }

  /**
   * 북마크 블록을 파싱합니다.
   */
  private static parseBookmark(block: any): BookmarkBlock {
    return {
      type: "bookmark",
      url: block.bookmark?.url || "",
      caption: this.parseRichText(block.bookmark?.caption || []),
    };
  }

  /**
   * 토글 블록을 파싱합니다.
   */
  private static parseToggle(block: any): ToggleBlock {
    return {
      type: "toggle",
      content: this.parseRichText(block.toggle?.rich_text || []),
      hasChildren: block.has_children || false,
    };
  }

  /**
   * To-Do 블록을 파싱합니다.
   */
  private static parseToDo(block: any): ToDoBlock {
    return {
      type: "to_do",
      content: this.parseRichText(block.to_do?.rich_text || []),
      checked: block.to_do?.checked || false,
      hasChildren: block.has_children || false,
    };
  }

  /**
   * 블록 배열을 파싱합니다.
   */
  static parseBlocks(blocks: any[]): BlockWithMetadata[] {
    const parsedBlocks: BlockWithMetadata[] = [];

    for (const block of blocks) {
      const parsedBlock = this.parseBlock(block);
      if (parsedBlock) {
        parsedBlocks.push({
          id: block.id,
          block: parsedBlock,
          children: [],
        });
      }
    }

    return parsedBlocks;
  }
}
