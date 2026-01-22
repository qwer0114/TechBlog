/**
 * @fileoverview Notion 페이지 상세 정보 및 블록 가져오기
 */

import { Client } from "@notionhq/client";
import { NotionPost } from "./notion-parser";
import { NotionBlockParser } from "./blocks/block-parser";
import { BlockWithMetadata } from "./blocks/block-types";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * 페이지 ID로 Notion 페이지 정보를 가져옵니다.
 */
export async function getPostById(pageId: string): Promise<NotionPost | null> {
  if (!process.env.NOTION_API_KEY) {
    console.warn("Missing NOTION_API_KEY environment variable");
    return null;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return new NotionPost(page);
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * 페이지의 모든 블록을 재귀적으로 가져옵니다.
 */
export async function getPageBlocks(
  pageId: string
): Promise<BlockWithMetadata[]> {
  try {
    const blocks = await fetchBlocksRecursively(pageId);
    return blocks;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
}

/**
 * 블록과 그 자식 블록들을 재귀적으로 가져옵니다.
 */
async function fetchBlocksRecursively(
  blockId: string
): Promise<BlockWithMetadata[]> {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  const blocks = NotionBlockParser.parseBlocks(response.results);

  // 자식 블록이 있는 경우 재귀적으로 가져오기
  for (const block of blocks) {
    if (
      block.block.type === "paragraph" ||
      block.block.type === "bulleted_list_item" ||
      block.block.type === "numbered_list_item" ||
      block.block.type === "toggle" ||
      block.block.type === "to_do"
    ) {
      const hasChildren = (block.block as any).hasChildren;
      if (hasChildren) {
        block.children = await fetchBlocksRecursively(block.id);
      }
    }
  }

  return blocks;
}

/**
 * 페이지 정보와 블록을 함께 가져옵니다.
 */
export async function getPostWithBlocks(pageId: string) {
  const [post, blocks] = await Promise.all([
    getPostById(pageId),
    getPageBlocks(pageId),
  ]);

  return { post, blocks };
}
