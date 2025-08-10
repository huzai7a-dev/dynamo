import type { OrderSchema, RegisterSchema } from "../validationSchema";

export type IUser = z.infer<typeof RegisterSchema>

export type OrderRequest = z.infer<typeof OrderSchema>;
export type OrderFieldsRequest = Omit<OrderRequest, 'attachments'>;
export type OrderFilesRequest = OrderRequest['attachments']; 

export interface OrderParams {
    user_id: string;
    limit?: number;
    page?: number;
    order_number?: string;
    order_name?: string;
    date_from?: string;
    date_to?: string;
}