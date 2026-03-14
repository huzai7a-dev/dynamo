<template>
    <div class="max-w-5xl mx-auto mt-10 space-y-6">

        <!-- Profile Header Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="h-2 bg-teal-gradient"></div>
            <div class="flex items-center gap-5 px-8 py-6">
                <div
                    class="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center text-primary text-xl font-bold select-none shrink-0">
                    {{ initials }}
                </div>
                <div>
                    <h1 class="text-xl font-semibold text-secondary leading-tight">
                        {{ profile.company_name || profile.contact_name || profile.user_name || '—' }}
                    </h1>
                    <p class="text-sm text-charcoal/70 mt-0.5">{{ profile.primary_email || '—' }}</p>
                </div>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Left column: Account + Emails -->
            <div class="lg:col-span-2 space-y-6">

                <!-- Account Info -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Account Info</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileField label="User Name" :value="profile.user_name" />
                    </div>
                </div>

                <!-- Emails -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Emails</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileField label="Primary Email" :value="profile.primary_email" />
                        <ProfileField label="Secondary Email" :value="profile.secondary_email" />
                        <ProfileField label="Invoice Email" :value="profile.invoice_email" />
                    </div>
                </div>

                <!-- Company Info -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Company Info</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileField label="Company Name" :value="profile.company_name" />
                        <ProfileField label="Contact Name" :value="profile.contact_name" />
                    </div>
                </div>

                <!-- Contact Details -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Contact Details</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ProfileField label="Phone" :value="profile.phone_number" />
                        <ProfileField label="Cell" :value="profile.cell_number" />
                        <ProfileField label="Fax" :value="profile.fax_number" />
                    </div>
                </div>

            </div>

            <!-- Right column: Location + Other + Action -->
            <div class="space-y-6">

                <!-- Location -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Location</h2>
                    <div class="space-y-4">
                        <ProfileField label="Country" :value="profile.country" />
                        <ProfileField label="City" :value="profile.city" />
                        <ProfileField label="State" :value="profile.state" />
                        <ProfileField label="Zip Code" :value="profile.zip_code" />
                        <ProfileField label="Address" :value="profile.address" />
                    </div>
                </div>

                <!-- Other -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 class="text-base font-semibold text-secondary mb-4">Other</h2>
                    <div class="space-y-4">
                        <ProfileField label="Reference" :value="profile.reference" />
                        <ProfileField v-if="profile.reference === 'Salesman' && profile.sales_man" label="Salesman"
                            :value="profile.sales_man_name || profile.sales_man" />
                        <ProfileField label="Website" :value="profile.website" />
                    </div>
                </div>

                <!-- Edit Button -->
                <button @click="$emit('edit')"
                    class="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl py-3 transition-colors duration-200 shadow-sm">
                    Edit Profile
                </button>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    profile: {
        user_name?: string;
        company_name?: string;
        contact_name?: string;
        primary_email?: string;
        secondary_email?: string;
        invoice_email?: string;
        phone_number?: string;
        cell_number?: string;
        fax_number?: string;
        country?: string;
        city?: string;
        state?: string;
        zip_code?: string;
        address?: string;
        reference?: string;
        sales_man?: string;
        sales_man_name?: string | null;
        website?: string;
    };
}>();

defineEmits(['edit']);

const initials = computed(() => {
    const name = props.profile.contact_name || props.profile.company_name || props.profile.user_name || '?';
    return name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('');
});
</script>
