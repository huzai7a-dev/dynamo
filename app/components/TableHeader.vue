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
        <!-- Customer Name Search -->
        <div class="flex-1 min-w-0">
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
          <UiSelect
            :model-value="selectedDateRange"
            @update:modelValue="$emit('update:selectedDateRange', $event)"
            label="Date Range"
            placeholder="Select date range..."
            :options="dateRangeOptions"
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
import UiSelect from './ui/Select.vue'
import UiButton from './ui/Button.vue'
import type { PropType } from 'vue'

const props = defineProps({
  searchOrderNumber: {
    type: String,
    default: ''
  },
  searchCustomerName: {
    type: String,
    default: ''
  },
  selectedDateRange: {
    type: String,
    default: ''
  },
  dateRangeOptions: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => []
  }
})
</script>