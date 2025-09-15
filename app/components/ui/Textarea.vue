<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="textareaId"
      class="block mb-2 text-sm font-medium text-gray-900"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 text-lg ml-0.5">*</span>
    </label>

    <!-- Wrapper -->
    <div
      :class="[
        'relative transition-all duration-200 rounded-xl border',
        'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
        'bg-white hover:border-gray-400',
        variantClass,
        sizeClass,
        {
          'cursor-not-allowed opacity-60': disabled,
          'bg-gray-50': readonly
        }
      ]"
    >
      <!-- Icon Slot -->
      <span v-if="iconLeft" class="absolute left-3 top-3 text-gray-600">
        <Icon :name="iconLeft" class="w-4 h-4" />
      </span>

      <!-- Textarea Field -->
      <textarea
        :id="textareaId"
        ref="textarea"
        v-model="model"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :rows="rows"
        :class="[
          'w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 resize-none',
          iconLeft ? 'pl-10 pr-4' : 'px-4',
          sizeInputClass
        ]"
        @input="onInput"
      />

      <!-- Icon Slot -->
      <span v-if="iconRight" class="absolute right-3 top-3 text-gray-600">
        <Icon :name="iconRight" class="w-4 h-4" />
      </span>

      <!-- Spinner -->
      <span v-if="loading" class="absolute right-3 top-3">
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
import Icon, { type IconName } from '../Icon.vue';

type Variant = 'default' | 'error' | 'success' | 'disabled'
type Size = 'sm' | 'md' | 'lg'

const props = defineProps<{
  required?: boolean
  modelValue: string | undefined
  label?: string
  placeholder?: string
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
  helperText?: string
  error?: string
  iconLeft?: IconName
  iconRight?: IconName
  rows?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val)
})

const textareaId = `textarea-${Math.random().toString(36).substring(2, 10)}`

const sizeClass = computed(() => {
  return {
    sm: 'min-h-[2.25rem] text-sm',
    md: 'min-h-[2.75rem] text-base',
    lg: 'min-h-[3.25rem] text-lg'
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
    default: 'border-gray-300',
    error: 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
    success: 'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20',
    disabled: 'border-gray-200'
  }[props.variant || 'default']
})

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<style scoped>
.loader {
  @apply animate-spin rounded-full border-2 border-t-transparent border-ring;
}
</style>

