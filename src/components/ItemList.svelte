<script lang="ts">
  import type { CustomImage } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'

  import storageService from '../service/storage'

  import {
    imageToShow,
    setInitialImages,
    setFilter,
    filter,
    optimizeResultsList,
  } from '../store'
  import { downloadManyImagesFromUrl } from '../utils/download'

  export let images: CustomImage[] = []

  const { optimizeAllImages, optimizeResultList } = optimizeResultsList

  const handleDownloadAll = () => {
    const urls = $optimizeResultList.values()

    downloadManyImagesFromUrl(Array.from(urls).map(({ url }) => url))
  }

  const handleOptimizeAll = () => {
    const urlList = $imageToShow.map(image => ({
      url: image.src,
      id: image.id,
    }))

    optimizeAllImages(urlList)
  }

  const persitImages = async () => {
    const tabs = await chrome.tabs
      .query({ active: true, currentWindow: true })
      .catch(err => console.log({ err }))

    if (!tabs) return

    const currentTabUrl = tabs[0].url

    storageService.saveImages(currentTabUrl, images)
  }

  $: {
    if (images) {
      setInitialImages(images)
      persitImages()
    }
  }
</script>

<div class="w-full flex my-2">
  <button
    class="flex-grow flex items-center justify-center gap-2 font-bold  rounded py-1 px-4 hover:text-indigo-500"
    class:bg-white={$filter === 'all'}
    class:text-indigo-500={$filter === 'all'}
    on:click={() => setFilter('all')}
  >
    All
  </button>

  <button
    class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-red-500"
    class:bg-white={$filter === 'low'}
    class:text-red-500={$filter === 'low'}
    on:click={() => setFilter('low')}
  >
    <span>Low</span>
    <i class="iconoir-emoji-talking-angry text-xl" />
  </button>

  <button
    class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-yellow-500"
    class:bg-white={$filter === 'medium'}
    class:text-yellow-500={$filter === 'medium'}
    on:click={() => setFilter('medium')}
  >
    <span>medium</span>
    <i class="iconoir-emoji-surprise-alt text-xl" />
  </button>

  <button
    class="flex items-center justify-center gap-2 flex-grow rounded py-1 px-4 hover:text-green-500"
    class:bg-white={$filter === 'high'}
    class:text-green-500={$filter === 'high'}
    on:click={() => setFilter('high')}
  >
    <span>high</span>
    <i class="iconoir-emoji text-xl" />
  </button>
</div>
<div class="flex items-center gap-2 my-2">
  <Button color="secondary" fullWidth on:click={handleOptimizeAll}>
    <span class="text-xs">
      Optimize {$imageToShow.length}
    </span>
  </Button>

  <Button color="tertiary" fullWidth on:click={handleDownloadAll}>
    <span class="text-xs">
      Download {$optimizeResultList.size}
    </span>
  </Button>
</div>
{#key $imageToShow}
  <ul class="flex flex-col gap-2">
    {#each $imageToShow as image}
      <Item {image} />
    {:else}
      <li class="w-full rounded-lg bg-white text-center p-5 ">
        <span
          class="font-bold  text-xl text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500"
        >
          No Images
        </span>
      </li>
    {/each}
  </ul>
{/key}
