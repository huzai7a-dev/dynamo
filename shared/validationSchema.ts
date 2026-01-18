import { z } from "zod";

const RegisterSchema = z.object({
  user_name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .describe("User Name"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .describe("Password"),

  primary_email: z
    .string()
    .email("Invalid primary email")
    .describe("Primary Email"),

  secondary_email: z
    .string()
    .email("Invalid secondary email")
    .optional()
    .or(z.literal(""))
    .describe("Secondary Email"),

  invoice_email: z
    .string()
    .email("Invalid invoice email")
    .optional()
    .or(z.literal(""))
    .describe("Invoice Email"),

  company_name: z
    .string()
    .min(1, "Company name is required")
    .describe("Company Name"),

  contact_name: z
    .string()
    .min(1, "Contact name is required")
    .describe("Contact Name"),

  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .describe("Phone Number"),

  cell_number: z
    .string()
    .optional()
    .describe("Cell Number"),

  fax_number: z
    .string()
    .max(10, "Fax number can be 10 digits long")
    .optional()
    .describe("Fax Number"),

  country: z
    .string()
    .min(1, "Country is required")
    .describe("Country"),

  city: z
    .string()
    .optional()
    .describe("City"),

  zip_code: z
    .string()
    .optional()
    .describe("Zip Code"),

  state: z
    .string()
    .optional()
    .describe("State"),

  reference: z
    .string()
    .optional()
    .describe("Reference"),

  salesMan: z
    .string()
    .optional()
    .describe("Salesman"),

  website: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .describe("Website"),

  address: z
    .string()
    .optional()
    .describe("Address"),
});


const LoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


const OrderSchema = z.object({
  orderName: z.string().min(1, 'Order name is required'),
  poNumber: z.string().optional(),
  requiredFormat: z.string().min(1, 'Format is required'),
  width: z.string().optional(),
  height: z.string().optional(),
  requiredStitch: z.string().min(1, 'Stitch is required'),
  fabric: z.string().min(1, 'Fabric is required'),
  placement: z.string().min(1, 'Placement is required'),
  numColors: z.string().optional(),
  blending: z.enum(['No', 'Yes', 'Not Sure']),
  rush: z.enum(['No', 'Yes']),
  instructions: z.string().optional(),
  attachments: z.array(z.instanceof(File)),
  faceless: z.enum(['with-outline', 'without-outline']).optional(),
})

const VectorSchema = z.object({
  vectorName: z.string().min(1, 'Vector name is required'),
  poNumber: z.string().optional(),
  requiredFormat: z.string().min(1, 'Format is required'),
  blending: z.enum(['No', 'Yes', 'Not Sure']),
  rush: z.enum(['No', 'Yes']),
  numColors: z.string().optional(),
  instructions: z.string().optional(),
  vectorType: z.string().optional(),
  attachments: z.array(z.instanceof(File)),
})

export const QuoteSchema = z.object({
  qType: z.enum(['order', 'vector']),
  title: z.string().min(1, "Title is required"),
  poNumber: z.string().optional(),
  instructions: z.string().optional(),
  estimatedPrice: z.number().nonnegative(),
  quoteData: z.record(z.any()),
  attachments: z.array(z.instanceof(File)),
});

export {
  RegisterSchema,
  LoginSchema,
  OrderSchema,
  VectorSchema
}