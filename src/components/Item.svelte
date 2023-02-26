<script lang="ts">
  import { slide } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import type { CustomImage } from 'src/types'

  import { getPercentageRatio } from '../utils'
  import { getOptimizedRemoteUrl } from '../service'
  import Button from './Button.svelte'
  import Loader from './Loader.svelte'
  import { getRemoteImageSize } from '../utils/image'
  import Input from './Input.svelte'
  import ButtonCheck from './ButtonCheck.svelte'

  export let image: CustomImage

  let checked: boolean = false
  let showDetails: boolean = false

  const { alt, height, originalHeight, originalWidth, src, width, coordinates } = image

  function goToImage(x: number, y: number, src: string) {
    window.scrollTo(x, y)

    const img = document.querySelector(
      `img[data-extension-id="${src}"]`,
    ) as HTMLImageElement

    img.style.border = '15px dashed purple'
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
    const tabs = await chrome.tabs.create({
      url: getOptimizedRemoteUrl(src),
    })
  }

  let optimizeImagePromise: ReturnType<typeof getRemoteImageSize> | null = null

  async function handleOptimizeImage() {
    const optimizedUrl = getOptimizedRemoteUrl(src)

    optimizeImagePromise = getRemoteImageSize(optimizedUrl)
  }

  function toggleDetails() {
    showDetails = !showDetails
  }

  const promise = getRemoteImageSize(src)
</script>

<li class="w-full rounded-lg" class:bg-white={showDetails}>
  <div class="flex w-full h-[60px] p-2 gap-2 items-center rounded-xl">
    {#await promise}
      <div class="flex-grow flex justify-center items-center gap-2  ">
        <div class="w-4 aspect-square border-2 border-slate-500" />

        <div
          class="aspect-square w-6 flex items-center justify-center bg-slate-200 rounded-sm"
        />

        <span class="flex-grow bg-slate-200 rounded-md h-3" />
      </div>
    {:then { sizeLabel: originalLabel, performance, bytes: originalBytes }}
      <label
        class="flex-grow h-full w-full flex justify-center items-center gap-2 cursor-pointer"
      >
        <div
          class="w-4 aspect-square border-2 border-slate-500 rounded flex justify-center items-center focus-within:ring"
          class:bg-slate-500={checked}
        >
          <input type="checkbox" bind:checked class="absolute w-0 h-0 -z-10 opacity-0" />
          {#if checked}
            <i class="iconoir-check text-white text-xs" />
          {/if}
        </div>

        <picture class="aspect-square h-full flex items-center justify-center">
          <img {src} {alt} class="object-cover w-full h-full rounded-lg" />
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
                  ({getPercentageRatio(newBytes, 0, originalBytes) - 100}%)
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
    {:catch error}
      <span>{error.message}</span>
    {/await}
  </div>

  {#if showDetails}
    <div
      class="w-full flex p-2 gap-2 items-center flex-wrap relative"
      transition:slide={{ duration: 300, easing: quintOut }}
    >
      <section>
        <header class="mb-2">
          <h3 class="text-sm font-bold">Image detials:</h3>
        </header>
        <div class="grid grid-cols-2 gap-x-6">
          <div class="flex gap-1">
            <span>Original Height:</span>
            <span class="font-bold ">{originalHeight}px</span>
          </div>

          <div class="flex gap-1">
            <span>Rendered Width:</span>
            <span class="font-bold ">{width}px</span>
          </div>

          <div class="flex gap-1">
            <span>Original Width:</span>
            <span class="font-bold ">{originalWidth}px</span>
          </div>

          <div class="flex gap-1">
            <span>Rendered Height:</span>
            <span class="font-bold ">{height}px</span>
          </div>
        </div>
      </section>

      <div class="w-full mt-4 text-neutral-400 text-sm font-bold text-center">
        Optimize options
      </div>

      <section>
        <header class="my-2">
          <h3 class="text-sm font-bold">Resize</h3>
        </header>
        <div class="flex gap-2 flex-wrap">
          <ButtonCheck active color="tertiary">
            <span class="flex items-center gap-1 font-bold text-xs">
              <i class="iconoir-scale-frame-reduce text-2xl" />
              <span> To render size </span>
            </span>
          </ButtonCheck>
          <ButtonCheck color="tertiary">
            <span class="font-bold text-xs">50%</span>
          </ButtonCheck>
          <ButtonCheck color="tertiary" active>
            <span class="font-bold text-xs">25%</span>
          </ButtonCheck>
          <ButtonCheck>
            <span class="font-bold text-xs">75%</span>
          </ButtonCheck>
          <div class="w-20">
            <Input>
              <i slot="icon" class="iconoir-percentage text-lg" />
            </Input>
          </div>
          <div class="w-20">
            <Input>
              <span slot="icon" class="text-xs font-bold"> H </span>
            </Input>
          </div>
          <div class="w-20">
            <Input>
              <span slot="icon" class="text-xs font-bold"> W </span>
            </Input>
          </div>
        </div>
      </section>

      <section>
        <header class="my-2">
          <h3 class="text-sm font-bold">Image Format</h3>
        </header>
        <div class="flex gap-2 flex-wrap">
          <ButtonCheck color="secondary">
            <span class="font-bold text-xs">WebP</span>
          </ButtonCheck>
          <ButtonCheck color="secondary">
            <span class="font-bold text-xs">JPG</span>
          </ButtonCheck>
          <ButtonCheck color="secondary" active>
            <span class="font-bold text-xs">PNG</span>
          </ButtonCheck>
        </div>
      </section>

      <Button fullWidth>Download</Button>
    </div>
  {/if}
</li>
