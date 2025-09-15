<template>
    <!-- Loading State -->
    <OrderDetailSkeleton v-if="pending" />
  
    <!-- Error State -->
    <UiErrorState 
      v-else-if="error"
      title="Unable to Load Order"
      message="We couldn't load the order details. This might be due to a network issue or the order might not exist."
      :loading="pending"
      back-route="/orders"
      back-text="Back to Orders"
      @retry="() => refresh()"
    />
  
    <!-- Success State -->
    <div v-else-if="order" class="min-h-screen bg-light-gray">
      <div class="container py-8">
        <!-- Header -->
        <OrderHeader
          :order_name="order?.order_name"
          :po_number="order?.po_number"
          :status="order?.status"
        />
  
        <!-- Main -->
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-secondary">
                Quote Details
              </h2>
              <OrderMetaGrid :order="order" />
            </div>
  
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <AttachmentsGallery
                title="Quote Attachments"
                noAttachmentsMessage="No order attachments uploaded."
                :attachments="order.order_attachments || []"
              />
            </div>

          </div>
  
          <aside class="space-y-6">
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-3 text-base font-semibold text-secondary">Summary</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-charcoal/70">Status</span>
                  <UiStatusBadge :status="order?.status" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-charcoal/70">Payment</span>
                  <span
                    class="text-sm font-medium"
                    :class="
                      order?.payment_status === 'paid'
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    "
                  >
                    {{ order?.payment_status === "paid" ? "Paid" : "Pending" }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-charcoal/70">Estimate</span>
                  <span class="text-sm font-medium text-secondary">
                    {{
                      order?.price === "0.00"
                        ? "To be quoted"
                        : `$${order?.price}`
                    }}
                  </span>
                </div>
              </div>
            </div>
  
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
              <InstructionBox :instructions="order?.instructions" />
            </div>
          
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 class="mb-3 text-base font-semibold text-secondary">Actions</h3>
              <QuoteActions
                :isAdmin="isAdmin"
                :status="order?.status"
                @accept="updateOrderStatus(QuoteStatus.ACCEPTED)"
                @reject="updateOrderStatus(QuoteStatus.REJECTED)"
                @proceed="updateOrderStatus(QuoteStatus.PROCEED)"
                @moveToOrder="handleMoveToOrder"
                @edit="handleEditOrder"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script setup  lang="ts">
  import OrderDetailSkeleton from "~/components/skeletons/OrderDetailSkeleton.vue";
import { ROLE } from "~~/shared/constants";
  
  interface OrderResponse {
    message: string;
    data: IOrder;
  }
  
  const route = useRoute();
  const router = useRouter();
  const { user } = useUserSession();
  
  const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);
  
  const toast = useToast();
  
  const { data, pending, error, refresh } = useFetch<OrderResponse>(
    `/api/orders/${route.params.id}`
    );
    
  const order = computed(() => data.value?.data);
  
  const updateOrderStatus = async (status: QuoteStatus) => {
    try {
      await $fetch(`/api/quotes/status`, {
        method: "POST",
        body: { quoteId: route.params.id, status }
      });
      toast.success("Quote status updated successfully");
      refresh();
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast.error("Failed to update quote status");
    }
  }
  
  const handleEditOrder = () => {
    router.push(`/orders/edit/${route.params.id}`);
  };
  
  const handleMoveToOrder = async () => {
    try {
      await $fetch(`/api/quotes/move-to-order`, {
        method: "POST",
        body: { quoteId: route.params.id }
      });
    } catch (error) {
      console.error("Error moving quote to order:", error);
      toast.error("Failed to move quote to order");
    }
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
  