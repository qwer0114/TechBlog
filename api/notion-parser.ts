/**
 * @fileoverview Notion API Response Parser
 *
 * This module provides utilities for parsing Notion database pages into structured
 * NotionPost objects. It handles the complex nested structure of Notion's API responses
 * and extracts blog post data from a Notion database.
 *
 * The parser is specifically designed for a Notion database with the following properties:
 * - title: Title property (rich text)
 * - status: Status property (status type)
 * - created_date: Date property (date type)
 * - series: Select property (single select)
 * - categories: Multi-select property
 * - cover: Page cover image (file or external URL)
 *
 * @see {@link https://developers.notion.com/reference/page Notion Page Object}
 * @see {@link https://developers.notion.com/reference/property-value-object Notion Property Values}
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Notion API title property structure
 * Title properties contain an array of rich text objects
 */
interface NotionTitleProperty {
  title?: Array<{
    plain_text: string;
  }>;
}

/**
 * Notion API date property structure
 * Date properties contain a date object with optional start and end
 */
interface NotionDateProperty {
  date?: {
    start: string;
    end?: string;
  } | null;
}

/**
 * Notion API status property structure
 * Status properties contain the status name and metadata
 */
interface NotionStatusProperty {
  status?: {
    name: string;
  } | null;
}

/**
 * Notion API select property structure (single select)
 * Select properties contain a single selected option
 */
interface NotionSelectProperty {
  select?: {
    name: string;
  } | null;
}

/**
 * Notion API multi-select property structure
 * Multi-select properties contain an array of selected options
 */
interface NotionMultiSelectProperty {
  multi_select?: Array<{
    name: string;
  }>;
}

/**
 * Notion API page cover structure
 * Covers can be either uploaded files or external URLs
 */
interface NotionCover {
  type: "file" | "external";
  file?: {
    url: string;
  };
  external?: {
    url: string;
  };
}

/**
 * Notion API page object (partial)
 * Represents a page from a Notion database query result
 */
interface NotionPage {
  id: string;
  cover?: NotionCover | null;
  properties: {
    title: NotionTitleProperty;
    status: NotionStatusProperty;
    created_date: NotionDateProperty;
    series: NotionSelectProperty;
    categories: NotionMultiSelectProperty;
  };
}

/**
 * Represents a blog post parsed from a Notion database page.
 *
 * This class transforms raw Notion API responses into a clean, typed structure
 * suitable for use in a blog application. It handles null/undefined values gracefully
 * and provides sensible defaults.
 *
 * @example
 * ```typescript
 * // Create from a Notion API page response
 * const notionPage = await notion.pages.retrieve({ page_id: "some-id" });
 * const post = new NotionPost(notionPage);
 *
 * console.log(post.title);      // "My Blog Post"
 * console.log(post.categories); // ["TypeScript", "Next.js"]
 * console.log(post.series);     // "Web Development" or null
 * ```
 *
 * @example
 * ```typescript
 * // Batch convert from database query results
 * const response = await notion.databases.query({ database_id: "..." });
 * const posts = NotionPost.fromPages(response.results);
 * ```
 */
export class NotionPost {
  /**
   * Unique identifier of the Notion page
   * This corresponds to the page_id in Notion's API
   */
  readonly id: string;

  /**
   * Title of the blog post
   * Empty string if no title is set in Notion
   */
  readonly title: string;

  /**
   * Status of the blog post (e.g., "완료", "진행중", "초안")
   * Empty string if no status is set
   */
  readonly status: string;

  /**
   * Creation date of the blog post in ISO 8601 format
   * Empty string if no date is set
   *
   * @example "2024-01-15T00:00:00.000Z"
   */
  readonly createdDate: string;

  /**
   * Series/category grouping for the blog post
   * Null if the post is not part of a series
   *
   * @example "React Deep Dive" or null
   */
  readonly series: string | null;

  /**
   * Array of category tags for the blog post
   * Empty array if no categories are selected
   *
   * @example ["TypeScript", "Web Development", "Tutorial"]
   */
  readonly categories: string[];

  /**
   * URL of the post's cover/thumbnail image
   * Null if no cover image is set
   * Supports both Notion-hosted files and external URLs
   */
  readonly thumbnail: string | null;

  /**
   * Creates a new NotionPost from a Notion API page object.
   *
   * @param page - The raw Notion page object from the API
   *
   * @example
   * ```typescript
   * const response = await notion.pages.retrieve({ page_id: "abc123" });
   * const post = new NotionPost(response);
   * ```
   */
  constructor(page: any) {
    const props = page.properties;

    this.id = page.id;
    this.title = NotionPost.getTitle(props.title);
    this.status = NotionPost.getStatus(props.status);
    this.createdDate = NotionPost.getDate(props.created_date);
    this.series = NotionPost.getSeries(props.series);
    this.categories = NotionPost.getCategories(props.categories);
    this.thumbnail = NotionPost.getCover(page);
  }

  /**
   * Extracts the plain text title from a Notion title property.
   *
   * Notion title properties are arrays of rich text objects. This method
   * extracts the plain text from the first element.
   *
   * @param prop - The Notion title property object
   * @returns The plain text title, or empty string if not available
   *
   * @example
   * ```typescript
   * const titleProp = {
   *   title: [{ plain_text: "My Blog Post" }]
   * };
   * const title = NotionPost.getTitle(titleProp); // "My Blog Post"
   * ```
   *
   * @private
   */
  private static getTitle(prop: any): string {
    return prop?.title?.[0]?.plain_text ?? "";
  }

  /**
   * Extracts the ISO date string from a Notion date property.
   *
   * Notion date properties contain a start date (and optionally an end date).
   * This method extracts the start date.
   *
   * @param prop - The Notion date property object
   * @returns The ISO 8601 date string, or empty string if not available
   *
   * @example
   * ```typescript
   * const dateProp = {
   *   date: { start: "2024-01-15T00:00:00.000Z" }
   * };
   * const date = NotionPost.getDate(dateProp); // "2024-01-15T00:00:00.000Z"
   * ```
   *
   * @private
   */
  private static getDate(prop: any): string {
    return prop?.date?.start ?? "";
  }

  /**
   * Extracts the status name from a Notion status property.
   *
   * Notion status properties contain a status object with a name field.
   * Common status values include "완료" (completed), "진행중" (in progress),
   * and "초안" (draft).
   *
   * @param prop - The Notion status property object
   * @returns The status name, or empty string if not available
   *
   * @example
   * ```typescript
   * const statusProp = {
   *   status: { name: "완료" }
   * };
   * const status = NotionPost.getStatus(statusProp); // "완료"
   * ```
   *
   * @private
   */
  private static getStatus(prop: any): string {
    return prop?.status?.name ?? "";
  }

  /**
   * Extracts the series name from a Notion select property.
   *
   * The series is a single-select property that groups related blog posts.
   * Returns null if no series is selected.
   *
   * @param prop - The Notion select property object
   * @returns The series name, or null if not selected
   *
   * @example
   * ```typescript
   * const seriesProp = {
   *   select: { name: "React Deep Dive" }
   * };
   * const series = NotionPost.getSeries(seriesProp); // "React Deep Dive"
   *
   * const emptySeries = NotionPost.getSeries({ select: null }); // null
   * ```
   *
   * @private
   */
  private static getSeries(prop: any): string | null {
    return prop?.select?.name ?? null;
  }

  /**
   * Extracts category names from a Notion multi-select property.
   *
   * Categories are represented as a multi-select property in Notion, allowing
   * multiple tags to be applied to a single post.
   *
   * @param prop - The Notion multi-select property object
   * @returns Array of category names, or empty array if none selected
   *
   * @example
   * ```typescript
   * const categoriesProp = {
   *   multi_select: [
   *     { name: "TypeScript" },
   *     { name: "Next.js" },
   *     { name: "Tutorial" }
   *   ]
   * };
   * const categories = NotionPost.getCategories(categoriesProp);
   * // ["TypeScript", "Next.js", "Tutorial"]
   *
   * const empty = NotionPost.getCategories({ multi_select: [] }); // []
   * ```
   *
   * @private
   */
  private static getCategories(prop: any): string[] {
    return prop?.multi_select?.map((item: any) => item.name) ?? [];
  }

  /**
   * Extracts the cover image URL from a Notion page.
   *
   * Notion pages can have cover images that are either:
   * 1. Files uploaded to Notion (cover.type === "file")
   * 2. External URLs (cover.type === "external")
   *
   * This method handles both cases and returns the appropriate URL.
   *
   * @param page - The Notion page object (not just the property)
   * @returns The cover image URL, or null if no cover is set
   *
   * @example
   * ```typescript
   * // File uploaded to Notion
   * const pageWithFile = {
   *   cover: {
   *     type: "file",
   *     file: { url: "https://notion.so/images/page-cover/..." }
   *   }
   * };
   * const url1 = NotionPost.getCover(pageWithFile);
   * // "https://notion.so/images/page-cover/..."
   *
   * // External URL
   * const pageWithExternal = {
   *   cover: {
   *     type: "external",
   *     external: { url: "https://example.com/image.jpg" }
   *   }
   * };
   * const url2 = NotionPost.getCover(pageWithExternal);
   * // "https://example.com/image.jpg"
   *
   * // No cover
   * const noCover = NotionPost.getCover({ cover: null }); // null
   * ```
   *
   * @private
   */
  private static getCover(page: any): string | null {
    const cover = page.cover;
    if (!cover) return null;

    // Handle both file uploads and external URLs
    return cover.type === "file" ? cover.file.url : cover.external.url;
  }

  /**
   * Batch converts an array of Notion pages into NotionPost objects.
   *
   * This is a convenience method for converting database query results
   * into an array of typed NotionPost instances.
   *
   * @param pages - Array of raw Notion page objects from the API
   * @returns Array of NotionPost instances
   *
   * @example
   * ```typescript
   * // Query a Notion database
   * const response = await notion.databases.query({
   *   database_id: "abc123",
   *   filter: { property: "status", status: { equals: "완료" } }
   * });
   *
   * // Convert all results to NotionPost objects
   * const posts = NotionPost.fromPages(response.results);
   * posts.forEach(post => {
   *   console.log(`${post.title} - ${post.categories.join(", ")}`);
   * });
   * ```
   *
   * @static
   */
  static fromPages(pages: any[]): NotionPost[] {
    return pages.map((page) => new NotionPost(page));
  }
}
