import { notion } from "@/api/client";
import { NotionPost } from "@/api/notion-parser";

export async function getLatestPosts(limit: number = 5) {
  const response = await notion.dataSources.query({
    data_source_id: process.env.DATABASE_ID!,
    page_size: limit,
    filter: {
      property: "status",
      status: { equals: "완료" },
    },
    sorts: [
      {
        property: "created_date",
        direction: "descending",
      },
    ],
  });
  return NotionPost.fromPages(response.results);
}
