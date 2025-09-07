export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    REJECTED = 'rejected',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
  }
  
export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'unpaid'
}
  
export enum DataSource {
    QUOTE = 'quote',
    ORDER = 'order',
    VECTOR = 'vector',
}

export enum QuoteStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    PROCEED = 'proceeded',
}