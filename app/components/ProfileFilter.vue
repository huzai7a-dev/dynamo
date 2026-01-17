<template>
    <div class="p-6 border-b border-gray-100">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
            <!-- Search Fields -->
            <div class="flex flex-col sm:flex-row gap-4 flex-1">
                <!-- Customer Name Search -->
                <div class="flex-1 min-w-0">
                    <UiInput :model-value="searchName" @update:modelValue="$emit('update:searchName', $event)"
                        label="Name" placeholder="Search by name..." size="md" />
                </div>
                <!-- Customer Email Search -->
                <div class="flex-1 min-w-0">
                    <UiInput :model-value="searchEmail" @update:modelValue="$emit('update:searchEmail', $event)"
                        label="Email" placeholder="Search by email..." size="md" />
                </div>
                <!-- Customer Company Search -->
                <div v-if="isAdmin" class="flex-1 min-w-0">
                    <UiInput :model-value="searchCompany" @update:modelValue="$emit('update:searchCompany', $event)"
                        label="Company" placeholder="Search by company..." size="md" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UiInput from './ui/Input.vue'

defineProps({
    searchName: {
        type: String,
        default: ''
    },
    searchEmail: {
        type: String,
        default: ''
    },
    searchCompany: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

defineEmits<{
    'update:searchName': [value: string]
    'update:searchEmail': [value: string]
    'update:searchCompany': [value: string]
}>()
</script>
