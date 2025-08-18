<template>
  <div class="space-y-6">
    <h3 class="text-2xl font-bold text-gray-900">{{ props.title }}</h3>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <TableHeader
        :searchOrderNumber="searchOrderNumber"
        @update:searchOrderNumber="(val: string) => emit('update:searchOrderNumber', val)"
        :searchOrderName="searchOrderName"
        @update:searchOrderName="(val: string) => emit('update:searchOrderName', val)"
        :selectedDateRange="selectedDateRange"
        @update:selectedDateRange="(val: string) => selectedDateRange = val"
        :dateRangeOptions="dateRangeOptions"
        @create-order="emit('create-order')"
      />

      <div class="p-6">
        <UiTable
          :data="props.data"
          :columns="props.columns"
          :pagination="props.pagination"
          :loading="props.loading"
          :error="props.error"
          :sortBy="props.sortBy"
          :sortOrder="props.sortOrder"
          @updateSort="emit('sort', $event)"
          @updatePage="emit('paginate', $event)"
          @rowClick="emit('rowClick', $event)"
        >
        <template #column-serialNumber="{ index }">
          <span class="text-primary font-semibold">{{ index + 1 }}</span>
        </template>

        <template #column-status="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(row?.status)">{{ row?.status?.toUpperCase() }}</span>
        </template>

        <!-- <template #column-actions="{ row }">
          <div class="flex space-x-2">
            <UiTooltip text="View">
              <Icon name="Eye" class="cursor-pointer hover:text-primary" @click="emit('edit', row)" />
            </UiTooltip>
          </div>
        </template> -->
      </UiTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TableHeader from "./TableHeader.vue";

interface Props {
  title: string;
  data: any[];
  columns: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: boolean;
  sortBy?: string;
  sortOrder?: string;
}

const emit = defineEmits(["create-order", "paginate", "sort", "rowClick", 'edit', "update:searchOrderNumber", "update:searchOrderName", "update:selectedDateRange"]);

const props = defineProps<Props>();

// Search and filter reactive variables
const searchOrderNumber = ref("");
const searchOrderName = ref("");
const selectedDateRange = ref("");

// Date range options for the select dropdown
const dateRangeOptions = ref([
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "This Year", value: "thisyear" },
  { label: "Last Year", value: "lastyear" },
]);

function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    statusMap[status.toLowerCase()] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
}

// function getStatusDotClass(status: string): string {
//   const statusMap: Record<string, string> = {
//     active: "bg-green-500",
//     inactive: "bg-gray-500",
//     pending: "bg-yellow-500",
//     completed: "bg-blue-500",
//     cancelled: "bg-red-500",
//   };

//   return statusMap[status.toLowerCase()] || "bg-gray-500";
// }

function viewOrder(order: any) {
  console.log("View order:", order);
  // Add your view logic here
}

function editOrder(order: any) {
  console.log("Edit order:", order);
  // Add your edit logic here
}

function deleteOrder(order: any) {
  console.log("Delete order:", order);
  // Add your delete logic here
}

function createOrder() {
  console.log("Create new order");
  // Add your create order logic here
}
</script>
