export const useInvoicePdf = () => {
  const toast = useToast();
  const downloadingRef = ref<string | null>(null);

  const downloadInvoicePdf = async (transactionRef: string) => {
    if (downloadingRef.value) return;
    downloadingRef.value = transactionRef;

    try {
      const res = await fetch(`/api/invoices/${transactionRef}/pdf`);
      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${transactionRef}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      downloadingRef.value = null;
    }
  };

  return { downloadInvoicePdf, downloadingRef };
};
