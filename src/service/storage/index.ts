import type { CustomImage, OptimizeResult, OptimizeOptions } from 'src/types'

type StoreData = {
  images?: CustomImage[]
  optimizeOptionsList?: [string, OptimizeOptions][]
  optimizeResultList?: [string, OptimizeResult][]
}

class StorageService {
  async getData(url: string) {
    const result = await chrome.storage.local.get([url])
    return result[url] as StoreData
  }

  async getImages(url: string) {
    const result = await this.getData(url)
    return result.images || []
  }

  async getOptimizeOptionsList(url: string) {
    const result = await this.getData(url)
    if (!result.optimizeOptionsList) return undefined
    return new Map(result.optimizeOptionsList)
  }

  async getOptimizeResultList(url: string) {
    const result = await this.getData(url)
    if (!result.optimizeResultList) return undefined
    return new Map(result.optimizeResultList)
  }

  async saveImages(url: string, images: CustomImage[]) {
    const prevData = await this.getData(url)

    const newData = {
      ...prevData,
      images,
    }

    await chrome.storage.local.set({ [url]: newData })
  }

  async saveOptimizeOptionsList(
    url: string,
    optimizeOptionsList: Map<string, OptimizeOptions>,
  ) {
    const prevData = await this.getData(url)

    const newData = {
      ...prevData,
      optimizeOptionsList: Array.from(optimizeOptionsList),
    }

    await chrome.storage.local.set({ [url]: newData })
  }

  async saveOptimizeResultList(
    url: string,
    optimizeResultList: Map<string, OptimizeResult>,
  ) {
    const prevData = await this.getData(url)

    const newData = {
      ...prevData,
      optimizeResultList: Array.from(optimizeResultList),
    }

    await chrome.storage.local.set({ [url]: newData })
  }
}

const storageService = new StorageService()

export default storageService
