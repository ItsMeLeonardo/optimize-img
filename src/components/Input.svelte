<script lang="ts">
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

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement

    if (type === 'number' && min && max) {
      const value = Number(target.value)

      if (value < min) {
        target.value = String(min)
        return
      }

      if (value > max) {
        target.value = String(max)
        return
      }

      return
    }

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
