import type { OrderSchema, RegisterSchema } from "../validationSchema";
import { OrderStatus, PaymentStatus } from "./enums";

export type IUser = z.infer<typeof RegisterSchema>

export type OrderRequest = z.infer<typeof OrderSchema>;
export type OrderFieldsRequest = Omit<OrderRequest, 'attachments'>;
export type OrderFilesRequest = OrderRequest['attachments']; 

export type VectorRequest = z.infer<typeof VectorSchema>;
export type VectorFieldsRequest = Omit<VectorRequest, 'attachments'>;
export type VectorFilesRequest = VectorRequest['attachments'];

export interface QueryParams {
    user_id: string;
    limit?: number;
    page?: number;
    order_number?: string;
    order_name?: string;
    customer_name?: string;
    date_from?: string;
    date_to?: string;
}

export interface TableOrders {
    id: string,
    order_name: string,
    price: number,
    status: OrderStatus,
    payment_status: PaymentStatus,
    created_at: string 
    customer_name?: string
}

export interface IOrder {
    id: number;
    order_name: string;
    po_number: string;
    required_format: string; 
    width_in: string;        
    height_in: string;       
    fabric: string;          
    placement: string;    
    num_colors: number;
    blending: "No" | "Yes";
    rush: "No" | "Yes";
    instructions: string | null;
    status: OrderStatus;
    created_at: string; 
    updated_at: string; 
    faceless: boolean | null;
    user_id: number;
    payment_status: PaymentStatus;
    price: string;
    order_attachments: Attachment[]
    delivery_attachments: Attachment[]
  }

export interface IVector {
    id: number;
    vector_name: string;
    po_number: string;
    required_format: string;
    num_colors: number;
    blending: "No" | "Yes";
    rush: "No" | "Yes";
    instructions: string | null;
    status: OrderStatus;
    created_at: string; 
    updated_at: string; 
    user_id: number;
    payment_status: PaymentStatus;
    price: string;
    vector_attachments: Attachment[]
    delivery_attachments: Attachment[]
    contact_name: string
}

export interface TableVector {
    id: string,
    vector_name: string,
    price: number,
    status: OrderStatus,
    payment_status: PaymentStatus,
    created_at: string 
    contact_name: string
}

export interface Pagination {
    currentPage: number,
    totalPage: number
}

export interface Attachment {
    url: string
    resource_type?: string | null
    format?: string | null
    bytes?: number | null
}