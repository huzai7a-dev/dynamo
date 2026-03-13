import type { IUser } from "#shared/types";

export const FIELD_ORDER: (keyof IUser)[] = [
    "contact_name",
    "user_name",
    "password",
    "company_name",
    "primary_email",
    "secondary_email",
    "invoice_email",
    "phone_number",
    "cell_number",
    "fax_number",
    "address",
    "city",
    "state",
    "zip_code",
    "country",
    "website",
    "reference",
    "sales_man",
];

export function formatLabel(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildTableRows(user: Partial<IUser>, ip?: string): string {
    const fields = FIELD_ORDER.filter(
        (key) => user[key] !== undefined && user[key] !== null && user[key] !== ""
    );

    const rows = fields
        .map(
            (key, index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#f8fffe" : "#ffffff"};">
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                font-weight: 600;
                color: #055d57;
                border-right: 2px solid #dff7f6;
                white-space: nowrap;
                width: 200px;
            ">${formatLabel(key as string)}</td>
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                color: #1C1C1C;
            ">${user[key]}</td>
        </tr>`
        )
        .join("");

    const ipRow = ip
        ? `
        <tr style="background-color: ${fields.length % 2 === 0 ? "#f8fffe" : "#ffffff"};">
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                font-weight: 600;
                color: #055d57;
                border-right: 2px solid #dff7f6;
                white-space: nowrap;
                width: 200px;
            ">IP Address</td>
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                color: #1C1C1C;
            ">${ip}</td>
        </tr>`
        : "";

    return rows + ipRow;
}
