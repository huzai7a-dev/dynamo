<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex shrink-0 justify-between items-center">
      <h3 class="text-2xl font-black text-secondary tracking-tight">Invoice History</h3>
    </div>

    <!-- Placeholder -->
    <div class="flex items-center justify-center py-32">
      <div class="bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-xl max-w-lg animate-in zoom-in-95 duration-700">
        <div class="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
          <Icon name="History" class="w-12 h-12 text-primary" />
        </div>
        <h3 class="text-3xl font-black text-secondary mb-4 italic tracking-tight">COMING SOON</h3>
        <p class="text-charcoal/50 font-medium leading-relaxed">
          Invoice history will show your paid invoices here. This feature is under construction.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});
</script>
