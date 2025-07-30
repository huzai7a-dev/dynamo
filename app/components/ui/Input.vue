<template>
  <div class="w-full">
    <!-- Label -->
    <label
  v-if="label"
  :for="inputId"
  class="block mb-1 text-sm font-medium text-foreground"
>
  {{ label }}
  <span v-if="required" class="text-red-500 text-lg ml-0.5">*</span>
</label>

    <!-- Wrapper -->
    <div
      :class="[
        'relative flex items-center transition-all duration-200 rounded-xl shadow-md',
        'focus-within:ring-1 focus-within:ring-ring focus-within:border border-primary bg-muted/20 hover:bg-muted/30',
        variantClass,
        sizeClass,
        {
          'cursor-not-allowed opacity-60': disabled,
          'bg-muted/30': readonly
        }
      ]"
    >
      <!-- Icon Slot -->
      <span v-if="$slots.icon" class="pl-3 text-muted-foreground">
        <slot name="icon" />
      </span>

      <!-- Input Field -->
      <input
        :id="inputId"
        ref="input"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :class="[
          'w-full bg-transparent outline-none text-foreground',
          icon ? 'pl-2 pr-4' : 'px-4',
          sizeInputClass
        ]"
        @input="onInput"
      />

      <!-- Spinner -->
      <span v-if="loading" class="absolute right-3">
        <span class="loader w-4 h-4" />
      </span>
    </div>

    <!-- Helper Text -->
    <p v-if="helperText" class="mt-1 text-xs text-muted-foreground">
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

type Variant = 'default' | 'error' | 'success' | 'disabled'
type Size = 'sm' | 'md' | 'lg'

const props = defineProps<{
  required?: boolean
  modelValue: string | undefined
  label?: string
  placeholder?: string
  type?: string
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
  helperText?: string
  error?: string
  icon?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})

const inputId = `input-${Math.random().toString(36).substring(2, 10)}`

const sizeClass = computed(() => {
  return {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-13 text-lg'
  }[props.size || 'md']
})

const sizeInputClass = computed(() => {
  return {
    sm: 'text-sm py-1.5',
    md: 'text-base py-2',
    lg: 'text-lg py-2.5'
  }[props.size || 'md']
})

const variantClass = computed(() => {
  return {
    default: 'border-input bg-background',
    error: 'border-red-500 focus-within:ring-red-500',
    success: 'border-green-500 focus-within:ring-green-500',
    disabled: 'border-muted'
  }[props.variant || 'default']
})

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.loader {
  @apply animate-spin rounded-full border-2 border-t-transparent border-ring;
}
</style>
