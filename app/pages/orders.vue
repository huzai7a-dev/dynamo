<template>
  <div>
    <DataTable @create-order="showOrderModal = true" />
    <UiModal v-model="showOrderModal">
      <OrderForm @success="onOrderSuccess" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '~/components/DataTable.vue'
import OrderForm from '~/components/OrderForm.vue'
import UiModal from '~/components/ui/Modal.vue'

definePageMeta({
  layout: 'portal',
  middleware: ['auth']
})

const { data: orders, pending, error } = useFetch(`/api/orders`);

const showOrderModal = ref(false)

const onOrderSuccess = () => {
  showOrderModal.value = false
}
</script>