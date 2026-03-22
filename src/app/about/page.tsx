import DopamineDivider from "@/components/ui/DopamineDivider"
import LinkedInButton from "@/components/ui/LinkedInButton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <p className="section-label mb-4">About Me</p>
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-10"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF2D9B 0%, #A020F0 50%, #00C2FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Filip Dumanowski
        </h1>

        <DopamineDivider className="mb-10" />

        <div className="dopamine-card author-card p-4 sm:p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="flex flex-col items-center">
              <img src="/author-photo.jpg" alt="Filip Dumanowski" className="neo-border w-full max-w-[220px] sm:max-w-[280px] aspect-square object-cover mx-auto md:mx-0" />
            </div>

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
    </main>
  )
}
