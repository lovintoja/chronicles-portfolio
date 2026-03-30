"use client"

import type { LucideIcon } from "lucide-react"
import { Server, Cpu, Cloud, Lock, GitBranch, Box, Globe, Activity } from "lucide-react"
import DopamineDivider from "@/components/ui/DopamineDivider"
import { useLanguage } from "@/contexts/LanguageContext"

interface AzureService {
  icon: LucideIcon
  name: string
  descriptionKey: keyof ReturnType<typeof useLanguage>["t"]["skills"]["azureServices"]
  shadow: string
}

const azureServices: AzureService[] = [
  { icon: Lock,      name: "Key Vault",          descriptionKey: "keyVault",          shadow: "#FF2D9B" },
  { icon: Server,    name: "Virtual Machines",    descriptionKey: "virtualMachines",   shadow: "#00C2FF" },
  { icon: GitBranch, name: "Azure DevOps",        descriptionKey: "devops",            shadow: "#B6FF00" },
  { icon: Box,       name: "Container Registry",  descriptionKey: "containerRegistry", shadow: "#FF6B00" },
  { icon: Globe,     name: "App Service",         descriptionKey: "appService",        shadow: "#A020F0" },
  { icon: Activity,  name: "Azure Monitor",       descriptionKey: "monitor",           shadow: "#FFE600" },
]

const tools = ["Docker", "Git", "GitHub Actions", "Linux", "Bash/Shell", "Postman", "VS Code", "IntelliJ IDEA"]

export default function SkillsPage() {
  const { t } = useLanguage()

  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <p className="section-label mb-3">{t.skills.sectionLabel}</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pop-black leading-tight">
          {t.skills.heading}
        </h1>
      </section>

      <DopamineDivider />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <p className="section-label mb-6">{t.skills.backend}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="dopamine-card p-4 sm:p-6" style={{ boxShadow: "6px 6px 0 #00C2FF" }}>
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-6 w-6 text-pop-black flex-shrink-0" />
              <h2
                className="font-display text-xl sm:text-2xl font-bold"
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
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-electric-blue text-pop-black">.NET 6</span>
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-lime-green text-pop-black">.NET 8</span>
            </div>
            <ul className="space-y-1">
              {t.skills.dotnet.map((skill: string) => (
                <li key={skill} className="pl-3 py-1 text-sm font-body text-pop-black" style={{ borderLeft: "3px solid #00C2FF" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="dopamine-card p-4 sm:p-6" style={{ boxShadow: "6px 6px 0 #B6FF00" }}>
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-6 w-6 text-pop-black flex-shrink-0" />
              <h2
                className="font-display text-xl sm:text-2xl font-bold"
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
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-solar-orange text-pop-white">Java 17</span>
              <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 text-pop-white" style={{ backgroundColor: "#A020F0" }}>Spring Boot 4.7.1</span>
            </div>
            <ul className="space-y-1">
              {t.skills.java.map((skill: string) => (
                <li key={skill} className="pl-3 py-1 text-sm font-body text-pop-black" style={{ borderLeft: "3px solid #B6FF00" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <DopamineDivider />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <p className="section-label mb-6">{t.skills.devops}</p>

        <div className="dopamine-card p-4 sm:p-6 mb-6" style={{ boxShadow: "8px 8px 0 #A020F0" }}>
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="h-7 w-7 text-pop-black flex-shrink-0" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-pop-black">Microsoft Azure</h2>
          </div>
          <p className="font-body text-pop-black mb-4 leading-relaxed">{t.skills.azureDescription}</p>
          <span className="border-2 border-pop-black text-xs font-bold font-ui uppercase px-2 py-0.5 bg-electric-blue text-pop-black">
            Azure Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {azureServices.map(({ icon: Icon, name, descriptionKey, shadow }) => (
            <div key={name} className="dopamine-card p-4" style={{ boxShadow: `6px 6px 0 ${shadow}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-pop-black flex-shrink-0" />
                <h3 className="font-display text-base font-bold text-pop-black">{name}</h3>
              </div>
              <p className="font-body text-sm text-pop-black leading-snug">{t.skills.azureServices[descriptionKey]}</p>
            </div>
          ))}
        </div>
      </section>

      <DopamineDivider />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <p className="section-label mb-6">{t.skills.tooling}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {tools.map((tool: string) => (
            <span key={tool} className="neo-border px-3 py-1 text-sm font-bold font-ui uppercase bg-pop-yellow text-pop-black">
              {tool}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
