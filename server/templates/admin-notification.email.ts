import type { IUser } from "#shared/types";
import { buildTableRows } from "./email.helpers";

const COMPANY_NAME = "Dynamo Stitches";
const ADMIN_NAME = "Admin";
const ADMIN_PORTAL_URL = "http://www.dynamostitches.com/dashboard";

export function generateAdminNotificationEmail(client: Partial<IUser>, ip?: string): string {
    const tableRows = buildTableRows(client, ip);
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Client Registration - ${COMPANY_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fafa; font-family: 'Inter', Arial, sans-serif;">

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fafa; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Email Card -->
                <table width="620" cellpadding="0" cellspacing="0" style="
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,128,128,0.10);
                    max-width: 620px;
                    width: 100%;
                ">
                    <!-- Header Banner -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #055d57 0%, #008080 100%);
                            padding: 38px 40px 32px 40px;
                            text-align: center;
                        ">
                            <!-- Brand pill -->
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
                                ">✦ ${COMPANY_NAME}</span>
                            </div>

                            <h1 style="
                                margin: 0;
                                font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                font-size: 22px;
                                font-weight: 700;
                                color: #ffffff;
                                line-height: 1.3;
                            ">New Client Registration</h1>
                            <p style="
                                margin: 8px 0 0 0;
                                font-size: 14px;
                                color: rgba(255,255,255,0.80);
                                font-family: 'Inter', Arial, sans-serif;
                            ">A new account has been created on the portal</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 32px 40px 8px 40px;">
                            <p style="
                                margin: 0 0 10px 0;
                                font-size: 16px;
                                font-weight: 600;
                                color: #1C1C1C;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Dear ${ADMIN_NAME},</p>
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.7;
                                font-family: 'Inter', Arial, sans-serif;
                            ">
                                We would like to inform you that a new client has successfully registered on the
                                <strong style="color: #008080;">${COMPANY_NAME}</strong> portal.
                                The client information is listed below for your review.
                            </p>
                        </td>
                    </tr>

                    <!-- Section Label -->
                    <tr>
                        <td style="padding: 28px 40px 12px 40px;">
                            <div style="border-left: 4px solid #008080; padding-left: 12px;">
                                <span style="
                                    font-family: 'Poppins', 'Inter', Arial, sans-serif;
                                    font-size: 15px;
                                    font-weight: 700;
                                    color: #008080;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                ">Client Information</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Info Table -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="
                                border-collapse: collapse;
                                border-radius: 8px;
                                overflow: hidden;
                                border: 1.5px solid #dff7f6;
                            ">
                                <!-- Table Header -->
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
                                        width: 200px;
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
                                    ">Value</th>
                                </tr>
                                ${tableRows}
                            </table>
                        </td>
                    </tr>

                    <!-- Action prompt -->
                    <tr>
                        <td style="padding: 0 40px 28px 40px;">
                            <p style="
                                margin: 0 0 20px 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.7;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Kindly review the account and proceed with any required verification or onboarding steps.</p>

                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="
                                        background: linear-gradient(135deg, #008080 0%, #20b2aa 100%);
                                        border-radius: 8px;
                                        padding: 0;
                                    ">
                                        <a href="${ADMIN_PORTAL_URL}" style="
                                            display: inline-block;
                                            padding: 12px 28px;
                                            font-family: 'Inter', Arial, sans-serif;
                                            font-size: 14px;
                                            font-weight: 600;
                                            color: #ffffff;
                                            text-decoration: none;
                                            border-radius: 8px;
                                        ">Go to Admin Panel →</a>
                                    </td>
                                </tr>
                            </table>
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
                        <td style="padding: 24px 40px 32px 40px;">
                            <p style="
                                margin: 0 0 4px 0;
                                font-size: 14px;
                                color: #374151;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Regards,</p>
                            <p style="
                                margin: 0 0 2px 0;
                                font-size: 14px;
                                font-weight: 600;
                                color: #1C1C1C;
                                font-family: 'Inter', Arial, sans-serif;
                            ">System Notification</p>
                            <p style="
                                margin: 0;
                                font-size: 15px;
                                font-weight: 700;
                                color: #008080;
                                font-family: 'Poppins', 'Inter', Arial, sans-serif;
                            ">${COMPANY_NAME}</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #055d57 0%, #008080 100%);
                            padding: 16px 40px;
                            text-align: center;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 12px;
                                color: rgba(255,255,255,0.8);
                                font-family: 'Inter', Arial, sans-serif;
                            ">© ${year} ${COMPANY_NAME}. All rights reserved. — Internal system notification.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
}
