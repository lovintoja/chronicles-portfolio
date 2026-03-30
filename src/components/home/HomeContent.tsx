"use client"

import Link from "next/link"
import PostCard from "@/components/blog/PostCard"
import DopamineDivider from "@/components/ui/DopamineDivider"
import HeroSection from "@/components/home/HeroSection"
import TechGlance from "@/components/home/TechGlance"
import { useLanguage } from "@/contexts/LanguageContext"
import type { PostWithAuthor } from "@/types"

interface BannerPost {
  id: string
  title: string
  slug: string
  headerImage: string
  excerpt?: string | null
  publishedAt?: Date | null
  language?: string | null
}

interface HomeContentProps {
  recentPosts: BannerPost[]
  allPosts: PostWithAuthor[]
}

export default function HomeContent({ recentPosts, allPosts }: HomeContentProps) {
  const { t, lang } = useLanguage()
  const [featured, ...sidePosts] = recentPosts

  const dateLocale = lang === "pl" ? "pl-PL" : "en-US"

  return (
    <main>
      <HeroSection />
      <TechGlance />
      <DopamineDivider />

      {featured && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
          <p className="section-label mb-6">{t.home.featured}</p>
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div
              className="dopamine-card overflow-hidden flex flex-col md:flex-row mb-10 sm:mb-16"
              style={{ boxShadow: "8px 8px 0 #00C2FF" }}
            >
              <div className="relative md:w-[58%] post-banner-card--featured overflow-hidden">
                {featured.headerImage && featured.headerImage.trim() !== "" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.headerImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full post-banner-card__placeholder" />
                )}
                <span className="absolute top-3 left-3 neo-border bg-hot-pink text-white text-xs font-black uppercase px-2 py-1 tracking-widest">
                  {t.home.featured}
                </span>
              </div>

              <div className="flex flex-col justify-between p-5 sm:p-7 md:p-8 md:w-[42%]">
                <div>
                  {featured.publishedAt && (
                    <time
                      className="text-xs tracking-widest uppercase text-electric-blue font-bold block mb-3"
                      style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
                    >
                      ▸ {new Date(featured.publishedAt).toLocaleDateString(dateLocale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  <h2
                    className="text-2xl sm:text-3xl font-black text-pop-black leading-tight mb-4 group-hover:text-hot-pink transition-colors"
                    style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
                  >
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-pop-black leading-relaxed line-clamp-3 mb-6">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <span className="btn btn-primary self-start text-sm px-5 py-2">
                  {t.home.readPost}
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section id="dispatches" className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
        <p className="section-label mb-6">{t.home.latestDispatches}</p>
        {sidePosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {sidePosts.slice(0, 4).map((post: BannerPost) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="post-banner-card"
                aria-label={`Read post: ${post.title}`}
              >
                {post.headerImage && post.headerImage.trim() !== "" ? (
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
                  <h3 className="post-banner-card__title">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        <DopamineDivider className="mb-10" />
        <p className="section-label mb-8">{t.home.allPosts}</p>
        {allPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-vivid-purple text-lg italic font-ui">
              {t.home.noPosts}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {allPosts.map((post: PostWithAuthor) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
