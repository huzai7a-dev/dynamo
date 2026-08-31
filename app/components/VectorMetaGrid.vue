<script setup lang="ts">
import { OrderKeyValue as KeyValue, OrderNotesBox as NotesBox } from "#components";

defineProps<{
  vector: IVector;
}>();
</script>

<template>
  <div class="flex flex-col gap-6 xl:flex-row">
    <div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
      <KeyValue label="PO Number" icon="Tag" :value="vector.po_number" />
      <KeyValue label="Vector Type" icon="Shapes" :value="vector.vector_type" />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="vector.required_format?.toUpperCase()"
      />
      <KeyValue label="Colors" icon="Palette" :value="vector.num_colors?.toString()" />
      <KeyValue label="Stitches" icon="Sparkles" :value="vector.stitches" />
      <!-- <KeyValue label="Blending" :value="vector.blending" /> -->
      <!-- <KeyValue label="Rush" :value="vector.rush" /> -->

      <KeyValue
        label="Order Category"
        icon="Package"
        :value="vector.is_free ? 'Free' : 'Paid'"
      />
      <KeyValue label="Payment Status" icon="ClipboardList" :value="vector.payment_status" />
      <KeyValue
        label="Price"
        icon="CircleDollarSign"
        :value="
          !vector?.price || vector.price === '0.00'
            ? 'To be quoted'
            : `$${vector.price}`
        "
      />
      <KeyValue label="Discount" icon="BadgePercent" :value="vector.discount" />
      <KeyValue
        label="Total Price"
        icon="DollarSign"
        :value="
          !vector?.total_price || vector.total_price === '0.00'
            ? '__'
            : `$${vector.total_price}`
        "
      />
      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(vector.updated_at).toLocaleString()"
      />
    </div>

    <div class="xl:w-80 xl:shrink-0">
      <NotesBox :value="vector.instructions" />
    </div>
  </div>
</template>
