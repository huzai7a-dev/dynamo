<script setup lang="ts">
import { OrderKeyValue as KeyValue } from "#components";

defineProps<{
  vector: IVector;
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <KeyValue label="PO Number" :value="vector.po_number" />
    <KeyValue label="Vector Type" :value="vector.vector_type" />
    <KeyValue
      label="Required Format"
      :value="vector.required_format?.toUpperCase()"
    />
    <KeyValue label="Colors" :value="vector.num_colors?.toString()" />
    <KeyValue label="Stitches" :value="vector.stitches" />
    <!-- <KeyValue label="Blending" :value="vector.blending" /> -->
    <!-- <KeyValue label="Rush" :value="vector.rush" /> -->

    <KeyValue
      label="Order Category"
      :value="vector.is_free ? 'Free' : 'Paid'"
    />
    <KeyValue label="Payment Status" :value="vector.payment_status" />
    <KeyValue
      label="Price"
      :value="
        !vector?.price || vector.price === '0.00'
          ? 'To be quoted'
          : `$${vector.price}`
      "
    />
    <KeyValue label="Discount" :value="vector.discount" />
    <KeyValue
      label="Total Price"
      :value="
        !vector?.total_price || vector.total_price === '0.00'
          ? '__'
          : `$${vector.total_price}`
      "
    />
    <KeyValue
      label="Last Updated"
      :value="new Date(vector.updated_at).toLocaleString()"
    />

    <KeyValue
      class="sm:col-span-2 xl:col-span-3"
      label="Instructions"
      :value="vector.instructions"
    />
  </div>
</template>
