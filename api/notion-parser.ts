/* eslint-disable @typescript-eslint/no-explicit-any */
export class NotionPost {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly createdDate: string;
  readonly series: string | null;
  readonly categories: string[];
  readonly thumbnail: string | null;

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

  // 정적 파서 메서드들
  private static getTitle(prop: any): string {
    return prop?.title?.[0]?.plain_text ?? "";
  }

  private static getDate(prop: any): string {
    return prop?.date?.start ?? "";
  }

  private static getStatus(prop: any): string {
    return prop?.status?.name ?? "";
  }

  private static getSeries(prop: any): string | null {
    return prop?.select?.name ?? null;
  }

  private static getCategories(prop: any): string[] {
    return prop?.multi_select?.map((item: any) => item.name) ?? [];
  }

  private static getCover(page: any): string | null {
    const cover = page.cover;
    if (!cover) return null;
    return cover.type === "file" ? cover.file.url : cover.external.url;
  }

  static fromPages(pages: any[]): NotionPost[] {
    return pages.map((page) => new NotionPost(page));
  }
}
