<template>
  <div
    class="bg-card text-card-foreground shadow-md p-8 max-w-lg mx-auto mt-10 border space-y-8"
  >
    <h1 class="text-3xl font-semibold text-center">Login to Your Account</h1>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <UiInput
        required
        v-model="emailOrUsername"
        name="emailOrUsername"
        label="Email or Username"
        placeholder="you@example.com or JohnDoe"
        :error="errors.emailOrUsername"
      />
      <UiInput
        required
        v-model="password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••"
        :error="errors.password"
      />

      <!-- <div class="text-right text-sm">
          <NuxtLink
            to="/forgot-password"
            class="font-medium text-primary hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div> -->

      <div class="pt-2">
        <UiButton rounded type="submit" :loading="isSubmitting" fullWidth>
          Login
        </UiButton>
      </div>

      <div class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="font-medium text-primary hover:underline"
        >
          Register here
        </NuxtLink>
      </div>
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
