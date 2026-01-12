import { getLatestPosts } from "@/api/post/route";
import Post from "@/components/common/Post";

async function LatestPost() {
  const posts = await getLatestPosts(5);

  return (
    <section>
      <div className="py-6 max-w-default mx-auto">
        <div className="py-3">
          <span className="text-2xl font-black">Latest Articles</span>
        </div>
        <ul className="flex flex-col gap-5">
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LatestPost;
