<template>
  <div class="px-5 pt-5 pb-4 space-y-3">

    <!-- Header: icon + title + description -->
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <Icon name="Filter" class="text-primary w-5 h-5" />
        <h2 class="text-xl font-extrabold text-primary-dark font-sans leading-tight">Search &amp; Filters</h2>
      </div>
      <p class="text-sm text-muted font-sans pl-7">{{ description }}</p>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
      <!-- Search Fields -->
      <div class="flex flex-col sm:flex-row gap-3 flex-1">

        <!-- First search -->
        <div class="flex-1 min-w-0 flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary/40 transition">
          <Icon name="Search" class="w-4 h-4 text-gray-400 shrink-0" />
          <input
            :value="searchOrderNumber"
            @input="$emit('update:searchOrderNumber', ($event.target as HTMLInputElement).value)"
            :placeholder="firstPlaceholder || `${title} number...`"
            class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none font-sans"
          />
        </div>

        <!-- Second search -->
        <div class="flex-1 min-w-0 flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary/40 transition">
          <Icon name="Search" class="w-4 h-4 text-gray-400 shrink-0" />
          <input
            :value="searchOrderName"
            @input="$emit('update:searchOrderName', ($event.target as HTMLInputElement).value)"
            :placeholder="secondPlaceholder || `${title} name...`"
            class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none font-sans"
          />
        </div>

        <!-- Customer Name (Admin Only) -->
        <div v-if="isAdmin" class="flex-1 min-w-0 flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary/40 transition">
          <Icon name="Search" class="w-4 h-4 text-gray-400 shrink-0" />
          <input
            :value="searchCustomerName"
            @input="$emit('update:searchCustomerName', ($event.target as HTMLInputElement).value)"
            placeholder="Customer name..."
            class="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none font-sans"
          />
        </div>

        <!-- Date Range -->
        <div class="flex-1 min-w-0">
          <UiDateRangeSelect
            :model-value="selectedDateRange"
            @update:modelValue="$emit('update:selectedDateRange', $event)"
            placeholder="Select date"
            size="md"
          />
        </div>

        <slot name="extra" />
      </div>

      <!-- Actions slot or default create button -->
      <div class="flex-shrink-0">
        <slot name="actions" v-if="$slots.actions" />
        <UiButton v-else variant="primary" size="md" icon="Plus" rounded @click="$emit('create-order')">
          {{ createButtonLabel || 'Create Order' }}
        </UiButton>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import UiInput from './ui/Input.vue'
import UiDateRangeSelect from './ui/DateRangeSelect.vue'
import UiButton from './ui/Button.vue'
import type { PropType } from 'vue'

interface DateRange {
  from: Date | null
  to: Date | null
}

defineProps({
  title: {
    type: String,
    default: 'Order'
  },
  description: {
    type: String,
    default: 'Filter by order number, vector number, quote number, or date'
  },
  createButtonLabel: {
    type: String,
    default: 'Create Order'
  },
  searchOrderNumber: {
    type: String,
    default: ''
  },
  searchOrderName: {
    type: String,
    default: ''
  },
  searchCustomerName: {
    type: String,
    default: ''
  },
  selectedDateRange: {
    type: Object as PropType<DateRange>,
    default: () => ({ from: null, to: null })
  },
  firstPlaceholder: {
    type: String,
    default: ''
  },
  secondPlaceholder: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  'update:searchOrderNumber': [value: string]
  'update:searchOrderName': [value: string]
  'update:searchCustomerName': [value: string]
  'update:selectedDateRange': [value: DateRange]
  'create-order': []
}>()

function getLastWord(sentence: string) {
  const trimmedSentence = sentence.trim();

  const wordsArray = trimmedSentence.split(' ');

  return wordsArray.pop();
}
</script>