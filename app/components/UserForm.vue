<template>
  <div class="bg-card text-card-foreground shadow-md p-8 max-w-6xl mx-auto mt-10 border space-y-10">
    <h1 class="text-3xl font-semibold" v-if="submitUrl">Create an Account</h1>
    <h1 class="text-3xl font-semibold" v-else>Profile</h1>

    <form @submit.prevent="onSubmit" class="space-y-8">
      <!-- Account Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Account Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput required v-model="user_name" name="user_name" label="User Name" placeholder="JohnDoe"
            :error="errors.user_name" :disabled="!submitUrl" />
          <UiInput v-if="submitUrl" required v-model="password" name="password" label="Password" type="password"
            placeholder="••••••" :error="errors.password" />
        </div>
      </div>

      <!-- Email Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Emails</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput required v-model="primary_email" name="primary_email" label="Primary Email"
            placeholder="you@example.com" :error="errors.primary_email" />
          <UiInput v-model="secondary_email" name="secondary_email" label="Secondary Email"
            placeholder="optional@example.com" :error="errors.secondary_email" />
          <UiInput required v-model="invoice_email" name="invoice_email" label="Invoice Email"
            placeholder="billing@example.com" :error="errors.invoice_email" />
        </div>
      </div>

      <!-- Company Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Company Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput required v-model="company_name" name="company_name" label="Company Name" placeholder="Acme Inc."
            :error="errors.company_name" />
          <UiInput required v-model="contact_name" name="contact_name" label="Contact Name" placeholder="Jane Doe"
            :error="errors.contact_name" />
        </div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Contact Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UiInput required v-model="phone_number" name="phone_number" label="Phone" placeholder="+1 555-1234"
            :error="errors.phone_number" />
          <UiInput v-model="cell_number" name="cell_number" label="Cell" placeholder="+1 555-6789"
            :error="errors.cell_number" />
          <UiInput v-model="fax_number" name="fax_number" label="Fax Number" placeholder="+1 555-9876"
            :error="errors.fax_number" />
        </div>
      </div>

      <!-- Location Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Location</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiSelect v-model="country" name="country" label="Country" placeholder="Select a country"
            :options="countryOptions" :error="errors.country" />
          <UiInput v-model="city" name="city" label="City" placeholder="New York" :error="errors.city" />
          <UiInput v-model="zip_code" name="zip_code" label="Zip Code" placeholder="10001" :error="errors.zip_code" />
          <UiInput v-model="state" name="state" label="State" placeholder="NY" :error="errors.state" />
        </div>
      </div>

      <!-- Other Info -->
      <div class="space-y-4">
        <h2 class="text-xl font-medium text-foreground">Other</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiSelect v-model="reference" name="reference" label="Reference" :options="referenceOptions"
            :error="errors.reference" />

          <UiSelect v-if="reference === 'Salesman'" v-model="sales_man" name="sales_man" label="Salesman"
            :placeholder="loadingSalesmen ? 'Loading salesmen...' : 'Select a salesman'" :options="salesManOptions"
            :error="errors.sales_man" :disabled="loadingSalesmen" />
          <UiInput v-model="website" name="website" label="Website" placeholder="https://example.com"
            :error="errors.website" />
          <UiInput v-model="address" name="address" label="Address" placeholder="123 Main St" :error="errors.address" />
        </div>
      </div>

      <div class="pt-4">
        <UiButton rounded type="submit" :loading="isSubmitting" fullWidth>
          {{ submitUrl ? "Register" : "Save changes" }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { RegisterSchema } from "~~/shared/validationSchema";
import { useToast } from "~/composables/useToast";
import { watch, computed, ref, onMounted } from "vue";
import { useRouter } from "#imports";

const props = defineProps({
  initialValues: {
    type: Object as () => Record<string, any>,
    default: () => ({}),
  },
  submitUrl: { type: String, default: "" },
  successRedirect: { type: String, default: "" },
});
const emit = defineEmits(["submitted", "success", "error"]);

// options
const countryOptions = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Germany", value: "Germany" },
];

const referenceOptions = [
  { label: "Search Eniginer", value: "Search Eniginer" },
  { label: "Salesman", value: "Salesman" },
  { label: "Customer", value: "Customer" },
  { label: "Other", value: "Other" },
];

const salesManOptions = ref<Array<{ label: string; value: string }>>([]);
const loadingSalesmen = ref(false);

onMounted(async () => {
  if (props.submitUrl) {
    loadingSalesmen.value = true;
    try {
      const res = await $fetch<{ success: boolean; data: Array<{ id: number; label: string; value: string }> }>('/api/salesmen');
      if (res.success) {
        salesManOptions.value = res.data.map((s) => ({ label: s.label, value: s.value }));
      }
    } catch (e) {
      console.error('Failed to load salesmen', e);
    } finally {
      loadingSalesmen.value = false;
    }
  }
});

const toast = useToast();
const router = useRouter();

const defaultInitial = {
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
  sales_man: "",
  website: "",
  address: "",
};

// Use RegisterSchema to validate fields.
// For profile/edit mode (when submitUrl is not provided) omit the password field
// so profile updates don't require password but other RegisterSchema rules still apply.
const formOptions: any = {
  initialValues: { ...defaultInitial, ...(props.initialValues || {}) },
  validationSchema: toTypedSchema(
    props.submitUrl
      ? RegisterSchema
      : (RegisterSchema as any).omit({ password: true }),
  ),
};

const { handleSubmit, defineField, errors, isSubmitting, setValues } =
  useForm(formOptions);

// keep fields available for v-model in template
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
const [sales_man] = defineField("sales_man");
const [website] = defineField("website");
const [address] = defineField("address");

// update form when parent provides new initialValues (e.g. profile fetch)
watch(
  () => props.initialValues,
  (v) => {
    if (v && Object.keys(v).length) {
      // set only known keys to avoid setting password
      setValues({ ...defaultInitial, ...(v || {}) });
    }
  },
  { deep: true, immediate: true },
);

const onSubmit = handleSubmit(async (values) => {
  try {
    if (props.submitUrl) {
      await $fetch(props.submitUrl, {
        method: "POST",
        body: values,
      });
      toast.success("Registration successful");
      emit("submitted", values);
      emit("success");
      if (props.successRedirect) {
        return router.push(props.successRedirect);
      }
      return;
    }

    // profile mode: just log for now and emit
    console.log("Profile submit payload", values);
    emit("submitted", values);
    emit("success");
  } catch (err: any) {
    const msg =
      err?.data?.message ||
      err?.data?.statusMessage ||
      err?.message ||
      "Something went wrong";
    toast.error(msg);
    emit("error", msg);
  }
});
</script>
