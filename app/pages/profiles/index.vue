<template>
    <div class="p-0 sm:p-6 max-w-full">
        <ProfilesTable title="Customer Profiles" :data="profiles" :loading="pending" :error="!!error"
            v-model:searchUserName="searchUserName" v-model:searchEmail="searchEmail"
            v-model:searchCompany="searchCompany" @view="(id) => navigateTo(`/profiles/${id}`)"
            @set-price-category="openPriceCategory" />

        <PriceCategoryModal
            v-model="showPriceCategoryModal"
            :userId="priceCategoryUserId"
            :initialValues="priceCategoryData ?? undefined"
            @saved="(v) => (priceCategoryData = { ...priceCategoryData, ...v } as IPriceCategory)"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { IPriceCategory } from '#shared/types';

definePageMeta({
    name: "Profiles",
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

const showPriceCategoryModal = ref(false);
const priceCategoryUserId = ref<string | number>("");
const priceCategoryData = ref<IPriceCategory | null>(null);

const openPriceCategory = async (userId: number) => {
    priceCategoryUserId.value = userId;
    priceCategoryData.value = null;
    try {
        const res = await $fetch<{ data: IPriceCategory | null }>(`/api/price-categories/${userId}`);
        priceCategoryData.value = res.data;
    } catch (e) {
        console.error("Failed to load price category", e);
    }
    showPriceCategoryModal.value = true;
};
</script>