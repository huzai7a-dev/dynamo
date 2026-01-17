<template>
    <div class="min-h-screen bg-light-gray">
        <div class="container py-8">
            <!-- Header -->
            <OrderHeader :order_name="quote?.title" :po_number="quote?.po_number" :status="quote?.status" />

            <!-- Main -->
            <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <!-- Rejection Reason -->
                    <div v-if="details?.reject_reason && quote?.status === 'rejected'"
                        class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                        <div class="flex items-start gap-3">
                            <div class="p-2 bg-red-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-red-600">
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
                            <div v-if="details.additional_query" class="py-2 border-b border-gray-100 last:border-0">
                                <span class="block text-sm text-gray-500 mb-1">Additional Query</span>
                                <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{ details.additional_query
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
                                <UiStatusBadge :status="quote?.status" />
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-charcoal/70">Estimate</span>
                                <span class="text-sm font-medium text-secondary">
                                    {{
                                        !quote?.estimated_price
                                            ? "To be quoted"
                                            : `$${quote?.estimated_price}`
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="mb-4 text-lg font-semibold text-secondary">Notes</h2>
                        <InstructionBox :instructions="quote?.instructions" />
                    </div>



                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 class="mb-3 text-base font-semibold text-secondary">Actions</h3>
                        <slot name="actions">
                            <!-- Default Actions if needed, but usually provided by parent -->
                        </slot>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuoteStatus, OrderStatus } from "~~/shared/types/enums";

interface Props {
    quote: any;
    isAdmin: boolean;
    quoteId: string | number;
}

const props = defineProps<Props>();

const { data: deliveryDetails } = await useFetch<any>(`/api/quotes/deliver/${props.quoteId}`, {
    immediate: props.quote.status !== QuoteStatus.PENDING
});

const details = computed(() => deliveryDetails.value?.data);

</script>

<style scoped>
/* subtle polish */
.container :where(.card) {
    animation: fade-in 0.6s ease-in-out both;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
