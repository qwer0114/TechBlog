import { getPostWithBlocks } from "@/api/post-detail";
import { NotionBlocksRenderer } from "@/api/blocks/block-renderer";
import { formatDate } from "@/util/format-date";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const { post, blocks } = await getPostWithBlocks(id);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-12">
      <div className="max-w-default mx-auto px-4">
        {/* 헤더 섹션 */}
        <header className="mb-12">
          {/* 메타 정보 */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <time>{formatDate(post.createdDate)}</time>
            {post.series && (
              <>
                <span className="size-1 rounded-full bg-gray-400" />
                <span className="font-medium">{post.series}</span>
              </>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* 카테고리 */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 dark:bg-[#282e39] text-gray-700 dark:text-gray-300"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* 썸네일 */}
          {post.thumbnail && (
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#282e39] mb-8">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 구분선 */}
          <hr className="border-gray-200 dark:border-gray-700" />
        </header>

        {/* 본문 콘텐츠 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <NotionBlocksRenderer blocks={blocks} />
        </div>
      </div>
    </article>
  );
}
