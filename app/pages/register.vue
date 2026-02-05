<template>
  <div class="space-y-10">
    <!-- <h1 class="text-3xl font-semibold">Create an Account</h1> -->

    <UserForm submitUrl="/api/auth/register" successRedirect="/login" />

    <div class="text-center text-sm text-muted-foreground">
      Already have an account?
      <NuxtLink to="/login" class="font-medium text-primary hover:underline">
        Login here
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserForm from "~/components/UserForm.vue";

definePageMeta({
  layout: "auth",
});
</script>
