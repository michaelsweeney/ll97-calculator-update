import { describe, it, expect } from 'vitest'
import { toBase64url, fromBase64url } from './base64url'

describe('base64url', () => {
  it('round-trips ASCII strings', () => {
    const s = '{"v":1,"foo":"bar"}'
    expect(fromBase64url(toBase64url(s))).toBe(s)
  })

  it('round-trips Unicode strings (em dash, curly quotes)', () => {
    const s = 'Empire State—"Building"'
    expect(fromBase64url(toBase64url(s))).toBe(s)
  })

  it('produces URL-safe output (no +, /, =)', () => {
    const encoded = toBase64url('{"v":1,"building_name":"Test"}')
    expect(encoded).not.toMatch(/[+/=]/)
  })
})
