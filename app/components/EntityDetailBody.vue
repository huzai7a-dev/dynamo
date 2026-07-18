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
      <div class="p-8 space-y-8 bg-slate-50/50">
        <!-- Header card — same width/rounding/border as the sections below -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <OrderHeader
            :order_name="entityName"
            :po_number="entity.po_number"
            :status="entity.status"
            :updated_at="entity.updated_at"
          >
            <template #actions>
              <!-- Order / Vector actions -->
              <OrderActions
                v-if="type !== 'quote'"
                size="default"
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
                size="default"
                :isAdmin="isAdmin"
                :status="entity.status"
                @accept="handleMoveToOrder"
                @edit="handleEdit"
              />
            </template>
          </OrderHeader>
        </div>

        <!-- Section: Information (includes delivery fields when available) -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <div
            class="px-6 py-4 bg-primary/5 flex items-center gap-2 border-b border-slate-100"
          >
            <Icon name="Info" :size="18" class="text-primary" />
            <h2 class="text-sm font-bold text-primary uppercase tracking-wider">
              {{ config.infoHeading }}
            </h2>
          </div>
          <div class="p-6 space-y-6">
            <!-- Entity meta fields -->
            <OrderMetaGrid v-if="type === 'order'" :order="entity" />
            <VectorMetaGrid v-else-if="type === 'vector'" :vector="entity" />
            <QuoteMetaGrid v-else :quote="entity" />

            <!-- Delivery fields for Order / Vector -->
            <template v-if="type !== 'quote' && deliveryData">
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
                <!-- Comments -->
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
            </template>

          </div>
        </div>

        <!-- Section: Attachments -->
        <div
          class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <div
            class="px-6 py-4 bg-amber-50 flex items-center gap-2 border-b border-slate-100"
          >
            <Icon name="Paperclip" :size="18" class="text-amber-600" />
            <h2
              class="text-sm font-bold text-amber-600 uppercase tracking-wider font-sans"
            >
              Attachments
            </h2>
          </div>
          <div class="p-6 space-y-6">
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
import { OrderStatus } from "~~/shared/types/enums";

type EntityType = "order" | "vector" | "quote";

const props = withDefaults(
  defineProps<{
    type: EntityType;
    entityId?: string | number;
    // When used inside the modal, fetching is triggered by the parent via watch on open.
    // When used on a page, we fetch immediately on mount.
    immediate?: boolean;
  }>(),
  {
    entityId: "",
    immediate: true,
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

// ─── Order / Vector actions ────────────────────────────────────────────────
const handleApproveOrReject = async (
  action: "approve" | "reject" | "cancel",
) => {
  const statusMap: Record<string, OrderStatus> = {
    approve: OrderStatus.IN_PROGRESS,
    reject: OrderStatus.REJECTED,
    cancel: OrderStatus.CANCELLED,
  };
  const apiIdKey = props.type === "order" ? "orderId" : "vectorId";
  try {
    await $fetch(`${config.value.apiBase}/status`, {
      method: "POST",
      body: { [apiIdKey]: entityId.value, status: statusMap[action] },
    });
    toast.success(
      `${props.type.charAt(0).toUpperCase() + props.type.slice(1)} status updated successfully`,
    );
    refresh();
    emit("refresh");
  } catch (e) {
    console.error(e);
    toast.error(`Failed to update ${props.type} status`);
  }
};

const handleEdit = () => {
  if (props.type === "order") {
    router.push(`/orders/edits/${entityId.value}`);
  } else if (props.type === "vector") {
    navigateTo(`/vectors/edit/${entityId.value}`);
  } else {
    router.push(`/quotes/edit/${entityId.value}?type=${entity.value?.q_type}`);
  }
};

// Order/Vector delivery completed
const handleDeliveryComplete = async (formData: any) => {
  delivering.value = true;
  try {
    const fd = new FormData();
    fd.append(
      props.type === "vector" ? "vectorId" : "orderId",
      String(entityId.value),
    );
    fd.append("stitches", formData.stitches);
    fd.append("price", formData.price);
    if (formData.discount) fd.append("discount", formData.discount);
    if (formData.total_price) fd.append("total_price", formData.total_price);
    if (formData.order_category)
      fd.append("order_category", formData.order_category);
    if (formData.height) fd.append("height", formData.height);
    if (formData.width) fd.append("width", formData.width);
    if (formData.comments) fd.append("comments", formData.comments);
    if (formData.designer_level)
      fd.append("designer_level", formData.designer_level);
    if (formData.assign_percentage)
      fd.append("assign_percentage", formData.assign_percentage);
    if (formData.minimum_price)
      fd.append("minimum_price", formData.minimum_price);
    if (formData.maximum_price)
      fd.append("maximum_price", formData.maximum_price);
    if (formData.thousand_stitches)
      fd.append("thousand_stitches", formData.thousand_stitches);
    if (formData.normal_delivery)
      fd.append("normal_delivery", formData.normal_delivery);
    if (formData.edit_or_change)
      fd.append("edit_or_change", formData.edit_or_change);
    if (formData.edit_in_stitch_file)
      fd.append("edit_in_stitch_file", formData.edit_in_stitch_file);
    (formData.attachments || []).forEach((f: File) =>
      fd.append("attachments", f),
    );

    const endpoint =
      props.type === "vector" ? "/api/vectors/deliver" : "/api/orders/deliver";
    await $fetch(endpoint, { method: "POST", body: fd });

    toast.success(
      `${props.type === "vector" ? "Vector" : "Order"} delivered successfully`,
    );
    refresh();
    emit("refresh");
    showDeliveryModal.value = false;
  } catch (e) {
    console.error(e);
    toast.error(`Failed to deliver ${props.type}`);
  } finally {
    delivering.value = false;
  }
};

// ─── Quote-specific actions ────────────────────────────────────────────────
const handleMoveToOrder = async () => {
  try {
    await $fetch("/api/quotes/move-to-order", {
      method: "POST",
      body: { quoteId: entityId.value, dataSourceType: entity.value?.q_type },
    });
    toast.success("Quote moved to order successfully");
    refresh();
    emit("refresh");
  } catch (e) {
    console.error(e);
    toast.error("Failed to move quote to order");
  }
};
</script>
