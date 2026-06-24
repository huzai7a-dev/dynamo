<template>
  <div class="flex flex-col gap-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon name="CircleDollarSign" class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 class="text-2xl font-black text-secondary tracking-tight">Unpaid Invoice</h3>
        <p class="text-sm text-charcoal/50 font-medium">Manage and take action on your unpaid invoices.</p>
      </div>
    </div>

    <!-- Payment Success Banner -->
    <Transition name="slide-down">
      <div
        v-if="showSuccessBanner"
        class="flex items-center gap-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-sm"
      >
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Icon name="CheckCircle" class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm">Payment Submitted Successfully!</p>
          <p class="text-xs text-emerald-600 mt-0.5">Your payment is being processed. This invoice will update to <strong>Paid</strong> shortly once 2Checkout confirms.</p>
        </div>
        <button @click="showSuccessBanner = false" class="text-emerald-400 hover:text-emerald-600">
          <Icon name="X" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center p-4">
      <div class="bg-rose-50 text-rose-600 p-8 rounded-3xl border border-rose-100 text-center max-w-md shadow-sm">
        <Icon name="AlertCircle" class="w-12 h-12 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2">Error Loading Invoices</h3>
        <p class="text-sm opacity-80 font-medium">We couldn't load your unpaid invoices. Please try refreshing.</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Empty State -->
      <InvoiceEmptyState
        v-if="transactions.length === 0"
        title="No Unpaid Invoices"
        description="You're all caught up! There are no pending invoices that need your attention right now."
        action-label="Create New Invoice"
        action-icon="FilePlus"
        action-route="/invoices"
      />

      <!-- Data State -->
      <template v-else>
        <!-- Invoice Table -->
        <div class="overflow-x-auto rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table class="min-w-full table-auto border-collapse text-sm font-sans">
            <!-- Header -->
            <thead class="bg-white border-b border-slate-200">
              <tr>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="CirclePlus" class="w-3.5 h-3.5 text-primary/50" />
                    <span>#SR</span>
                  </div>
                </th>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="FileText" class="w-3.5 h-3.5 text-primary/50" />
                    <span>Invoice Number</span>
                  </div>
                </th>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="CircleDollarSign" class="w-3.5 h-3.5 text-primary/50" />
                    <span>Price</span>
                  </div>
                </th>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="Tag" class="w-3.5 h-3.5 text-primary/50" />
                    <span>Price Status</span>
                  </div>
                </th>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="Calendar" class="w-3.5 h-3.5 text-primary/50" />
                    <span>Date</span>
                  </div>
                </th>
                <th class="px-5 py-4 text-center text-xs font-bold text-charcoal/70 uppercase tracking-widest">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon name="Settings" class="w-3.5 h-3.5 text-primary/50" />
                    <span>Action</span>
                  </div>
                </th>
              </tr>
            </thead>

            <!-- Body -->
            <tbody>
              <tr
                v-for="(tx, index) in transactions"
                :key="tx.transactionRef"
                class="bg-white border-b border-slate-100 last:border-b-0 hover:bg-primary/[0.02] transition-colors duration-150"
              >
                <!-- #SR -->
                <td class="px-5 py-4 text-center">
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {{ index + 1 }}
                  </span>
                </td>
                <!-- Invoice Number + Copy -->
                <td class="px-5 py-4 text-center">
                  <div class="text-sm font-black text-secondary tracking-tight">{{ tx.transactionRef }}</div>
                  <button
                    @click.stop="copyToClipboard(tx.transactionRef)"
                    class="inline-flex items-center gap-1 text-xs text-primary hover:text-teal-700 font-medium mt-1 transition-colors"
                  >
                    <Icon name="Copy" class="w-3 h-3" />
                    {{ copiedRef === tx.transactionRef ? 'Copied!' : 'Copy' }}
                  </button>
                </td>
                <!-- Price -->
                <td class="px-5 py-4 text-center text-sm font-black text-primary">
                  ${{ Number(tx.amount).toFixed(2) }}
                </td>
                <!-- Price Status -->
                <td class="px-5 py-4 text-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    unPaid
                  </span>
                </td>
                <!-- Date -->
                <td class="px-5 py-4 text-center">
                  <div class="text-sm text-charcoal/70">{{ formatDatePrimary(tx.createdAt) }}</div>
                  <div class="text-xs text-charcoal/40 mt-0.5">{{ formatDateSecondary(tx.createdAt) }}</div>
                </td>
                <!-- Action -->
                <td class="px-5 py-4 text-center">
                  <div class="flex items-center justify-center gap-2 flex-wrap">
                    <!-- Revert -->
                    <button
                      @click="confirmRevert(tx)"
                      :disabled="revertingRef === tx.transactionRef"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
                    >
                      <template v-if="revertingRef === tx.transactionRef">
                        <Icon name="RefreshCw" class="w-3 h-3 animate-spin" /> Reverting...
                      </template>
                      <template v-else>
                        <Icon name="RefreshCw" class="w-3 h-3" /> Revert
                      </template>
                    </button>

                    <!-- Details -->
                    <button
                      @click="openDetails(tx)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      <Icon name="Eye" class="w-3 h-3" />
                      Details
                    </button>

                    <!-- Download PDF -->
                    <button
                      @click="downloadPdf(tx)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      <Icon name="Download" class="w-3 h-3" />
                      Download PDF
                    </button>

                    <!-- Pay Now -->
                    <button
                      @click="payNow(tx)"
                      :disabled="payingRef === tx.transactionRef"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Icon v-if="payingRef === tx.transactionRef" name="RefreshCw" class="w-3 h-3 animate-spin" />
                      <Icon v-else name="CircleDollarSign" class="w-3 h-3" />
                      {{ payingRef === tx.transactionRef ? 'Redirecting...' : 'Pay Now' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- "No more" footer message -->
        <div class="flex flex-col items-center justify-center py-10">
          <div class="mb-4">
            <svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="2" width="50" height="40" rx="4" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
              <line x1="25" y1="14" x2="55" y2="14" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <line x1="25" y1="22" x2="48" y2="22" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <line x1="25" y1="30" x2="52" y2="30" stroke="#d1fae5" stroke-width="2" stroke-linecap="round"/>
              <circle cx="40" cy="32" r="12" fill="#dcfce7" stroke="#86efac" stroke-width="1"/>
              <text x="40" y="37" text-anchor="middle" fill="#16a34a" font-size="12" font-weight="bold">$</text>
            </svg>
          </div>
          <p class="text-sm font-bold text-secondary">No more unpaid invoices!</p>
          <p class="text-xs text-charcoal/50 font-medium mt-1">Great job! All your invoices are paid.</p>
        </div>
      </template>
    </div>

    <!-- Details Modal -->
    <UiModal v-model="showDetailsModal">
      <div v-if="selectedTx">
        <h2 class="text-lg font-black text-secondary mb-1">Invoice Detail</h2>
        <p class="text-sm font-bold text-secondary mb-4">
          Invoice Number : <span class="font-black">{{ selectedTx.transactionRef }}</span>
        </p>

        <div class="overflow-x-auto rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full table-auto text-sm">
            <thead class="bg-secondary text-white">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">sno</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Order Number</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Design Name</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Price</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Order Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in selectedTxDetails"
                :key="`detail-${idx}`"
                class="border-b border-gray-100 last:border-b-0"
              >
                <td class="px-4 py-3 text-gray-600">{{ idx + 1 }}</td>
                <td class="px-4 py-3 font-bold text-secondary">
                  {{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}
                </td>
                <td class="px-4 py-3 text-gray-700">{{ item.name }}</td>
                <td class="px-4 py-3 font-bold text-primary">{{ Number(item.price || 0) }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(item.date) }}</td>
              </tr>

              <!-- Total row -->
              <tr class="bg-secondary/80">
                <td colspan="3" class="px-4 py-3 text-white font-bold">Total Amount</td>
                <td class="px-4 py-3 text-white font-black text-base">
                  {{ selectedTxDetails.reduce((s, i) => s + Number(i.price || 0), 0) }}
                </td>
                <td class="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="detailsLoading" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </UiModal>

    <!-- Revert Confirm Modal -->
    <UiModal v-model="showRevertModal">
      <div class="text-center py-4">
        <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertTriangle" class="w-8 h-8 text-amber-600" />
        </div>
        <h3 class="text-xl font-black text-secondary mb-2">Revert Invoice?</h3>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">
          This will delete the invoice and return all included orders/vectors back to your
          <span class="font-bold text-secondary">Invoice</span> page as unpaid items.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="showRevertModal = false"
            class="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeRevert"
            :disabled="!!revertingRef"
            class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            Yes, Revert
          </button>
        </div>
      </div>
    </UiModal>

    <!-- Hidden PDF print area -->
    <div id="pdf-print-area" class="hidden">
      <div v-if="pdfTx" style="font-family: 'Inter', sans-serif; background: #fff; width: 800px; padding: 40px; box-sizing: border-box; margin: 0 auto; color: #1e293b;">
        <!-- Header -->
        <table style="width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
          <tr>
            <td style="width: 50%; vertical-align: middle;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <img src="/images/logo-icon.PNG" alt="Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                <div>
                  <h1 style="margin: 0; font-size: 24px; color: #003438; text-transform: uppercase; letter-spacing: 1px;">{{ COMPANY.name }}</h1>
                  <p style="margin: 4px 0 0; font-size: 10px; color: #64748b; letter-spacing: 1.5px;">{{ COMPANY.tagline }}</p>
                </div>
              </div>
            </td>
            <td style="width: 50%; text-align: right; vertical-align: middle;">
              <h1 style="margin: 0 0 15px 0; font-size: 36px; color: #003438; font-weight: 900; letter-spacing: 2px;">INVOICE</h1>
              <table style="width: auto; margin-left: auto; font-size: 14px; color: #334155;">
                <tr>
                  <td style="padding-right: 15px; font-weight: bold; padding-bottom: 5px;">Invoice #</td>
                  <td style="font-weight: 800; color: #0f172a; padding-bottom: 5px;">{{ pdfTx.transactionRef }}</td>
                </tr>
                <tr>
                  <td style="padding-right: 15px; font-weight: bold;">Date</td>
                  <td>{{ formatDateShort(pdfTx.createdAt) }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Bill To / Bill From -->
        <table style="width: 100%; margin-bottom: 30px; border-spacing: 15px 0; margin-left: -15px; margin-right: -15px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 0 15px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; position: relative; padding: 30px 20px 20px;">
                <div style="position: absolute; top: -12px; left: 15px; background: #003438; color: white; padding: 4px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;">
                  BILL FROM
                </div>
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #0f172a;">{{ COMPANY.name }}</h3>
                <table style="font-size: 13px; color: #475569; line-height: 1.6;">
                  <tr><td style="padding-bottom: 8px;"><strong>Email:</strong></td><td style="padding-bottom: 8px; padding-left: 10px;">{{ COMPANY.accountsEmail || COMPANY.email }}</td></tr>
                  <tr><td style="padding-bottom: 8px;"><strong>Phone:</strong></td><td style="padding-bottom: 8px; padding-left: 10px;">{{ COMPANY.phone }}</td></tr>
                  <tr><td style="padding-bottom: 8px; vertical-align: top;"><strong>Address:</strong></td><td style="padding-bottom: 8px; padding-left: 10px;">{{ COMPANY.address }}</td></tr>
                </table>
              </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0 15px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; position: relative; padding: 30px 20px 20px;">
                <div style="position: absolute; top: -12px; left: 15px; background: #eab308; color: white; padding: 4px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;">
                  BILL TO
                </div>
                <template v-if="pdfUser">
                  <table style="font-size: 13px; color: #475569; line-height: 1.6; width: 100%;">
                    <tr><td style="padding-bottom: 8px; width: 70px;"><strong>Name:</strong></td><td style="padding-bottom: 8px; color: #0f172a; font-weight: 600;">{{ pdfUser.name }}</td></tr>
                    <tr><td style="padding-bottom: 8px;"><strong>E-mail:</strong></td><td style="padding-bottom: 8px; color: #0f172a; font-weight: 600;">{{ pdfUser.email }}</td></tr>
                    <tr><td style="padding-bottom: 8px;"><strong>Company:</strong></td><td style="padding-bottom: 8px; color: #0f172a; font-weight: 600;">{{ pdfUser.company }}</td></tr>
                    <tr><td style="padding-bottom: 8px;"><strong>Date:</strong></td><td style="padding-bottom: 8px; color: #0f172a; font-weight: 600;">{{ formatDateShort(pdfTx.createdAt) }}</td></tr>
                  </table>
                </template>
              </div>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #003438; color: white;">
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">#SR</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">Design No</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">Design Name</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">PO Number</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">Payment Status</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-right: 1px solid rgba(255,255,255,0.2);">Received Date</th>
              <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in pdfItems" :key="idx" :style="{ background: idx % 2 === 0 ? '#f8fafc' : '#ffffff', borderBottom: '1px solid #e2e8f0' }">
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">{{ idx + 1 }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: 600; color: #0f172a; border-right: 1px solid #e2e8f0;">
                {{ item.type === 'order' ? 'OR' : 'VR' }}-{{ item.id }}
              </td>
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">{{ item.name }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">{{ item.poNumber || '-' }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">Receivable</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; color: #475569; border-right: 1px solid #e2e8f0;">{{ formatDateShort(item.date) }}</td>
              <td style="padding: 12px; text-align: center; font-size: 13px; font-weight: bold; color: #0f172a;">${{ Number(item.price || 0).toFixed(0) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="background: #e2e8f0; padding: 12px; text-align: right; font-weight: 800; font-size: 14px; color: #003438; letter-spacing: 1px;">TOTAL</td>
              <td style="background: #003438; padding: 12px; text-align: center; font-weight: 800; font-size: 14px; color: white;">${{ Number(pdfTx.amount).toFixed(0) }}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Note & Payment Info -->
        <table style="width: 100%; border-spacing: 15px 0; margin-left: -15px; margin-right: -15px; margin-bottom: 40px;">
          <tr>
            <td style="width: 40%; vertical-align: top; padding: 0 15px;">
              <div style="border: 1px solid #003438; border-radius: 8px; padding: 20px;">
                <div style="font-size: 14px; font-weight: bold; color: #003438; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                  NOTE
                </div>
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.6;">
                  If you have an outstanding balance: please pay it as soon as possible to avoid service interruptions. Accounts delinquent for over 7 days are subject to suspension and/or deletion.
                </p>
              </div>
            </td>
            <td style="width: 60%; vertical-align: top; padding: 0 15px;">
              <div style="border: 1px solid #eab308; border-radius: 8px; padding: 20px; background: #fffbeb;">
                <div style="font-size: 14px; font-weight: bold; color: #eab308; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                  PAYMENT INFORMATION
                </div>
                <table style="width: 100%; font-size: 12px;">
                  <tr>
                    <td style="width: 40%; vertical-align: top; border-right: 1px solid #fcd34d; padding-right: 15px;">
                      <div style="font-weight: 600; margin-bottom: 10px; color: #0f172a;">We accept:</div>
                      <div style="display: flex; gap: 8px;">
                        <!-- Placeholders for card logos -->
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #1d4ed8;">VISA</div>
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #dc2626;">MC</div>
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #2563eb;">AMEX</div>
                        <div style="background: white; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-size: 9px; font-weight: bold; color: #0369a1;">PayPal</div>
                      </div>
                    </td>
                    <td style="width: 60%; vertical-align: top; padding-left: 15px;">
                      <table style="width: 100%; color: #334155; line-height: 1.6;">
                        <tr><td colspan="2" style="font-weight: 600; color: #0f172a; padding-bottom: 4px;">Bank Transfer</td></tr>
                        <tr><td style="font-weight: 600;">Account Name:</td><td>{{ PAYMENT_INFO.accountName }}</td></tr>
                        <tr><td style="font-weight: 600;">Bank Name:</td><td>{{ PAYMENT_INFO.bankName }}</td></tr>
                        <tr><td style="font-weight: 600;">Account Number:</td><td>{{ PAYMENT_INFO.accountNumber }}</td></tr>
                        <tr><td style="font-weight: 600;">Routing Number:</td><td>{{ PAYMENT_INFO.routingNumber }}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- Thank You -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 5px 0; font-family: 'Playfair Display', serif; font-style: italic; font-size: 32px; color: #003438;">Thank you!</h2>
          <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">WE APPRECIATE YOUR BUSINESS</p>
        </div>

        <!-- Footer -->
        <div style="background: #003438; color: white; padding: 15px 20px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 11px; border-bottom: 4px solid #eab308;">
          <div style="display: flex; gap: 20px;">
            <span>{{ COMPANY.website }}</span>
            <span>{{ COMPANY.phone }}</span>
            <span>{{ COMPANY.email }}</span>
          </div>
          <div style="text-align: right;">
            {{ COMPANY.address }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { COMPANY, PAYMENT_INFO } from '~/constants';

definePageMeta({
  name: "Unpaid Invoices",
  layout: "portal",
  middleware: ["auth"],
});

const toast = useToast();
const route = useRoute();

// ── Payment Success Banner ─────────────────────────────────
// Show when returning from 2Checkout with ?payment=success
const showSuccessBanner = ref(route.query.payment === 'success');

// Clean the query param from the URL without reloading
if (showSuccessBanner.value) {
  const router = useRouter();
  router.replace({ query: { ...route.query, payment: undefined, ref: undefined } });
}

// Fetch all pending transactions
const { data, pending, error, refresh } = await useFetch<any>('/api/invoices');
const transactions = computed(() => data.value?.transactions || []);

// ── Copy to Clipboard ─────────────────────────────────────
const copiedRef = ref<string | null>(null);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedRef.value = text;
    toast.success('Copied to clipboard!');
    setTimeout(() => {
      copiedRef.value = null;
    }, 2000);
  } catch {
    toast.error('Failed to copy');
  }
};

// ── Details Modal ──────────────────────────────────────────
const showDetailsModal = ref(false);
const selectedTx = ref<any>(null);
const selectedTxDetails = ref<any[]>([]);
const detailsLoading = ref(false);

const openDetails = async (tx: any) => {
  selectedTx.value = tx;
  showDetailsModal.value = true;
  detailsLoading.value = true;

  try {
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    selectedTxDetails.value = detail?.items || [];
  } catch (e) {
    toast.error('Failed to load invoice details');
    selectedTxDetails.value = [];
  } finally {
    detailsLoading.value = false;
  }
};

// ── Revert ─────────────────────────────────────────────────
const showRevertModal = ref(false);
const pendingRevertTx = ref<any>(null);
const revertingRef = ref<string | null>(null);

const confirmRevert = (tx: any) => {
  pendingRevertTx.value = tx;
  showRevertModal.value = true;
};

const executeRevert = async () => {
  if (!pendingRevertTx.value) return;
  const tx = pendingRevertTx.value;

  showRevertModal.value = false;
  revertingRef.value = tx.transactionRef;

  try {
    await $fetch(`/api/invoices/${tx.transactionRef}`, { method: 'DELETE' });
    toast.success('Invoice reverted. Items returned to Invoice page.');
    await refresh();
  } catch (err: any) {
    toast.error(err.data?.message || 'Failed to revert invoice');
  } finally {
    revertingRef.value = null;
    pendingRevertTx.value = null;
  }
};

// ── Pay Now ────────────────────────────────────────────────
const payingRef = ref<string | null>(null);

const payNow = async (tx: any) => {
  payingRef.value = tx.transactionRef;
  try {
    const { checkoutUrl } = await $fetch<{ checkoutUrl: string }>(
      `/api/invoices/${tx.transactionRef}/pay-link`,
      { method: 'POST' }
    );
    // Redirect the browser to 2Checkout
    window.location.href = checkoutUrl;
  } catch (err: any) {
    toast.error(err.data?.message || 'Failed to initiate payment. Please try again.');
    payingRef.value = null;
  }
  // Note: don't reset payingRef on success — user is being redirected away
};

// ── PDF Download ───────────────────────────────────────────
const pdfTx = ref<any>(null);
const pdfItems = ref<any[]>([]);
const pdfUser = ref<any>(null);

const downloadPdf = async (tx: any) => {
  try {
    // Fetch detail for PDF
    const detail = await $fetch<any>(`/api/invoices/${tx.transactionRef}`);
    pdfTx.value = detail; // detail contains user and enriched items
    pdfItems.value = detail?.items || [];
    pdfUser.value = detail?.user || null;

    await nextTick();

    const printArea = document.getElementById('pdf-print-area');
    if (!printArea) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${tx.transactionRef}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (err) {
    toast.error('Failed to prepare PDF. Please try again.');
  }
};

// ── Helpers ────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// Date formatting — primary: "May 28, 2026", secondary: "02:33 PM"
const formatDatePrimary = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateSecondary = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDateShort = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>
