<template>
    <!-- Loading State -->
    <OrderDetailSkeleton v-if="pending" />
  
    <!-- Error State -->
    <UiErrorState 
      v-else-if="error"
      title="Unable to Load Quote"
      message="We couldn't load the quote details. This might be due to a network issue or the quote might not exist."
      :loading="pending"
      back-route="/quotes"
      back-text="Back to Quotes"
      @retry="() => refresh()"
    />
  
    <!-- Success State -->
    <div v-else-if="quote">
      <!-- Order Detail Component -->
      <OrderDetailComponent
        v-if="dataSourceType === DataSource.ORDER"
        :order="quote"
        :deliveryData="deliveryData"
        :isAdmin="isAdmin"
        :orderId="String(route.params.id)"
        @update:orderStatus="handleOrderStatusUpdate"
        @edit:order="handleEditOrder"
        @delivery:complete="handleDeliveryComplete"
      >
        <template #actions>
          <QuoteActions
            :isAdmin="isAdmin"
            :status="quote?.status"
            @accept="updateOrderStatus(QuoteStatus.ACCEPTED, dataSourceType)"
            @reject="updateOrderStatus(QuoteStatus.REJECTED, dataSourceType)"
            @proceed="updateOrderStatus(QuoteStatus.PROCEED, dataSourceType)"
            @moveToOrder="handleMoveToOrder(dataSourceType)"
            @edit="handleEditOrder"
          />
        </template>
      </OrderDetailComponent>

      <!-- Vector Detail Component -->
      <VectorDetailComponent
        v-else-if="dataSourceType === DataSource.VECTOR"
        :vector="quote"
        :deliveryData="deliveryData"
        :isAdmin="isAdmin"
        :vectorId="String(route.params.id)"
        @update:vectorStatus="handleVectorStatusUpdate"
        @edit:vector="handleEditVector"
        @delivery:complete="handleDeliveryComplete"
      >
        <template #actions>
          <QuoteActions
            :isAdmin="isAdmin"
            :status="quote?.status"
            @accept="updateOrderStatus(QuoteStatus.ACCEPTED, dataSourceType)"
            @reject="updateOrderStatus(QuoteStatus.REJECTED, dataSourceType)"
            @proceed="updateOrderStatus(QuoteStatus.PROCEED, dataSourceType)"
            @moveToOrder="handleMoveToOrder(dataSourceType)"
            @edit="handleEditVector"
          />
        </template>
      </VectorDetailComponent>
    </div>
  </template>
  
  <script setup  lang="ts">
  import OrderDetailSkeleton from "~/components/skeletons/OrderDetailSkeleton.vue";
  import { ROLE } from "~~/shared/constants";
  import { DataSource, QuoteStatus } from "~~/shared/types/enums";
  import type { DeliveryFormData } from "~/components/DeliveryModal.vue";
  
  interface QuoteResponse {
    message: string;
    data: IOrder | IVector;
  }
  
  const route = useRoute();
  const router = useRouter();
  const { user } = useUserSession();
  
  const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

  const dataSourceType = computed(() => route.query.type as DataSource);
  
  const toast = useToast();
  
  const { data, pending, error, refresh } = useFetch<QuoteResponse>(
    `/api/quotes/${route.params.id}?type=${dataSourceType.value}`
    );
    
  const quote = computed(() => data.value?.data);

  // Fetch delivery data based on dataSourceType
  const { data: deliveryData } = useFetch(() => {
    if (dataSourceType.value === DataSource.ORDER) {
      return `/api/orders/deliver/${route.params.id}`;
    } else if (dataSourceType.value === DataSource.VECTOR) {
      return `/api/vectors/deliver/${route.params.id}`;
    }
    return `/api/orders/deliver/${route.params.id}`; // fallback
  }, {
    server: false
  });
  
  const updateOrderStatus = async (status: QuoteStatus, dataSourceType: DataSource) => {
    try {
      await $fetch(`/api/quotes/status`, {
        method: "POST",
        body: { quoteId: route.params.id, status, dataSourceType }
      });
      toast.success("Quote status updated successfully");
      refresh();
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast.error("Failed to update quote status");
    }
  }
  
  const handleEditOrder = () => {
    router.push(`/quotes/edit/${route.params.id}?type=${dataSourceType.value}`);
  };

  const handleEditVector = () => {
    router.push(`/quotes/edit/${route.params.id}?type=${dataSourceType.value}`);
  };
  
  const handleMoveToOrder = async (dataSourceType: DataSource) => {
    try {
      await $fetch(`/api/quotes/move-to-order`, {
        method: "POST",
        body: { quoteId: route.params.id, dataSourceType }
      });
      toast.success("Quote moved to order successfully");
      refresh();
    } catch (error) {
      console.error("Error moving quote to order:", error);
      toast.error("Failed to move quote to order");
    }
  };

  const handleOrderStatusUpdate = (status: OrderStatus) => {
    refresh();
  };

  const handleVectorStatusUpdate = (status: OrderStatus) => {
    refresh();
  };

  const handleDeliveryComplete = (deliveryData: DeliveryFormData) => {
    refresh();
  };
  
  definePageMeta({
    name: "Quotes Details",
    layout: "portal",
    middleware: ["auth"],
  });
  
  </script>
  
  <style scoped>
  /* subtle polish */
  .container :where(.card) {
    animation: fade-in 0.6s ease-in-out both;
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  