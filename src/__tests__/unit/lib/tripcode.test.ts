import { describe, it, expect } from 'vitest'
import { parseNameAndTripcode } from '@/lib/tripcode'

describe('parseNameAndTripcode') {
  describe('when there is no # delimiter') {
    it('should return the input as displayName with null tripcode', () => {
      const result = parseNameAndTripcode('JustAName')
      expect(result.displayName).toBe('JustAName')
      expect(result.tripcode).toBeNull()
    })
  }

  describe('when input is name#password') {
    it('should return the name and a 6-char hex tripcode', () => {
      const result = parseNameAndTripcode('Alice#secret')
      expect(result.displayName).toBe('Alice')
      expect(result.tripcode).toMatch(/^[0-9a-f]{6}$/)
    })
  }

  describe('when input starts with # (empty name)') {
    it('should set displayName to "Anonymous"', () => {
      const result = parseNameAndTripcode('#password')
      expect(result.displayName).toBe('Anonymous')
      expect(result.tripcode).toMatch(/^[0-9a-f]{6}$/)
    })
  }

  describe('when input contains multiple # characters') {
    it('should split only at the first # and use the rest as the password', () => {
      const result = parseNameAndTripcode('Bob#pass#word')
      expect(result.displayName).toBe('Bob')
      // The password is "pass#word"
      expect(result.tripcode).toMatch(/^[0-9a-f]{6}$/)
      // Confirm it differs from a result with just "pass" as password
      const withShortPass = parseNameAndTripcode('Bob#pass')
      expect(result.tripcode).not.toBe(withShortPass.tripcode)
    })
  }

  describe('when the same password and secret are used') {
    it('should produce a deterministic tripcode', () => {
      const first = parseNameAndTripcode('User#mypassword')
      const second = parseNameAndTripcode('User#mypassword')
      expect(first.tripcode).toBe(second.tripcode)
    })
  }
}
