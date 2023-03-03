import { writable, derived } from 'svelte/store'

import type { Filter, CustomImage } from 'src/types'

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

export const images = writable<CustomImage[]>([])

export function addImage(value: CustomImage) {
  images.update(array => {
    array.push(value)
    return array
  })
}

export function setInitialImages(value: CustomImage[]) {
  images.set(value)
}

export const filter = writable<Filter>('all')

export function setFilter(value: Filter) {
  filter.set(value)
}

export const imageToShow = derived([images, filter], ([$images, $filters]) => {
  if ($filters === 'all') return $images
  return $images.filter(image => image.performance === $filters)
})
