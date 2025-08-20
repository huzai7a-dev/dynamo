<template>
  <UiModal v-model="isOpen" class="max-w-2xl">
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="Package" class="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Deliver Order</h2>
          <p class="text-gray-600 mt-2">Complete the delivery by providing the final estimate and deliverables</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Estimate Amount -->
        <div class="space-y-2">
          <UiInput v-model="formData.estimateAmount" label="Final Estimate Amount" placeholder="0.00" type="number"
            step="0.01" min="0" required helper-text="Enter the final cost for this order" />
        </div>

        <!-- File Upload -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="Upload" class="w-5 h-5 text-gray-600" />
            <label class="text-sm font-medium text-gray-700">
              Delivery Files
              <span class="text-red-500 text-lg ml-0.5">*</span>
            </label>
          </div>
          <p class="text-xs text-gray-500">
            Upload the final deliverables (designs, proofs, vector files, etc.)
          </p>
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50">
            <UiFileUploader v-model:files="formData.files" :multiple="true"
              accept="image/*,.pdf,.ai,.eps,.svg,.zip,.rar" :max-files="10" />
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <UiInput v-model="formData.notes" label="Delivery Notes"
            placeholder="Add any additional notes about the delivery..." type="text"
            helper-text="Optional notes about the delivery or special instructions" />
        </div>

        <!-- Summary -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="Info" class="w-5 h-5 text-blue-600" />
            <h4 class="font-medium text-blue-900">Delivery Summary</h4>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-blue-700">Estimate Amount:</span>
              <span class="font-medium text-blue-900">
                {{ formData.estimateAmount ? `$${formData.estimateAmount}` : 'Not set' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Files Uploaded:</span>
              <span class="font-medium text-blue-900">
                {{ formData.files.length }} file{{ formData.files.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Notes:</span>
              <span class="font-medium text-blue-900">
                {{ formData.notes ? 'Added' : 'None' }}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div class="flex gap-3 w-full">
        <UiButton variant="danger" size="lg" @click="handleCancel" :disabled="loading" class="flex-1" rounded>
          <Icon name="X" class="w-4 h-4" />
          Cancel
        </UiButton>
        <UiButton variant="primary" size="lg" :loading="loading" :disabled="!isFormValid" @click="handleSubmit"
          class="flex-1" rounded>
          <Icon name="Check" class="w-4 h-4" />
          Complete Delivery
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface DeliveryFormData {
  estimateAmount: string
  files: File[]
  notes: string
}

interface Props {
  modelValue: boolean
  orderId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'on:deliver': [data: { orderId: string; estimateAmount: string; files: File[]; notes: string }]
}>()

const loading = ref(false)

const formData = ref<DeliveryFormData>({
  estimateAmount: '',
  files: [],
  notes: ''
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  return formData.value.estimateAmount !== '' &&
    parseFloat(formData.value.estimateAmount) > 0 &&
    formData.value.files.length > 0
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true

  try {
    emit('on:deliver', {
      orderId: props.orderId,
      estimateAmount: formData.value.estimateAmount,
      files: formData.value.files,
      notes: formData.value.notes
    })

    // Reset form
    formData.value = {
      estimateAmount: '',
      files: [],
      notes: ''
    }

    isOpen.value = false
  } catch (error) {
    console.error('Error submitting delivery:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  // Reset form
  formData.value = {
    estimateAmount: '',
    files: [],
    notes: ''
  }
  isOpen.value = false
}
</script>
