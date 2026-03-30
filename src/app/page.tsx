import { getRecentPublishedPosts, getAllPublishedPosts } from "@/lib/post.queries"
import HomeContent from "@/components/home/HomeContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Chronicle",
  description: "A dopamine decor personal blog.",
}

export default async function HomePage() {
  const [recentPosts, allPosts] = await Promise.all([
    getRecentPublishedPosts(5),
    getAllPublishedPosts(),
  ])

  return <HomeContent recentPosts={recentPosts} allPosts={allPosts} />
}
