import type { BuildingScenario } from './types'
import { toBase64url, fromBase64url } from './base64url'

export function encodeScenario(scenario: BuildingScenario): string {
  return toBase64url(JSON.stringify(scenario))
}

export function decodeScenario(encoded: string): BuildingScenario | null {
  try {
    const parsed = JSON.parse(fromBase64url(encoded))
    if (parsed?.v !== 1) return null
    return parsed as BuildingScenario
  } catch {
    return null
  }
}
