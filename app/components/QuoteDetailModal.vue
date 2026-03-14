<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
        <div class="w-full max-w-4xl rounded-xl bg-white shadow-lg overflow-auto max-h-[90vh]">
            <div class="flex items-center justify-between p-4 border-b">
                <h3 class="text-lg font-semibold">Quote Details</h3>
                <button class="p-2" @click="close">✕</button>
            </div>

            <div class="p-6">
                <div v-if="pending" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>

                <div v-else-if="error" class="text-center text-rose-600">
                    Failed to load quote details.
                    <div class="mt-4">
                        <button class="px-3 py-2 bg-primary text-white rounded" @click="() => refresh()">
                            Retry
                        </button>
                    </div>
                </div>

                <div v-else-if="quote">
                    <OrderHeader :order_name="quote.title" :po_number="quote.po_number" :status="quote.status" />

                    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Rejection Reason -->
                            <div v-if="details?.reject_reason && quote.status === 'rejected'"
                                class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 bg-red-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="m15 9-6 6" />
                                            <path d="m9 9 6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="mb-1 text-lg font-semibold text-red-900">Quote Rejected</h2>
                                        <p class="text-red-700 leading-relaxed">{{ details.reject_reason }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 class="mb-4 text-lg font-semibold text-secondary">
                                    Quote Details
                                </h2>
                                <QuoteMetaGrid :quote="quote" />
                                <AttachmentsGallery class="mt-6" title="Attachments"
                                    noAttachmentsMessage="No quote attachments uploaded."
                                    :attachments="quote.quote_attachments || []" />
                            </div>

                            <!-- Delivery Details Section -->
                            <div v-if="details" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 class="mb-4 text-lg font-semibold text-secondary">Delivery Details</h2>
                                <div class="space-y-4">
                                    <div v-if="details.stitch_count"
                                        class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span class="text-sm text-gray-500">Stitch Count</span>
                                        <span class="font-medium text-gray-900">{{ details.stitch_count }}</span>
                                    </div>
                                    <div v-if="details.turn_around_time"
                                        class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span class="text-sm text-gray-500">Turn Around Time</span>
                                        <span class="font-medium text-gray-900">{{ details.turn_around_time }}</span>
                                    </div>
                                    <div v-if="details.additional_query"
                                        class="py-2 border-b border-gray-100 last:border-0">
                                        <span class="block text-sm text-gray-500 mb-1">Additional Query</span>
                                        <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{
                                            details.additional_query
                                            }}</p>
                                    </div>

                                    <div v-if="details.delivery_attachments?.length" class="pt-2">
                                        <span class="block text-sm text-gray-500 mb-2">Delivery Attachments</span>
                                        <div class="flex flex-wrap gap-2">
                                            <AttachmentsGallery title="" noAttachmentsMessage=""
                                                :attachments="details.delivery_attachments" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside class="space-y-6">
                            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 class="mb-3 text-base font-semibold text-secondary">Summary</h3>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-charcoal/70">Status</span>
                                        <UiStatusBadge :status="quote.status" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-charcoal/70">Estimate</span>
                                        <span class="text-sm font-medium text-secondary">
                                            {{
                                                !quote.estimated_price
                                                    ? "To be quoted"
                                                    : `$${quote.estimated_price}`
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
                                <InstructionBox :instructions="quote.instructions" />
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 class="mb-3 text-base font-semibold text-secondary">Actions</h3>
                                <QuoteActions :isAdmin="isAdmin" :status="quote.status"
                                    @accept="handleMoveToOrder(quote.q_type)" @reject="showRejectModal = true"
                                    @proceed="updateQuoteStatus(QuoteStatus.PROCEED, quote.q_type)"
                                    @edit="handleEditOrder" @deliver="showDeliveryModal = true" />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 p-4 border-t">
                <button class="px-4 py-2 rounded bg-gray-100" @click="close">
                    Close
                </button>
            </div>
        </div>

        <!-- Modals -->
        <QuoteDeliveryModal v-if="quote" v-model="showDeliveryModal" :quoteId="String(quoteId)" :initialValues="{
            stitchCount: quote.quote_data?.stitch_count || '',
            turnAroundTime: quote.quote_data?.turn_around_time || '',
            price: quote.estimated_price || '',
            additionalQuery: quote.quote_data?.additional_query || ''
        }" @on:deliver="handleDeliver" />
        <QuoteRejectModal v-model="showRejectModal" :loading="rejecting" @confirm="handleRejectConfirm" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { QuoteStatus, DataSource } from "~~/shared/types/enums";
import { ROLE } from "~~/shared/constants";
import OrderHeader from "./OrderHeader.vue";
import QuoteMetaGrid from "./QuoteMetaGrid.vue";
import AttachmentsGallery from "./AttachmentsGallery.vue";
import InstructionBox from "./InstructionBox.vue";
import QuoteActions from "./QuoteActions.vue";
import QuoteDeliveryModal from "./QuoteDeliveryModal.vue";
import QuoteRejectModal from "./QuoteRejectModal.vue";

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        quoteId?: string | number;
    }>(),
    {
        modelValue: false,
        quoteId: "",
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
    (e: "refresh"): void;
}>();

const quoteId = computed(() => props.quoteId);
const { user } = useUserSession();
const isAdmin = computed(() => (user.value as any)?.role === ROLE.Admin);
const toast = useToast();
const router = useRouter();

const modelValue = computed(() => props.modelValue);

const { data, pending, error, execute: fetchQuote } = useFetch<any>(
    () => (quoteId.value ? `/api/quotes/${quoteId.value}` : '') as string,
    {
        immediate: false,
        watch: [quoteId]
    }
);

const { data: deliveryDetailsResp, execute: fetchDelivery } = useFetch<any>(
    () => (quoteId.value && quote.value?.status !== QuoteStatus.PENDING ? `/api/quotes/deliver/${quoteId.value}` : '') as string,
    {
        immediate: false,
        watch: [quoteId, data]
    }
);

watch(modelValue, (isOpen) => {
    if (isOpen && quoteId.value) {
        fetchQuote();
        fetchDelivery();
    }
});

const refresh = () => {
    fetchQuote();
    fetchDelivery();
};

// Nuxt useFetch parses Response -> data 
// Backend returns { message, data: { ... } }
const quote = computed(() => (data.value as any)?.data);
const details = computed(() => (deliveryDetailsResp.value as any)?.data);

const showDeliveryModal = ref(false);
const showRejectModal = ref(false);
const rejecting = ref(false);

const close = () => emit("update:modelValue", false);

const updateQuoteStatus = async (status: QuoteStatus, dataSourceType: DataSource) => {
    try {
        await $fetch(`/api/quotes/status`, {
            method: "POST",
            body: { quoteId: quoteId.value, status, dataSourceType }
        });
        toast.success("Quote status updated successfully");
        refresh();
        emit("refresh");
    } catch (error) {
        console.error("Error updating quote status:", error);
        toast.error("Failed to update quote status");
    }
};

const handleEditOrder = () => {
    router.push(`/quotes/edit/${quoteId.value}?type=${quote.value?.q_type}`);
};

const handleMoveToOrder = async (dataSourceType: DataSource) => {
    try {
        await $fetch(`/api/quotes/move-to-order`, {
            method: "POST",
            body: { quoteId: quoteId.value, dataSourceType }
        });
        toast.success("Quote moved to order successfully");
        refresh();
        emit("refresh");
        close();
    } catch (error) {
        console.error("Error moving quote to order:", error);
        toast.error("Failed to move quote to order");
    }
};

const handleRejectConfirm = async (reason: string) => {
    try {
        rejecting.value = true;
        await $fetch('/api/quotes/reject', {
            method: "POST",
            body: { quoteId: quoteId.value, reason }
        });
        toast.success("Quote rejected successfully");
        showRejectModal.value = false;
        refresh();
        emit("refresh");
    } catch (err: any) {
        console.error("Error rejecting quote:", err);
        toast.error(err.message || "Failed to reject quote");
    } finally {
        rejecting.value = false;
    }
};

const handleDeliver = async (form: any) => {
    try {
        const formData = new FormData();
        formData.append('stitchCount', form.stitchCount);
        formData.append('turnAroundTime', form.turnAroundTime);
        formData.append('price', form.price);
        formData.append('additionalQuery', form.additionalQuery);

        if (form.attachments && form.attachments.length > 0) {
            form.attachments.forEach((file: File) => {
                formData.append('attachments', file);
            });
        }

        await $fetch(`/api/quotes/deliver/${quoteId.value}`, {
            method: "POST",
            body: formData
        });

        toast.success("Quote delivered successfully");
        showDeliveryModal.value = false;
        refresh();
        emit("refresh");

    } catch (err: any) {
        console.error("Error delivering quote:", err);
        toast.error(err.statusMessage || "Failed to deliver quote");
    }
};
</script>
