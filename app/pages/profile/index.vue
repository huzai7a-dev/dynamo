<template>
    <div>
        <h1>Profile</h1>
    </div>
</template>


<script setup lang="ts">
definePageMeta({
    name: "Profile",
    layout: "portal",
    middleware: ["auth"],
});
</script>