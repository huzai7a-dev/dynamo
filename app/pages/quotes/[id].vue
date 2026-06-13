<template>
  <EntityDetailBody type="quote" :entityId="route.params.id" />
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  name: "Quote Details",
  layout: "portal",
  middleware: ["auth"],
});
</script>