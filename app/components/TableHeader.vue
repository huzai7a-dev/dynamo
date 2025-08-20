<template>
  <div class="p-6 border-b border-gray-100">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
      <!-- Search Fields -->
      <div class="flex flex-col sm:flex-row gap-4 flex-1">
        <!-- Order Number Search -->
        <div class="flex-1 min-w-0">
          <UiInput
            :model-value="searchOrderNumber"
            @update:modelValue="$emit('update:searchOrderNumber', $event)"
            label="Order Number"
            placeholder="Search by order number..."
            size="md"
          />
        </div>
        <!-- Order Name Search -->
        <div class="flex-1 min-w-0">
          <UiInput
            :model-value="searchOrderName"
            @update:modelValue="$emit('update:searchOrderName', $event)"
            label="Order Name"
            placeholder="Search by order name..."
            size="md"
          />
        </div>
        <!-- Customer Name Search (Admin Only) -->
        <div v-if="isAdmin" class="flex-1 min-w-0">
          <UiInput
            :model-value="searchCustomerName"
            @update:modelValue="$emit('update:searchCustomerName', $event)"
            label="Customer Name"
            placeholder="Search by customer name..."
            size="md"
          />
        </div>
        <!-- Date Range Select -->
        <div class="flex-1 min-w-0">
          <UiDateRangeSelect
            :model-value="selectedDateRange"
            @update:modelValue="$emit('update:selectedDateRange', $event)"
            label="Date Range"
            placeholder="Select date range..."
            size="md"
          />
        </div>
      </div>
      <!-- Create Order Button -->
      <div class="flex-shrink-0">
        <UiButton
          variant="primary"
          size="md"
          icon="Plus"
          rounded
          @click="$emit('create-order')"
        >
          Create Order
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
</script>