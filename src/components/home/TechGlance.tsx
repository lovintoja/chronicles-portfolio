interface TechCard {
  accent: string
  shadow: string
  label: string
  title: string
  body: string
  pills: string[]
  pillBg: string
}

const cards: TechCard[] = [
  {
    accent: "#FF2D9B",
    shadow: "6px 6px 0 #00C2FF",
    label: "Backend",
    title: "Java & .NET",
    body: "Spring Boot 3, ASP.NET Core, REST APIs, EF Core, JPA",
    pills: [".NET 8", "Java 17", "Spring Boot"],
    pillBg: "bg-hot-pink text-white",
  },
  {
    accent: "#B6FF00",
    shadow: "6px 6px 0 #FF2D9B",
    label: "Cloud & Infra",
    title: "Azure + Docker",
    body: "AKS, App Service, Key Vault, Container Registry, Azure DevOps CI/CD",
    pills: ["Azure", "Docker", "GitHub Actions"],
    pillBg: "bg-lime-green text-pop-black",
  },
  {
    accent: "#00C2FF",
    shadow: "6px 6px 0 #B6FF00",
    label: "Data & Messaging",
    title: "PostgreSQL & More",
    body: "Entity Framework, Spring Data JPA, SQL query optimisation",
    pills: ["PostgreSQL", "SQL Server", "Prisma"],
    pillBg: "bg-electric-blue text-pop-black",
  },
]

export default function TechGlance() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <p className="section-label mb-6">At a Glance</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div
            key={c.title}
            className="dopamine-card p-5 flex flex-col gap-3"
            style={{ boxShadow: c.shadow }}
          >
            <div className="w-8 h-8 neo-border flex-shrink-0" style={{ background: c.accent }} />
            <div>
              <p className="section-label mb-1">{c.label}</p>
              <h3
                className="text-xl font-black text-pop-black"
                style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
              >
                {c.title}
              </h3>
              <p className="text-sm text-pop-black mt-2 leading-snug">{c.body}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {c.pills.map((p) => (
                <span key={p} className={`neo-border text-xs font-bold font-ui uppercase px-2 py-0.5 ${c.pillBg}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
