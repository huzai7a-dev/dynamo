<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    status: string
}>()

const badgeClass = computed(() => {
    switch (props.status) {
        case 'paid':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'failed':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'refunded':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
});

const formattedStatus = computed(() => {
    if (!props.status) return 'Unknown';
    return props.status.charAt(0).toUpperCase() + props.status.slice(1);
});
</script>

<template>
    <span class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium capitalize"
        :class="badgeClass">
        <span class="h-1.5 w-1.5 rounded-full" :class="{
            'bg-emerald-500': status === 'paid',
            'bg-yellow-500': status === 'pending',
            'bg-red-500': status === 'failed',
            'bg-gray-500': status === 'refunded' || !status
        }" />
        {{ formattedStatus }}
    </span>
</template>
