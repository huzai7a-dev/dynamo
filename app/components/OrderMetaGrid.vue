<script setup lang="ts">
import { OrderKeyValue as KeyValue } from "#components";
import type { PaymentStatus } from "#shared/types/enums";
import type { IOrder } from "~~/shared/types";

defineProps<{
  order: IOrder;
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <KeyValue label="PO Number" :value="order.po_number" />
    <KeyValue
      label="Required Format"
      :value="order.required_format?.toUpperCase()"
    />
    <KeyValue label="Height" :value="`${order.height_in}`" />
    <KeyValue label="Width" :value="`${order.width_in}`" />
    <KeyValue label="Fabric" :value="order.fabric" />
    <KeyValue label="Placement" :value="order.placement" />
    <KeyValue label="Colors" :value="order.num_colors?.toString()" />
    <KeyValue label="Required Stitch" :value="order.required_stitch" />
    <KeyValue label="Stitches Count" :value="order.stitches?.toString()" />
    <!-- <KeyValue label="Blending" :value="order.blending" /> -->
    <!-- <KeyValue label="Rush" :value="order.rush" /> -->
    <!-- <KeyValue label="Faceless" :value="order.faceless === null ? '-' : order.faceless ? 'Yes' : 'No'" /> -->

    <KeyValue label="Order Category" :value="order.is_free ? 'Free' : 'Paid'" />
    <KeyValue label="Payment Status" :value="order.payment_status" />
    <KeyValue
      label="Price"
      :value="
        !order?.price || order.price === '0.00'
          ? 'To be quoted'
          : `$${order.price}`
      "
    />
    <KeyValue label="Discount" :value="order.discount" />
    <KeyValue
      label="Total Price"
      :value="
        !order?.total_price || order.total_price === '0.00'
          ? '__'
          : `$${order.total_price}`
      "
    />
    <!-- <KeyValue label="Free Order" :value="order.is_free ? 'Yes' : 'No'" /> -->

    <KeyValue
      label="Last Updated"
      :value="new Date(order.updated_at).toLocaleString()"
    />

    <KeyValue
      class="sm:col-span-2 xl:col-span-3"
      label="Instructions"
      :value="order.instructions"
    />
  </div>
</template>
