<template>
  <div class="overflow-x-auto relative">
    <!-- Status States: Loading, Error, Empty -->
    <div v-if="loading && data.length === 0"
      class="min-h-[400px] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
      <div class="relative mb-6">
        <div class="w-20 h-20 border-4 border-primary/20 rounded-full border-t-primary animate-spin"></div>
        <Icon name="Database"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary/40" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Loading Data</h3>
      <p class="text-gray-500 max-w-xs mx-auto">Please wait while we fetch the latest records for you.</p>
    </div>

    <div v-else-if="error"
      class="min-h-[400px] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500">
      <div class="bg-red-50 p-6 rounded-full mb-6">
        <Icon name="AlertCircle" class="w-12 h-12 text-red-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Failed to load data</h3>
      <p class="text-gray-500 max-w-xs mx-auto mb-6">Something went wrong while fetching the data. Please try again
        later.</p>
      <button @click="emit('refresh')"
        class="inline-flex items-center px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-primary/20">
        <Icon name="RefreshCw" class="w-4 h-4 mr-2" />
        Retry Now
      </button>
    </div>

    <div v-else-if="data.length === 0"
      class="min-h-[400px] flex flex-col items-center justify-center p-12 text-center animate-in slide-in-from-bottom-4 duration-500">
      <div class="bg-gray-100 p-8 rounded-full mb-6">
        <Icon name="Search" class="w-16 h-16 text-gray-300" />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No Records Found</h3>
      <p class="text-gray-500 max-w-md mx-auto">We couldn't find any data matching your current criteria. Try adjusting
        your search or filters.</p>
    </div>

    <table v-else :class="[
      'min-w-full table-auto border-collapse text-sm',
      loading ? 'opacity-40 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300',
    ]">
      <!-- Table header -->
      <thead class="bg-primary text-white sticky top-0 z-10">
        <tr>
          <th v-for="column in columns" :key="column.key" class="px-4 py-2 cursor-pointer"
            @click="sortData(column.key)">
            <div class="flex items-center justify-between">
              <span>{{ column.label }}</span>
              <!-- Sort icon -->
              <svg v-if="sortBy === column.key" class="w-4 h-4 ml-2" :class="sortOrder === 'asc' ? 'rotate-180' : ''"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <tr v-if="data.length === 0 && !loading">
          <td colspan="columns.length" class="text-center py-10 text-muted">No data available</td>
        </tr>
        <tr v-for="(row, index) in data" :key="index" class="border-t cursor-pointer"
          @click="emit('rowClick', { row, index })">
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
    <div v-if="pagination && !infiniteScroll" class="flex justify-between items-center mt-4">
      <button :disabled="pagination.currentPage <= 1" @click="changePage(pagination.currentPage - 1)"
        class="px-4 py-2 text-white bg-primary rounded disabled:opacity-50">
        Previous
      </button>
      <span class="text-sm">
        Page {{ pagination.currentPage }} of {{ pagination.totalPage }}
      </span>
      <button :disabled="pagination.currentPage >= pagination.totalPage" @click="changePage(pagination.currentPage + 1)"
        class="px-4 py-2 text-white bg-primary rounded disabled:opacity-50">
        Next
      </button>
    </div>

    <!-- Infinite Scroll Sentinel -->
    <div v-if="infiniteScroll" ref="sentinel" class="h-10 flex justify-center items-center">
      <div v-if="loading && data.length > 0"
        class="loader w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Icon, { type IconName } from '../Icon.vue';

interface Column {
  key: string;
  label: string;
}

// Props to pass data and configuration
const props = defineProps({
  data: {
    type: Array as () => any[],
    required: true
  },
  columns: {
    type: Array as () => Column[],
    required: true
  },
  pagination: {
    type: Object as () => { currentPage: number, totalPage: number } | null,
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
  },
  infiniteScroll: {
    type: Boolean,
    default: false
  }
});

// Emits for sorting and pagination change
const emit = defineEmits<{
  (e: 'updateSort', payload: { sortBy: string; sortOrder: string }): void;
  (e: 'updatePage', page: number): void;
  (e: 'rowClick', payload: { row: any; index: number }): void;
  (e: 'loadMore'): void;
  (e: 'refresh'): void;
}>();

// Local state to manage sorting
const sortBy = ref<string>(props.sortBy);
const sortOrder = ref<string>(props.sortOrder);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Watch for sort changes and emit to parent
watch([sortBy, sortOrder], () => {
  emit('updateSort', { sortBy: sortBy.value, sortOrder: sortOrder.value });
});

// Sort the table data based on column and current sort direction
const sortData = (columnKey: string) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }
  emit('updateSort', { sortBy: sortBy.value, sortOrder: sortOrder.value });
};

// Handle page change and emit for pagination update
const changePage = (page: number) => {
  emit('updatePage', page);
};

// Setup IntersectionObserver for infinite scroll
const loadMoreItems = (entries: IntersectionObserverEntry[]) => {
  const entry = entries[0];
  if (entry && entry.isIntersecting && !props.loading) {
    if (props.pagination) {
      if (props.pagination.currentPage < props.pagination.totalPage) {
        emit('loadMore');
      }
    } else {
      emit('loadMore');
    }
  }
};

onMounted(() => {
  if (props.infiniteScroll) {
    observer = new IntersectionObserver(loadMoreItems, {
      rootMargin: '100px',
      threshold: 0.1
    });

    if (sentinel.value) {
      observer.observe(sentinel.value);
    }
  }
});

// Watch for sentinel changes if infinite scroll is dynamically enabled
watch(() => props.infiniteScroll, (val) => {
  if (val && !observer) {
    // Setup logic if needed, but usually it's set on mount
  } else if (!val && observer) {
    observer.disconnect();
    observer = null;
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});

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
