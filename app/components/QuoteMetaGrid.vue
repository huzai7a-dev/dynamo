<script setup lang="ts">
import { OrderKeyValue as KeyValue, OrderNotesBox as NotesBox } from "#components";

defineProps<{
  quote: {
    po_number: string;
    status: string;
    estimated_price: string;
    instructions: string;
    quote_data: {
      rush: string;
      blending: string;
      numColors: string;
      vectorType: string;
      requiredFormat: string;
    };
    created_at: string;
    updated_at: string;
  };
}>();
</script>

<template>
  <div class="flex flex-col gap-6 xl:flex-row">
    <div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
      <KeyValue label="PO Number" icon="Tag" :value="quote.po_number" />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="quote.quote_data?.requiredFormat?.toUpperCase()"
      />
      <KeyValue label="Vector Type" icon="Shapes" :value="quote.quote_data?.vectorType" />
      <KeyValue label="Colors" icon="Palette" :value="quote.quote_data?.numColors" />
      <!-- <KeyValue label="Blending" :value="quote.quote_data?.blending" /> -->
      <!-- <KeyValue label="Rush" :value="quote.quote_data?.rush" /> -->
      <KeyValue
        label="Estimated Price"
        icon="CircleDollarSign"
        :value="
          quote.estimated_price ? `$${quote.estimated_price}` : 'To be quoted'
        "
      />
      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(quote.updated_at).toLocaleString()"
      />
    </div>

    <div class="xl:w-80 xl:shrink-0">
      <NotesBox :value="quote.instructions" />
    </div>
  </div>
</template>
