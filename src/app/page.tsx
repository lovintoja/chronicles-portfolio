import Link from "next/link"
import { getRecentPublishedPosts, getAllPublishedPosts } from "@/lib/post.queries"
import PostCard from "@/components/blog/PostCard"
import DopamineDivider from "@/components/ui/DopamineDivider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Chronicle",
  description: "A dopamine decor personal blog.",
}

interface BannerPost {
  id: string
  title: string
  slug: string
  headerImage: string
}

function PostBannerCard({
  post,
  featured = false,
}: {
  post: BannerPost
  featured?: boolean
}) {
  const hasImage = post.headerImage && post.headerImage.trim() !== ""

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`post-banner-card ${featured ? "post-banner-card--featured" : ""}`}
      aria-label={`Read post: ${post.title}`}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.headerImage}
          alt=""
          aria-hidden="true"
          className="post-banner-card__image"
        />
      ) : (
        <div className="post-banner-card__placeholder" />
      )}

      <div className="post-banner-card__overlay" />

      <div className="post-banner-card__title-area">
        <h2 className="post-banner-card__title">
          {post.title}
        </h2>
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const [recentPosts, allPosts] = await Promise.all([
    getRecentPublishedPosts(5),
    getAllPublishedPosts(),
  ])

  const [featured, ...sidePosts] = recentPosts

  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <p className="section-label mb-6">Latest Dispatches</p>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured && (
              <div className="md:col-span-2">
                <PostBannerCard post={featured} featured />
              </div>
            )}

            {sidePosts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:grid-rows-2">
                {sidePosts.slice(0, 4).map((post: BannerPost) => (
                  <PostBannerCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-vivid-purple text-lg italic font-ui">
              No posts have been published yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <DopamineDivider className="mb-10" />

        <p className="section-label mb-8">All Posts</p>

        {allPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-vivid-purple text-lg italic font-ui">
              No posts have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
