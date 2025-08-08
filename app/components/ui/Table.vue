<template>
  <div class="w-full">
    <!-- Table Container -->
    <div
      :class="[
        'relative overflow-hidden rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:rounded-2xl',
        {
          'overflow-x-auto': scrollable,
          'max-h-96 overflow-y-auto': maxHeight,
        },
      ]"
    >
      <table class="w-full relative z-10 table-auto">
        <!-- Table Header -->
        <thead :class="getHeaderClass">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 text-left font-semibold transition-all duration-300 relative',
                'first:rounded-tl-2xl last:rounded-tr-2xl',
                {
                  'cursor-pointer hover:bg-white/20 hover:scale-105 transform':
                    sortable && column.sortable !== false,
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                  'w-20': column.key === 'actions',
                },
              ]"
              @click="handleSort(column)"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm uppercase tracking-wider">{{ column.label }}</span>
                <Icon
                  v-if="sortable && column.sortable !== false"
                  :name="getSortIcon(column.key)"
                  :class="[
                    'w-4 h-4 transition-all duration-300',
                    sortConfig?.key === column.key ? 'text-white scale-110' : 'text-white/70',
                  ]"
                />
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr
            v-for="(row, index) in displayData"
            :key="getRowKey(row, index)"
            :class="[
              'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent',
              'relative group cursor-pointer',
              {
                'bg-gradient-to-r from-gray-50/50 to-transparent': striped && index % 2 === 1,
                'border-b border-gray-100/50': !striped,
              },
            ]"
            @click="handleRowClick(row, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 relative z-10',
                column.key === 'actions' ? 'w-20' : '',
                {
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                  'font-semibold text-gray-900': column.bold,
                  'text-sm text-gray-600': column.size === 'sm',
                  'text-lg text-gray-800': column.size === 'lg',
                },
              ]"
            >
              <!-- Custom Cell Slot -->
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="row[column.key]"
              >
                <!-- Default Rendering -->
                <span v-if="column.format === 'currency'" class="font-mono">
                  {{ formatCurrency(row[column.key]) }}
                </span>
                <span v-else-if="column.format === 'date'" class="text-gray-600">
                  {{ formatDate(row[column.key]) }}
                </span>
                <span v-else-if="column.format === 'status'">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm',
                      'border border-current/20 backdrop-blur-sm',
                      getStatusClass(row[column.key]),
                    ]"
                  >
                    <span
                      :class="[
                        'w-2 h-2 rounded-full mr-2 animate-pulse',
                        getStatusDotClass(row[column.key]),
                      ]"
                    />
                    {{ row[column.key] }}
                  </span>
                </span>
                <span v-else>
                  {{ row[column.key] }}
                </span>
              </slot>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="displayData.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              {{ emptyMessage || 'No data available.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && totalPages > 1"
      class="mt-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-gray-100"
    >
      <div class="text-sm text-gray-600">
        Showing <span class="font-semibold text-gray-900">{{ startIndex + 1 }}</span>
        to <span class="font-semibold text-gray-900">{{ endIndex }}</span> of
        <span class="font-semibold text-gray-900">{{ totalItems }}</span> results
      </div>

      <div class="flex items-center gap-2">
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="px-4 py-2 text-sm rounded-lg transition disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 rounded-lg text-sm transition',
            page === currentPage
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>

        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-4 py-2 text-sm rounded-lg transition disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  format?: 'text' | 'currency' | 'date' | 'status'
  size?: 'sm' | 'md' | 'lg'
  bold?: boolean
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

const props = defineProps<{
  columns: TableColumn[]
  data: any[]
  sortable?: boolean
  striped?: boolean
  scrollable?: boolean
  maxHeight?: boolean
  headerVariant?: 'default' | 'primary' | 'secondary' | 'muted'
  pagination?: boolean
  itemsPerPage?: number
  emptyMessage?: string
  rowKey?: string
}>()

const emit = defineEmits<{
  (e: 'sort', config: SortConfig): void
  (e: 'row-click', row: any, index: number): void
}>()

const currentPage = ref(1)
const sortConfig = ref<SortConfig | null>(null)

const totalItems = computed(() => props.data.length)
const totalPages = computed(() =>
  Math.ceil(totalItems.value / (props.itemsPerPage || 10))
)
const startIndex = computed(() => (currentPage.value - 1) * (props.itemsPerPage || 10))
const endIndex = computed(() => Math.min(startIndex.value + (props.itemsPerPage || 10), totalItems.value))

const sortedData = computed(() => {
  if (!sortConfig.value) return props.data
  return [...props.data].sort((a, b) => {
    const aVal = a[sortConfig.value.key]
    const bVal = b[sortConfig.value.key]
    if (aVal < bVal) return sortConfig.value.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.value.direction === 'asc' ? 1 : -1
    return 0
  })
})

const displayData = computed(() => {
  if (!props.pagination) return sortedData.value
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function handleSort(column: TableColumn) {
  if (!props.sortable || column.sortable === false) return
  if (sortConfig.value?.key === column.key) {
    sortConfig.value.direction =
      sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value = { key: column.key, direction: 'asc' }
  }
  emit('sort', sortConfig.value)
}

function handleRowClick(row: any, index: number) {
  emit('row-click', row, index)
}

function getSortIcon(key: string): string {
  if (sortConfig.value?.key !== key) return 'ChevronsUpDown'
  return sortConfig.value.direction === 'asc' ? 'chevron-up' : 'chevron-down'
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString()
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return map[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function getStatusDotClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-500',
    pending: 'bg-yellow-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
    inactive: 'bg-gray-500',
  }
  return map[status.toLowerCase()] || 'bg-gray-500'
}

const getHeaderClass = computed(() => {
  switch (props.headerVariant) {
    case 'primary':
      return 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
    case 'secondary':
      return 'bg-gradient-to-r from-secondary to-gray-800 text-white shadow-lg'
    case 'muted':
      return 'bg-gradient-to-r from-muted/20 to-muted/30 backdrop-blur-sm'
    default:
      return 'bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200'
  }
})

function getRowKey(row: any, index: number): string | number {
  return props.rowKey ? row[props.rowKey] : index
}
</script>
