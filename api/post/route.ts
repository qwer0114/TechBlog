/**
 * @fileoverview 블로그 포스트 API 라우트
 *
 * 이 모듈은 Notion 데이터베이스에서 블로그 포스트를 가져오는 API 엔드포인트를 제공합니다.
 * Notion API를 쿼리하고 완료 상태로 필터링된 파싱된 포스트 데이터를 반환합니다.
 */

import { notion } from "@/api/client";
import { NotionPost } from "@/api/notion-parser";

/**
 * Notion 데이터베이스에서 최신 완료된 블로그 포스트를 가져옵니다.
 *
 * 이 함수는 상태가 "완료"인 포스트에 대해 Notion 데이터베이스를 쿼리하고,
 * 생성 날짜 기준 내림차순으로 정렬하여 NotionPost 객체로 반환합니다.
 *
 * 다음 환경 변수가 설정되어 있어야 합니다:
 * - `DATABASE_ID`: 블로그 포스트가 있는 Notion 데이터베이스 ID
 * - `NOTION_API_KEY`: Notion API 통합 토큰 (client.ts에서 설정)
 *
 * @param limit - 가져올 최대 포스트 수. 기본값은 5입니다.
 * @returns NotionPost 객체 배열로 해석되는 Promise
 *
 * @throws {Error} Notion API 요청이 실패하거나 DATABASE_ID가 설정되지 않은 경우
 *
 * @example
 * ```typescript
 * // 가장 최근 완료된 포스트 5개 가져오기
 * const posts = await getLatestPosts();
 * console.log(posts[0].title); // "내 최신 블로그 포스트"
 * ```
 *
 * @example
 * ```typescript
 * // 가장 최근 완료된 포스트 10개 가져오기
 * const posts = await getLatestPosts(10);
 * posts.forEach(post => {
 *   console.log(`${post.title} - ${post.createdDate}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // React 서버 컴포넌트에서 사용
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
 * @see {@link NotionPost} 반환되는 포스트 객체의 구조
 * @see {@link https://developers.notion.com/reference/post-database-query Notion Database Query API}
 */
export async function getLatestPosts(limit: number = 5) {
  // 환경 변수 체크
  if (!process.env.DATABASE_ID || !process.env.NOTION_API_KEY) {
    console.warn("Missing DATABASE_ID or NOTION_API_KEY environment variable");
    return [];
  }

  try {
    // 필터링 및 정렬과 함께 Notion 데이터베이스 쿼리
    const response = await notion.dataSources.query({
      // 환경 변수에서 가져온 Notion 데이터베이스 ID
      data_source_id: process.env.DATABASE_ID,

      // 반환할 결과 수 제한
      page_size: limit,

      // 완료된 포스트만 필터링
      filter: {
        property: "status",
        status: { equals: "완료" },
      },

      // 생성 날짜 기준으로 정렬, 최신순
      sorts: [
        {
          property: "created_date",
          direction: "descending",
        },
      ],
    });

    // 원시 Notion API 응답을 타입이 지정된 NotionPost 객체로 변환
    return NotionPost.fromPages(response.results);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
