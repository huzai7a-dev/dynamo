<script setup lang="ts">
import { OrderKeyValue as KeyValue } from '#components';

defineProps<{
    quote: {
        po_number: string
        status: string
        estimated_price: string
        quote_data: {
            rush: string
            blending: string
            numColors: string
            vectorType: string
            requiredFormat: string
        }
        created_at: string
        updated_at: string
    }
}>()
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue label="PO Number" :value="quote.po_number" />
        <KeyValue label="Required Format" :value="quote.quote_data?.requiredFormat?.toUpperCase()" />
        <KeyValue label="Vector Type" :value="quote.quote_data?.vectorType" />
        <KeyValue label="# Colors" :value="quote.quote_data?.numColors" />
        <KeyValue label="Blending" :value="quote.quote_data?.blending" />
        <KeyValue label="Rush" :value="quote.quote_data?.rush" />
        <KeyValue label="Estimated Price"
            :value="quote.estimated_price ? `$${quote.estimated_price}` : 'To be quoted'" />
        <KeyValue label="Last Updated" :value="new Date(quote.updated_at).toLocaleString()" />
    </div>
</template>
