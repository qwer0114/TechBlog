/**
 * @fileoverview Notion API 클라이언트 설정
 *
 * 이 모듈은 애플리케이션 전체에서 사용되는 Notion API 클라이언트를 초기화하고 내보냅니다.
 * 클라이언트는 환경 변수의 인증 자격 증명으로 구성됩니다.
 *
 * @see {@link https://developers.notion.com/reference/intro Notion API 문서}
 */

import { Client } from "@notionhq/client";

/**
 * Notion API 클라이언트 인스턴스
 *
 * 이 클라이언트는 데이터베이스 쿼리, 페이지 조회 및 기타 Notion 리소스 접근을 위해
 * Notion API와 상호작용하는 데 사용됩니다.
 *
 * **필수 환경 변수:**
 * - `NOTION_API_KEY`: Notion 통합 토큰
 *   - https://www.notion.so/my-integrations 에서 통합을 생성하세요
 *   - 데이터베이스에 대한 통합 액세스 권한을 부여하세요
 *   - "내부 통합 토큰"을 복사하세요
 *
 * **설정 방법:**
 * 1. https://www.notion.so/my-integrations 에서 Notion 통합을 생성합니다
 * 2. 통합 토큰을 복사합니다
 * 3. `.env.local` 파일에 추가합니다:
 *    ```
 *    NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *    DATABASE_ID=your_database_id_here
 *    ```
 * 4. Notion 데이터베이스를 통합과 공유합니다:
 *    - Notion에서 데이터베이스를 엽니다
 *    - "..." 메뉴 클릭 → "연결 추가"
 *    - 생성한 통합을 선택합니다
 *
 * @example
 * ```typescript
 * import { notion } from "@/api/client";
 *
 * // 데이터베이스 쿼리
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
 * // 페이지 조회
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
