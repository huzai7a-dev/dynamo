<template>
  <div>
    <DataTable
      @create-order="showOrderModal = true"
      title="Orders"
      :data="tableData || []"
      :columns="columns"
      :pagination="{
        currentPage: data?.data?.pagination.currentPage || 1,
        totalPages: data?.data?.pagination.totalPage || 10,
      }"
      :loading="pending"
      :error="!!error"
      @edit="$router.push(`/orders/${$event.id}`)"
      @refresh="refresh"
      @update:searchOrderNumber="orderNumber = $event"
      @update:searchOrderName="orderName = $event"
      @paginate="(nextPage) => (currentPage = nextPage)"
      @row-click="$router.push(`/orders/${$event.row.id}`)"
    />
    <UiModal v-model="showOrderModal">
      <OrderForm @success="onOrderSuccess" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DataTable from "~/components/DataTable.vue";
import OrderForm from "~/components/OrderForm.vue";
import UiModal from "~/components/ui/Modal.vue";
import type { Pagination, TableOrders } from "~~/shared/types";
import { formateDate } from "~~/shared/utils";

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});

interface OrderResponse {
  message: string;
  data: {
    orders: TableOrders[];
    pagination: Pagination;
  };
}

const showOrderModal = ref(false);
const currentPage = ref(1);
const orderNumber = ref("");
const orderName = ref("");

const params = computed(() => ({
  page: currentPage.value,
  order_number: orderNumber.value,
  order_name: orderName.value,
}));

const debounceParams = ref(useDebounce(params, 500));

const { data, pending, error, refresh } = useFetch<OrderResponse>("/api/orders", {
  params: debounceParams,
  keepalive: true,
  lazy: true,
});

const columns = ref([
  { label: "Serial Number", key: "serialNumber" },
  { label: "Order Number", key: "id" },
  { label: "Order Name", key: "orderName" },
  { label: "Price", key: "price" },
  { label: "Order Status", key: "status" },
  { label: "Payment Status", key: "paymentStatus" },
  { label: "Date", key: "date" },
]);

const tableData = computed(() => {
  const orders = data.value?.data?.orders ?? [];
  return orders.map((order) => ({
    id: order.id,
    orderName: order.order_name,
    price: order?.price > 0 ? `$${order.price}` : "N/A",
    status: order.status,
    paymentStatus: order.payment_status,
    date: formateDate(order.created_at),
  }));
});

const onOrderSuccess = () => {
  showOrderModal.value = false;
};
</script>
