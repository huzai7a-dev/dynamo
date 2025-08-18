<script setup lang="ts">
import { OrderKeyValue as KeyValue } from '#components';


const props = defineProps<{
  order: {
    order_name: string
    po_number: string
    required_format: string
    width_in: string
    height_in: string
    fabric: string
    placement: string
    num_colors: number
    blending: string
    rush: string
    payment_status: string
    price: string
    faceless: boolean | null
    created_at: string
    updated_at: string
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <KeyValue label="PO Number"         :value="order.po_number" />
    <KeyValue label="Required Format"   :value="order.required_format?.toUpperCase()" />
    <KeyValue label="Dimensions (in)"   :value="`${order.width_in} × ${order.height_in}`" />
    <KeyValue label="Fabric"            :value="order.fabric" />
    <KeyValue label="Placement"         :value="order.placement" />
    <KeyValue label="# Colors"          :value="order.num_colors?.toString()" />
    <KeyValue label="Blending"          :value="order.blending" />
    <KeyValue label="Rush"              :value="order.rush" />
    <KeyValue label="Payment Status"    :value="order.payment_status" />
    <KeyValue label="Price"             :value="order.price === '0.00' ? 'To be quoted' : `$${order.price}`" />
    <KeyValue label="Faceless"          :value="order.faceless === null ? 'N/A' : (order.faceless ? 'Yes' : 'No')" />
    <KeyValue label="Last Updated"      :value="new Date(order.updated_at).toLocaleString()" />
  </div>
</template>
