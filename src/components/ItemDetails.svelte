<script lang="ts">
  import { slide } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import ButtonCheck from './ButtonCheck.svelte'
  import Input from './Input.svelte'
  import Button from './Button.svelte'
  import { optimizeImage } from '../service'
  import type { ImageFormat } from 'src/types'

  type ResizeType = 'PERCETAGE' | 'PIXELS' | 'RENDERED'

  export let url: string
  export let height: number
  export let width: number

  export let originalHeight: number
  export let originalWidth: number

  let quality = 70
  let imageFormat: ImageFormat = 'webp'

  let newHeight = originalHeight
  let newWidth = originalWidth

  let percentageResize: number | undefined
  let resizeType: ResizeType | undefined

  const formats: ImageFormat[] = ['webp', 'jpg', 'png']
  const percentageOptions = [25, 50, 75]

  function handleClickPercetageOption(value: number) {
    percentageResize = value
    resizeType = 'PERCETAGE'
  }

  function handleClickRenderedOption() {
    resizeType = 'RENDERED'
    percentageResize = undefined
  }

  function handleInputPixelResize() {
    resizeType = 'PIXELS'
  }

  function handleClickDownload() {
    const resultUrl = optimizeImage({
      url,
      format: imageFormat,
      height: newHeight,
      width: newWidth,
      quality,
    })

    chrome.tabs.create({
      url: resultUrl,
    })
  }

  $: {
    if (resizeType === 'PERCETAGE') {
      newHeight = (originalHeight * percentageResize!) / 100
      newWidth = (originalWidth * percentageResize!) / 100
    }

    if (resizeType === 'RENDERED') {
      newHeight = height
      newWidth = width
    }
  }
</script>

<div
  class="w-full flex p-2 gap-2 items-center flex-wrap relative"
  transition:slide={{ duration: 300, easing: quintOut }}
>
  <section>
    <header class="mb-2">
      <h3 class="text-sm font-bold">Image detials: zzz</h3>
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
      <ButtonCheck
        color="tertiary"
        checked={resizeType === 'RENDERED'}
        on:click={handleClickRenderedOption}
      >
        <span class="flex items-center gap-1 font-bold text-xs">
          <i class="iconoir-scale-frame-reduce text-2xl" />
          <span> To render size </span>
        </span>
      </ButtonCheck>
      {#each percentageOptions as option}
        <ButtonCheck
          color="tertiary"
          checked={percentageResize === option && resizeType === 'PERCETAGE'}
          on:click={() => handleClickPercetageOption(option)}
        >
          <span class="font-bold text-xs">{option}%</span>
        </ButtonCheck>
      {/each}
      <div class="w-20">
        <Input bind:value={percentageResize} type="number" min={1} max={99}>
          <i slot="icon" class="iconoir-percentage text-lg" />
        </Input>
      </div>
      <div class="w-20">
        <Input bind:value={newHeight} type="number" on:input={handleInputPixelResize}>
          <span slot="icon" class="text-xs font-bold"> H </span>
        </Input>
      </div>
      <div class="w-20">
        <Input bind:value={newWidth} type="number" on:input={handleInputPixelResize}>
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
      {#each formats as format}
        <ButtonCheck
          color="secondary"
          checked={format === imageFormat}
          on:click={() => {
            imageFormat = format
          }}
        >
          <span class="font-bold text-xs">{format}</span>
        </ButtonCheck>
      {/each}
    </div>
  </section>

  <section>
    <header class="my-2">
      <h3 class="text-sm font-bold">Quality</h3>
    </header>
    <div class="flex gap-2 flex-wrap">
      <div class="w-20">
        <Input bind:value={quality}>
          <i slot="icon" class="iconoir-percentage text-lg" />
        </Input>
      </div>
    </div>
  </section>

  <Button fullWidth on:click={handleClickDownload}>Download</Button>
</div>
