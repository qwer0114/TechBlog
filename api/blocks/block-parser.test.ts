/**
 * @fileoverview Notion 블록 파서 테스트
 */

import { describe, it, expect } from "vitest";
import { NotionBlockParser } from "./block-parser";

describe("NotionBlockParser", () => {
  describe("parseRichText", () => {
    it("빈 배열을 처리해야 합니다", () => {
      const result = NotionBlockParser.parseRichText([]);
      expect(result).toEqual([]);
    });

    it("null/undefined를 처리해야 합니다", () => {
      expect(NotionBlockParser.parseRichText(null as any)).toEqual([]);
      expect(NotionBlockParser.parseRichText(undefined as any)).toEqual([]);
    });

    it("기본 텍스트를 파싱해야 합니다", () => {
      const richText = [
        {
          plain_text: "Hello World",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ];

      const result = NotionBlockParser.parseRichText(richText);

      expect(result).toEqual([
        {
          content: "Hello World",
          link: undefined,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ]);
    });

    it("링크가 포함된 텍스트를 파싱해야 합니다", () => {
      const richText = [
        {
          plain_text: "Click here",
          text: {
            link: {
              url: "https://example.com",
            },
          },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: true,
            code: false,
            color: "blue",
          },
        },
      ];

      const result = NotionBlockParser.parseRichText(richText);

      expect(result[0].content).toBe("Click here");
      expect(result[0].link).toBe("https://example.com");
      expect(result[0].annotations.bold).toBe(true);
      expect(result[0].annotations.underline).toBe(true);
    });

    it("여러 리치 텍스트 요소를 파싱해야 합니다", () => {
      const richText = [
        {
          plain_text: "Normal ",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
        {
          plain_text: "bold ",
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
        {
          plain_text: "italic",
          annotations: {
            bold: false,
            italic: true,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ];

      const result = NotionBlockParser.parseRichText(richText);

      expect(result).toHaveLength(3);
      expect(result[0].annotations.bold).toBe(false);
      expect(result[1].annotations.bold).toBe(true);
      expect(result[2].annotations.italic).toBe(true);
    });
  });

  describe("parseParagraph", () => {
    it("기본 단락을 파싱해야 합니다", () => {
      const block = {
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              plain_text: "This is a paragraph",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
        has_children: false,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result).toEqual({
        type: "paragraph",
        content: [
          {
            content: "This is a paragraph",
            link: undefined,
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
          },
        ],
        hasChildren: false,
      });
    });

    it("자식이 있는 단락을 파싱해야 합니다", () => {
      const block = {
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              plain_text: "Parent paragraph",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
        has_children: true,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("paragraph");
      expect((result as any)?.hasChildren).toBe(true);
    });
  });

  describe("parseHeading", () => {
    it("H1 제목을 파싱해야 합니다", () => {
      const block = {
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              plain_text: "Main Heading",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
          is_toggleable: false,
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("heading_1");
      expect((result as any)?.content[0].content).toBe("Main Heading");
      expect((result as any)?.isToggleable).toBe(false);
    });

    it("토글 가능한 H2 제목을 파싱해야 합니다", () => {
      const block = {
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              plain_text: "Toggleable Heading",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
          is_toggleable: true,
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("heading_2");
      expect((result as any)?.isToggleable).toBe(true);
    });
  });

  describe("parseListItem", () => {
    it("bulleted list item을 파싱해야 합니다", () => {
      const block = {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              plain_text: "First item",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
        has_children: false,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("bulleted_list_item");
      expect((result as any)?.content[0].content).toBe("First item");
    });

    it("numbered list item을 파싱해야 합니다", () => {
      const block = {
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [
            {
              plain_text: "First step",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
        has_children: true,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("numbered_list_item");
      expect((result as any)?.hasChildren).toBe(true);
    });
  });

  describe("parseQuote", () => {
    it("인용구를 파싱해야 합니다", () => {
      const block = {
        type: "quote",
        quote: {
          rich_text: [
            {
              plain_text: "This is a quote",
              annotations: {
                bold: false,
                italic: true,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("quote");
      expect((result as any)?.content[0].content).toBe("This is a quote");
      expect((result as any)?.content[0].annotations.italic).toBe(true);
    });
  });

  describe("parseCode", () => {
    it("코드 블록을 파싱해야 합니다", () => {
      const block = {
        type: "code",
        code: {
          rich_text: [
            {
              plain_text: "const hello = 'world';",
            },
          ],
          language: "javascript",
          caption: [],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("code");
      expect((result as any)?.content).toBe("const hello = 'world';");
      expect((result as any)?.language).toBe("javascript");
      expect((result as any)?.caption).toEqual([]);
    });

    it("여러 줄의 코드를 파싱해야 합니다", () => {
      const block = {
        type: "code",
        code: {
          rich_text: [
            { plain_text: "function hello() {\n" },
            { plain_text: "  return 'world';\n" },
            { plain_text: "}" },
          ],
          language: "typescript",
          caption: [
            {
              plain_text: "Example function",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect((result as any)?.content).toBe(
        "function hello() {\n  return 'world';\n}"
      );
      expect((result as any)?.language).toBe("typescript");
      expect((result as any)?.caption).toHaveLength(1);
    });
  });

  describe("parseCallout", () => {
    it("이모지 아이콘이 있는 callout을 파싱해야 합니다", () => {
      const block = {
        type: "callout",
        callout: {
          rich_text: [
            {
              plain_text: "Important note",
              annotations: {
                bold: true,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
          icon: {
            type: "emoji",
            emoji: "💡",
          },
          color: "yellow_background",
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("callout");
      expect((result as any)?.content[0].content).toBe("Important note");
      expect((result as any)?.icon?.type).toBe("emoji");
      expect((result as any)?.icon?.emoji).toBe("💡");
      expect((result as any)?.color).toBe("yellow_background");
    });
  });

  describe("parseDivider", () => {
    it("구분선을 파싱해야 합니다", () => {
      const block = {
        type: "divider",
        divider: {},
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result).toEqual({
        type: "divider",
      });
    });
  });

  describe("parseImage", () => {
    it("외부 이미지를 파싱해야 합니다", () => {
      const block = {
        type: "image",
        image: {
          type: "external",
          external: {
            url: "https://example.com/image.jpg",
          },
          caption: [
            {
              plain_text: "Example image",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("image");
      expect((result as any)?.url).toBe("https://example.com/image.jpg");
      expect((result as any)?.caption[0].content).toBe("Example image");
    });

    it("파일 이미지를 파싱해야 합니다", () => {
      const block = {
        type: "image",
        image: {
          type: "file",
          file: {
            url: "https://notion.so/images/abc123.png",
          },
          caption: [],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("image");
      expect((result as any)?.url).toBe("https://notion.so/images/abc123.png");
    });
  });

  describe("parseBookmark", () => {
    it("북마크를 파싱해야 합니다", () => {
      const block = {
        type: "bookmark",
        bookmark: {
          url: "https://example.com",
          caption: [
            {
              plain_text: "Example website",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("bookmark");
      expect((result as any)?.url).toBe("https://example.com");
      expect((result as any)?.caption[0].content).toBe("Example website");
    });
  });

  describe("parseToggle", () => {
    it("토글 블록을 파싱해야 합니다", () => {
      const block = {
        type: "toggle",
        toggle: {
          rich_text: [
            {
              plain_text: "Click to expand",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        },
        has_children: true,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("toggle");
      expect((result as any)?.content[0].content).toBe("Click to expand");
      expect((result as any)?.hasChildren).toBe(true);
    });
  });

  describe("parseToDo", () => {
    it("체크된 to-do를 파싱해야 합니다", () => {
      const block = {
        type: "to_do",
        to_do: {
          rich_text: [
            {
              plain_text: "Complete task",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
          checked: true,
        },
        has_children: false,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("to_do");
      expect((result as any)?.content[0].content).toBe("Complete task");
      expect((result as any)?.checked).toBe(true);
    });

    it("체크되지 않은 to-do를 파싱해야 합니다", () => {
      const block = {
        type: "to_do",
        to_do: {
          rich_text: [
            {
              plain_text: "Pending task",
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
          checked: false,
        },
        has_children: true,
      };

      const result = NotionBlockParser.parseBlock(block);

      expect(result?.type).toBe("to_do");
      expect((result as any)?.checked).toBe(false);
      expect((result as any)?.hasChildren).toBe(true);
    });
  });

  describe("parseBlocks", () => {
    it("여러 블록을 파싱해야 합니다", () => {
      const blocks = [
        {
          id: "block-1",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                plain_text: "First paragraph",
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
              },
            ],
          },
          has_children: false,
        },
        {
          id: "block-2",
          type: "heading_1",
          heading_1: {
            rich_text: [
              {
                plain_text: "Main heading",
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
              },
            ],
            is_toggleable: false,
          },
        },
        {
          id: "block-3",
          type: "divider",
          divider: {},
        },
      ];

      const result = NotionBlockParser.parseBlocks(blocks);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe("block-1");
      expect(result[0].block.type).toBe("paragraph");
      expect(result[1].id).toBe("block-2");
      expect(result[1].block.type).toBe("heading_1");
      expect(result[2].id).toBe("block-3");
      expect(result[2].block.type).toBe("divider");
    });

    it("null 블록을 필터링해야 합니다", () => {
      const blocks = [
        {
          id: "block-1",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                plain_text: "Valid paragraph",
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
              },
            ],
          },
          has_children: false,
        },
        {
          id: "block-2",
          type: "unsupported_type",
        },
      ];

      const result = NotionBlockParser.parseBlocks(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("block-1");
    });
  });
});
