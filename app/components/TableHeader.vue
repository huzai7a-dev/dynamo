<template>
  <div class="p-6 border-b border-gray-100">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
      <!-- Search Fields -->
      <div class="flex flex-col sm:flex-row gap-4 flex-1">
        <!-- Order Number Search -->
        <div class="flex-1 min-w-0">
          <UiInput :model-value="searchOrderNumber" @update:modelValue="$emit('update:searchOrderNumber', $event)"
            :label="`${title} ${firstPlaceholder ? getLastWord(firstPlaceholder) : ''}`"
            :placeholder="firstPlaceholder || `Search by ${title} number...`" size="md" />
        </div>
        <!-- Order Name Search -->
        <div class="flex-1 min-w-0">
          <UiInput :model-value="searchOrderName" @update:modelValue="$emit('update:searchOrderName', $event)"
            :label="`${title} ${secondPlaceholder ? getLastWord(secondPlaceholder) : ''}`"
            :placeholder="secondPlaceholder || `Search by ${title} name...`" size="md" />
        </div>
        <!-- Customer Name Search (Admin Only) -->
        <div v-if="isAdmin" class="flex-1 min-w-0">
          <UiInput :model-value="searchCustomerName" @update:modelValue="$emit('update:searchCustomerName', $event)"
            label="Customer Name" placeholder="Search by customer name..." size="md" />
        </div>
        <!-- Date Range Select -->
        <div class="flex-1 min-w-0">
          <UiDateRangeSelect :model-value="selectedDateRange"
            @update:modelValue="$emit('update:selectedDateRange', $event)" label="Date Range"
            placeholder="Select date range..." size="md" />
        </div>
        <slot name="extra" />
      </div>
      <!-- Actions Slot or Default Create Button -->
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