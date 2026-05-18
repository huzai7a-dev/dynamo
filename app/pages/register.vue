<template>
  <div class="space-y-10">
    <!-- <h1 class="text-3xl font-semibold">Create an Account</h1> -->

    <UserForm submitUrl="/api/auth/register" successRedirect="/login" />
  </div>
</template>

<script setup lang="ts">
import UserForm from "~/components/UserForm.vue";

definePageMeta({
  layout: "auth",
});
</script>
