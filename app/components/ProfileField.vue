<template>
    <div class="flex flex-col" :class="$attrs.class">
        <span class="text-xs uppercase tracking-wide text-charcoal/70">{{ label }}</span>
        <span class="mt-0.5 text-sm font-medium text-secondary">{{ value || '—' }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | null }>();
</script>
