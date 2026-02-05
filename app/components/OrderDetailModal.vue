<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-start justify-center p-6"
    >
      <div class="fixed inset-0 bg-black/40" @click="close"></div>

      <div
        class="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-lg"
      >
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h3 class="text-lg font-semibold text-secondary">Order Details</h3>
          <button class="p-2 rounded hover:bg-slate-100" @click="close">
            <Icon name="X" />
          </button>
        </div>

        <div class="p-6">
          <div v-if="pending" class="py-10">
            <OrderDetailSkeleton />
          </div>

          <UiErrorState
            v-else-if="error"
            title="Unable to Load Order"
            message="We couldn't load the order details. This might be due to a network issue or the order might not exist."
            :loading="pending"
            back-route="/orders"
            back-text="Back to Orders"
            @retry="fetchOrder"
          />

          <div v-else-if="order" class="min-h-[40vh] bg-light-gray">
            <!-- Header -->
            <OrderHeader
              :order_name="order.order_name"
              :po_number="order.po_number"
              :status="order.status"
            />

            <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div class="lg:col-span-2 space-y-6">
                <div
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 class="mb-4 text-lg font-semibold text-secondary">
                    Order Details
                  </h2>
                  <OrderMetaGrid :order="order" />
                  <AttachmentsGallery
                    class="mt-6"
                    title="Attachments"
                    noAttachmentsMessage="No order attachments uploaded."
                    :attachments="order.order_attachments || []"
                  />
                </div>

                <DeliveryDetails
                  v-if="deliveryData"
                  :deliveryData="deliveryData"
                />
              </div>

              <aside class="space-y-6">
                <div
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 class="mb-3 text-base font-semibold text-secondary">
                    Summary
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-charcoal/70">Status</span>
                      <UiStatusBadge :status="order.status" />
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-charcoal/70">Payment</span>
                      <span
                        class="text-sm font-medium"
                        :class="
                          order.payment_status === 'paid'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        "
                      >
                        {{
                          order.payment_status === "paid" ? "Paid" : "Pending"
                        }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-charcoal/70">Estimate</span>
                      <span class="text-sm font-medium text-secondary">
                        {{
                          order.price === "0.00"
                            ? "To be quoted"
                            : `$${order.price}`
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 class="mb-4 text-lg font-semibold text-secondary">
                    Notes
                  </h2>
                  <InstructionBox :instructions="order.instructions" />
                </div>

                <div
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 class="mb-3 text-base font-semibold text-secondary">
                    Actions
                  </h3>
                  <OrderActions
                    :isAdmin="isAdmin"
                    :status="order.status"
                    @approve="updateOrderStatus(OrderStatus.IN_PROGRESS)"
                    @reject="updateOrderStatus(OrderStatus.REJECTED)"
                    @deliver="showDeliveryModal = true"
                    @cancel="updateOrderStatus(OrderStatus.CANCELLED)"
                    @edit="handleEditOrder"
                  />
                </div>
              </aside>
            </div>
          </div>

          <!-- Delivery Modal inside detail modal -->
          <DeliveryModal
            v-model="showDeliveryModal"
            :orderId="String(orderId)"
            :orderDate="order?.created_at"
            @on:deliver="onDeliveryCompleted"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRef } from "vue";
import Icon from "./Icon.vue";
import OrderHeader from "~/components/OrderHeader.vue";
import OrderMetaGrid from "~/components/OrderMetaGrid.vue";
import AttachmentsGallery from "~/components/AttachmentsGallery.vue";
import DeliveryDetails from "~/components/DeliveryDetails.vue";
import InstructionBox from "~/components/InstructionBox.vue";
import OrderActions from "~/components/OrderActions.vue";
import DeliveryModal from "~/components/DeliveryModal.vue";
import OrderDetailSkeleton from "~/components/skeletons/OrderDetailSkeleton.vue";
import { ROLE } from "~~/shared/constants";
import { OrderStatus } from "~~/shared/types/enums";

interface OrderResponse {
  message: string;
  data: any;
}
import type { OrderDelivery } from "~~/shared/types";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  orderId: { type: [String, Number], required: true },
});

const emit = defineEmits(["update:modelValue"]);

// keep reactive refs to props so template reacts to v-model changes
const modelValue = toRef(props, "modelValue");
const orderId = toRef(props, "orderId");

const showDeliveryModal = ref(false);
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const data = ref<OrderResponse | null>(null);
const deliveryData = ref<OrderDelivery | null>(null);
const pending = ref(false);
const error = ref(false);

const fetchOrder = async () => {
  if (!orderId.value) return;
  pending.value = true;
  error.value = false;
  try {
    data.value = (await $fetch(
      `/api/orders/${orderId.value}`,
    )) as OrderResponse;
    deliveryData.value = (await $fetch(
      `/api/orders/deliver/${orderId.value}`,
    )) as any;
  } catch (e) {
    console.error(e);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

watch(modelValue, (v) => {
  if (v) fetchOrder();
});

const close = () => emit("update:modelValue", false);

const order = computed(() => data.value?.data);

const updateOrderStatus = async (status: any) => {
  try {
    await $fetch(`/api/orders/status`, {
      method: "POST",
      body: { orderId: orderId.value, status },
    });
    await fetchOrder();
    useToast().success("Order status updated successfully");
  } catch (e) {
    console.error(e);
    useToast().error("Failed to update order status");
  }
};

const handleEditOrder = () => {
  const router = useRouter();
  router.push(`/orders/edit/${orderId.value}`);
};

const onDeliveryCompleted = () => {
  fetchOrder();
  showDeliveryModal.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
