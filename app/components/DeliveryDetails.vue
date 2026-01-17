<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-secondary">
      Delivery Details
    </h2>
    
    <!-- Basic Information -->
    <div class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Basic Information
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrderKeyValue label="Stitches" :value="deliveryData.stitches?.toString()" />
        <OrderKeyValue label="Price" :value="deliveryData.price ? `$${deliveryData.price}` : undefined" />
        <OrderKeyValue 
          v-if="deliveryData.discount" 
          label="Discount" 
          :value="deliveryData.discount ? `$${deliveryData.discount}` : undefined" 
        />
        <OrderKeyValue 
          v-if="deliveryData.total_price" 
          label="Total Price" 
          :value="deliveryData.total_price ? `$${deliveryData.total_price}` : undefined" 
        />
        <OrderKeyValue 
          v-if="deliveryData.is_free !== undefined" 
          label="Free Order" 
          :value="deliveryData.is_free ? 'Yes' : 'No'" 
        />
        <OrderKeyValue 
          v-if="deliveryData.designer_level" 
          label="Designer Level" 
          :value="deliveryData.designer_level" 
        />
        <OrderKeyValue 
          v-if="deliveryData.assign_percentage" 
          label="Assign Percentage" 
          :value="deliveryData.assign_percentage ? `${deliveryData.assign_percentage}%` : undefined" 
        />
      </div>
    </div>

    <!-- Dimensions -->
    <div v-if="deliveryData.height || deliveryData.width" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Dimensions
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrderKeyValue 
          v-if="deliveryData.height" 
          label="Height" 
          :value="deliveryData.height" 
        />
        <OrderKeyValue 
          v-if="deliveryData.width" 
          label="Width" 
          :value="deliveryData.width" 
        />
        <OrderKeyValue 
          v-if="deliveryData.height && deliveryData.width" 
          label="Dimensions" 
          :value="`${deliveryData.width} × ${deliveryData.height}`" 
        />
      </div>
    </div>

    <!-- Price Criteria -->
    <div v-if="deliveryData.price_criteria" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Price Criteria
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrderKeyValue 
          v-if="deliveryData.price_criteria.minimum_price" 
          label="Minimum Price" 
          :value="`$${deliveryData.price_criteria.minimum_price}`" 
        />
        <OrderKeyValue 
          v-if="deliveryData.price_criteria.maximum_price" 
          label="Maximum Price" 
          :value="`$${deliveryData.price_criteria.maximum_price}`" 
        />
        <OrderKeyValue 
          v-if="deliveryData.price_criteria.thousand_stitches" 
          label="1000 Stitches" 
          :value="`$${deliveryData.price_criteria.thousand_stitches}`" 
        />
      </div>
    </div>

    <!-- Customer Requirements -->
    <div v-if="deliveryData.customer_requirement" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Customer Requirements
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrderKeyValue 
          v-if="deliveryData.customer_requirement.normal_delivery" 
          label="Normal Delivery" 
          :value="deliveryData.customer_requirement.normal_delivery" 
        />
        <OrderKeyValue 
          v-if="deliveryData.customer_requirement.edit_or_change" 
          label="Edit or Change" 
          :value="deliveryData.customer_requirement.edit_or_change" 
        />
        <OrderKeyValue 
          v-if="deliveryData.customer_requirement.edit_in_stitch_file" 
          label="Edit in Stitch File" 
          :value="deliveryData.customer_requirement.edit_in_stitch_file" 
        />
      </div>
    </div>

    <!-- Comments -->
    <div v-if="deliveryData.comments" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Main Comments
      </h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm text-secondary whitespace-pre-wrap">{{ deliveryData.comments }}</p>
      </div>
    </div>

    <!-- Additional Comments -->
    <div v-if="hasAdditionalComments" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Additional Comments
      </h3>
      <div class="space-y-4">
        <div v-if="deliveryData.customer_requirement?.comment_box_1" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-xs font-medium text-charcoal/70 uppercase tracking-wide mb-2">Comment Box 1</h4>
          <p class="text-sm text-secondary whitespace-pre-wrap">{{ deliveryData.customer_requirement.comment_box_1 }}</p>
        </div>
        <div v-if="deliveryData.customer_requirement?.comment_box_2" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-xs font-medium text-charcoal/70 uppercase tracking-wide mb-2">Comment Box 2</h4>
          <p class="text-sm text-secondary whitespace-pre-wrap">{{ deliveryData.customer_requirement.comment_box_2 }}</p>
        </div>
        <div v-if="deliveryData.customer_requirement?.comment_box_3" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-xs font-medium text-charcoal/70 uppercase tracking-wide mb-2">Comment Box 3</h4>
          <p class="text-sm text-secondary whitespace-pre-wrap">{{ deliveryData.customer_requirement.comment_box_3 }}</p>
        </div>
        <div v-if="deliveryData.customer_requirement?.comment_box_4" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-xs font-medium text-charcoal/70 uppercase tracking-wide mb-2">Comment Box 4</h4>
          <p class="text-sm text-secondary whitespace-pre-wrap">{{ deliveryData.customer_requirement.comment_box_4 }}</p>
        </div>
      </div>
    </div>

    <!-- Delivery Attachments -->
    <div v-if="deliveryData.delivery_attachments && deliveryData.delivery_attachments.length > 0" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Delivery Attachments
      </h3>
      <AttachmentsGallery
        :attachments="deliveryData.delivery_attachments"
        noAttachmentsMessage="No delivery attachments available."
      />
    </div>

    <!-- Delivery Date -->
    <div v-if="deliveryData.created_at" class="mb-6">
      <h3 class="mb-3 text-sm font-medium text-charcoal/70 uppercase tracking-wide">
        Delivery Information
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OrderKeyValue 
          label="Delivered At" 
          :value="new Date(deliveryData.created_at).toLocaleString()" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderDelivery, VectorDelivery } from "~~/shared/types";

const props = defineProps<{
  deliveryData: OrderDelivery | VectorDelivery
}>()

// Computed property to check if there are any additional comments
const hasAdditionalComments = computed(() => {
  const req = props.deliveryData.customer_requirement;
  return req?.comment_box_1 || req?.comment_box_2 || req?.comment_box_3 || req?.comment_box_4;
})
</script>
