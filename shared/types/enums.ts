export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'processing',
    REJECTED = 'rejected',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'payable',
    NOT_REQUIRED = 'not_required'
}

export enum DataSource {
    QUOTE = 'quote',
    ORDER = 'order',
    VECTOR = 'vector',
    ALL = 'all'
}

export enum QuoteStatus {
    PENDING = 'pending',
    PROCEED = 'converted',
}

export enum EmailAccount {
    ADMIN_ACC = 'ADMIN_ACC',
    ORDER_ACC = 'ORDER_ACC',
    ACCOUNTS_ACC = 'ACCOUNTS_ACC',
}