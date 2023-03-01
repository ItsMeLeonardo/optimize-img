import type { Performance } from 'src/types'

export * from './numbers'

const HIGH_INTERVAL = 100
const MEDIUM_INTERVAL = 200
const LOW_INTERVAL = 300

export function getImagePerformance(bytes: number): Performance {
  const kbs = bytes / 1024
  if (kbs < HIGH_INTERVAL) return 'high'
  if (kbs < MEDIUM_INTERVAL) return 'medium'
  return 'low'
}
