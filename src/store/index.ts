import { writable, derived } from 'svelte/store'

import type { Filter, CustomImage, OptimizeResult, OptimizeOptions } from 'src/types'

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

export function setInitialImages(value: CustomImage[]) {
  images.set(value)
}

export function optimizeImage(id: string, optimizeResult: OptimizeResult) {
  images.update(images => {
    const image = images.find(image => image.id === id)
    if (image) image.optimizeResult = optimizeResult
    return images
  })
}

export function setOptimizeOptions(
  id: string,
  optimizeOptions: Partial<OptimizeOptions>,
) {
  images.update(images => {
    const image = images.find(image => image.id === id)
    if (image) {
      const newOptions = { ...image.optimizeOptions, ...optimizeOptions }
      image.optimizeOptions = newOptions
    }
    return images
  })
}

export const filter = writable<Filter>('all')

export function setFilter(value: Filter) {
  filter.set(value)
}

export const imageToShow = derived([images, filter], ([$images, $filters]) => {
  if ($filters === 'all') return $images
  return $images.filter(image => image.performance === $filters)
})

// export const optimizeOptions = writable<OptimizeOptions>({})

export const optimizeOptionsList = writable(new Map<string, OptimizeOptions>())

export function addOptimizeOptions(
  id: string,
  optimizeOptions: Partial<OptimizeOptions>,
) {
  optimizeOptionsList.update(list => {
    const newOptions = { ...list.get(id), ...optimizeOptions }
    list.set(id, newOptions)
    return list
  })
}
