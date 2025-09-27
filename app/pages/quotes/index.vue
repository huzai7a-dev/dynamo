<template>
    <div>
      <QuotesTable
        @create-order="$router.push('/quotes/create')"
        :data="data?.data?.quotes ?? []"
        :pagination="{
          currentPage: data?.data?.pagination.currentPage || 1,
          totalPage: data?.data?.pagination.totalPage || 10,
        }"
        :searchCustomerName="customerName"
        :searchOrderNumber="orderNumber"
        :searchOrderName="orderName"
        :loading="pending"
        :error="!!error"
        @refresh="refresh"
        @update:dataSourceType="dataSourceType = $event"
        @update:searchOrderNumber="orderNumber = $event"
        @update:searchOrderName="orderName = $event"
        @update:selectedDateRange="dateRange = $event"
        @update:searchCustomerName="customerName = $event"
        @paginate="(nextPage) => (currentPage = nextPage)"
        @row-click="$router.push(`/quotes/${$event.row.id}?type=${dataSourceType}`)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import type { Pagination, TableOrders } from "~~/shared/types";
  
  definePageMeta({
    layout: "portal",
    middleware: ["auth"],
  });
  
  interface OrderResponse {
    message: string;
    data: {
      quotes: TableOrders[];
      pagination: Pagination;
    };
  }
  
  const currentPage = ref(1);
  const orderNumber = ref("");
  const orderName = ref("");
  const customerName = ref("");
  const dateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const dataSourceType = ref(DataSource.ORDER);
  
  const params = computed(() => ({
    page: currentPage.value,
    order_number: orderNumber.value,
    order_name: orderName.value,
    customer_name: customerName.value,
    data_source_type: dataSourceType.value,
    ...(dateRange.value.from && { date_from: dateRange.value.from.toISOString().split('T')[0] }),
    ...(dateRange.value.to && { date_to: dateRange.value.to.toISOString().split('T')[0] }),
  }));
  
  const debounceParams: Ref<QueryParams> = ref(useDebounce(params, 500));
  
  const { data, pending, error, refresh } = useFetch<OrderResponse>("/api/quotes", {
    params: debounceParams,
    keepalive: true,
    lazy: true,
  });
  
  </script>
  