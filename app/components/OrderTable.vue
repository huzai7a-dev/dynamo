<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <TableHeader :searchOrderNumber="searchOrderNumber" :searchOrderName="searchOrderName"
        :selectedDateRange="selectedDateRange" :isAdmin="isAdmin" :searchCustomerName="searchCustomerName"
        @create-order="emit('create-order')"
        @update:searchOrderNumber="(val: string) => emit('update:searchOrderNumber', val)"
        @update:searchOrderName="(val: string) => emit('update:searchOrderName', val)"
        @update:searchCustomerName="(val: string) => emit('update:searchCustomerName', val)"
        @update:selectedDateRange="(val) => emit('update:selectedDateRange', val)" />

      <div class="p-6">
        <UiTable :data="formateData" :columns="columns" :pagination="props.pagination" :loading="props.loading"
          :error="props.error" :sortBy="props.sortBy" :sortOrder="props.sortOrder"
          @updateSort="(sortBy: string, sortOrder: string) => emit('sort', sortBy, sortOrder)"
          @updatePage="emit('paginate', $event)" @rowClick="emit('rowClick', $event)">
          <template #column-serial_number="{ index }">
            <span class="text-primary font-semibold">{{ index + 1 }}</span>
          </template>

          <template #column-status="{ row }">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getOrderStatusBadgeClass((row as TableOrders).status)">
              {{ formatOrderStatus((row as TableOrders).status) }}
            </span>
          </template>

          <template #column-payment_status="{ row }">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getPaymentStatusBadgeClass((row as TableOrders).payment_status)">
              {{ formatPaymentStatus((row as TableOrders).payment_status) }}
            </span>
          </template>

          <template #column-convert_from_quote="{ row }">
            <span class="text-primary font-semibold">{{ row.convert_from_quote }}</span>
          </template>
        </UiTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { TableOrders, Pagination } from "#shared/types";
import TableHeader from "./TableHeader.vue";
import { ROLE } from "~~/shared/constants";
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
  formatOrderStatus,
  formatPaymentStatus
} from "~/utils/orderUtils";

interface Props {
  title?: string;
  data?: TableOrders[];
  pagination?: Pagination;
  loading: boolean;
  error: boolean;
  sortBy?: string;
  sortOrder?: string;
  searchOrderNumber?: string;
  searchOrderName?: string;
  searchCustomerName?: string;
}

const emit = defineEmits<{
  'create-order': [];
  'paginate': [page: number];
  'sort': [sortBy: string, sortOrder: string];
  'rowClick': [{ row: TableOrders, index: number }];
  'update:searchOrderNumber': [value: string];
  'update:searchOrderName': [value: string];
  'update:searchCustomerName': [value: string];
  'update:selectedDateRange': [value: { from: Date | null; to: Date | null }];
}>();

const props = defineProps<Props>();
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const formateData = computed(() => {
  return props.data?.map((item) => ({
    ...item,
    created_at: formateDate(item.created_at),
    price: item.price > 0 ? `$${item.price}` : "N/A",
    ...(isAdmin.value ? {
      customer_name: item.customer_name,
      is_from_quote: item.is_from_quote ? "Yes" : "No",
    } : {}),
  }));
});

const selectedDateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const columns = ref([
  { label: "Serial Number", key: "serial_number" },
  { label: "Order Number", key: "id" },
  { label: "Order Name", key: "order_name" },
  ...(isAdmin.value ? [{ label: "Customer Name", key: "customer_name" }, { label: "Converted From Quote", key: "is_from_quote" }] : []),
  { label: "Price", key: "price" },
  { label: "Order Status", key: "status" },
  { label: "Payment Status", key: "payment_status" },
  { label: "Date", key: "created_at" },
]);



</script>
