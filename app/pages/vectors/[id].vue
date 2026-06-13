<template>
  <EntityDetailBody type="vector" :entityId="route.params.id" />
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  name: "Vector Details",
  layout: "portal",
  middleware: ["auth"],
});
</script>