<script setup lang="ts">
import { OrderKeyValue as KeyValue, OrderNotesBox as NotesBox } from "#components";
import type { PaymentStatus } from "#shared/types/enums";
import type { IOrder } from "~~/shared/types";

defineProps<{
  order: IOrder;
}>();
</script>

<template>
  <div class="flex flex-col gap-6 xl:flex-row">
    <div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
      <KeyValue label="PO Number" icon="Tag" :value="order.po_number" />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="order.required_format?.toUpperCase()"
      />
      <KeyValue label="Height" icon="Ruler" :value="`${order.height_in}`" />
      <KeyValue label="Width" icon="Ruler" :value="`${order.width_in}`" />
      <KeyValue label="Fabric" icon="Shirt" :value="order.fabric" />
      <KeyValue label="Placement" icon="MapPin" :value="order.placement" />
      <KeyValue label="Colors" icon="Palette" :value="order.num_colors?.toString()" />
      <KeyValue label="Required Stitch" icon="Sparkles" :value="order.required_stitch" />
      <KeyValue label="Stitches Count" icon="Layers" :value="order.stitches?.toString()" />
      <!-- <KeyValue label="Blending" :value="order.blending" /> -->
      <!-- <KeyValue label="Rush" :value="order.rush" /> -->
      <!-- <KeyValue label="Faceless" :value="order.faceless === null ? '-' : order.faceless ? 'Yes' : 'No'" /> -->

      <KeyValue label="Order Category" icon="Package" :value="order.is_free ? 'Free' : 'Paid'" />
      <KeyValue label="Payment Status" icon="ClipboardList" :value="order.payment_status" />
      <KeyValue
        label="Price"
        icon="CircleDollarSign"
        :value="
          !order?.price || order.price === '0.00'
            ? 'To be quoted'
            : `$${order.price}`
        "
      />
      <KeyValue label="Discount" icon="BadgePercent" :value="order.discount" />
      <KeyValue
        label="Total Price"
        icon="DollarSign"
        :value="
          !order?.total_price || order.total_price === '0.00'
            ? '__'
            : `$${order.total_price}`
        "
      />
      <!-- <KeyValue label="Free Order" :value="order.is_free ? 'Yes' : 'No'" /> -->

      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(order.updated_at).toLocaleString()"
      />
    </div>

    <div class="xl:w-80 xl:shrink-0">
      <NotesBox :value="order.instructions" />
    </div>
  </div>
</template>
