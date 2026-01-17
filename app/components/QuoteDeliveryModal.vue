<template>
    <UiModal v-model="isOpen">
        <div class="space-y-6">
            <!-- Header -->
            <div class="text-center space-y-3">
                <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="Package" class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Deliver Quote Order</h2>
                    <p class="text-sm text-gray-500 mt-1">Fill in the delivery details below</p>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Details Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <Icon name="FileText" class="w-5 h-5 text-blue-600" />
                        <h3 class="text-lg font-semibold text-gray-900">Delivery Details</h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UiInput v-model="formData.stitchCount" label="Stitch Count" placeholder="Enter stitch count"
                            type="text" required />
                        <UiInput v-model="formData.price" label="Price" placeholder="0.00" type="number" step="0.01"
                            min="0" required />
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <UiInput v-model="formData.turnAroundTime" label="Turn Around Time"
                            placeholder="e.g., 2-3 business days" type="text" required />
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <UiTextarea v-model="formData.additionalQuery" label="Additional Query"
                            placeholder="Enter any additional queries or notes" :rows="3" />
                    </div>
                </div>

                <!-- File Upload Section -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <Icon name="File" class="w-5 h-5 text-indigo-600" />
                        <h3 class="text-lg font-semibold text-gray-900">Attachments</h3>
                    </div>

                    <div class="space-y-3">
                        <p class="text-sm text-gray-600">
                            Upload the final deliverables (designs, proofs, files, etc.)
                        </p>
                        <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50/50">
                            <UiFileUploader v-model:files="formData.attachments" :multiple="true"
                                accept="image/*,.pdf,.ai,.eps,.svg,.zip,.rar" :max-files="10" />
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
                    <Icon name="Package" class="w-4 h-4" />
                    Submit Delivery
                </UiButton>
            </div>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface QuoteDeliveryFormData {
    stitchCount: string
    turnAroundTime: string
    price: string
    additionalQuery: string
    attachments: File[]
}

interface Props {
    modelValue: boolean
    quoteId: string
    initialValues?: Partial<QuoteDeliveryFormData>
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'on:deliver': [data: QuoteDeliveryFormData]
}>()

const loading = ref(false)

const initialFormData: QuoteDeliveryFormData = {
    stitchCount: '',
    turnAroundTime: '',
    price: '',
    additionalQuery: '',
    attachments: []
}

const formData = ref<QuoteDeliveryFormData>({ ...initialFormData })

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

watch(() => props.modelValue, (isOpen) => {
    if (isOpen && props.initialValues) {
        formData.value = {
            ...initialFormData,
            ...props.initialValues,
            // Ensure we don't overwrite attachments with undefined if not passed
            attachments: []
        }
    } else if (!isOpen) {
        // Reset Logic handled in handleCancel/submit usually, but good to ensure
    }
})

const isFormValid = computed(() => {
    return formData.value.stitchCount !== '' &&
        formData.value.turnAroundTime.trim() !== '' &&
        parseFloat(formData.value.price) > 0
})

const handleSubmit = async () => {
    if (!isFormValid.value) return

    loading.value = true

    try {
        // Create FormData object
        const deliveryFormData = new FormData()
        deliveryFormData.append('stitchCount', formData.value.stitchCount)
        deliveryFormData.append('turnAroundTime', formData.value.turnAroundTime)
        deliveryFormData.append('price', formData.value.price)
        deliveryFormData.append('additionalQuery', formData.value.additionalQuery)

        // Append all files
        formData.value.attachments.forEach((file, index) => {
            deliveryFormData.append(`attachments[${index}]`, file)
        })

        await emit('on:deliver', formData.value)

        // Reset form
        formData.value = { ...initialFormData }

        isOpen.value = false
    } catch (error) {
        console.error('Error submitting delivery:', error)
    } finally {
        loading.value = false
    }
}

const handleCancel = () => {
    // Reset form
    formData.value = { ...initialFormData }
    isOpen.value = false
}
</script>
