<script lang="ts">
  import type { Colors } from 'src/types'

  type ButtonType = {
    icon: string
    default: string
  }

  export let icon: boolean = false
  export let color: Colors = 'primary'
  export let fullWidth: boolean = false

  const colorVariants: Record<Colors, ButtonType> = {
    primary: {
      icon: 'text-primary group-hover:bg-primary/10',
      default: 'text-primary bg-primary/10 group-hover:bg-primary/20',
    },
    secondary: {
      icon: 'text-secondary group-hover:bg-secondary/10',
      default: 'text-secondary bg-secondary/10 group-hover:bg-secondary/20',
    },
    tertiary: {
      icon: 'text-tertiary group-hover:bg-tertiary/10',
      default: 'text-tertiary bg-tertiary/10 group-hover:bg-tertiary/20',
    },
    neutral: {
      icon: 'text-neutral-500 group-hover:bg-neutral-100/10',
      default: 'text-neutral-500 bg-neutral-100/10 group-hover:bg-neutral-100/20',
    },
  }

  const colorVariant = colorVariants[color]
</script>

<button class="group relative" class:w-full={fullWidth} on:click>
  {#if icon}
    <span
      class="flex bg-neutral-100/50 justify-center text-lg items-center p-2 rounded-lg {colorVariant.icon}"
    >
      <slot><!-- optional fallback --></slot>
    </span>
  {:else}
    <span
      class="relative flex items-center justify-center gap-1 text-sm font-medium px-6 py-2 rounded-lg {colorVariant.default}"
    >
      <slot><!-- optional fallback --></slot>
    </span>
  {/if}
</button>
