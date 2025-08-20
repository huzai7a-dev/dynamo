<template>
  <div class="overflow-x-auto relative">
    <!-- Table wrapper with loading, error, and empty states -->
    <div v-if="loading" class="absolute top-0 left-0 w-full h-full flex justify-center items-center py-10">
      <svg class="w-12 h-12 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
      </svg>
    </div>

    <div v-if="error" class="py-10 text-center text-destructive">
      <p class="text-lg font-semibold p-4 bg-red-200 text-red-800 inline">Error loading data, please try again.</p>
      <template >

      </template>
    </div>

    <table v-else :class="[
      'min-w-full table-auto border-collapse text-sm',
      loading ? 'opacity-50' : '',
    ]"
    >
      <!-- Table header -->
      <thead class="bg-primary text-white">
        <tr>
          <th v-for="column in columns" :key="column.key" class="px-4 py-2 cursor-pointer" @click="sortData(column.key)">
            <div class="flex items-center justify-between">
              <span>{{ column.label }}</span>
              <!-- Sort icon -->
              <svg v-if="sortBy === column.key" class="w-4 h-4 ml-2" :class="sortOrder === 'asc' ? 'rotate-180' : ''" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <tr v-if="data.length === 0">
          <td colspan="columns.length" class="text-center py-10 text-muted">No data available</td>
        </tr>
        <tr 
          v-for="(row, index) in data" 
          :key="index" 
          class="border-t cursor-pointer"
          @click="emit('rowClick', { row, index })"
        >
          <td v-for="column in columns" :key="column.key" class="px-4 py-2">
            <!-- Slot for custom content in specific columns -->
            <template v-if="$slots[`column-${column.key}`]">
              <slot :name="`column-${column.key}`" :row="row" :column="column" :index="index" />
            </template>
            <template v-else>
              {{ row[column.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="pagination" class="flex justify-between items-center mt-4">
      <button :disabled="pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)" class="px-4 py-2 text-white bg-primary rounded disabled:opacity-50">
        Previous
      </button>
      <span class="text-sm">
        Page {{ pagination.currentPage }} of {{ pagination.totalPage }}
      </span>
      <button :disabled="pagination.currentPage >= pagination.totalPage" @click="changePage(pagination.currentPage + 1)" class="px-4 py-2 text-white bg-primary rounded disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props to pass data and configuration
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: 'asc'
  }
});

// Emits for sorting and pagination change
const emit = defineEmits(['updateSort', 'updatePage', 'rowClick']);

// Local state to manage sorting
const sortBy = ref(props.sortBy);
const sortOrder = ref(props.sortOrder);

// Watch for sort changes and emit to parent
watch([sortBy, sortOrder], () => {
  emit('updateSort', { sortBy: sortBy.value, sortOrder: sortOrder.value });
});

// Sort the table data based on column and current sort direction
const sortData = (columnKey) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }
  emit('updateSort', { sortBy: sortBy.value, sortOrder: sortOrder.value });
};

// Handle page change and emit for pagination update
const changePage = (page) => {
  emit('updatePage', page);
};
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #008080;
}

tbody tr:hover {
  background-color: #f3f4f6;
}

button:disabled {
  cursor: not-allowed;
}
</style>
