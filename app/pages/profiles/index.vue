<template>
    <div class="p-0 sm:p-6 max-w-full">
        <ProfilesTable title="User Profiles" :data="profiles" :loading="pending" :error="!!error"
            v-model:searchUserName="searchUserName" v-model:searchEmail="searchEmail"
            v-model:searchCompany="searchCompany" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
    layout: "portal",
    middleware: ["auth"],
});

const searchUserName = ref('');
const searchEmail = ref('');
const searchCompany = ref('');

const { data: response, pending, error } = await useFetch('/api/profiles', {
    query: {
        user_name: searchUserName,
        email: searchEmail,
        company: searchCompany
    },
    watch: [searchUserName, searchEmail, searchCompany]
});

const profiles = computed(() => {
    return (response.value as any)?.data || [];
});
</script>