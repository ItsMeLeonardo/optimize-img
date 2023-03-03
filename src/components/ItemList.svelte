<script lang="ts">
  import type { CustomImage, Filter } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'

  import {
    optimizedUrls,
    addOptimizedUrl,
    imageToShow,
    setInitialImages,
    setFilter,
    filter,
  } from '../store'
  import { downloadManyImagesFromUrl } from '../utils/download'

  export let images: CustomImage[] = []

  function handleOptimizeImage(event: CustomEvent<{ url: string }>) {
    const { url } = event.detail

    addOptimizedUrl(url)
  }

  const handleDownloadAll = () => {
    optimizedUrls.subscribe(urls => {
      downloadManyImagesFromUrl(Array.from(urls))
    })
  }

  const handleOptimizeAll = () => {
    $imageToShow.forEach(image => {
      const { src } = image
      addOptimizedUrl(src)
    })
  }

  $: {
    if (images) {
      setInitialImages(images)
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
      Download {$optimizedUrls.size}
    </span>
  </Button>
</div>
{#key $imageToShow}
  <ul class="flex flex-col gap-2">
    {#each $imageToShow as image}
      <Item {image} on:optimize={handleOptimizeImage} />
    {:else}
      <li class="w-full rounded-lg bg-white p-5 text-center">No Images</li>
    {/each}
  </ul>
{/key}
