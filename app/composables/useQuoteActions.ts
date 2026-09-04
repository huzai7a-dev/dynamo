export const useQuoteActions = () => {
  const toast = useToast();

  const moveToOrder = async (quoteId: string | number, qType: any) => {
    try {
      await $fetch("/api/quotes/move-to-order", {
        method: "POST",
        body: { quoteId, dataSourceType: qType },
      });
      toast.success("Quote moved to order successfully");
      return true;
    } catch (e) {
      console.error(e);
      toast.error("Failed to move quote to order");
      return false;
    }
  };

  return { moveToOrder };
};
