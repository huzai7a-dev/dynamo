<template>
  <div class="w-full flex flex-col items-center gap-6">

    <!-- Centered header -->
    <div class="text-center space-y-3">
      <h1 class="text-3xl font-bold text-gray-900">Login to Account</h1>
      <img src="/images/full-logo.png" alt="Dynamo Stitches" class="h-14 mx-auto object-contain" />
    </div>

    <!-- Form — full width -->
    <form @submit.prevent="onSubmit" class="w-full space-y-5 px-12">
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
      <p class="text-center text-sm text-gray-500">
        Don't have an account?
        <NuxtLink to="/register" class="font-semibold text-primary hover:underline ml-1">
          Register here
        </NuxtLink>
      </p>
    </form>
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
