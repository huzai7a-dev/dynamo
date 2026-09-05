<script setup lang="ts">
import {
  OrderKeyValue as KeyValue,
  OrderNotesBox as NotesBox,
} from "#components";
import { isOrderProcessingOrPending } from "~/utils/orderUtils";

withDefaults(
  defineProps<{
    vector: IVector;
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
        :value="vector.po_number"
        :compact="compact"
      />
      <KeyValue
        label="Vector Type"
        icon="Shapes"
        :value="vector.vector_type"
        :compact="compact"
      />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="vector.required_format?.toUpperCase()"
        :compact="compact"
      />
      <KeyValue
        label="Colors"
        icon="Palette"
        :value="vector.num_colors?.toString()"
        :compact="compact"
      />
      <KeyValue
        label="Stitches"
        icon="Sparkles"
        :value="vector.stitches"
        :compact="compact"
      />
      <!-- <KeyValue label="Blending" :value="vector.blending" /> -->
      <!-- <KeyValue label="Rush" :value="vector.rush" /> -->

      <KeyValue
        label="Order Category"
        icon="Package"
        :value="vector.is_free ? 'Free' : 'Paid'"
        :compact="compact"
      />
      <KeyValue
        label="Payment Status"
        icon="ClipboardList"
        :value="
          isOrderProcessingOrPending(vector.status)
            ? '-'
            : vector.payment_status
        "
        :compact="compact"
      />
      <KeyValue
        label="Price"
        icon="CircleDollarSign"
        :value="
          isOrderProcessingOrPending(vector.status)
            ? '-'
            : !vector?.price || vector.price === '0.00'
              ? 'To be quoted'
              : `$${vector.price}`
        "
        :compact="compact"
      />
      <KeyValue
        label="Discount"
        icon="BadgePercent"
        :value="vector.discount"
        :compact="compact"
      />
      <KeyValue
        label="Total Price"
        icon="DollarSign"
        :value="
          !vector?.total_price || vector.total_price === '0.00'
            ? '__'
            : `$${vector.total_price}`
        "
        :compact="compact"
      />
      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(vector.updated_at).toLocaleString()"
        :compact="compact"
      />
    </div>

    <div :class="compact ? 'xl:w-64' : 'xl:w-80'" class="xl:shrink-0">
      <NotesBox :value="vector.instructions" :compact="compact" />
    </div>
  </div>
</template>
