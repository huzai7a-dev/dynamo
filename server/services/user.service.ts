import type { IUser } from "#shared/types";

class UserService {
    private db: ReturnType<typeof useDb>;
    constructor() {
        this.db = useDb();
    }

    async getUserByEmailOrUserName(email: string, userName: string) {
        const user = await this.db`SELECT * FROM users WHERE primary_email = ${email} OR user_name = ${userName}` as Array<IUser>;
        return user[0];
    }

    async createUser(user: IUser) {
        const result = await this.db`
            INSERT INTO users (
                user_name,
                company_name,
                contact_name,
                country,
                password,
                phone_number,
                primary_email,
                address,
                cell_number,
                city,
                fax_number,
                invoice_email,
                reference,
                secondary_email,
                state,
                website,
                zip_code
            )
            VALUES (
                ${user.user_name},
                ${user.company_name},
                ${user.contact_name},
                ${user.country},
                ${user.password},
                ${user.phone_number},
                ${user.primary_email},
                ${user.address ?? null},
                ${user.cell_number ?? null},
                ${user.city ?? null},
                ${user.fax_number ?? null},
                ${user.invoice_email ?? null},
                ${user.reference ?? null},
                ${user.secondary_email ?? null},
                ${user.state ?? null},
                ${user.website ?? null},
                ${user.zip_code ?? null}
            )
            RETURNING *;
            `;
        return result;
    }
}

export default new UserService();
