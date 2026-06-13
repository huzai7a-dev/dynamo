<template>
  <EntityDetailBody type="order" :entityId="route.params.id" />
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  name: "Order Details",
  layout: "portal",
  middleware: ["auth"],
});
</script>
