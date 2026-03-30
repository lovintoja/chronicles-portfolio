import { describe, it, expect } from 'vitest'

type NavGroup = {
  label: string
  items: { href: string; label: string }[]
}

const navGroups: NavGroup[] = [
  {
    label: "About",
    items: [
      { href: "/about", label: "About" },
      { href: "/skills", label: "Skills" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/projects", label: "Projects" },
      { href: "/pricing", label: "Pricing" },
      { href: "/offer", label: "Offer" },
    ],
  },
]

describe("navGroups", () => {
  it("every group has at least one item", () => {
    navGroups.forEach(group => {
      expect(group.items.length).toBeGreaterThan(0)
    })
  })

  it("every item has a non-empty href and label", () => {
    navGroups.forEach(group => {
      group.items.forEach(item => {
        expect(item.href.trim()).not.toBe("")
        expect(item.label.trim()).not.toBe("")
      })
    })
  })

  it("all hrefs start with /", () => {
    navGroups.forEach(group => {
      group.items.forEach(item => {
        expect(item.href).toMatch(/^\//)
      })
    })
  })

  it("no duplicate hrefs across all groups", () => {
    const allHrefs = navGroups.flatMap(g => g.items.map(i => i.href))
    const unique = new Set(allHrefs)
    expect(unique.size).toBe(allHrefs.length)
  })

  it("all group labels are non-empty", () => {
    navGroups.forEach(group => {
      expect(group.label.trim()).not.toBe("")
    })
  })
})
