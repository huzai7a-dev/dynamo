<script setup lang="ts">
import {
  OrderKeyValue as KeyValue,
  OrderNotesBox as NotesBox,
} from "#components";
import type { PaymentStatus } from "#shared/types/enums";
import type { IOrder } from "~~/shared/types";
import { isOrderProcessingOrPending } from "~/utils/orderUtils";

const props = withDefaults(
  defineProps<{
    order: IOrder;
    compact?: boolean;
  }>(),
  { compact: false },
);
</script>

<template>
  <div class="flex flex-col xl:flex-row" :class="compact ? 'gap-3' : 'gap-6'">
    <div
      class="grid flex-1 grid-cols-1"
      :class="compact ? 'gap-2 sm:grid-cols-3' : 'gap-4 sm:grid-cols-2'"
    >
      <KeyValue
        label="PO Number"
        icon="Tag"
        :value="order.po_number"
        :compact="compact"
      />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="order.required_format?.toUpperCase()"
        :compact="compact"
      />
      <KeyValue
        label="Height"
        icon="Ruler"
        :value="`${order.height_in}`"
        :compact="compact"
      />
      <KeyValue
        label="Width"
        icon="Ruler"
        :value="`${order.width_in}`"
        :compact="compact"
      />
      <KeyValue
        label="Fabric"
        icon="Shirt"
        :value="order.fabric"
        :compact="compact"
      />
      <KeyValue
        label="Placement"
        icon="MapPin"
        :value="order.placement"
        :compact="compact"
      />
      <KeyValue
        label="Colors"
        icon="Palette"
        :value="order.num_colors?.toString()"
        :compact="compact"
      />
      <KeyValue
        label="Required Stitch"
        icon="Sparkles"
        :value="order.required_stitch"
        :compact="compact"
      />
      <KeyValue
        label="Stitches Count"
        icon="Layers"
        :value="order.stitches?.toString()"
        :compact="compact"
      />
      <!-- <KeyValue label="Blending" :value="order.blending" /> -->
      <!-- <KeyValue label="Rush" :value="order.rush" /> -->
      <!-- <KeyValue label="Faceless" :value="order.faceless === null ? '-' : order.faceless ? 'Yes' : 'No'" /> -->

      <KeyValue
        label="Order Category"
        icon="Package"
        :value="order.is_free ? 'Free' : 'Paid'"
        :compact="compact"
      />
      <KeyValue
        label="Payment Status"
        icon="ClipboardList"
        class="capitalize"
        :value="
          isOrderProcessingOrPending(order.status) ? '-' : order.payment_status
        "
        :compact="compact"
      />
      <KeyValue
        label="Price"
        icon="CircleDollarSign"
        :value="
          isOrderProcessingOrPending(order.status)
            ? '-'
            : !order?.price || order.price === '0.00'
              ? 'To be quoted'
              : `$${order.price}`
        "
        :compact="compact"
      />
      <KeyValue
        label="Discount"
        icon="BadgePercent"
        :value="order.discount"
        :compact="compact"
      />
      <KeyValue
        label="Total Price"
        icon="DollarSign"
        :value="
          !order?.total_price || order.total_price === '0.00'
            ? '__'
            : `$${order.total_price}`
        "
        :compact="compact"
      />
      <!-- <KeyValue label="Free Order" :value="order.is_free ? 'Yes' : 'No'" /> -->

      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(order.updated_at).toLocaleString()"
        :compact="compact"
      />
    </div>

    <div :class="compact ? 'xl:w-64' : 'xl:w-80'" class="xl:shrink-0">
      <NotesBox :value="order.instructions" :compact="compact" />
    </div>
  </div>
</template>
