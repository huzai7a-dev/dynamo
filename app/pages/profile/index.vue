<template>
  <div class="profile-page max-w-3xl mx-auto px-6">
    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-else>
      <UserForm :initialValues="profile" @submitted="onFormSubmitted" />
      <div v-if="error" class="text-sm text-red-600 mt-2">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-sm text-green-600 mt-2">
        {{ successMessage }}
      </div>
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

const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const isSaving = ref(false);

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
  error.value = false;
  errorMessage.value = "";
  try {
    const res = await $fetch(`/api/profiles/${user.value.id}`);
    populateProfile(res?.data ?? res);
    successMessage.value = "";
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err?.message ?? "Failed to fetch profile";
    console.error("fetchProfile error", err);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  fetchProfile();
}

async function onFormSubmitted(payload: any) {
  // call update profile endpoint
  error.value = false;
  errorMessage.value = "";
  successMessage.value = "";
  if (!profile.id) {
    error.value = true;
    errorMessage.value = "Missing profile id";
    return;
  }

  isSaving.value = true;
  try {
    const res = await $fetch(`/api/profiles/${profile.id}`, {
      method: "PUT",
      body: payload,
    });
    // expect { message, data }
    const updated = res?.data ?? res;
    populateProfile(updated);
    successMessage.value = res?.message ?? "Profile updated successfully";
    console.log("Profile updated", updated);
  } catch (err: any) {
    error.value = true;
    // $fetch errors may have .data
    errorMessage.value =
      err?.data?.message ||
      err?.data?.statusMessage ||
      err?.message ||
      "Failed to update profile";
    console.error("update profile error", err);
  } finally {
    isSaving.value = false;
  }
}

// fetch on mount
onMounted(() => {
  fetchProfile();
});
</script>
