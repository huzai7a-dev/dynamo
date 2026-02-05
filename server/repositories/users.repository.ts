import type { IUser } from "#shared/types";
import { ROLE } from "~~/shared/constants";

class UsersRepository {
	private db: ReturnType<typeof useDb>;
	constructor() {
		this.db = useDb();
	}

	async findByEmailOrUserName(email: string, userName: string) {
		const user = await this.db`SELECT * FROM users WHERE primary_email = ${email} OR user_name = ${userName}` as Array<IUser>;
		return user[0] ?? null;
	}

	async create(user: IUser) {
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
                sales_man,
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
                ${user.sales_man ?? null},
                ${user.secondary_email ?? null},
                ${user.state ?? null},
                ${user.website ?? null},
                ${user.zip_code ?? null}
            )
            RETURNING *;
        ` as Array<IUser>;
		return result[0] ?? null;
	}

	async getAllUsers(filters: { id?: string; user_name?: string; email?: string; company?: string } = {}) {
		const { id, user_name, email, company } = filters;

		let query: any = this.db`SELECT * FROM users WHERE role != ${ROLE.Admin}`;

		if (id) {
			query = this.db`${query} AND id::text LIKE ${'%' + id + '%'}`;
		}
		if (user_name) {
			query = this.db`${query} AND contact_name ILIKE ${'%' + user_name + '%'}`;
		}
		if (email) {
			query = this.db`${query} AND primary_email ILIKE ${'%' + email + '%'}`;
		}
		if (company) {
			query = this.db`${query} AND company_name ILIKE ${'%' + company + '%'}`;
		}

		const users = await query as Array<IUser>;
		return users;
	}

	async getById(id: string) {
		const users = await this.db`SELECT * FROM users WHERE id = ${id}` as Array<IUser>;
		return users[0] ?? null;
	}

	async updateById(id: string, data: Partial<IUser>) {
		// Update only allowed profile fields; use COALESCE to preserve existing values
		const result = await this.db`
			UPDATE users SET
				user_name = COALESCE(${data.user_name}::varchar, user_name),
				company_name = COALESCE(${data.company_name}::varchar, company_name),
				contact_name = COALESCE(${data.contact_name}::varchar, contact_name),
				country = COALESCE(${data.country}::varchar, country),
				phone_number = COALESCE(${data.phone_number}::varchar, phone_number),
				primary_email = COALESCE(${data.primary_email}::varchar, primary_email),
				address = COALESCE(${data.address}::text, address),
				cell_number = COALESCE(${data.cell_number}::varchar, cell_number),
				city = COALESCE(${data.city}::varchar, city),
				fax_number = COALESCE(${data.fax_number}::varchar, fax_number),
				invoice_email = COALESCE(${data.invoice_email}::varchar, invoice_email),
				reference = COALESCE(${data.reference}::varchar, reference),
				sales_man = COALESCE(${data.sales_man}::varchar, sales_man),
				secondary_email = COALESCE(${data.secondary_email}::varchar, secondary_email),
				state = COALESCE(${data.state}::varchar, state),
				website = COALESCE(${data.website}::varchar, website),
				zip_code = COALESCE(${data.zip_code}::varchar, zip_code),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
			RETURNING *;
		` as Array<IUser>;

		const user = result[0] ?? null;
		return user;
	}
}

export default new UsersRepository();