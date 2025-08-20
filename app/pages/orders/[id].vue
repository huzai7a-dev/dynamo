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
              Order Details
            </h2>
            <OrderMetaGrid :order="order" />
          </div>

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AttachmentsGallery
              title="Order Attachments"
              noAttachmentsMessage="No order attachments uploaded."
              :attachments="order.order_attachments || []"
            />
          </div>

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AttachmentsGallery
              title="Delivery Attachments"
              noAttachmentsMessage="No delivery attachments uploaded yet."
              :attachments="order.delivery_attachments || []"
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
            <OrderActions
              :isAdmin="isAdmin"
              :status="order?.status"
              @approve="updateOrderStatus(OrderStatus.IN_PROGRESS)"
              @reject="updateOrderStatus(OrderStatus.REJECTED)"
              @deliver="showDeliveryModal = true"
              @cancel="updateOrderStatus(OrderStatus.CANCELLED)"
            />
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Delivery Modal -->
  <DeliveryModal
    v-model="showDeliveryModal"
    :order-id="route.params.id as string"
    @on:deliver="handleDeliveryComplete"
  />
</template>

<script setup  lang="ts">
import { ROLE } from "~~/shared/constants";
import { OrderStatus } from "~~/shared/types/enums";

interface OrderResponse {
  message: string;
  data: IOrder;
}

const route = useRoute();
const { user } = useUserSession();

const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const toast = useToast();
const showDeliveryModal = ref(false);

const { data, pending, error, refresh } = useFetch<OrderResponse>(
  `/api/orders/${route.params.id}`
  );
  
const order = computed(() => data.value?.data);

const updateOrderStatus = async (status: OrderStatus) => {
  try {
    await $fetch(`/api/orders/status`, {
      method: "POST",
      body: { orderId: route.params.id, status }
    });
    toast.success("Order status updated successfully");
    refresh();
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status");
  }
}

const handleDeliveryComplete = async (deliveryData: { 
  orderId: string; 
  estimateAmount: string; 
  files: File[]; 
  notes: string 
}) => {

  try {
    
   const fd = new FormData();
   fd.append("orderId", deliveryData.orderId);
   fd.append("estimateAmount", deliveryData.estimateAmount);
   fd.append("notes", deliveryData.notes);
   deliveryData.files.forEach(file => {
    fd.append("attachments", file);
   });

   await $fetch(`/api/orders/deliver`, {
    method: "POST",
    body: fd
   });
    
    await refresh();
    toast.success("Order delivered successfully");
    
    showDeliveryModal.value = false;
  } catch (error) {
    console.error("Error completing delivery:", error);
    toast.error("Failed to complete delivery");
  }
}



definePageMeta({
  name: "Order Details",
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
