<template>
    <div class="w-full">
      <!-- Label -->
      <label
        v-if="label"
        :for="selectId"
        class="block mb-2 text-sm font-medium text-gray-900"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 text-lg ml-0.5">*</span>
      </label>

  
      <!-- Select Wrapper -->
      <div
        :class="[
          'relative rounded-xl transition-all duration-200 border',
          'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20',
          'bg-white hover:border-gray-400',
          'flex items-center',
          sizeClass,
          variantClass,
          {
            'cursor-not-allowed opacity-60': disabled,
            'bg-gray-50': readonly
          }
        ]"
      >
        <select
          :id="selectId"
          v-model="model"
          :disabled="disabled"
          :class="[
            'w-full appearance-none bg-transparent outline-none text-gray-900 placeholder:text-gray-400',
            'px-4 pr-10', // right icon spacing
            sizeInputClass
          ]"
          @change="onChange"
        >
          <option v-if="placeholder" disabled value="">
            {{ placeholder }}
          </option>
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
  
        <!-- Chevron Icon -->
        <svg
          class="pointer-events-none absolute right-3 h-4 w-4 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
  
      <!-- Error / Helper -->
      <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
      <p v-else-if="helperText" class="mt-1 text-xs text-muted-foreground">
        {{ helperText }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  type Variant = 'default' | 'error' | 'success' | 'disabled'
  type Size = 'sm' | 'md' | 'lg'
  
  interface Option {
    label: string
    value: string
  }
  
  const props = defineProps<{
    modelValue: string | undefined
    label?: string
    placeholder?: string
    options: Option[]
    variant?: Variant
    size?: Size
    disabled?: boolean
    readonly?: boolean
    helperText?: string
    error?: string
    required?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  
  const model = computed({
    get: () => props.modelValue ?? '',
    set: (val: string) => emit('update:modelValue', val)
  })
  
  const selectId = `select-${Math.random().toString(36).substring(2, 10)}`
  
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
    default: 'border-gray-300',
    error: 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
    success: 'border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20',
    disabled: 'border-gray-200'
  }[props.variant || 'default']
})
  
  function onChange(event: Event) {
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
  }
  </script>
  