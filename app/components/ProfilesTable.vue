<template>
    <div class="space-y-6">
        <h3 v-if="title" class="text-2xl font-bold text-gray-900">{{ title }}</h3>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ProfileFilter :searchName="searchUserName" :searchEmail="searchEmail" :searchCompany="searchCompany"
                :isAdmin="isAdmin" @update:searchName="(val: string) => emit('update:searchUserName', val)"
                @update:searchEmail="(val: string) => emit('update:searchEmail', val)"
                @update:searchCompany="(val: string) => emit('update:searchCompany', val)" />

            <div class="p-6">
                <div class="w-full overflow-x-auto custom-scrollbar">
                    <UiTable :data="formattedData" :columns="columns" :loading="props.loading" :error="props.error"
                        :sortBy="props.sortBy" :sortOrder="props.sortOrder"
                        @updateSort="(payload) => emit('sort', payload.sortBy, payload.sortOrder)"
                        @rowClick="emit('rowClick', $event)">

                        <template #column-serial_number="{ index }">
                            <span class="text-primary font-semibold">{{ index + 1 }}</span>
                        </template>

                        <template #column-role="{ row }">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap"
                                :class="row.role === ROLE.Admin ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'">
                                {{ row.role === ROLE.Admin ? 'Admin' : 'User' }}
                            </span>
                        </template>

                        <template #column-created_at="{ row }">
                            <span class="text-gray-600 whitespace-nowrap">{{ row.created_at_formatted }}</span>
                        </template>

                        <template #column-primary_email="{ row }">
                            <span class="text-gray-600 truncate max-w-[200px] block" :title="row.primary_email">{{
                                row.primary_email }}</span>
                        </template>

                    </UiTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import ProfileFilter from "./ProfileFilter.vue";
import { ROLE } from "~~/shared/constants";
import { formateDate } from "~~/shared/utils";

interface Profile {
    id: number;
    user_name: string;
    primary_email: string;
    company_name?: string;
    contact_name?: string;
    phone_number?: string;
    role: number;
    created_at: string;
}

interface Props {
    title?: string;
    data?: Profile[];
    loading: boolean;
    error: boolean;
    sortBy?: string;
    sortOrder?: string;
    searchUserName?: string;
    searchEmail?: string;
    searchCompany?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'sort': [sortBy: string, sortOrder: string];
    'rowClick': [payload: { row: Profile, index: number }];
    'update:searchUserName': [value: string];
    'update:searchEmail': [value: string];
    'update:searchCompany': [value: string];
}>();

const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);

const formattedData = computed(() => {
    return props.data?.map((item) => ({
        ...item,
        created_at_formatted: formateDate(item.created_at),
    })) || [];
});

const columns = [
    { label: "#", key: "serial_number" },
    { label: "ID", key: "id" },
    { label: "User Name", key: "user_name" },
    { label: "Company", key: "company_name" },
    { label: "Contact Name", key: "contact_name" },
    { label: "Email", key: "primary_email" },
    { label: "Phone", key: "phone_number" },
    { label: "Role", key: "role" },
    { label: "Joined At", key: "created_at" },
];
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #00808066;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #008080;
}
</style>
