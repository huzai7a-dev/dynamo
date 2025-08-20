<template>
    <button
      :class="[
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        sizeClass,
        variantClass,
        {
          'w-full': fullWidth,
          'rounded-full': rounded,
          'opacity-50 cursor-not-allowed': disabled || loading,
          'pointer-events-none': loading,
        }
      ]"
      :disabled="disabled || loading"
      @click="onClick"
    >
      <span v-if="loading" class="loader mr-2" />
      <div class="flex items-center gap-2">
        <Icon v-if="props.icon" :name="props.icon"  />
        <slot />
      </div>
    </button>
  </template>
  
  <script lang="ts" setup>
  import { computed, defineEmits } from 'vue'
  
  type Variant =
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'accent'
    | 'muted'
    | 'outline'
    | 'danger'
  
  type Size = 'sm' | 'md' | 'lg'
  
  const props = defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
    rounded?: boolean
    icon?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()
  
  const sizeClass = computed(() => {
    const map: Record<Size, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    }
    return map[props.size || 'md']
  })
  
  const variantClass = computed(() => {
    const base = 'text-white'
    const map: Record<Variant, string> = {
      primary: `${base} bg-primary hover:bg-teal-700`,
      secondary: `${base} bg-secondary hover:bg-gray-800`,
      destructive: `${base} bg-destructive hover:bg-red-600`,
      accent: `${base} bg-accent hover:bg-teal-500`,
      muted: `${base} bg-muted hover:bg-gray-300 text-charcoal`,
      outline: 'border border-input text-foreground bg-transparent hover:bg-muted/30',
      danger: `${base} bg-red-500 hover:bg-red-600`
    }
    return map[props.variant || 'primary']
  })
  
  function onClick(event: MouseEvent) {
    if (!props.disabled && !props.loading) {
      emit('click', event)
    }
  }
  </script>
  
  <style scoped>
  .loader {
    @apply animate-spin rounded-full border-2 border-t-transparent border-white w-4 h-4;
  }
  </style>
  