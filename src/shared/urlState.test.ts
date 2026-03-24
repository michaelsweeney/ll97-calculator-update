import { describe, it, expect } from 'vitest'
import { toBase64url, fromBase64url } from './base64url'
import { encodeScenario, decodeScenario } from './urlState'
import type { BuildingScenario } from './types'

const baseScenario: BuildingScenario = {
  v: 1,
  building_uses: [{ building_type: 'Office', building_area: 50000 }],
  utilities: {
    elec_kwh: 1200000,
    gas_therms: 80000,
    steam_mlbs: 0,
    fuel_two_gal: 0,
    fuel_four_gal: 0,
    elec_onsite_gen_kwh: 0,
  },
}

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

describe('encodeScenario / decodeScenario', () => {
  it('round-trips a scenario', () => {
    expect(decodeScenario(encodeScenario(baseScenario))).toEqual(baseScenario)
  })

  it('round-trips with Unicode building name', () => {
    const s: BuildingScenario = {
      ...baseScenario,
      ll84: {
        bbl: '1-00072-7201',
        property_id: '1234',
        year: 'll84_2025_cal_2024',
        building_name: 'Empire State—"Building"',
        year_label: 'LL84 2025',
      },
    }
    expect(decodeScenario(encodeScenario(s))).toEqual(s)
  })

  it('returns null for malformed base64', () => {
    expect(decodeScenario('not-valid-base64!!!')).toBeNull()
  })

  it('returns null for wrong version', () => {
    const bad = toBase64url(JSON.stringify({ v: 2, building_uses: [] }))
    expect(decodeScenario(bad)).toBeNull()
  })

  it('returns null for valid base64 but non-JSON', () => {
    expect(decodeScenario(toBase64url('hello world'))).toBeNull()
  })
})
