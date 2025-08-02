<template>
    <h1 v-if="loggedIn">
        Welcome {{ user?.fullName }}
    </h1>
</template>


<script setup lang="ts">
    const { user, loggedIn } = useUserSession()

    definePageMeta({
        layout: "portal",
        middleware: ['auth']
    })
</script>