/**
 * @fileoverview Blog Post API Route
 *
 * This module provides the API endpoint for fetching blog posts from the Notion database.
 * It queries the Notion API and returns parsed post data filtered by completion status.
 */

import { notion } from "@/api/client";
import { NotionPost } from "@/api/notion-parser";

/**
 * Fetches the latest completed blog posts from the Notion database.
 *
 * This function queries the Notion database for posts with a status of "완료" (completed),
 * sorts them by creation date in descending order, and returns them as NotionPost objects.
 *
 * The function requires the following environment variables to be set:
 * - `DATABASE_ID`: The Notion database ID containing the blog posts
 * - `NOTION_API_KEY`: The Notion API integration token (set in client.ts)
 *
 * @param limit - Maximum number of posts to fetch. Defaults to 5.
 * @returns Promise resolving to an array of NotionPost objects
 *
 * @throws {Error} If the Notion API request fails or DATABASE_ID is not set
 *
 * @example
 * ```typescript
 * // Fetch the 5 most recent completed posts
 * const posts = await getLatestPosts();
 * console.log(posts[0].title); // "My Latest Blog Post"
 * ```
 *
 * @example
 * ```typescript
 * // Fetch the 10 most recent completed posts
 * const posts = await getLatestPosts(10);
 * posts.forEach(post => {
 *   console.log(`${post.title} - ${post.createdDate}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Usage in a React Server Component
 * async function BlogPostList() {
 *   const posts = await getLatestPosts(3);
 *
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <article key={post.id}>
 *           <h2>{post.title}</h2>
 *           <p>{post.createdDate}</p>
 *           <div>{post.categories.join(", ")}</div>
 *         </article>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link NotionPost} for the structure of returned post objects
 * @see {@link https://developers.notion.com/reference/post-database-query Notion Database Query API}
 */
export async function getLatestPosts(limit: number = 5) {
  // Query the Notion database with filtering and sorting
  const response = await notion.dataSources.query({
    // The Notion database ID from environment variables
    data_source_id: process.env.DATABASE_ID!,

    // Limit the number of results returned
    page_size: limit,

    // Filter for completed posts only
    // "완료" means "completed" in Korean
    filter: {
      property: "status",
      status: { equals: "완료" },
    },

    // Sort by creation date, newest first
    sorts: [
      {
        property: "created_date",
        direction: "descending",
      },
    ],
  });

  // Convert raw Notion API responses to typed NotionPost objects
  return NotionPost.fromPages(response.results);
}
