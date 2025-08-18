<template>
  <p v-if="pending">Loading</p>
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
              v-if="order?.attachments && order.attachments.length"
              :attachments="order.attachments || []"
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
            <OrderActions />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IOrder } from "~~/shared/types";

interface OrderResponse {
  message: string;
  data: IOrder;
}
const route = useRoute();
const { data, pending, error } = useFetch<OrderResponse>(
  `/api/orders/${route.params.id}`
);

const order = computed(() => data.value?.data);

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
</style>
