import type { UploadedAsset } from "../services/upload.service";

interface VectorDeliveryEmailData {
    vectorId: number;
    vectorName: string;
    user: { contact_name?: string; user_name?: string };
    vector: Record<string, any>;
    delivery: Record<string, any>;
    deliveryAttachments: UploadedAsset[];
}

function fmt(value: any, unit = ""): string {
    if (value === null || value === undefined || value === "") return "—";
    return `${value}${unit}`;
}

function buildCombinedRows(vector: Record<string, any>, delivery: Record<string, any>): string {
    const rows: { label: string; value: string; section?: string }[] = [
        // Vector Info
        { label: "Vector ID", value: `#${vector.id}`, section: "Vector" },
        { label: "Vector Name", value: fmt(vector.vector_name), section: "Vector" },
        { label: "PO Number", value: fmt(vector.po_number), section: "Vector" },
        { label: "Format", value: fmt(vector.required_format), section: "Vector" },
        { label: "Vector Type", value: fmt(vector.vector_type), section: "Vector" },
        { label: "Colors", value: fmt(vector.num_colors), section: "Vector" },
        { label: "Blending", value: fmt(vector.blending), section: "Vector" },
        { label: "Rush", value: fmt(vector.rush), section: "Vector" },
        // Delivery Info
        { label: "Stitches", value: fmt(delivery.stitches), section: "Delivery" },
        { label: "Width (in)", value: fmt(delivery.width), section: "Delivery" },
        { label: "Height (in)", value: fmt(delivery.height), section: "Delivery" },
        { label: "Price", value: delivery.is_free ? "Free" : fmt(delivery.price, " USD"), section: "Delivery" },
        { label: "Discount", value: fmt(delivery.discount, " USD"), section: "Delivery" },
        { label: "Total Price", value: delivery.is_free ? "Free" : fmt(delivery.total_price, " USD"), section: "Delivery" },
        { label: "Comments", value: fmt(delivery.comments), section: "Delivery" },
    ];

    const visible = rows.filter((r) => r.value !== "—");
    let lastSection = "";
    let html = "";
    let rowIndex = 0;

    for (const row of visible) {
        if (row.section && row.section !== lastSection) {
            lastSection = row.section;
            html += `
        <tr>
            <td colspan="2" style="
                padding: 10px 18px 8px 18px;
                font-family: 'Poppins', 'Inter', Arial, sans-serif;
                font-size: 11.5px;
                font-weight: 700;
                color: #008080;
                background-color: #f0fefe;
                text-transform: uppercase;
                letter-spacing: 0.7px;
                border-top: 1.5px solid #dff7f6;
            ">${row.section} Details</td>
        </tr>`;
            rowIndex = 0;
        }

        html += `
        <tr style="background-color: ${rowIndex % 2 === 0 ? "#f8fffe" : "#ffffff"};">
            <td style="
                padding: 11px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                font-weight: 600;
                color: #055d57;
                border-right: 2px solid #dff7f6;
                white-space: nowrap;
                width: 180px;
            ">${row.label}</td>
            <td style="
                padding: 11px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                color: #1C1C1C;
            ">${row.value}</td>
        </tr>`;
        rowIndex++;
    }

    return html;
}

export function generateVectorDeliveryEmail(data: VectorDeliveryEmailData): string {
    const { vectorId, vectorName, user, vector, delivery, deliveryAttachments } = data;
    const displayName = user.contact_name || user.user_name || "Valued Customer";
    const combinedRows = buildCombinedRows(vector, delivery);
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Vector is Ready – ${vectorName}</title>
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
                            ">Your Vector is Ready!</h1>
                            <p style="
                                margin: 8px 0 0 0;
                                font-size: 15px;
                                color: rgba(255,255,255,0.90);
                                font-family: 'Inter', Arial, sans-serif;
                                font-weight: 500;
                            ">${vectorName} &nbsp;·&nbsp; #${vectorId}</p>
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
                            ">Your vector has been <strong style="color: #008080;">completed</strong>.</p>
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">The files are available in your account under <strong>Vector Records</strong>. Please log in to review and download them. If any revisions are needed, you may submit them through your account.</p>
                        </td>
                    </tr>

                    <!-- Thank you -->
                    <tr>
                        <td style="padding: 0 40px 20px 40px;">
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Thank you for choosing <strong style="color: #008080;">Dynamo Stitches</strong>.</p>
                        </td>
                    </tr>

                    <!-- Section Label -->
                    <tr>
                        <td style="padding: 0 40px 12px 40px;">
                            <div style="border-left: 4px solid #008080; padding-left: 12px;">
                                <span style="
                                    font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                    font-size: 15px;
                                    font-weight: 700;
                                    color: #008080;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                ">Vector Information</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Combined Table -->
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
                                ${combinedRows}
                            </table>
                        </td>
                    </tr>

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
                        <td style="padding: 26px 40px 24px 40px;">
                            <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151; font-family: 'Inter', Arial, sans-serif;">Regards,</p>
                            <p style="margin: 0 0 18px 0; font-size: 15px; font-weight: 700; color: #008080; font-family: 'Poppins', 'Inter', Arial, sans-serif;">Dynamo Stitches Team</p>
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">✉</td>
                                    <td style="padding-bottom: 6px;"><a href="mailto:order@dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">order@dynamostitches.com</a></td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">🌐</td>
                                    <td style="padding-bottom: 6px;"><a href="https://www.dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">www.dynamostitches.com</a></td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">📞</td>
                                    <td style="padding-bottom: 6px;"><span style="font-size: 13.5px; color: #374151; font-family: 'Inter', Arial, sans-serif;">+1 (469)-819-2874</span></td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle;">👤</td>
                                    <td><a href="https://customer.dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">customer.dynamostitches.com</a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Disclaimer -->
                    <tr>
                        <td style="padding: 0 40px 28px 40px;">
                            <div style="
                                background-color: #f8f9fa;
                                border-left: 3px solid #d1d5db;
                                border-radius: 4px;
                                padding: 14px 16px;
                            ">
                                <p style="
                                    margin: 0 0 4px 0;
                                    font-size: 11.5px;
                                    font-weight: 700;
                                    color: #6b7280;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    font-family: 'Inter', Arial, sans-serif;
                                ">Disclaimer</p>
                                <p style="
                                    margin: 0;
                                    font-size: 11.5px;
                                    color: #6b7280;
                                    line-height: 1.7;
                                    font-family: 'Inter', Arial, sans-serif;
                                ">Due to the custom nature of our services, it is the customer's responsibility to carefully review all art proofs, including spelling, colors, print placement, and overall design. All designs should be checked for accuracy before production. We recommend running a test sewout or sample before proceeding with final garments. Dynamo Stitches is not responsible for any errors or damages on the finished products. Additionally, the use of national logos or trademarked designs requires proper licensing or permission from the rightful owner. Dynamo Stitches is not liable for any unauthorized use of logos or copyrighted material.</p>
                            </div>
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
