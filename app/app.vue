<script setup lang="ts">

</script>

<template>
  <NuxtLayout>
    <NuxtPage :key="$route.fullPath" />
    <UiToastContainer />
  </NuxtLayout>
</template>
