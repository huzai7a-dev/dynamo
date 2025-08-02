import type { RegisterSchema } from "../validationSchema";

type IUser = z.infer<typeof RegisterSchema>