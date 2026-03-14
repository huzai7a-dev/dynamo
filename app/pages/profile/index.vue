<template>
  <div class="profile-page max-w-6xl mx-auto px-6">
    <div v-if="loading" class="text-gray-600 mt-10">Loading...</div>
    <div v-else>
      <!-- Read-only view -->
      <UserProfileView v-if="!isEditing" :profile="profile" @edit="isEditing = true" />

      <!-- Edit form -->
      <template v-else>
        <UserForm :initialValues="profile" :externalLoading="isSaving" @submitted="onFormSubmitted" />
        <div class="max-w-6xl mx-auto mt-3 flex justify-end">
          <UiButton @click="cancelEdit">Cancel</UiButton>
        </div>
      </template>


    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "Profile",
  layout: "portal",
  middleware: ["auth"],
});

import { ref, reactive, onMounted } from "vue";
import UserForm from "~/components/UserForm.vue";
import UserProfileView from "~/components/UserProfileView.vue";
import { useToast } from "~/composables/useToast";

const loading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const toast = useToast();

const profile = reactive({
  id: null as null | number,
  user_name: "",
  company_name: "",
  contact_name: "",
  country: "",
  phone_number: "",
  primary_email: "",
  address: "",
  cell_number: "",
  city: "",
  fax_number: "",
  invoice_email: "",
  reference: "",
  sales_man: "",
  secondary_email: "",
  state: "",
  website: "",
  zip_code: "",
  sales_man_name: "",
});
const { user } = useUserSession();

function populateProfile(data: any) {
  const keys = Object.keys(profile) as Array<keyof typeof profile>;
  for (const k of keys) {
    // @ts-ignore
    profile[k] = data?.[k] ?? profile[k];
  }
  if (data?.id) profile.id = data.id;
}

async function fetchProfile() {
  loading.value = true;
  try {
    const res = await $fetch(`/api/profiles/${user.value.id}`) as any;
    populateProfile(res?.data ?? res);
  } catch (err: any) {
    toast.error(err?.message ?? "Failed to fetch profile");
    console.error("fetchProfile error", err);
  } finally {
    loading.value = false;
  }
}

function cancelEdit() {
  isEditing.value = false;
  fetchProfile();
}

async function onFormSubmitted(payload: any) {
  if (!profile.id) {
    toast.error("Missing profile id");
    return;
  }

  isSaving.value = true;
  try {
    const res = await $fetch(`/api/profiles/${profile.id}`, {
      method: "PUT",
      body: payload,
    }) as any;
    const updated = res?.data ?? res;
    populateProfile(updated);
    toast.success(res?.message ?? "Profile updated successfully");
    isEditing.value = false;
  } catch (err: any) {
    const msg =
      err?.data?.message ||
      err?.data?.statusMessage ||
      err?.message ||
      "Failed to update profile";
    toast.error(msg);
    console.error("update profile error", err);
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});
</script>
