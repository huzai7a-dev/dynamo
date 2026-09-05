<template>
  <div>
    <div v-if="pending" class="py-10">
      <OrderDetailSkeleton />
    </div>

    <UiErrorState
      v-else-if="error"
      :title="config.errorTitle"
      :message="config.errorMessage"
      :loading="pending"
      :back-route="config.backRoute"
      :back-text="config.backText"
      @retry="refresh"
    />

    <div v-else-if="entity" class="min-h-[40vh]">
      <div
        class="bg-slate-50/50"
        :class="compact ? 'p-4 space-y-4' : 'p-8 space-y-8'"
      >
        <!-- Header card — same width/rounding/border as the sections below -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <OrderHeader
            :order_name="entityName"
            :po_number="entity.po_number"
            :status="entity.status"
            :updated_at="entity.updated_at"
            :compact="compact"
          >
            <template #actions>
              <!-- Order / Vector actions -->
              <OrderActions
                v-if="type !== 'quote'"
                :size="compact ? 'compact' : 'default'"
                :isAdmin="isAdmin"
                :status="entity.status"
                @approve="handleApproveOrReject('approve')"
                @reject="handleApproveOrReject('reject')"
                @deliver="showDeliveryModal = true"
                @cancel="handleApproveOrReject('cancel')"
                @edit="handleEdit"
              />
              <!-- Quote actions -->
              <QuoteActions
                v-else
                :size="compact ? 'compact' : 'default'"
                :isAdmin="isAdmin"
                :status="entity.status"
                @accept="handleMoveToOrder"
                @edit="handleEdit"
              />
            </template>
          </OrderHeader>
        </div>

        <!-- Cancellation policy notice -->
        <div
          v-if="type !== 'quote' && entity.status === OrderStatus.PENDING"
          class="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50"
          :class="compact ? 'p-3' : 'p-4'"
        >
          <Icon
            name="Info"
            :size="compact ? 14 : 18"
            class="mt-0.5 shrink-0 text-blue-600"
          />
          <p :class="compact ? 'text-xs' : 'text-sm'" class="text-blue-800">
            You may cancel your {{ type }} while it is pending approval. Once
            the {{ type }} has been approved by the admin, it cannot be
            cancelled.
          </p>
        </div>

        <!-- Section: Information (includes delivery fields when available) -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <div
            class="bg-primary/5 flex items-center gap-2 border-b border-slate-100"
            :class="compact ? 'px-4 py-2.5' : 'px-6 py-4'"
          >
            <Icon name="Info" :size="compact ? 14 : 18" class="text-primary" />
            <h2 class="text-sm font-bold text-primary uppercase tracking-wider">
              {{ config.infoHeading }}
            </h2>
          </div>
          <div :class="compact ? 'p-3 space-y-3' : 'p-6 space-y-6'">
            <!-- Entity meta fields -->
            <OrderMetaGrid
              v-if="type === 'order'"
              :order="{ ...entity, ...deliveryData }"
              :compact="compact"
            />
            <VectorMetaGrid
              v-else-if="type === 'vector'"
              :vector="{ ...entity, ...deliveryData }"
              :compact="compact"
            />
            <QuoteMetaGrid v-else :quote="entity" :compact="compact" />

            <!-- Delivery fields for Order / Vector -->
            <!-- <template v-if="type !== 'quote' && deliveryData">
              <div class="border-t border-slate-100 pt-4">
                <p
                  class="text-xs font-bold text-charcoal/50 uppercase tracking-wider mb-4"
                >
                  Delivery Information
                </p>
                <div
                  class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  <OrderKeyValue
                    label="Stitches"
                    :value="(deliveryData as any).stitches?.toString()"
                  />
                  <OrderKeyValue
                    label="Price"
                    :value="
                      (deliveryData as any).price
                        ? `$${(deliveryData as any).price}`
                        : undefined
                    "
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).discount"
                    label="Discount"
                    :value="`$${(deliveryData as any).discount}`"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).total_price"
                    label="Total Price"
                    :value="`$${(deliveryData as any).total_price}`"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).is_free !== undefined"
                    label="Free Order"
                    :value="(deliveryData as any).is_free ? 'Yes' : 'No'"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).designer_level"
                    label="Designer Level"
                    :value="(deliveryData as any).designer_level"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).height"
                    label="Height"
                    :value="(deliveryData as any).height"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).width"
                    label="Width"
                    :value="(deliveryData as any).width"
                  />
                  <OrderKeyValue
                    v-if="(deliveryData as any).created_at"
                    label="Delivered At"
                    :value="
                      new Date(
                        (deliveryData as any).created_at,
                      ).toLocaleString()
                    "
                  />
                </div>
                <div v-if="(deliveryData as any).comments" class="mt-4">
                  <p
                    class="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2"
                  >
                    Comments
                  </p>
                  <p
                    class="text-sm text-secondary bg-gray-50 rounded-lg p-4 whitespace-pre-wrap"
                  >
                    {{ (deliveryData as any).comments }}
                  </p>
                </div>
              </div>
            </template> -->
          </div>
        </div>

        <!-- Section: Attachments -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <div
            class="bg-amber-50 flex items-center gap-2 border-b border-slate-100"
            :class="compact ? 'px-4 py-2.5' : 'px-6 py-4'"
          >
            <Icon
              name="Paperclip"
              :size="compact ? 14 : 18"
              class="text-amber-600"
            />
            <h2
              class="text-sm font-bold text-amber-600 uppercase tracking-wider font-sans"
            >
              Attachments
            </h2>
          </div>
          <div :class="compact ? 'p-3 space-y-3' : 'p-6 space-y-6'">
            <!-- Entity attachments -->
            <AttachmentsGallery
              :noAttachmentsMessage="config.noAttachmentsMessage"
              :attachments="entityAttachments"
            />

            <!-- Delivery attachments (Order/Vector) -->
            <template v-if="type !== 'quote' && deliveryAttachments.length">
              <div class="border-t border-slate-100 pt-4">
                <p
                  class="text-xs font-bold text-charcoal/50 uppercase tracking-wider mb-4"
                >
                  Delivery Attachments
                </p>
                <AttachmentsGallery
                  noAttachmentsMessage=""
                  :attachments="deliveryAttachments"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery modal: Order / Vector -->
    <DeliveryModal
      v-if="type !== 'quote'"
      v-model="showDeliveryModal"
      :orderId="entityId ? String(entityId) : ''"
      :orderDate="entity?.created_at || ''"
      :userId="entity?.user_id"
      :loading="delivering"
      @on:deliver="handleDeliveryComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Icon from "./Icon.vue";
import OrderHeader from "./OrderHeader.vue";
import OrderMetaGrid from "./OrderMetaGrid.vue";
import VectorMetaGrid from "./VectorMetaGrid.vue";
import QuoteMetaGrid from "./QuoteMetaGrid.vue";
import AttachmentsGallery from "./AttachmentsGallery.vue";
import OrderActions from "./OrderActions.vue";
import QuoteActions from "./QuoteActions.vue";
import DeliveryModal from "./DeliveryModal.vue";
import OrderDetailSkeleton from "./skeletons/OrderDetailSkeleton.vue";
import { ROLE } from "~~/shared/constants";
import { OrderStatus, QuoteStatus } from "~~/shared/types/enums";

type EntityType = "order" | "vector" | "quote";

const props = withDefaults(
  defineProps<{
    type: EntityType;
    entityId?: string | number;
    // When used inside the modal, fetching is triggered by the parent via watch on open.
    // When used on a page, we fetch immediately on mount.
    immediate?: boolean;
    // Shrinks spacing/padding/text sizes for use inside a small modal (EntityDetailModal).
    compact?: boolean;
  }>(),
  {
    entityId: "",
    immediate: true,
    compact: false,
  },
);

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const entityId = computed(() => props.entityId);

// ─── Per-type static config ────────────────────────────────────────────────
const config = computed(() => {
  switch (props.type) {
    case "order":
      return {
        infoHeading: "Order Information",
        errorTitle: "Unable to Load Order",
        errorMessage:
          "We couldn't load the order details. This might be due to a network issue or the order might not exist.",
        backRoute: "/orders",
        backText: "Back to Orders",
        noAttachmentsMessage: "No order attachments uploaded.",
        apiBase: "/api/orders",
        deliveryBase: "/api/orders/deliver",
      };
    case "vector":
      return {
        infoHeading: "Vector Information",
        errorTitle: "Unable to Load Vector",
        errorMessage:
          "We couldn't load the vector details. This might be due to a network issue or the vector might not exist.",
        backRoute: "/vectors",
        backText: "Back to Vectors",
        noAttachmentsMessage: "No vector attachments uploaded.",
        apiBase: "/api/vectors",
        deliveryBase: "/api/vectors/deliver",
      };
    case "quote":
    default:
      return {
        infoHeading: "Quote Information",
        errorTitle: "Unable to Load Quote",
        errorMessage:
          "We couldn't load the quote details. This might be due to a network issue or the quote might not exist.",
        backRoute: "/quotes",
        backText: "Back to Quotes",
        noAttachmentsMessage: "No quote attachments uploaded.",
        apiBase: "/api/quotes",
        deliveryBase: "",
      };
  }
});

// ─── Data fetching ─────────────────────────────────────────────────────────
const {
  data,
  pending,
  error,
  execute: fetchEntity,
} = useFetch<any>(
  () => (entityId.value ? `${config.value.apiBase}/${entityId.value}` : ""),
  { immediate: props.immediate, watch: [entityId] },
);

// Derived early so the deliveryResp URL factory can safely reference it
const entity = computed(() => (data.value as any)?.data);

const { data: deliveryResp, execute: fetchDelivery } = useFetch<any>(
  () => {
    if (!entityId.value || props.type === "quote") return "";
    return `${config.value.deliveryBase}/${entityId.value}`;
  },
  { immediate: props.immediate, watch: [entityId, data] },
);

const refresh = () => {
  fetchEntity();
  fetchDelivery();
};

// Expose refresh so EntityDetailModal can call it when opening
defineExpose({ refresh });

// ─── Derived entity & attachments (continued) ──────────────────────────────

const entityName = computed(() => {
  if (!entity.value) return "";
  if (props.type === "order") return entity.value.order_name;
  if (props.type === "vector") return entity.value.vector_name;
  return entity.value.title; // quote
});

const entityAttachments = computed(() => {
  if (!entity.value) return [];
  if (props.type === "order") return entity.value.order_attachments || [];
  if (props.type === "vector") return entity.value.vector_attachments || [];
  return entity.value.quote_attachments || [];
});

// Order/Vector: deliveryResp.value is the delivery record directly
const deliveryData = computed(() => deliveryResp.value);

// Order/Vector: prefer the delivery-record's attachments, but fall back to the
// entity's own `delivery_attachments` (populated even without an order_deliveries/
// vector_deliveries row — e.g. quote-converted orders/vectors that inherited
// delivery attachments from the original quote).
const deliveryAttachments = computed(() => {
  const fromDelivery = (deliveryData.value as any)?.delivery_attachments;
  if (fromDelivery?.length) return fromDelivery;
  return entity.value?.delivery_attachments || [];
});

// ─── Auth ──────────────────────────────────────────────────────────────────
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

// ─── Action modal state ────────────────────────────────────────────────────
const showDeliveryModal = ref(false);
const delivering = ref(false);
const toast = useToast();
const router = useRouter();

const orderVectorActions = useOrderVectorActions(
  computed(() => (props.type === "vector" ? "vector" : "order")),
);
const quoteActions = useQuoteActions();

// ─── Order / Vector actions ────────────────────────────────────────────────
const handleApproveOrReject = async (
  action: "approve" | "reject" | "cancel",
) => {
  const success = await orderVectorActions.updateStatus(entityId.value, action);
  if (success) {
    refresh();
    emit("refresh");
  }
};

const handleEdit = () => {
  if (props.type === "order") {
    router.push(`/orders/edits/${entityId.value}`);
  } else if (props.type === "vector") {
    navigateTo(`/vectors/edit/${entityId.value}`);
  } else {
    if (entity.value?.status === QuoteStatus.PROCEED) return;
    router.push(`/quotes/edit/${entityId.value}?type=${entity.value?.q_type}`);
  }
};

// Order/Vector delivery completed
const handleDeliveryComplete = async (formData: any) => {
  delivering.value = true;
  try {
    const success = await orderVectorActions.deliver(entityId.value, formData);
    if (success) {
      refresh();
      emit("refresh");
      showDeliveryModal.value = false;
    }
  } finally {
    delivering.value = false;
  }
};

// ─── Quote-specific actions ────────────────────────────────────────────────
const handleMoveToOrder = async () => {
  const success = await quoteActions.moveToOrder(
    entityId.value,
    entity.value?.q_type,
  );
  if (success) {
    refresh();
    emit("refresh");
  }
};
</script>
