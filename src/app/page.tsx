import Link from "next/link"
import { getRecentPublishedPosts, getAllPublishedPosts } from "@/lib/post.queries"
import PostCard from "@/components/blog/PostCard"
import DopamineDivider from "@/components/ui/DopamineDivider"
import LinkedInButton from "@/components/ui/LinkedInButton"
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
      {/* Background image or gradient placeholder */}
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

      {/* Gradient overlay */}
      <div className="post-banner-card__overlay" />

      {/* Title */}
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
      {/* ── Top Banner ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <p className="section-label mb-6">Latest Dispatches</p>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large featured card — spans 2 columns */}
            {featured && (
              <div className="md:col-span-2">
                <PostBannerCard post={featured} featured />
              </div>
            )}

            {/* 2×2 grid of smaller cards */}
            {sidePosts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:grid-rows-2">
                {sidePosts.slice(0, 4).map((post) => (
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

      {/* ── About Section ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <DopamineDivider className="mb-10" />

        <div className="dopamine-card author-card p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: photo placeholder + name */}
            <div className="flex flex-col items-center md:items-start gap-5">
              {/* Replace with real photo: <img src="/images/author-photo.jpg" alt="Filip Dumanowski" className="neo-border w-[280px] h-[280px] object-cover" /> */}
              <div
                className="author-photo neo-border"
                aria-label="Author photo placeholder"
              >
                <span className="author-photo__initials">FD</span>
              </div>

              <h2 className="author-name text-3xl md:text-4xl font-black leading-tight">
                Filip Dumanowski
              </h2>
            </div>

            {/* Right: bio + LinkedIn */}
            <div className="flex flex-col gap-6">
              <p className="text-pop-black leading-relaxed text-base md:text-lg font-body">
                My name is Filip Dumanowski and I am big nerd at heart! In my professional career I&apos;ve
                touched numerous technologies - backend OOP like Java and .NET, data analysis with R and
                Python, CI/CD and orchestration using cloud tooling, and a lot of smaller projects in my
                home lab. In my spare time I love messing around with my smart home setup and test out new
                audio equipment. Connect with me on LinkedIn in case any of those resonate with you, we
                might be a good match!
              </p>

              <div>
                <LinkedInButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Posts Feed ─────────────────────────────────────────── */}
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
