import type { FieldChange } from "../utils/diff";

interface VectorUpdatedEmailData {
    vectorId: number;
    changes: FieldChange[];
    user: { contact_name?: string; user_name?: string };
    subject: string;
    isAdmin?: boolean;
    vectorName: string;
}

function buildChangeRows(changes: FieldChange[]): string {
    return changes
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
                width: 160px;
            ">${row.label}</td>
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                color: #9CA3AF;
                text-decoration: line-through;
                border-right: 2px solid #dff7f6;
            ">${row.before}</td>
            <td style="
                padding: 12px 18px;
                font-family: 'Inter', Arial, sans-serif;
                font-size: 13.5px;
                font-weight: 600;
                color: #1C1C1C;
            ">${row.after}</td>
        </tr>`)
        .join("");
}

export function generateVectorUpdatedEmail(data: VectorUpdatedEmailData): string {
    const { changes, user, subject, isAdmin = false, vectorName } = data;
    const displayName = user.contact_name || user.user_name || "Valued Customer";
    const changeRows = buildChangeRows(changes);
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     ${!isAdmin ? `<title>${subject}</title>` : ''}
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
                            ${!isAdmin ? `<h1 style="
                                margin: 0;
                                font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                font-size: 22px;
                                font-weight: 700;
                                color: #ffffff;
                                line-height: 1.3;
                            ">Your Vector Has Been Updated</h1>` : ''}
                            <p style="
                                margin: 8px 0 0 0;
                                font-size: 15px;
                                color: rgba(255,255,255,0.90);
                                font-family: 'Inter', Arial, sans-serif;
                                font-weight: 500;
                            ">${vectorName}</p>
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
                            ">Your vector with <strong style="color: #008080;">Dynamo Stitches</strong> has been updated. The fields below reflect the changes that were made.</p>
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">You may review the full vector details anytime within your account under <strong>Order Records</strong>.</p>
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
                                ">Updated Fields</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Changes Table -->
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
                                        width: 160px;
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
                                        border-right: 1.5px solid rgba(255,255,255,0.2);
                                    ">Previous</th>
                                    <th style="
                                        padding: 11px 18px;
                                        font-family: 'Inter', Arial, sans-serif;
                                        font-size: 12px;
                                        font-weight: 700;
                                        color: #ffffff;
                                        text-align: left;
                                        letter-spacing: 0.6px;
                                        text-transform: uppercase;
                                    ">Updated</th>
                                </tr>
                                ${changeRows}
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
