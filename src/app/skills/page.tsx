import type { Metadata } from "next"
import { Server, Cpu, Cloud, Lock, GitBranch, Box, Globe, Activity } from "lucide-react"
import DopamineDivider from "@/components/ui/DopamineDivider"

export const metadata: Metadata = {
  title: "Skills | The Chronicle",
}

const azureServices = [
  {
    icon: Lock,
    name: "Key Vault",
    description: "Secrets, keys, and certificate management",
    shadow: "#FF2D9B",
  },
  {
    icon: Server,
    name: "Virtual Machines",
    description: "Linux & Windows VM provisioning and management",
    shadow: "#00C2FF",
  },
  {
    icon: GitBranch,
    name: "Azure DevOps",
    description: "CI/CD pipelines, repos, and work item tracking",
    shadow: "#B6FF00",
  },
  {
    icon: Box,
    name: "Container Registry",
    description: "Private Docker image storage and lifecycle",
    shadow: "#FF6B00",
  },
  {
    icon: Globe,
    name: "App Service",
    description: "Managed hosting for web apps and APIs",
    shadow: "#A020F0",
  },
  {
    icon: Activity,
    name: "Azure Monitor",
    description: "Metrics, alerts, and log analytics",
    shadow: "#FFE600",
  },
]

const tools = [
  "Docker",
  "Git",
  "GitHub Actions",
  "Linux",
  "Bash/Shell",
  "Postman",
  "VS Code",
  "IntelliJ IDEA",
]

const dotnetSkills = [
  "REST API Development",
  "Entity Framework Core",
  "Dependency Injection",
  "LINQ & Data Querying",
  "Minimal APIs",
  "ASP.NET Core Middleware",
]

const javaSkills = [
  "Spring MVC & REST",
  "Spring Data JPA",
  "Spring Security",
  "Spring Boot Actuator",
  "Maven & Gradle Builds",
  "Microservices Architecture",
]

export default function SkillsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="section-label mb-3">Technical Skills</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-pop-black leading-tight">
          My Stack
        </h1>
      </section>

      <DopamineDivider />

      {/* Backend Development */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="section-label mb-6">Backend Development</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* .NET Card */}
          <div
            className="dopamine-card p-6"
            style={{ boxShadow: "6px 6px 0 #00C2FF" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-6 w-6 text-pop-black flex-shrink-0" />
              <h2
                className="font-display text-2xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #FF2D9B, #A020F0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                .NET
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-electric-blue text-pop-black">
                .NET 6
              </span>
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-lime-green text-pop-black">
                .NET 8
              </span>
            </div>
            <ul className="space-y-1">
              {dotnetSkills.map((skill) => (
                <li
                  key={skill}
                  className="pl-3 py-1 text-sm font-body text-pop-black"
                  style={{ borderLeft: "3px solid #00C2FF" }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Java/Spring Card */}
          <div
            className="dopamine-card p-6"
            style={{ boxShadow: "6px 6px 0 #B6FF00" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-6 w-6 text-pop-black flex-shrink-0" />
              <h2
                className="font-display text-2xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #FF2D9B, #A020F0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Java &amp; Spring
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-solar-orange text-pop-white">
                Java 17
              </span>
              <span
                className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 text-pop-white"
                style={{ backgroundColor: "#A020F0" }}
              >
                Spring Boot 4.7.1
              </span>
            </div>
            <ul className="space-y-1">
              {javaSkills.map((skill) => (
                <li
                  key={skill}
                  className="pl-3 py-1 text-sm font-body text-pop-black"
                  style={{ borderLeft: "3px solid #B6FF00" }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <DopamineDivider />

      {/* DevOps & Cloud */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="section-label mb-6">DevOps &amp; Cloud</p>

        {/* Azure Overview Card */}
        <div
          className="dopamine-card p-6 mb-6"
          style={{ boxShadow: "8px 8px 0 #A020F0" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="h-7 w-7 text-pop-black flex-shrink-0" />
            <h2 className="font-display text-2xl font-bold text-pop-black">
              Microsoft Azure
            </h2>
          </div>
          <p className="font-body text-pop-black mb-4 leading-relaxed">
            Experienced with provisioning, securing, and automating infrastructure on Microsoft
            Azure — from compute and storage to secrets management and CI/CD pipelines.
          </p>
          <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-electric-blue text-pop-black">
            Azure Cloud
          </span>
        </div>

        {/* Azure Service Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {azureServices.map(({ icon: Icon, name, description, shadow }) => (
            <div
              key={name}
              className="dopamine-card p-4"
              style={{ boxShadow: `6px 6px 0 ${shadow}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-pop-black flex-shrink-0" />
                <h3 className="font-display text-base font-bold text-pop-black">{name}</h3>
              </div>
              <p className="font-body text-sm text-pop-black leading-snug">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <DopamineDivider />

      {/* Tooling & Workflow */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="section-label mb-6">Tooling &amp; Workflow</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {tools.map((tool) => (
            <span
              key={tool}
              className="neo-border px-3 py-1 text-sm font-bold font-ui uppercase bg-pop-yellow text-pop-black"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
