<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { CustomImage } from 'src/types'

  import { getPercentageRatio } from '../utils'
  import { buildOptimizeImageUrl } from '../service'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'
  import { getRemoteImageSize } from '../utils/image'

  import ItemDetails from './ItemDetails.svelte'

  export let image: CustomImage

  const dispatch = createEventDispatcher<{
    optimize: { url: string }
  }>()
  // let checked = false
  let showDetails = false
  let quality = 70

  const {
    alt,
    height,
    originalHeight,
    originalWidth,
    src,
    width,
    coordinates,
    performance,
    size: originalSize,
    sizeLabel: originalLabel,
  } = image

  let optimizedUrl: string = buildOptimizeImageUrl({
    url: src,
    quality,
  })

  function goToImage(x: number, y: number, src: string) {
    window.scrollTo(x, y - 100)

    const img = document.querySelector(
      `img[data-extension-id="${src}"]`,
    ) as HTMLImageElement

    img.animate(
      [{ filter: 'blur(0)' }, { filter: 'blur(2rem)' }, { filter: 'blur(0)' }],
      {
        delay: 100,
        duration: 1500,
        easing: 'ease',
      },
    )
  }

  async function handleGoToImage() {
    const tabs = await chrome.tabs
      .query({ active: true, currentWindow: true })
      .catch(err => console.log({ err }))

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: goToImage,
      args: [coordinates.left, coordinates.top, src],
    })
  }

  async function handleDonwloadImage() {
    chrome.downloads.download({
      url: optimizedUrl,
    })
  }

  let optimizeImagePromise: ReturnType<typeof getRemoteImageSize> | null = null

  async function handleOptimizeImage() {
    optimizeImagePromise = getRemoteImageSize(optimizedUrl)
    dispatch('optimize', { url: optimizedUrl })
  }

  function toggleDetails() {
    showDetails = !showDetails
  }
</script>

<li class="w-full rounded-lg" class:bg-white={showDetails}>
  <div class="flex w-full h-[60px] p-2 gap-2 items-center rounded-xl">
    <label
      for=""
      class="flex-grow h-full w-full flex justify-center items-center gap-2 cursor-pointer"
    >
      <!-- <div
          class="w-4 aspect-square border-2 border-slate-500 rounded flex justify-center items-center focus-within:ring"
          class:bg-slate-500={checked}
        >
          <input
            type="checkbox"
            bind:checked
            class="absolute w-0 h-0 -z-10 opacity-0"
          />
          {#if checked}
            <i class="iconoir-check text-white text-xs" />
          {/if}
        </div> -->

      <picture class="aspect-square h-full flex items-center justify-center">
        <img
          {src}
          {alt}
          crossorigin="anonymous"
          class="object-cover w-full h-full rounded-lg"
        />
      </picture>

      <div class="flex flex-grow flex-col gap-0.5 items-start">
        <div
          class="w-full flex text-xl items-center gap-1"
          class:text-red-500={performance === 'low'}
          class:text-green-500={performance === 'high'}
          class:text-yellow-500={performance === 'medium'}
        >
          {#if performance === 'low'}
            <i class="iconoir-emoji-talking-angry" />
          {/if}
          {#if performance === 'medium'}
            <i class="iconoir-emoji-surprise-alt" />
          {/if}
          {#if performance === 'high'}
            <i class="iconoir-emoji" />
          {/if}
          <span class="text-xs font-bold whitespace-nowrap">
            {originalLabel}
          </span>
        </div>
        {#if optimizeImagePromise}
          {#await optimizeImagePromise then { sizeLabel: newLabel, bytes: newBytes }}
            <span class="text-xs text-green-500 whitespace-nowrap">
              {newLabel}
              <span class="font-bold">
                ({getPercentageRatio(newBytes, 0, originalSize) - 100}%)
              </span>
            </span>
          {/await}
        {/if}
      </div>
    </label>
    <Button on:click={handleGoToImage} icon color="secondary">
      <i class="iconoir-eye-empty" />
    </Button>
    {#if !optimizeImagePromise}
      <Button icon on:click={handleOptimizeImage}>
        <i class="iconoir-magic-wand" />
      </Button>
    {:else}
      {#await optimizeImagePromise}
        <span class="flex justify-center items-center rounded-md">
          <Loader />
        </span>
      {:then}
        <Button icon on:click={handleDonwloadImage}>
          <i class="iconoir-download" />
        </Button>
      {:catch error}
        error try again
      {/await}
    {/if}
    <Button icon on:click={toggleDetails} color="tertiary">
      <i class="iconoir-nav-arrow-down" class:rotate-180={showDetails} />
    </Button>
  </div>

  {#if showDetails}
    <ItemDetails {height} {width} {originalHeight} {originalWidth} url={src} />
  {/if}
</li>
