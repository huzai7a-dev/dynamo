import type { OrderSchema, QuoteSchema, RegisterSchema, VectorSchema } from "../validationSchema";
import { OrderStatus, PaymentStatus } from "./enums";

export type IUser = z.infer<typeof RegisterSchema>

export type OrderRequest = z.infer<typeof OrderSchema>;
export type OrderFieldsRequest = Omit<OrderRequest, 'attachments'>;
export type OrderFilesRequest = OrderRequest['attachments'];

export type VectorRequest = z.infer<typeof VectorSchema>;
export type VectorFieldsRequest = Omit<VectorRequest, 'attachments'>;
export type VectorFilesRequest = VectorRequest['attachments'];

export type QuoteRequest = z.infer<typeof QuoteSchema>;
export type QuoteFieldsRequest = Omit<QuoteRequest, 'attachments'>;
export type QuoteFilesRequest = QuoteRequest['attachments'];


export interface QueryParams {
  user_id: string;
  limit?: number;
  page?: number;
  order_number?: string;
  order_name?: string;
  customer_name?: string;
  date_from?: string;
  date_to?: string;
  data_source_type?: string;
  status?: string;
  is_free?: boolean;
  is_paid?: boolean;
  converted?: boolean;
}

export interface TableOrders {
  id: string,
  order_name: string,
  price: number,
  status: OrderStatus,
  payment_status: PaymentStatus,
  created_at: string
  customer_name?: string
  metadata?: any
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
  vector_type: string;
  vector_attachments: Attachment[]
  delivery_attachments: Attachment[]
  contact_name: string
  metadata?: any
  is_form_quote: boolean
}

export interface TableVector {
  id: string,
  vector_name: string,
  price: number,
  status: OrderStatus,
  payment_status: PaymentStatus,
  created_at: string
  contact_name: string
  is_form_quote: boolean
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

export interface OrderDelivery {
  id: string
  order_id: string
  stitches: number
  price: string
  discount?: string
  total_price?: string
  is_free?: boolean
  height?: string
  width?: string
  comments?: string
  designer_level?: string
  assign_percentage?: string
  price_criteria?: {
    maximum_price?: number
    minimum_price?: number
    thousand_stitches?: number
  }
  customer_requirement?: {
    comment_box_1?: string
    comment_box_2?: string
    comment_box_3?: string
    comment_box_4?: string
    edit_or_change?: string
    normal_delivery?: string
    edit_in_stitch_file?: string
  }
  created_at: string
  delivery_attachments?: Attachment[]
}

export type VectorDelivery = Omit<OrderDelivery, 'order_id'> & {
  vector_id: number
};

export interface OrderResponse {
  message: string;
  data: {
    orders: TableOrders[];
    pagination: Pagination;
  };
}