import { NotionPost } from "@/api/notion-parser";
import Flex from "@/components/common/Flex";
import Link from "next/link";
import { formatDate } from "@/util/format-date";

function Post({ post }: { post: NotionPost }) {
  const { id, title, createdDate, series, categories, thumbnail } = post;

  return (
    <Link href={`/blog/${id}`}>
      <article className="group flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-[#282e39] hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg">
        <div className="w-full sm:w-56 h-40 shrink-0 rounded-lg bg-gray-100 dark:bg-[#282e39] overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-3xl">📝</span>
            </div>
          )}
        </div>
        <Flex direction="col" justify="center" gap={3} className="flex-1">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <time>{formatDate(createdDate)}</time>
            {series && (
              <>
                <span className="size-1 rounded-full bg-gray-400" />
                <span>{series}</span>
              </>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
            {title}
          </h2>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-[#282e39] text-gray-600 dark:text-gray-300"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
          <Flex
            align="center"
            gap={1}
            className="text-sm font-medium text-gray-900 dark:text-white mt-auto pt-2"
          >
            Read more
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Flex>
        </Flex>
      </article>
    </Link>
  );
}

export default Post;
