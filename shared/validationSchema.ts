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

export {
    RegisterSchema
}