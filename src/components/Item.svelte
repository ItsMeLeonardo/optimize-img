<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import debounce from 'just-debounce'

  import type { CustomImage, OptimizeOptions } from 'src/types'

  import { addOptimizeOptions, optimizeOptionsList, optimizeResultsList } from '../store'

  import { getPercentageRatio } from '../utils'
  import { buildOptimizeImageUrl } from '../service'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'

  import ItemDetails from './ItemDetails.svelte'

  export let image: CustomImage

  const dispatch = createEventDispatcher<{
    optimize: { url: string }
  }>()
  let showDetails = false
  let quality = 70
  let loading = false

  const { optimizeImage, optimizeResultList, resetImage } = optimizeResultsList

  const {
    alt,
    height,
    originalHeight,
    originalWidth,
    src,
    width,
    coordinates,
    id,
    performance,
    size: originalSize,
    sizeLabel: originalLabel,
  } = image

  let optimizedUrl: string = buildOptimizeImageUrl({
    url: src,
    quality,
  })

  function goToImage(x: number, y: number, id: string) {
    window.scrollTo(x, y - 100)

    const img = document.querySelector(
      `img[data-extension-id="${id}"]`,
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
      args: [coordinates.left, coordinates.top, id],
    })
  }

  async function handleDonwloadImage() {
    chrome.downloads.download({
      url: optimizedUrl,
    })
  }

  async function handleOptimizeImage(options?: OptimizeOptions) {
    loading = true

    await optimizeImage(id, src, options).finally(() => {
      loading = false
    })
    dispatch('optimize', { url: optimizedUrl })
  }

  const handleChangeOptimizeOptions = debounce((event: CustomEvent<OptimizeOptions>) => {
    const options = event.detail
    addOptimizeOptions(id, options)
    handleOptimizeImage(options)
  }, 500)

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
        {#if $optimizeResultList.get(id)}
          <span class="text-xs text-green-500 whitespace-nowrap">
            {$optimizeResultList.get(id).sizeLabel}
            <span class="font-bold">
              ({getPercentageRatio($optimizeResultList.get(id).bytes, 0, originalSize) -
                100}%)
            </span>
          </span>
        {/if}
      </div>
    </label>
    <Button on:click={handleGoToImage} icon color="secondary">
      <i class="iconoir-eye-empty" />
    </Button>

    {#if loading}
      <span class="flex justify-center items-center rounded-md">
        <Loader />
      </span>
    {/if}

    {#if !$optimizeResultList.get(id) && !loading}
      <Button icon on:click={() => handleOptimizeImage()}>
        <i class="iconoir-magic-wand" />
      </Button>
    {:else if !loading}
      <Button icon on:click={handleDonwloadImage}>
        <i class="iconoir-download" />
      </Button>
    {/if}
    <Button icon on:click={toggleDetails} color="tertiary">
      <i class="iconoir-nav-arrow-down" class:rotate-180={showDetails} />
    </Button>
  </div>

  {#if showDetails}
    <ItemDetails
      {height}
      {width}
      {originalHeight}
      {originalWidth}
      url={src}
      optimizeOptions={$optimizeOptionsList.get(id)}
      on:optimize={handleChangeOptimizeOptions}
      on:reset={() => resetImage(id)}
    />
  {/if}
</li>
