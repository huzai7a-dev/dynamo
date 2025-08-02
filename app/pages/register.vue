<template>
  <div
    class="bg-card text-card-foreground shadow-md p-8 max-w-6xl mx-auto mt-10 border space-y-10"
  >
    <h1 class="text-3xl font-semibold">Create an Account</h1>

    <form @submit.prevent="onSubmit" class="space-y-8">
      <!-- Account Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Account Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput
            required
            v-model="user_name"
            name="user_name"
            label="User Name"
            placeholder="JohnDoe"
            :error="errors.user_name"
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
        </div>
      </div>

      <!-- Email Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Emails</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput
            required
            v-model="primary_email"
            name="primary_email"
            label="Primary Email"
            placeholder="you@example.com"
            :error="errors.primary_email"
          />
          <UiInput
            v-model="secondary_email"
            name="secondary_email"
            label="Secondary Email"
            placeholder="optional@example.com"
            :error="errors.secondary_email"
          />
          <UiInput
            v-model="invoice_email"
            name="invoice_email"
            label="Invoice Email"
            placeholder="billing@example.com"
            :error="errors.invoice_email"
          />
        </div>
      </div>

      <!-- Company Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Company Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput
            required
            v-model="company_name"
            name="company_name"
            label="Company Name"
            placeholder="Acme Inc."
            :error="errors.company_name"
          />
          <UiInput
            required
            v-model="contact_name"
            name="contact_name"
            label="Contact Name"
            placeholder="Jane Doe"
            :error="errors.contact_name"
          />
        </div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Contact Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UiInput
            required
            v-model="phone_number"
            name="phone_number"
            label="Phone"
            placeholder="+1 555-1234"
            :error="errors.phone_number"
          />
          <UiInput
            v-model="cell_number"
            name="cell_number"
            label="Cell"
            placeholder="+1 555-6789"
            :error="errors.cell_number"
          />
          <UiInput
            v-model="fax_number"
            name="fax_number"
            label="Fax Number"
            placeholder="+1 555-9876"
            :error="errors.fax_number"
          />
        </div>
      </div>

      <!-- Location Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Location</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiSelect
            v-model="country"
            name="country"
            label="Country"
            placeholder="Select a country"
            :options="countryOptions"
            :error="errors.country"
          />
          <UiInput
            v-model="city"
            name="city"
            label="City"
            placeholder="New York"
            :error="errors.city"
          />
          <UiInput
            v-model="zip_code"
            name="zip_code"
            label="Zip Code"
            placeholder="10001"
            :error="errors.zip_code"
          />
          <UiInput
            v-model="state"
            name="state"
            label="State"
            placeholder="NY"
            :error="errors.state"
          />
        </div>
      </div>

      <!-- Other Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Other</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput
            v-model="reference"
            name="reference"
            label="Reference"
            placeholder="Referral, Ad, etc."
            :error="errors.reference"
          />
          <UiInput
            v-model="website"
            name="website"
            label="Website"
            placeholder="https://example.com"
            :error="errors.website"
          />
          <UiInput
            v-model="address"
            name="address"
            label="Address"
            placeholder="123 Main St"
            :error="errors.address"
          />
        </div>
      </div>

      <div class="pt-4">
        <UiButton rounded type="submit" :loading="isSubmitting" fullWidth>
          Register
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { RegisterSchema } from "~~/shared/validationSchema";
import { useToast } from "~/composables/useToast";

const countryOptions = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Germany", value: "Germany" },
];

const toast = useToast()
const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(RegisterSchema),
  initialValues: {
    country: "United States",
    user_name: "",
    password: "",
    primary_email: "",
    secondary_email: "",
    invoice_email: "",
    company_name: "",
    contact_name: "",
    phone_number: "",
    cell_number: "",
    fax_number: "",
    city: "",
    zip_code: "",
    state: "",
    reference: "",
    website: "",
    address: "",
  },
});

const [user_name] = defineField("user_name");
const [password] = defineField("password");
const [primary_email] = defineField("primary_email");
const [secondary_email] = defineField("secondary_email");
const [invoice_email] = defineField("invoice_email");
const [company_name] = defineField("company_name");
const [contact_name] = defineField("contact_name");
const [phone_number] = defineField("phone_number");
const [cell_number] = defineField("cell_number");
const [fax_number] = defineField("fax_number");
const [country] = defineField("country");
const [city] = defineField("city");
const [zip_code] = defineField("zip_code");
const [state] = defineField("state");
const [reference] = defineField("reference");
const [website] = defineField("website");
const [address] = defineField("address");

const onSubmit = handleSubmit(async(values) => {
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: values
    });
    toast.success('Registration successful');
    navigateTo('/login');
  } catch (error: any) {
    toast.error(error?.data?.message || error?.data?.statusMessage || 'Something went wrong');
  }
});

definePageMeta({
  layout: "auth",
});
</script>
