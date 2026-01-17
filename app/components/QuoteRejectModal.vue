<template>
    <UiModal v-model="isOpen" title="Reject Quote">
        <div class="space-y-4">
            <p class="text-sm text-gray-600">Please provide a reason for rejecting this quote to help us improve.</p>

            <div class="space-y-2">
                <label class="text-sm font-medium text-charcoal">Rejection Reason</label>
                <textarea v-model="reason"
                    class="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-sm bg-gray-50/50 min-h-[100px]"
                    placeholder="E.g., Price is too high, Delivery time too long..."></textarea>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <button class="px-4 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition"
                    @click="isOpen = false">
                    Cancel
                </button>
                <button
                    class="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm transition flex items-center gap-2"
                    :disabled="!reason || loading" @click="handleSubmit">
                    <span v-if="loading">Rejecting...</span>
                    <span v-else>Reject Quote</span>
                </button>
            </div>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm', reason: string): void
}>()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const reason = ref('')

const handleSubmit = () => {
    if (!reason.value) return
    emit('confirm', reason.value)
    // Optional: reset reason? or keep it in case error
}

watch(() => props.modelValue, (val) => {
    if (!val) reason.value = '' // Reset on close
})
</script>
