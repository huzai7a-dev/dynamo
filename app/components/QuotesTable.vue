<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <TableHeader createButtonLabel="Create Quote" :searchOrderNumber="searchOrderNumber"
        :searchOrderName="searchOrderName" :selectedDateRange="selectedDateRange" :isAdmin="isAdmin"
        :searchCustomerName="searchCustomerName" @create-order="emit('create-order')"
        @update:searchOrderNumber="(val: string) => emit('update:searchOrderNumber', val)"
        @update:searchOrderName="(val: string) => emit('update:searchOrderName', val)"
        @update:searchCustomerName="(val: string) => emit('update:searchCustomerName', val)"
        @update:selectedDateRange="(val) => emit('update:selectedDateRange', val)">

        <template #actions>
          <UiSelect :placeholder="'Create Quote'" :options="dataSourceTypeOptions"
            @update:modelValue="(event) => { router.push(`/quotes/create?type=${event}`) }" />
        </template>
      </TableHeader>


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
  'update:dataSourceType': [value: DataSource];
  'update:searchOrderNumber': [value: string];
  'update:searchOrderName': [value: string];
  'update:searchCustomerName': [value: string];
  'update:selectedDateRange': [value: { from: Date | null; to: Date | null }];
}>();

const props = defineProps<Props>();
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);
// const dataSourceType = ref(DataSource.ORDER);
const router = useRouter();
const dataSourceTypeOptions = [
  { label: "Order", value: DataSource.ORDER },
  { label: "Vector", value: DataSource.VECTOR },
];

const formateData = computed(() => {
  return props.data?.map((item) => ({
    ...item,
    created_at: formateDate(item.created_at),
    price: item.price > 0 ? `$${item.price}` : "N/A",
    ...(isAdmin.value ? {
      customer_name: item.customer_name,
    } : {}),
  }));
});

const selectedDateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });

const columns = computed(() => [
  { label: "Serial Number", key: "serial_number" },
  { label: "Quote Number", key: "id" },
  { label: "Quote Name", key: "title" },
  { label: "Quote Type", key: "q_type" },
  ...(isAdmin.value ? [{ label: "Customer Name", key: "customer_name" }] : []),
  { label: "Price", key: "price" },
  { label: "Quote Status", key: "status" },
  { label: "Date", key: "created_at" },
]);



</script>