import type { OrderSchema, RegisterSchema } from "../validationSchema";

export type IUser = z.infer<typeof RegisterSchema>

export type OrderRequest = z.infer<typeof OrderSchema>;
export type OrderFieldsRequest = Omit<OrderRequest, 'attachments'>;
export type OrderFilesRequest = OrderRequest['attachments']; 