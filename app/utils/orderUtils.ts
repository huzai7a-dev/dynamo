import type { OrderStatus, PaymentStatus } from '#shared/types/enums';

export function getOrderStatusBadgeClass(status: OrderStatus | undefined): string {
  const statusMap: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return status && status in statusMap 
    ? statusMap[status] 
    : "bg-gray-100 text-gray-800 border-gray-200";
}

export function getPaymentStatusBadgeClass(status: PaymentStatus | undefined): string {
  const statusMap: Record<PaymentStatus, string> = {
    paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    unpaid: "bg-red-100 text-red-800 border-red-200",
  };

  return status && status in statusMap 
    ? statusMap[status] 
    : "bg-gray-100 text-gray-800 border-gray-200";
}

export function formatOrderStatus(status: OrderStatus | undefined): string {
  if (!status) return "UNKNOWN";
  
  return status
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPaymentStatus(status: PaymentStatus | undefined): string {
  if (!status) return "UNKNOWN";
  
  return status.charAt(0).toUpperCase() + status.slice(1);
}
