<script lang="ts">
  import { fade } from 'svelte/transition'

  import type { DomImages, CustomImage } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'
  import { getRemoteImageSize } from '../utils/image'

  type Filters = 'all' | 'low' | 'medium' | 'high'

  let customImages: Promise<CustomImage[]> | undefined
  let domImages: DomImages[] | undefined

  let filter: Filters = 'all'

  function getAllImages() {
    const docImages = document.querySelectorAll('img')
    const imageList = Array.from(docImages)

    imageList.forEach(img => {
      img.setAttribute('data-extension-id', img.src)
    })

    const imagesMaped: DomImages[] = imageList.map(img => {
      const { width, height, naturalWidth, naturalHeight, alt, src } = img

      const rect = img.getBoundingClientRect()

      const coordinates = {
        top: rect.top + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      }

      return {
        src,
        alt,
        width,
        height,
        id: src,
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

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
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
    // images++
    // getImage()
  }

  $: {
    if (domImages) {
      customImages = populateCustomImage()
      console.log(customImages.then(console.log))
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
          <span>Find images</span>
        </Button>
      </div>
    {/if}
  </div>

  {#if domImages}
    {#if domImages.length}
      <div class="w-full flex my-2">
        <button
          class="flex-grow flex items-center justify-center gap-2 font-bold  rounded py-1 px-4 hover:text-indigo-500"
          class:bg-white={filter === 'all'}
          on:click={() => (filter = 'all')}
        >
          All
        </button>

        <button
          class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-red-500"
          class:bg-white={filter === 'low'}
          class:text-red-500={filter === 'low'}
          on:click={() => (filter = 'low')}
        >
          <span>Low</span>
          <i class="iconoir-emoji-talking-angry text-xl" />
        </button>

        <button
          class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-yellow-500"
          class:bg-white={filter === 'medium'}
          class:text-yellow-500={filter === 'medium'}
          on:click={() => (filter = 'medium')}
        >
          <span>medium</span>
          <i class="iconoir-emoji-surprise-alt text-xl" />
        </button>

        <button
          class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-green-500"
          class:bg-white={filter === 'high'}
          class:text-green-500={filter === 'high'}
          on:click={() => (filter = 'high')}
        >
          <span>high</span>
          <i class="iconoir-emoji text-xl" />
        </button>
      </div>

      {#if customImages}
        {#await customImages}
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
          <ul class="flex flex-col gap-2">
            {#each images as image}
              <Item {image} />
            {/each}
          </ul>
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
