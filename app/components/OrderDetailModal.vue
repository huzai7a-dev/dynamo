<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div class="fixed inset-0 bg-black/40" @click="close"></div>

      <div class="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-lg">
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

          <UiErrorState v-else-if="error" title="Unable to Load Order"
            message="We couldn't load the order details. This might be due to a network issue or the order might not exist."
            :loading="pending" back-route="/orders" back-text="Back to Orders" @retry="fetchOrder" />

          <div v-else-if="order" class="min-h-[40vh]">
            <!-- Header -->
            <OrderHeader :order_name="order.order_name" :po_number="order.po_number" :status="order.status"
              :updated_at="order.updated_at">
              <template #actions>
                <OrderActions size="compact" :isAdmin="isAdmin" :status="order.status"
                  @approve="updateOrderStatus(OrderStatus.IN_PROGRESS)"
                  @reject="updateOrderStatus(OrderStatus.REJECTED)" @deliver="showDeliveryModal = true"
                  @cancel="updateOrderStatus(OrderStatus.CANCELLED)" @edit="handleEditOrder" />
              </template>
            </OrderHeader>

            <div class="p-8 space-y-8 bg-slate-50/50">
              <!-- Section: Order Information -->
              <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div class="px-6 py-4 bg-primary/5 flex items-center gap-2 border-b border-slate-100">
                  <Icon name="Info" :size="18" class="text-primary" />
                  <h2 class="text-sm font-bold text-primary uppercase tracking-wider">Order Information</h2>
                </div>
                <div class="p-6">
                  <OrderMetaGrid :order="order" />
                </div>
              </div>

              <!-- Section: Attachments -->
              <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div class="px-6 py-4 bg-amber-50 flex items-center gap-2 border-b border-slate-100">
                  <Icon name="Paperclip" :size="18" class="text-amber-600" />
                  <h2 class="text-sm font-bold text-amber-600 uppercase tracking-wider font-sans">Attachments</h2>
                </div>
                <div class="p-6">
                  <AttachmentsGallery noAttachmentsMessage="No order attachments uploaded."
                    :attachments="order.order_attachments || []" />
                </div>
              </div>

              <DeliveryDetails v-if="deliveryData" :deliveryData="deliveryData" />
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Modal inside detail modal -->
      <DeliveryModal v-model="showDeliveryModal" :orderId="String(orderId)" :orderDate="order?.created_at"
        @on:deliver="onDeliveryCompleted" />
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
  router.push(`/orders/edits/${orderId.value}`);
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
