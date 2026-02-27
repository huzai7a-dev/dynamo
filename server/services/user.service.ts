import type { IUser } from "#shared/types";
import usersRepository from "~~/server/repositories/users.repository";
import { ROLE } from "~~/shared/constants";
import EmailService from "./email.service";
import { generateProfileUpdateEmail } from "../templates/profile-update.email";
import { generateProfileUpdateAdminEmail } from "../templates/profile-update-admin.email";

class UserService {
    // constructor no longer needs useDb
    constructor() {
        // ...existing code...
    }

    async getUserByEmailOrUserName(email: string, userName: string) {
        return usersRepository.findByEmailOrUserName(email, userName);
    }

    async createUser(user: IUser) {
        return usersRepository.create(user);
    }

    async getAllUsers(filters: { id?: string; user_name?: string; email?: string; company?: string } = {}) {
        return usersRepository.getAllUsers(filters);
    }

    async getUserById(id: string) {
        const user = await usersRepository.getById(id);
        if (!user) return null;
        const u = { ...user } as any;
        delete u.password;
        return u;
    }

    async updateUserProfile(id: string, payload: Partial<IUser>) {
        // Only allow specific fields - whitelist
        const allowedFields = [
            "user_name",
            "company_name",
            "contact_name",
            "country",
            "phone_number",
            "primary_email",
            "address",
            "cell_number",
            "city",
            "fax_number",
            "invoice_email",
            "reference",
            "sales_man",
            "secondary_email",
            "state",
            "website",
            "zip_code",
        ];

        const filtered: Partial<IUser> = {};
        for (const k of allowedFields) {
            if ((payload as any)[k] !== undefined) {
                (filtered as any)[k] = (payload as any)[k];
            }
        }

        const updated = await usersRepository.updateById(id, filtered);
        if (!updated) return null;
        const u = { ...updated } as any;
        delete u.password;

        // Fire both emails in parallel — non-blocking
        if (u.primary_email) {
            Promise.all([
                EmailService.sendHtmlEmail(
                    u.primary_email,
                    'Your Profile Information Has Been Updated',
                    generateProfileUpdateEmail(u)
                ),
                EmailService.sendHtmlEmail(
                    useRuntimeConfig().emailUser as string,
                    'Client Profile Update Notification',
                    generateProfileUpdateAdminEmail(u)
                ),
            ]).catch((err) => console.error('Profile-update email failed:', err));
        }

        return u;
    }
}

export default new UserService();
