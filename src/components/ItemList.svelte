<script lang="ts">
  import type { CustomImage, Filters } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'

  import { optimizedUrls, addOptimizedUrl } from '../store'
  import { downloadManyImagesFromUrl } from '../utils/download'

  export let images: CustomImage[] = []

  let filter: Filters = 'all'

  function handleOptimizeImage(event: CustomEvent<{ url: string }>) {
    const { url } = event.detail

    addOptimizedUrl(url)
  }

  const handleDownloadAll = () => {
    optimizedUrls.subscribe(urls => {
      downloadManyImagesFromUrl(Array.from(urls))
    })
  }

  $: filteredImages = images.filter(image => {
    if (filter === 'all') return true
    if (filter === 'low') return image.performance === 'low'
    if (filter === 'medium') return image.performance === 'medium'
    if (filter === 'high') return image.performance === 'high'
  })
</script>

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
<div class="flex items-center gap-2">
  <Button color="secondary">
    <span class="text-xs">
      Optimize {filteredImages.length}
    </span>
  </Button>

  <Button color="tertiary" on:click={handleDownloadAll}>
    <span class="text-xs">
      Download {$optimizedUrls.size}
    </span>
  </Button>
</div>
<ul class="flex flex-col gap-2">
  {#each filteredImages as image}
    <Item {image} on:optimize={handleOptimizeImage} />
  {:else}
    <li class="w-full rounded-lg bg-white p-5 text-center">No Images</li>
  {/each}
</ul>
