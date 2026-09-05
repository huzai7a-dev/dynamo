<script setup lang="ts">
import { OrderKeyValue as KeyValue, OrderNotesBox as NotesBox } from "#components";

withDefaults(
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
    compact?: boolean;
  }>(),
  { compact: false },
);
</script>

<template>
  <div class="flex flex-col xl:flex-row" :class="compact ? 'gap-3' : 'gap-6'">
    <div
      class="grid flex-1 grid-cols-1"
      :class="compact ? 'gap-2 sm:grid-cols-3' : 'gap-4 sm:grid-cols-2'"
    >
      <KeyValue label="PO Number" icon="Tag" :value="quote.po_number" :compact="compact" />
      <KeyValue
        label="Required Format"
        icon="FileText"
        :value="quote.quote_data?.requiredFormat?.toUpperCase()"
        :compact="compact"
      />
      <KeyValue label="Vector Type" icon="Shapes" :value="quote.quote_data?.vectorType" :compact="compact" />
      <KeyValue label="Colors" icon="Palette" :value="quote.quote_data?.numColors" :compact="compact" />
      <!-- <KeyValue label="Blending" :value="quote.quote_data?.blending" /> -->
      <!-- <KeyValue label="Rush" :value="quote.quote_data?.rush" /> -->
      <KeyValue
        label="Estimated Price"
        icon="CircleDollarSign"
        :value="
          quote.estimated_price ? `$${quote.estimated_price}` : 'To be quoted'
        "
        :compact="compact"
      />
      <KeyValue
        label="Last Updated"
        icon="Calendar"
        :value="new Date(quote.updated_at).toLocaleString()"
        :compact="compact"
      />
    </div>

    <div :class="compact ? 'xl:w-64' : 'xl:w-80'" class="xl:shrink-0">
      <NotesBox :value="quote.instructions" :compact="compact" />
    </div>
  </div>
</template>
