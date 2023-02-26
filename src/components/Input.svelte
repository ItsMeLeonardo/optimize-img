<script lang="ts">
  type HTMLInputTypeAttribute =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
  export const type: HTMLInputTypeAttribute = 'text'
  export let value: string = ''

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    value = target.value
  }
</script>

<label class="bg-neutral-50 p-1 gap-1 rounded-lg flex items-center">
  <input
    {value}
    {type}
    on:input={handleInput}
    class="text-xs p-2 rounded-lg bg-white w-full"
  />

  <span class="flex items-center justify-center w-[18px] aspect-square">
    <slot name="icon"><!-- optional fallback --></slot>
  </span>
</label>
