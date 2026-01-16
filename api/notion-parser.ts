/**
 * @fileoverview Notion API 응답 파서
 *
 * 이 모듈은 Notion 데이터베이스 페이지를 구조화된 NotionPost 객체로 파싱하는
 * 유틸리티를 제공합니다. Notion API 응답의 복잡한 중첩 구조를 처리하고
 * 블로그 포스트 데이터를 추출합니다.
 *
 * 파서는 다음 속성을 가진 Notion 데이터베이스용으로 설계되었습니다:
 * - title: 제목 속성 (리치 텍스트)
 * - status: 상태 속성 (상태 타입)
 * - created_date: 날짜 속성 (날짜 타입)
 * - series: 선택 속성 (단일 선택)
 * - categories: 다중 선택 속성
 * - cover: 페이지 커버 이미지 (파일 또는 외부 URL)
 *
 * @see {@link https://developers.notion.com/reference/page Notion Page Object}
 * @see {@link https://developers.notion.com/reference/property-value-object Notion Property Values}
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Notion API 제목 속성 구조
 * 제목 속성은 리치 텍스트 객체의 배열을 포함합니다
 */
interface NotionTitleProperty {
  title?: Array<{
    plain_text: string;
  }>;
}

/**
 * Notion API 날짜 속성 구조
 * 날짜 속성은 선택적인 시작일과 종료일을 가진 날짜 객체를 포함합니다
 */
interface NotionDateProperty {
  date?: {
    start: string;
    end?: string;
  } | null;
}

/**
 * Notion API 상태 속성 구조
 * 상태 속성은 상태 이름과 메타데이터를 포함합니다
 */
interface NotionStatusProperty {
  status?: {
    name: string;
  } | null;
}

/**
 * Notion API 선택 속성 구조 (단일 선택)
 * 선택 속성은 하나의 선택된 옵션을 포함합니다
 */
interface NotionSelectProperty {
  select?: {
    name: string;
  } | null;
}

/**
 * Notion API 다중 선택 속성 구조
 * 다중 선택 속성은 선택된 옵션의 배열을 포함합니다
 */
interface NotionMultiSelectProperty {
  multi_select?: Array<{
    name: string;
  }>;
}

/**
 * Notion API 페이지 커버 구조
 * 커버는 업로드된 파일 또는 외부 URL일 수 있습니다
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
 * Notion API 페이지 객체 (부분)
 * Notion 데이터베이스 쿼리 결과의 페이지를 나타냅니다
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
 * Notion 데이터베이스 페이지에서 파싱된 블로그 포스트를 나타냅니다.
 *
 * 이 클래스는 원시 Notion API 응답을 블로그 애플리케이션에 적합한
 * 깔끔하고 타입이 지정된 구조로 변환합니다. null/undefined 값을
 * 우아하게 처리하고 합리적인 기본값을 제공합니다.
 *
 * @example
 * ```typescript
 * // Notion API 페이지 응답에서 생성
 * const notionPage = await notion.pages.retrieve({ page_id: "some-id" });
 * const post = new NotionPost(notionPage);
 *
 * console.log(post.title);      // "내 블로그 포스트"
 * console.log(post.categories); // ["TypeScript", "Next.js"]
 * console.log(post.series);     // "웹 개발" 또는 null
 * ```
 *
 * @example
 * ```typescript
 * // 데이터베이스 쿼리 결과에서 일괄 변환
 * const response = await notion.databases.query({ database_id: "..." });
 * const posts = NotionPost.fromPages(response.results);
 * ```
 */
export class NotionPost {
  /**
   * Notion 페이지의 고유 식별자
   * Notion API의 page_id에 해당합니다
   */
  readonly id: string;

  /**
   * 블로그 포스트의 제목
   * Notion에 제목이 설정되지 않은 경우 빈 문자열
   */
  readonly title: string;

  /**
   * 블로그 포스트의 상태 (예: "완료", "진행중", "초안")
   * 상태가 설정되지 않은 경우 빈 문자열
   */
  readonly status: string;

  /**
   * ISO 8601 형식의 블로그 포스트 생성 날짜
   * 날짜가 설정되지 않은 경우 빈 문자열
   *
   * @example "2024-01-15T00:00:00.000Z"
   */
  readonly createdDate: string;

  /**
   * 블로그 포스트의 시리즈/카테고리 그룹
   * 포스트가 시리즈의 일부가 아닌 경우 null
   *
   * @example "React 심화 학습" 또는 null
   */
  readonly series: string | null;

  /**
   * 블로그 포스트의 카테고리 태그 배열
   * 선택된 카테고리가 없는 경우 빈 배열
   *
   * @example ["TypeScript", "웹 개발", "튜토리얼"]
   */
  readonly categories: string[];

  /**
   * 포스트의 커버/썸네일 이미지 URL
   * 커버 이미지가 설정되지 않은 경우 null
   * Notion 호스팅 파일과 외부 URL 모두 지원
   */
  readonly thumbnail: string | null;

  /**
   * Notion API 페이지 객체에서 새 NotionPost를 생성합니다.
   *
   * @param page - API에서 가져온 원시 Notion 페이지 객체
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
   * Notion 제목 속성에서 일반 텍스트 제목을 추출합니다.
   *
   * Notion 제목 속성은 리치 텍스트 객체의 배열입니다. 이 메서드는
   * 첫 번째 요소에서 일반 텍스트를 추출합니다.
   *
   * @param prop - Notion 제목 속성 객체
   * @returns 일반 텍스트 제목, 사용 불가능한 경우 빈 문자열
   *
   * @example
   * ```typescript
   * const titleProp = {
   *   title: [{ plain_text: "내 블로그 포스트" }]
   * };
   * const title = NotionPost.getTitle(titleProp); // "내 블로그 포스트"
   * ```
   *
   * @private
   */
  private static getTitle(prop: any): string {
    return prop?.title?.[0]?.plain_text ?? "";
  }

  /**
   * Notion 날짜 속성에서 ISO 날짜 문자열을 추출합니다.
   *
   * Notion 날짜 속성은 시작 날짜(및 선택적으로 종료 날짜)를 포함합니다.
   * 이 메서드는 시작 날짜를 추출합니다.
   *
   * @param prop - Notion 날짜 속성 객체
   * @returns ISO 8601 날짜 문자열, 사용 불가능한 경우 빈 문자열
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
   * Notion 상태 속성에서 상태 이름을 추출합니다.
   *
   * Notion 상태 속성은 이름 필드가 있는 상태 객체를 포함합니다.
   * 일반적인 상태 값으로는 "완료", "진행중", "초안" 등이 있습니다.
   *
   * @param prop - Notion 상태 속성 객체
   * @returns 상태 이름, 사용 불가능한 경우 빈 문자열
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
   * Notion 선택 속성에서 시리즈 이름을 추출합니다.
   *
   * 시리즈는 관련 블로그 포스트를 그룹화하는 단일 선택 속성입니다.
   * 시리즈가 선택되지 않은 경우 null을 반환합니다.
   *
   * @param prop - Notion 선택 속성 객체
   * @returns 시리즈 이름, 선택되지 않은 경우 null
   *
   * @example
   * ```typescript
   * const seriesProp = {
   *   select: { name: "React 심화 학습" }
   * };
   * const series = NotionPost.getSeries(seriesProp); // "React 심화 학습"
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
   * Notion 다중 선택 속성에서 카테고리 이름을 추출합니다.
   *
   * 카테고리는 Notion의 다중 선택 속성으로 표현되어
   * 하나의 포스트에 여러 태그를 적용할 수 있습니다.
   *
   * @param prop - Notion 다중 선택 속성 객체
   * @returns 카테고리 이름 배열, 선택된 것이 없으면 빈 배열
   *
   * @example
   * ```typescript
   * const categoriesProp = {
   *   multi_select: [
   *     { name: "TypeScript" },
   *     { name: "Next.js" },
   *     { name: "튜토리얼" }
   *   ]
   * };
   * const categories = NotionPost.getCategories(categoriesProp);
   * // ["TypeScript", "Next.js", "튜토리얼"]
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
   * Notion 페이지에서 커버 이미지 URL을 추출합니다.
   *
   * Notion 페이지는 다음 두 가지 유형의 커버 이미지를 가질 수 있습니다:
   * 1. Notion에 업로드된 파일 (cover.type === "file")
   * 2. 외부 URL (cover.type === "external")
   *
   * 이 메서드는 두 경우를 모두 처리하고 적절한 URL을 반환합니다.
   *
   * @param page - Notion 페이지 객체 (속성만이 아님)
   * @returns 커버 이미지 URL, 커버가 설정되지 않은 경우 null
   *
   * @example
   * ```typescript
   * // Notion에 업로드된 파일
   * const pageWithFile = {
   *   cover: {
   *     type: "file",
   *     file: { url: "https://notion.so/images/page-cover/..." }
   *   }
   * };
   * const url1 = NotionPost.getCover(pageWithFile);
   * // "https://notion.so/images/page-cover/..."
   *
   * // 외부 URL
   * const pageWithExternal = {
   *   cover: {
   *     type: "external",
   *     external: { url: "https://example.com/image.jpg" }
   *   }
   * };
   * const url2 = NotionPost.getCover(pageWithExternal);
   * // "https://example.com/image.jpg"
   *
   * // 커버 없음
   * const noCover = NotionPost.getCover({ cover: null }); // null
   * ```
   *
   * @private
   */
  private static getCover(page: any): string | null {
    const cover = page.cover;
    if (!cover) return null;

    // 파일 업로드와 외부 URL 모두 처리
    return cover.type === "file" ? cover.file.url : cover.external.url;
  }

  /**
   * Notion 페이지 배열을 NotionPost 객체로 일괄 변환합니다.
   *
   * 데이터베이스 쿼리 결과를 타입이 지정된 NotionPost 인스턴스 배열로
   * 변환하는 편의 메서드입니다.
   *
   * @param pages - API에서 가져온 원시 Notion 페이지 객체 배열
   * @returns NotionPost 인스턴스 배열
   *
   * @example
   * ```typescript
   * // Notion 데이터베이스 쿼리
   * const response = await notion.databases.query({
   *   database_id: "abc123",
   *   filter: { property: "status", status: { equals: "완료" } }
   * });
   *
   * // 모든 결과를 NotionPost 객체로 변환
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
