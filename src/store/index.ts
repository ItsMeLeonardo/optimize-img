import { writable, derived } from 'svelte/store'

import type { Filter, CustomImage, OptimizeResult, OptimizeOptions } from 'src/types'
import { getRemoteImageSize } from '../utils/image'
import { buildOptimizeImageUrl } from '../service'

/* export const optimizedUrls = writable(new Set<string>())

export function addOptimizedUrl(value: string) {
  optimizedUrls.update(set => {
    set.add(value)
    return set
  })
} */

// ------------------------------

export const images = writable<CustomImage[]>([])

export function setInitialImages(value: CustomImage[]) {
  images.set(value)
}

// ------------------------------

export const filter = writable<Filter>('all')

export function setFilter(value: Filter) {
  filter.set(value)
}

// ------------------------------

export const imageToShow = derived([images, filter], ([$images, $filters]) => {
  if ($filters === 'all') return $images
  return $images.filter(image => image.performance === $filters)
})

// ------------------------------

export const optimizeOptionsList = writable(new Map<string, OptimizeOptions>())

export const setInitialOptimizeOptionsList = (value: Map<string, OptimizeOptions>) => {
  optimizeOptionsList.set(value)
}

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

// ------------------------------

export const globalOptimizeOptions = writable<OptimizeOptions>({
  format: 'webp',
  quality: 70,
})

// ------------------------------

type imageOption = {
  id: string
  url: string
}

function createOptimizeResultsList() {
  const optimizeResultList = writable(new Map<string, OptimizeResult>())
  const loadingAllImages = writable(false)

  const setInitialResults = (value: Map<string, OptimizeResult>) => {
    optimizeResultList.set(value)
  }

  const optimizeImage = async (
    id: string,
    url: string,
    optimizeOptions?: OptimizeOptions,
  ) => {
    const optionsToUse = optimizeOptions || globalOptimizeOptions

    const optimizedUrl = buildOptimizeImageUrl({
      url,
      ...optionsToUse,
    })
    const result = await getRemoteImageSize(optimizedUrl)

    optimizeResultList.update(list => {
      list.set(id, result)
      return list
    })
  }

  const resetImage = (id: string) => {
    optimizeResultList.update(list => {
      list.delete(id)
      return list
    })
  }

  const optimizeAllImages = async (urls: imageOption[]) => {
    loadingAllImages.set(true)

    const newList = await Promise.all(
      urls.map(async ({ id, url }) => {
        const optimizedUrl = buildOptimizeImageUrl({
          url,
          ...globalOptimizeOptions,
        })
        return getRemoteImageSize(optimizedUrl).then(result => [id, result])
      }),
    ).finally(() => loadingAllImages.set(false))

    optimizeResultList.set(new Map(newList as [string, OptimizeResult][]))
  }

  return {
    optimizeResultList,
    loadingAllImages,
    optimizeImage,
    optimizeAllImages,
    resetImage,
    setInitialResults,
  }
}

export const optimizeResultsList = createOptimizeResultsList()
