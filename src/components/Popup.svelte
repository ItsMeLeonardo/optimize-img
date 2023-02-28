<script lang="ts">
  import { fade } from 'svelte/transition'

  import type { CustomImage } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'

  type Filters = 'all' | 'low' | 'medium' | 'high'

  let images: CustomImage[]
  let filter: Filters = 'all'

  function getAllImages() {
    const docImages = document.querySelectorAll('img')
    const imageList = Array.from(docImages).slice(0, 10)

    imageList.forEach((img, index) => {
      img.setAttribute('data-extension-id', img.src)
    })

    const imagesMaped: CustomImage[] = imageList.map(img => {
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

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const images = request.images
    setImage(images)
  })

  function setImage(value: CustomImage[]) {
    images = value
  }

  async function handleClick() {
    await loadContentScript()
    // images++
    // getImage()
  }
</script>

<main class="p-1 w-80 bg-neutral-50">
  <div class="p-5 pb-2 flex flex-col gap-2 justify-center items-center">
    <h1
      class="mx-auto text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      Optimize.img
    </h1>
    {#if !images || images.length === 0}
      <div class="flex flex-col gap-4 justify-center items-center" out:fade>
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

  {#if images}
    {#if images.length}
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
    {/if}

    <ul class="flex flex-col gap-2">
      {#each images as image}
        <Item {image} />
      {:else}
        <li
          class="w-full text-center px-8 py-4 flex flex-col gap-2 items-center justify-center"
        >
          <i class="iconoir-emoji-puzzled text-2xl" />
          <span>
            Sorry, we couldn't find any images in this page.
            <span class="text-purple-600">Try again in another page.</span>
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</main>
