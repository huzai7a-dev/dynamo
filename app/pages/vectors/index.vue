<template>
    <div>
      <VectorsTable
        @create-order="$router.push('/vectors/create')"
        :data="data?.data?.vectors ?? []"
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
        @update:searchOrderNumber="orderNumber = $event"
        @update:searchOrderName="orderName = $event"
        @update:selectedDateRange="dateRange = $event"
        @update:searchCustomerName="customerName = $event"
        @paginate="(nextPage) => (currentPage = nextPage)"
        @row-click="$router.push(`/vectors/${$event.row.id}`)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import type { IVector, Pagination, QueryParams, } from "~~/shared/types";
  
  definePageMeta({
    layout: "portal",
    middleware: ["auth"],
    name:"Vectors"
  });
  
  interface OrderResponse {
    message: string;
    data: {
      vectors: IVector[];
      pagination: Pagination;
    };
  }
  
  const currentPage = ref(1);
  const orderNumber = ref("");
  const orderName = ref("");
  const customerName = ref("");
  const dateRange = ref<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  
  const params = computed(() => ({
    page: currentPage.value,
    order_number: orderNumber.value,
    order_name: orderName.value,
    customer_name: customerName.value,
    ...(dateRange.value.from && { date_from: dateRange.value.from.toISOString().split('T')[0] }),
    ...(dateRange.value.to && { date_to: dateRange.value.to.toISOString().split('T')[0] }),
  }));
  
  const debounceParams: Ref<QueryParams> = ref(useDebounce(params, 500));
  
  const { data, pending, error, refresh } = useFetch<OrderResponse>("/api/vectors", {
    params: debounceParams,
    keepalive: true,
    lazy: true,
  });
  
  </script>
  