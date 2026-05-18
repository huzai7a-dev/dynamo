<template>
    <div class="max-w-5xl mx-auto mt-10 space-y-6">

        <!-- Profile Header Card -->
        <div class="relative rounded-2xl border border-white/40 shadow-xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-primary-light/10">
            <div class="h-2 bg-teal-gradient opacity-70"></div>
            <div class="px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div class="flex items-center gap-6">
                    <div
                        class="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-primary text-3xl font-bold select-none shrink-0 shadow-sm border-4 border-white">
                        {{ initials }}
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-secondary tracking-tight">
                            {{ profile.company_name || profile.contact_name || profile.user_name || '—' }}
                        </h1>
                        <p class="text-base text-charcoal/60 mt-1 font-medium">
                            {{ profile.primary_email || '—' }}
                        </p>
                    </div>
                </div>

                <button @click="$emit('edit')"
                    class="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 shrink-0">
                    <Icon name="Pencil" :size="18" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Account Info -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="User" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Account Info</h2>
                </div>
                <div class="space-y-4">
                    <ProfileField label="User Name" :value="profile.user_name" />
                </div>
            </div>

            <!-- Emails -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="Mail" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Emails</h2>
                </div>
                <div class="space-y-5">
                    <div v-for="(email, label) in {
                        'Primary Email': profile.primary_email,
                        'Secondary Email': profile.secondary_email,
                        'Invoice Email': profile.invoice_email
                    }" :key="label" class="group flex items-center justify-between">
                        <ProfileField :label="label" :value="email" />
                        <button v-if="email" @click="copyToClipboard(email)"
                            class="p-2 text-charcoal/40 hover:text-primary transition-colors duration-200">
                            <Icon name="Copy" :size="16" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Company Info -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="Building2" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Company Info</h2>
                </div>
                <div class="space-y-4">
                    <ProfileField label="Company Name" :value="profile.company_name" />
                    <ProfileField label="Contact Name" :value="profile.contact_name" />
                </div>
            </div>

            <!-- Location Details -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="MapPin" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Location Details</h2>
                </div>
                <div class="space-y-4">
                    <ProfileField label="Country" :value="profile.country" />
                    <div class="grid grid-cols-2 gap-4">
                        <ProfileField label="City" :value="profile.city" />
                        <ProfileField label="State" :value="profile.state" />
                    </div>
                    <ProfileField label="Zip Code" :value="profile.zip_code" />
                    <ProfileField label="Address" :value="profile.address" />
                </div>
            </div>

            <!-- Contact Details -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="Phone" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Contact Details</h2>
                </div>
                <div class="space-y-4">
                    <ProfileField label="Phone" :value="profile.phone_number" />
                    <ProfileField label="Cell" :value="profile.cell_number" />
                    <ProfileField label="Fax" :value="profile.fax_number" />
                </div>
            </div>

            <!-- Other Info -->
            <div class="glass-card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="icon-badge">
                        <Icon name="Settings" :size="20" />
                    </div>
                    <h2 class="text-lg font-bold text-secondary">Other Info</h2>
                </div>
                <div class="space-y-4">
                    <ProfileField label="Reference" :value="profile.reference" />
                    <ProfileField v-if="profile.reference === 'Salesman' && profile.sales_man" label="Salesman"
                        :value="profile.sales_man_name || profile.sales_man" />
                    <div class="group flex items-center justify-between">
                        <ProfileField label="Website" :value="profile.website" />
                        <button v-if="profile.website" @click="copyToClipboard(profile.website)"
                            class="p-2 text-charcoal/40 hover:text-primary transition-colors duration-200">
                            <Icon name="Copy" :size="16" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';
import { useToast } from '~/composables/useToast';

const toast = useToast();

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
const copyToClipboard = (text?: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
};
</script>

<style scoped>
.glass-card {
    @apply rounded-2xl border border-white/40 shadow-xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-primary-light/10 transition-all duration-300 hover:shadow-2xl hover:border-white/60;
}

.icon-badge {
    @apply h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner;
}
</style>
