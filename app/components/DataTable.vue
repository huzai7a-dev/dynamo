<template>
  <div class="space-y-6">
    <!-- Main Title -->
    <h3 class="text-2xl font-bold text-gray-900">Orders</h3>

    <!-- Single Component Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Header with Search and Create Button -->
      <TableHeader
        :search-order-number="searchOrderNumber"
        @update:searchOrderNumber="(val: string) => searchOrderNumber = val"
        :search-customer-name="searchCustomerName"
        @update:searchCustomerName="(val: string) => searchCustomerName = val"
        :selected-date-range="selectedDateRange"
        @update:selectedDateRange="(val: string) => selectedDateRange = val"
        :date-range-options="dateRangeOptions"
        @create-order="emit('create-order')"
      />

      <!-- Table Section -->
      <div class="p-6">
        <UiTable 
          :columns="advancedColumns" 
          :data="advancedData"
          :pagination="true"
          :items-per-page="5"
          striped
          sortable
          header-variant="primary"
          empty-message="No orders found"
        >
          <template #cell-status="{ value }">
            <span 
              :class="[
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm',
                'border border-current/20 backdrop-blur-sm',
                getStatusBadgeClass(value)
              ]"
            >
              <span 
                :class="[
                  'w-2 h-2 rounded-full mr-2 animate-pulse',
                  getStatusDotClass(value)
                ]"
              />
              {{ value }}
            </span>
          </template>

          <!-- Custom Actions Cell -->
          <template #cell-actions="{ row }">
            <div class="flex items-center gap-2">
              <!-- <button 
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                @click="viewOrder(row)"
              >
                <Icon name="Eye" class="w-4 h-4" />
              </button> -->
              <button 
                class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-110"
                @click="editOrder(row)"
              >
                <Icon name="Pencil" class="w-4 h-4" />
              </button>
              <button 
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                @click="deleteOrder(row)"
              >
                <Icon name="Trash" class="w-4 h-4" />
              </button>
            </div>
          </template>
        </UiTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumn } from '~/components/ui/Table.vue'
import TableHeader from './TableHeader.vue'

const emit = defineEmits(['create-order'])

// Search and filter reactive variables
const searchOrderNumber = ref('')
const searchCustomerName = ref('')
const selectedDateRange = ref('')

// Date range options for the select dropdown
const dateRangeOptions = ref([
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'This Year', value: 'thisyear' },
  { label: 'Last Year', value: 'lastyear' }
])

const advancedColumns: TableColumn[] = [
  { key: 'id', label: 'ORDER ID', sortable: true, bold: true },
  { key: 'customer', label: 'CUSTOMER', sortable: true },
  { key: 'product', label: 'PRODUCT' },
  { key: 'amount', label: 'AMOUNT', format: 'currency', align: 'right', sortable: true },
  { key: 'date', label: 'DATE', format: 'date', align: 'center', sortable: true },
  { key: 'status', label: 'STATUS', align: 'center' },
  { key: 'actions', label: 'ACTIONS', align: 'center' }
]

const advancedData = ref([
  { id: '#ORD-001', customer: 'John Doe', product: 'Custom Patch', amount: 150.00, date: '2024-01-15', status: 'completed', actions: '' },
  { id: '#ORD-002', customer: 'Jane Smith', product: 'Logo Design', amount: 299.99, date: '2024-01-16', status: 'pending', actions: '' },
  { id: '#ORD-003', customer: 'Bob Johnson', product: 'Vector Artwork', amount: 89.50, date: '2024-01-17', status: 'active', actions: '' },
  { id: '#ORD-004', customer: 'Alice Brown', product: 'Digitizing Service', amount: 75.00, date: '2024-01-18', status: 'cancelled', actions: '' },
  { id: '#ORD-005', customer: 'Charlie Wilson', product: 'Line Artwork', amount: 120.00, date: '2024-01-19', status: 'completed', actions: '' },
  { id: '#ORD-006', customer: 'Diana Davis', product: 'Custom Patch', amount: 200.00, date: '2024-01-20', status: 'pending', actions: '' },
  { id: '#ORD-007', customer: 'Eve Miller', product: 'Logo Design', amount: 350.00, date: '2024-01-21', status: 'active', actions: '' },
  { id: '#ORD-008', customer: 'Frank Garcia', product: 'Vector Artwork', amount: 95.00, date: '2024-01-22', status: 'completed', actions: '' }
])

function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  }
  
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function getStatusDotClass(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-yellow-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500'
  }
  
  return statusMap[status.toLowerCase()] || 'bg-gray-500'
}

function viewOrder(order: any) {
  console.log('View order:', order)
  // Add your view logic here
}

function editOrder(order: any) {
  console.log('Edit order:', order)
  // Add your edit logic here
}

function deleteOrder(order: any) {
  console.log('Delete order:', order)
  // Add your delete logic here
}

function createOrder() {
  console.log('Create new order')
  // Add your create order logic here
}
</script> 