import { writable } from 'svelte/store'

export const optimizedUrls = writable(new Set<string>())

export function addOptimizedUrl(value: string) {
  optimizedUrls.update(set => {
    set.add(value)
    return set
  })
}

export function removeOptimizedUrl(value: string) {
  optimizedUrls.update(set => {
    set.delete(value)
    return set
  })
}
