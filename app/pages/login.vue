<template>
  <div class="w-full flex flex-col items-center gap-6">

    <!-- Centered header above card -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Login to Account</h1>
      <img src="/images/full-logo.png" alt="Dynamo Stitches" class="h-14 mx-auto object-contain" />
    </div>

    <!-- Card -->
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-8">
      <form @submit.prevent="onSubmit" class="space-y-5">
        <UiInput required v-model="emailOrUsername" name="emailOrUsername" label="Email or Username"
          placeholder="you@example.com or JohnDoe" icon-left="User" :error="errors.emailOrUsername" />
        <UiInput required v-model="password" name="password" label="Password" type="password" placeholder="••••••••"
          icon-left="Lock" :error="errors.password" />

        <!-- Remember me row -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 accent-primary" />
            Remember me
          </label>
          <NuxtLink to="/forgot-password" class="text-primary font-medium hover:underline">
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Submit -->
        <UiButton type="submit" :loading="isSubmitting" fullWidth size="lg">
          Login
        </UiButton>

        <!-- Register -->
        <p class="text-center text-sm text-gray-500 pt-1">
          Don't have an account?
          <NuxtLink to="/register" class="font-semibold text-primary hover:underline ml-1">
            Register here
          </NuxtLink>
        </p>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useToast } from "~/composables/useToast";
import { LoginSchema } from "~~/shared/validationSchema";

const toast = useToast();
const { fetch: refreshSession } = useUserSession();

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
  initialValues: {
    emailOrUsername: "",
    password: "",
  },
});

const [emailOrUsername] = defineField("emailOrUsername");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    const user = await $fetch("/api/auth/login", {
      method: "POST",
      body: values,
    });
    await refreshSession();
    toast.success("Login successful!");
    navigateTo("/dashboard");
  } catch (error: any) {
    toast.error(
      error?.data?.message ||
      error?.data?.statusMessage ||
      "Invalid credentials. Please try again."
    );
  }
});

definePageMeta({
  layout: "auth",
});
</script>
