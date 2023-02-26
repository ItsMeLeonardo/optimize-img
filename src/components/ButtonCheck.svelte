<script lang="ts">
  import type { Colors } from 'src/types'

  export let color: Colors = 'primary'
  export let active = false

  const activeColors: Record<Colors, string> = {
    neutral: 'bg-neutral-400/5 text-neutral-400',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
  }

  const activeColor = active ? activeColors[color] : 'bg-neutral-400/5 text-neutral-400 '
</script>

<button
  class="flex gap-2 items-center p-2 rounded-lg justify-center flex-grow {activeColor}"
  on:click
>
  <slot><!-- optional fallback --></slot>
</button>
