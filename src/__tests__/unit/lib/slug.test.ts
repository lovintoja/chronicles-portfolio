import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/lib/slug'

describe('generateSlug') {
  describe('when given a normal title') {
    it('should produce lowercase kebab-case', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
    })
  }

  describe('when the title contains special characters') {
    it('should strip special characters', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world')
    })
  }

  describe('when the title contains uppercase letters') {
    it('should lowercase the result', () => {
      expect(generateSlug('MY TITLE')).toBe('my-title')
    })
  }

  describe('when the title has leading and trailing spaces') {
    it('should trim whitespace', () => {
      expect(generateSlug('  trimmed title  ')).toBe('trimmed-title')
    })
  }

  describe('when the title has multiple consecutive spaces') {
    it('should collapse them into a single dash', () => {
      expect(generateSlug('multiple   spaces   here')).toBe('multiple-spaces-here')
    })
  }
}
