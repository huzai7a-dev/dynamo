<template>
  <div class="p-0 sm:p-6 max-w-full">
    <div v-if="pending" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p class="text-primary font-semibold animate-pulse">Loading Profile...</p>
    </div>
    <div v-else-if="error" class="text-center py-20 text-red-500">Failed to load profile.</div>
    <UserProfileView v-else-if="profile" :profile="profile" readonly />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "Profile Details", layout: "portal", middleware: ["auth"] });

const route = useRoute();
const { data: response, pending, error } = await useFetch(`/api/profiles/${route.params.id}`);
const profile = computed(() => (response.value as any)?.data);
</script>
