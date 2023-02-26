<script lang="ts">
  import { fade } from 'svelte/transition'
  import type { CustomImage } from 'src/types'
  import Button from './Button.svelte'
  import Item from './Item.svelte'

  let images: CustomImage[]

  function getAllImages() {
    const docImages = document.querySelectorAll('img')
    const imageList = Array.from(docImages).slice(0, 10)

    imageList.forEach((img, index) => {
      img.style.border = '5px dashed purple'
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

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getAllImages,
    })
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const images = request.images
    setImage(images)
  })

  function getImage() {
    return images
  }

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
  <div class="p-5 flex flex-col gap-2 justify-center items-center">
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
    <ul class="flex flex-col gap-2">
      {#each images as image}
        <Item {image} />
      {:else}
        <li class="w-full text-center p-2">no images</li>
      {/each}
    </ul>
  {/if}
</main>
