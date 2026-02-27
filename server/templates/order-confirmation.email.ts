import type { OrderFieldsRequest } from "#shared/types";
import type { UploadedAsset } from "../services/upload.service";

interface OrderEmailData {
    orderId: number;
    fields: OrderFieldsRequest;
    uploaded: UploadedAsset[];
    user: { contact_name?: string; user_name?: string };
}

function formatValue(value: any): string {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
}

function buildOrderRows(fields: OrderFieldsRequest, orderId: number): string {
    const rows: { label: string; value: string }[] = [
        { label: "Order ID", value: `#${orderId}` },
        { label: "Order Name", value: formatValue(fields.orderName) },
        { label: "PO Number", value: formatValue(fields.poNumber) },
        { label: "Required Format", value: formatValue(fields.requiredFormat) },
        { label: "Required Stitch", value: formatValue(fields.requiredStitch) },
        { label: "Fabric", value: formatValue(fields.fabric) },
        { label: "Placement", value: formatValue(fields.placement) },
        { label: "Width (in)", value: formatValue(fields.width) },
        { label: "Height (in)", value: formatValue(fields.height) },
        { label: "Number of Colors", value: formatValue(fields.numColors) },
        { label: "Blending", value: formatValue(fields.blending) },
        { label: "Rush", value: formatValue(fields.rush) },
        { label: "Faceless", value: formatValue(fields.faceless) },
        { label: "Instructions", value: formatValue(fields.instructions) },
    ];

    return rows
        .filter((r) => r.value !== "—" || ["Order ID", "Order Name", "Required Format", "Required Stitch", "Fabric", "Placement", "Blending", "Rush"].includes(r.label))
        .map((row, index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#f8fffe" : "#ffffff"};">
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                font-weight: 600;
                color: #055d57;
                border-right: 2px solid #dff7f6;
                white-space: nowrap;
                width: 180px;
            ">${row.label}</td>
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                color: #1C1C1C;
            ">${row.value}</td>
        </tr>`)
        .join("");
}

function buildAttachmentRows(uploaded: UploadedAsset[]): string {
    if (!uploaded.length) return "";

    const attachmentLinks = uploaded
        .map((a, i) => `
            <tr>
                <td style="padding: 8px 0;">
                    <a href="${a.url}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        font-family: 'Inter', Arial, sans-serif;
                        font-size: 13.5px;
                        color: #008080;
                        text-decoration: none;
                        font-weight: 500;
                    ">
                        <span style="font-size: 14px;">📎</span>
                        Attachment ${i + 1}${a.originalFilename ? ` — ${a.originalFilename}` : ""}
                    </a>
                </td>
            </tr>`)
        .join("");

    return `
    <!-- Attachments Section -->
    <tr>
        <td style="padding: 0 40px 28px 40px;">
            <div style="border-left: 4px solid #008080; padding-left: 12px; margin-bottom: 14px;">
                <span style="
                    font-family: 'Poppins', 'Inter', Arial, sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: #008080;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">Attachments</span>
            </div>
            <table cellpadding="0" cellspacing="0" style="
                background: #f8fffe;
                border: 1.5px solid #dff7f6;
                border-radius: 8px;
                padding: 12px 18px;
                width: 100%;
            ">
                ${attachmentLinks}
            </table>
        </td>
    </tr>`;
}

export function generateOrderConfirmationEmail(data: OrderEmailData): string {
    const { orderId, fields, uploaded, user } = data;
    const displayName = user.contact_name || user.user_name || "Valued Customer";
    const orderRows = buildOrderRows(fields, orderId);
    const attachmentSection = buildAttachmentRows(uploaded);
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Received – ${fields.orderName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fafa; font-family: 'Inter', Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fafa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,128,128,0.10);
                    max-width: 620px;
                    width: 100%;
                ">
                    <!-- Header -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #008080 0%, #20b2aa 100%);
                            padding: 38px 40px 32px 40px;
                            text-align: center;
                        ">
                            <div style="
                                display: inline-block;
                                background: rgba(255,255,255,0.14);
                                border-radius: 50px;
                                padding: 8px 28px;
                                margin-bottom: 18px;
                            ">
                                <span style="
                                    font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                    font-size: 20px;
                                    font-weight: 700;
                                    color: #ffffff;
                                    letter-spacing: 0.5px;
                                ">✦ Dynamo Stitches</span>
                            </div>
                            <h1 style="
                                margin: 0;
                                font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                font-size: 22px;
                                font-weight: 700;
                                color: #ffffff;
                                line-height: 1.3;
                            ">Your Order Has Been Received</h1>
                            <p style="
                                margin: 8px 0 0 0;
                                font-size: 15px;
                                color: rgba(255,255,255,0.90);
                                font-family: 'Inter', Arial, sans-serif;
                                font-weight: 500;
                            ">${fields.orderName} &nbsp;·&nbsp; #${orderId}</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 32px 40px 20px 40px;">
                            <p style="
                                margin: 0 0 12px 0;
                                font-size: 16px;
                                font-weight: 600;
                                color: #1C1C1C;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Dear ${displayName},</p>
                            <p style="
                                margin: 0 0 10px 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Thank you for placing your order with <strong style="color: #008080;">Dynamo Stitches</strong>. Your order has been successfully received and is now being processed by our team.</p>
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">You may also monitor your order status within your account under <strong>Order Records</strong>. After signing in, you will be able to download your files directly from the portal.</p>
                        </td>
                    </tr>

                    <!-- Section Label -->
                    <tr>
                        <td style="padding: 8px 40px 12px 40px;">
                            <div style="border-left: 4px solid #008080; padding-left: 12px;">
                                <span style="
                                    font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                    font-size: 15px;
                                    font-weight: 700;
                                    color: #008080;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                ">Request Order Details</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Order Details Table -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="
                                border-collapse: collapse;
                                border-radius: 8px;
                                overflow: hidden;
                                border: 1.5px solid #dff7f6;
                            ">
                                <tr style="background: linear-gradient(90deg, #008080 0%, #20b2aa 100%);">
                                    <th style="
                                        padding: 11px 18px;
                                        font-family: 'Inter', Arial, sans-serif;
                                        font-size: 12px;
                                        font-weight: 700;
                                        color: #ffffff;
                                        text-align: left;
                                        letter-spacing: 0.6px;
                                        text-transform: uppercase;
                                        border-right: 1.5px solid rgba(255,255,255,0.2);
                                        width: 180px;
                                    ">Field</th>
                                    <th style="
                                        padding: 11px 18px;
                                        font-family: 'Inter', Arial, sans-serif;
                                        font-size: 12px;
                                        font-weight: 700;
                                        color: #ffffff;
                                        text-align: left;
                                        letter-spacing: 0.6px;
                                        text-transform: uppercase;
                                    ">Details</th>
                                </tr>
                                ${orderRows}
                            </table>
                        </td>
                    </tr>

                    ${attachmentSection}

                    <!-- Closing -->
                    <tr>
                        <td style="padding: 0 40px 28px 40px;">
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Feel free to reach out if you have any questions or concerns.</p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <hr style="border: none; border-top: 1.5px solid #dff7f6; margin: 0;" />
                        </td>
                    </tr>

                    <!-- Signature -->
                    <tr>
                        <td style="padding: 26px 40px 32px 40px;">
                            <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151; font-family: 'Inter', Arial, sans-serif;">Regards,</p>
                            <p style="margin: 0 0 18px 0; font-size: 15px; font-weight: 700; color: #008080; font-family: 'Poppins', 'Inter', Arial, sans-serif;">Dynamo Stitches Team</p>

                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">✉</td>
                                    <td style="padding-bottom: 6px;">
                                        <a href="mailto:order@dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">order@dynamostitches.com</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">🌐</td>
                                    <td style="padding-bottom: 6px;">
                                        <a href="https://www.dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">www.dynamostitches.com</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">📞</td>
                                    <td style="padding-bottom: 6px;">
                                        <span style="font-size: 13.5px; color: #374151; font-family: 'Inter', Arial, sans-serif;">+1 (469)-819-2874</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">👤</td>
                                    <td>
                                        <a href="https://customer.dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">customer.dynamostitches.com</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #008080 0%, #20b2aa 100%);
                            padding: 16px 40px;
                            text-align: center;
                        ">
                            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.8); font-family: 'Inter', Arial, sans-serif;">
                                © ${year} Dynamo Stitches. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
}
