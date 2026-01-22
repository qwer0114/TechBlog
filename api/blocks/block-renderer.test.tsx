/**
 * @fileoverview Notion 블록 렌더러 테스트
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  NotionBlocksRenderer,
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
} from "./block-renderer";
import {
  ParsedRichText,
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
  BlockWithMetadata,
} from "./block-types";

describe("RichTextRenderer", () => {
  it("일반 텍스트를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "Hello World",
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

    const { container } = render(<RichTextRenderer content={content} />);
    expect(container.textContent).toBe("Hello World");
  });

  it("볼드 텍스트를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "Bold Text",
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
        },
      },
    ];

    const { container } = render(<RichTextRenderer content={content} />);
    const strong = container.querySelector("strong");
    expect(strong).toBeTruthy();
    expect(strong?.textContent).toBe("Bold Text");
  });

  it("이탤릭 텍스트를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "Italic Text",
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

    const { container } = render(<RichTextRenderer content={content} />);
    const em = container.querySelector("em");
    expect(em).toBeTruthy();
    expect(em?.textContent).toBe("Italic Text");
  });

  it("링크를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "Click here",
        link: "https://example.com",
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

    const { container } = render(<RichTextRenderer content={content} />);
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://example.com");
    expect(link?.textContent).toBe("Click here");
  });

  it("인라인 코드를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "const x = 1;",
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: true,
          color: "default",
        },
      },
    ];

    const { container } = render(<RichTextRenderer content={content} />);
    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.textContent).toBe("const x = 1;");
  });

  it("여러 스타일이 조합된 텍스트를 렌더링해야 합니다", () => {
    const content: ParsedRichText[] = [
      {
        content: "Bold and Italic",
        annotations: {
          bold: true,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
        },
      },
    ];

    const { container } = render(<RichTextRenderer content={content} />);
    const em = container.querySelector("em");
    const strong = em?.querySelector("strong");
    expect(em).toBeTruthy();
    expect(strong).toBeTruthy();
    expect(strong?.textContent).toBe("Bold and Italic");
  });
});

describe("ParagraphBlockRenderer", () => {
  it("단락을 렌더링해야 합니다", () => {
    const block: ParagraphBlock = {
      type: "paragraph",
      content: [
        {
          content: "This is a paragraph",
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
    };

    const { container } = render(<ParagraphBlockRenderer block={block} />);
    const p = container.querySelector("p");
    expect(p).toBeTruthy();
    expect(p?.textContent).toBe("This is a paragraph");
  });
});

describe("HeadingBlockRenderer", () => {
  it("H1을 렌더링해야 합니다", () => {
    const block: HeadingBlock = {
      type: "heading_1",
      content: [
        {
          content: "Main Heading",
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
      isToggleable: false,
    };

    const { container } = render(<HeadingBlockRenderer block={block} />);
    const h1 = container.querySelector("h1");
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toBe("Main Heading");
  });

  it("H2를 렌더링해야 합니다", () => {
    const block: HeadingBlock = {
      type: "heading_2",
      content: [
        {
          content: "Sub Heading",
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
      isToggleable: false,
    };

    const { container } = render(<HeadingBlockRenderer block={block} />);
    const h2 = container.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2?.textContent).toBe("Sub Heading");
  });
});

describe("ListItemBlockRenderer", () => {
  it("bulleted list item을 렌더링해야 합니다", () => {
    const block: ListItemBlock = {
      type: "bulleted_list_item",
      content: [
        {
          content: "First item",
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
    };

    const { container } = render(<ListItemBlockRenderer block={block} />);
    const li = container.querySelector("li");
    expect(li).toBeTruthy();
    expect(li?.textContent).toBe("First item");
  });
});

describe("QuoteBlockRenderer", () => {
  it("인용구를 렌더링해야 합니다", () => {
    const block: QuoteBlock = {
      type: "quote",
      content: [
        {
          content: "This is a quote",
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
    };

    const { container } = render(<QuoteBlockRenderer block={block} />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote).toBeTruthy();
    expect(blockquote?.textContent).toBe("This is a quote");
  });
});

describe("CodeBlockRenderer", () => {
  it("코드 블록을 렌더링해야 합니다", () => {
    const block: CodeBlock = {
      type: "code",
      content: "const hello = 'world';",
      language: "javascript",
      caption: [],
    };

    const { container } = render(<CodeBlockRenderer block={block} />);
    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.textContent).toBe("const hello = 'world';");
    expect(code?.className).toContain("language-javascript");
  });

  it("캡션이 있는 코드 블록을 렌더링해야 합니다", () => {
    const block: CodeBlock = {
      type: "code",
      content: "console.log('test');",
      language: "typescript",
      caption: [
        {
          content: "Example code",
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
    };

    const { container } = render(<CodeBlockRenderer block={block} />);
    const figcaption = container.querySelector("figcaption");
    expect(figcaption).toBeTruthy();
    expect(figcaption?.textContent).toBe("Example code");
  });
});

describe("CalloutBlockRenderer", () => {
  it("이모지 아이콘이 있는 callout을 렌더링해야 합니다", () => {
    const block: CalloutBlock = {
      type: "callout",
      content: [
        {
          content: "Important note",
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
    };

    const { container } = render(<CalloutBlockRenderer block={block} />);
    const callout = container.querySelector(".notion-callout");
    expect(callout).toBeTruthy();
    expect(callout?.textContent).toContain("💡");
    expect(callout?.textContent).toContain("Important note");
  });
});

describe("DividerBlockRenderer", () => {
  it("구분선을 렌더링해야 합니다", () => {
    const { container } = render(<DividerBlockRenderer />);
    const hr = container.querySelector("hr");
    expect(hr).toBeTruthy();
  });
});

describe("ImageBlockRenderer", () => {
  it("이미지를 렌더링해야 합니다", () => {
    const block: ImageBlock = {
      type: "image",
      url: "https://example.com/image.jpg",
      caption: [],
    };

    const { container } = render(<ImageBlockRenderer block={block} />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("https://example.com/image.jpg");
  });

  it("캡션이 있는 이미지를 렌더링해야 합니다", () => {
    const block: ImageBlock = {
      type: "image",
      url: "https://example.com/image.jpg",
      caption: [
        {
          content: "Example image",
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
    };

    const { container } = render(<ImageBlockRenderer block={block} />);
    const figcaption = container.querySelector("figcaption");
    expect(figcaption).toBeTruthy();
    expect(figcaption?.textContent).toBe("Example image");
  });
});

describe("BookmarkBlockRenderer", () => {
  it("북마크를 렌더링해야 합니다", () => {
    const block: BookmarkBlock = {
      type: "bookmark",
      url: "https://example.com",
      caption: [],
    };

    const { container } = render(<BookmarkBlockRenderer block={block} />);
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://example.com");
  });
});

describe("ToggleBlockRenderer", () => {
  it("토글 블록을 렌더링해야 합니다", () => {
    const block: ToggleBlock = {
      type: "toggle",
      content: [
        {
          content: "Click to expand",
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
      hasChildren: true,
    };

    const { container } = render(<ToggleBlockRenderer block={block} />);
    const details = container.querySelector("details");
    const summary = container.querySelector("summary");
    expect(details).toBeTruthy();
    expect(summary).toBeTruthy();
    expect(summary?.textContent).toBe("Click to expand");
  });
});

describe("ToDoBlockRenderer", () => {
  it("체크된 to-do를 렌더링해야 합니다", () => {
    const block: ToDoBlock = {
      type: "to_do",
      content: [
        {
          content: "Complete task",
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
      hasChildren: false,
    };

    const { container } = render(<ToDoBlockRenderer block={block} />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
    expect((checkbox as HTMLInputElement)?.checked).toBe(true);
    expect(container.textContent).toContain("Complete task");
  });

  it("체크되지 않은 to-do를 렌더링해야 합니다", () => {
    const block: ToDoBlock = {
      type: "to_do",
      content: [
        {
          content: "Pending task",
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
      hasChildren: false,
    };

    const { container } = render(<ToDoBlockRenderer block={block} />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
    expect((checkbox as HTMLInputElement)?.checked).toBe(false);
  });
});

describe("NotionBlocksRenderer", () => {
  it("여러 블록을 렌더링해야 합니다", () => {
    const blocks: BlockWithMetadata[] = [
      {
        id: "block-1",
        block: {
          type: "heading_1",
          content: [
            {
              content: "Main Heading",
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
          isToggleable: false,
        },
      },
      {
        id: "block-2",
        block: {
          type: "paragraph",
          content: [
            {
              content: "This is a paragraph",
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
        },
      },
    ];

    const { container } = render(<NotionBlocksRenderer blocks={blocks} />);
    const h1 = container.querySelector("h1");
    const p = container.querySelector("p");
    expect(h1).toBeTruthy();
    expect(p).toBeTruthy();
    expect(h1?.textContent).toBe("Main Heading");
    expect(p?.textContent).toBe("This is a paragraph");
  });

  it("자식 블록을 렌더링해야 합니다", () => {
    const blocks: BlockWithMetadata[] = [
      {
        id: "block-1",
        block: {
          type: "paragraph",
          content: [
            {
              content: "Parent",
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
          hasChildren: true,
        },
        children: [
          {
            id: "block-1-1",
            block: {
              type: "paragraph",
              content: [
                {
                  content: "Child",
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
            },
          },
        ],
      },
    ];

    const { container } = render(<NotionBlocksRenderer blocks={blocks} />);
    const childrenDiv = container.querySelector(".notion-block-children");
    expect(childrenDiv).toBeTruthy();
    expect(container.textContent).toContain("Parent");
    expect(container.textContent).toContain("Child");
  });
});
