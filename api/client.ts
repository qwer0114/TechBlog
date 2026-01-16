/**
 * @fileoverview Notion API Client Configuration
 *
 * This module initializes and exports the Notion API client used throughout the application.
 * The client is configured with authentication credentials from environment variables.
 *
 * @see {@link https://developers.notion.com/reference/intro Notion API Documentation}
 */

import { Client } from "@notionhq/client";

/**
 * Notion API client instance.
 *
 * This client is used to interact with the Notion API for querying databases,
 * retrieving pages, and accessing other Notion resources.
 *
 * **Environment Variables Required:**
 * - `NOTION_API_KEY`: Your Notion integration token
 *   - Create an integration at https://www.notion.so/my-integrations
 *   - Grant the integration access to your database
 *   - Copy the "Internal Integration Token"
 *
 * **Setup Instructions:**
 * 1. Create a Notion integration at https://www.notion.so/my-integrations
 * 2. Copy the integration token
 * 3. Add it to your `.env.local` file:
 *    ```
 *    NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *    DATABASE_ID=your_database_id_here
 *    ```
 * 4. Share your Notion database with the integration:
 *    - Open your database in Notion
 *    - Click "..." menu → "Add connections"
 *    - Select your integration
 *
 * @example
 * ```typescript
 * import { notion } from "@/api/client";
 *
 * // Query a database
 * const response = await notion.databases.query({
 *   database_id: "abc123...",
 *   filter: {
 *     property: "Status",
 *     status: { equals: "Published" }
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * import { notion } from "@/api/client";
 *
 * // Retrieve a page
 * const page = await notion.pages.retrieve({
 *   page_id: "page-id-here"
 * });
 * ```
 *
 * @see {@link https://github.com/makenotion/notion-sdk-js Notion SDK for JavaScript}
 */
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
