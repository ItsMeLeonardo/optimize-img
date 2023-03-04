<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'

  import type { DomImages, CustomImage } from 'src/types'
  import storageService from '../service/storage'
  import { setInitialOptimizeOptionsList, optimizeResultsList } from '../store'

  import Button from './Button.svelte'
  import { getRemoteImageSize } from '../utils/image'
  import ItemList from './ItemList.svelte'

  let customImages: Promise<CustomImage[]> | undefined
  let domImages: DomImages[] | undefined

  let savedImages: CustomImage[] | undefined

  const { setInitialResults } = optimizeResultsList

  function getAllImages() {
    const docImages = document.querySelectorAll('img')
    const imageList = Array.from(docImages)

    const imagesMaped: DomImages[] = imageList.map((img, index) => {
      const { width, height, naturalWidth, naturalHeight, alt, src } = img
      const id = `${src}-${index}`

      img.setAttribute('data-extension-id', id)

      const rect = img.getBoundingClientRect()

      const coordinates = {
        top: rect.top + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      }

      return {
        id,
        src,
        alt,
        width,
        height,
        coordinates,
        originalWidth: naturalWidth,
        originalHeight: naturalHeight,
      }
    })

    chrome.runtime.sendMessage({ images: imagesMaped })
  }

  async function loadContentScript() {
    const tabs = await chrome.tabs
      .query({ active: true, currentWindow: true })
      .catch(err => console.log({ err }))

    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getAllImages,
    })
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const images = request.images as DomImages[]

    setImages(images)
  })

  function setImages(images: DomImages[]) {
    domImages = images
  }

  async function populateCustomImage() {
    const images: CustomImage[] = []

    for await (const image of domImages) {
      const { bytes, sizeLabel, performance } = await getRemoteImageSize(image.src)

      if (!bytes) continue

      const customImage: CustomImage = {
        ...image,
        size: bytes,
        sizeLabel,
        performance,
      }

      images.push(customImage)
    }

    return images
  }

  async function handleClick() {
    await loadContentScript()
  }

  onMount(async () => {
    const tabs = await chrome.tabs
      .query({ active: true, currentWindow: true })
      .catch(err => console.log({ err }))

    if (!tabs) return

    const currentTabUrl = tabs[0].url

    const data = await storageService.getData(currentTabUrl)

    if (!data) return

    if (data.images && data.images.length) {
      savedImages = data.images
    }

    if (data.optimizeOptionsList) {
      const { optimizeOptionsList } = data
      setInitialOptimizeOptionsList(new Map(optimizeOptionsList))
    }

    if (data.optimizeResultList) {
      const { optimizeResultList } = data
      setInitialResults(new Map(optimizeResultList))
    }
  })

  $: {
    if (domImages) {
      customImages = populateCustomImage()
    }
  }
</script>

<main class="p-1 w-80 bg-neutral-50">
  <div class="p-5 pb-2 flex flex-col gap-2 justify-center items-center">
    <h1
      class="mx-auto text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      Optimize.img
    </h1>
    {#if !domImages || domImages.length === 0}
      <div
        class="flex flex-col gap-4 justify-center items-center"
        out:fade={{ duration: 200 }}
      >
        <p class="text-sm text-center">
          Find images in the current page and optimize them
        </p>
        <Button on:click={handleClick}>
          <i class="iconoir-search-window text-xl" />
          {#if savedImages && savedImages.length}
            <span>Look Again</span>
          {:else}
            <span>Find images</span>
          {/if}
        </Button>
      </div>
    {/if}
  </div>

  {#if savedImages && savedImages.length && !domImages}
    <ItemList images={savedImages} />
  {/if}

  {#if domImages}
    {#if domImages.length}
      {#if customImages}
        {#await customImages}
          <div class="flex w-full gap-4">
            <span class="h-5 rounded bg-slate-200 flex-grow" />
            <span class="h-5 rounded bg-slate-200 flex-grow" />
            <span class="h-5 rounded bg-slate-200 flex-grow" />
            <span class="h-5 rounded bg-slate-200 flex-grow" />
          </div>
          <ul class="flex flex-col gap-2">
            {#each domImages as item}
              <li class="w-full rounded-lg">
                <div class="flex w-full h-[60px] p-2 gap-2 items-center rounded-xl">
                  <div class="flex-grow h-full flex justify-center items-center gap-2  ">
                    <div
                      class="aspect-square h-full flex items-center justify-center bg-slate-200 rounded-lg"
                    />

                    <span class="flex-grow bg-slate-200 rounded-md h-5" />

                    <div
                      class="aspect-square h-[34px] flex items-center justify-center bg-slate-200 rounded-lg"
                    />

                    <div
                      class="aspect-square h-[34px] flex items-center justify-center bg-slate-200 rounded-lg"
                    />

                    <div
                      class="aspect-square h-[34px] flex items-center justify-center bg-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {:then images}
          <ItemList {images} />
        {/await}
      {/if}
    {:else}
      <div
        class="w-full text-center px-8 py-4 flex flex-col gap-2 items-center justify-center"
      >
        <i class="iconoir-emoji-puzzled text-2xl" />
        <span>
          Sorry, we couldn't find any images in this page.
          <span class="text-purple-600">Try again in another page.</span>
        </span>
      </div>
    {/if}
  {/if}
</main>
