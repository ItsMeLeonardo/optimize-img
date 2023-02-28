<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  type HTMLInputTypeAttribute =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
  export let type: HTMLInputTypeAttribute = 'text'
  export let value: string | number = ''
  export let min: number | string = ''
  export let max: number | string = ''

  const dispatch = createEventDispatcher<{ input: { value: string } }>()

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement

    if (type === 'number' && target.value.trim().length && min && max) {
      const numberValue = Number(target.value)

      if (numberValue < min) {
        target.value = String(min)
      }

      if (numberValue > max) {
        target.value = String(max)
      }
    }
    dispatch('input', {
      value: target.value,
    })
    value = target.value
  }
</script>

<label class="bg-neutral-50 p-1 gap-1 rounded-lg flex items-center">
  <input
    {value}
    {type}
    {min}
    {max}
    on:input={handleInput}
    class="text-xs p-2 rounded-lg bg-white w-full appearance-none"
  />

  <span class="flex items-center justify-center w-[18px] aspect-square">
    <slot name="icon"><!-- optional fallback --></slot>
  </span>
</label>
