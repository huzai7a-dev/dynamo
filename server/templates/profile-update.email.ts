import type { IUser } from "#shared/types";

export function generateProfileUpdateEmail(user: Partial<IUser>): string {
    const year = new Date().getFullYear();
    const displayName = user.contact_name || user.user_name || "Valued Customer";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Profile Updated – Dynamo Stitches</title>
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
                            ">Profile Successfully Updated</h1>
                            <p style="
                                margin: 8px 0 0 0;
                                font-size: 14px;
                                color: rgba(255,255,255,0.82);
                                font-family: 'Inter', Arial, sans-serif;
                            ">Your information has been saved</p>
                        </td>
                    </tr>

                    <!-- Greeting & body -->
                    <tr>
                        <td style="padding: 36px 40px 28px 40px;">
                            <p style="
                                margin: 0 0 12px 0;
                                font-size: 16px;
                                font-weight: 600;
                                color: #1C1C1C;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Dear ${displayName},</p>
                            <p style="
                                margin: 0 0 12px 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">Thank you for updating your profile.</p>
                            <p style="
                                margin: 0;
                                font-size: 14.5px;
                                color: #374151;
                                line-height: 1.75;
                                font-family: 'Inter', Arial, sans-serif;
                            ">
                                We're happy to inform you that your profile information has been
                                <strong style="color: #008080;">successfully updated</strong> in our system.
                                If you notice anything incorrect or need further assistance, please feel free to reach out to us anytime.
                            </p>
                        </td>
                    </tr>

                    <!-- Info card -->
                    <tr>
                        <td style="padding: 0 40px 36px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="
                                background-color: #f8fffe;
                                border: 1.5px solid #dff7f6;
                                border-radius: 10px;
                            ">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <p style="
                                            margin: 0 0 6px 0;
                                            font-size: 12px;
                                            font-weight: 700;
                                            color: #008080;
                                            text-transform: uppercase;
                                            letter-spacing: 0.6px;
                                            font-family: 'Inter', Arial, sans-serif;
                                        ">Need help?</p>
                                        <p style="
                                            margin: 0;
                                            font-size: 13.5px;
                                            color: #374151;
                                            line-height: 1.6;
                                            font-family: 'Inter', Arial, sans-serif;
                                        ">If you did not make this change or believe this was done in error,
                                        please contact us immediately at
                                        <a href="mailto:order@dynamostitches.com" style="color:#008080;text-decoration:none;font-weight:600;">order@dynamostitches.com</a>.</p>
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
                        <td style="padding: 26px 40px 32px 40px;">
                            <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151; font-family: 'Inter', Arial, sans-serif;">Regards,</p>
                            <p style="margin: 0 0 18px 0; font-size: 15px; font-weight: 700; color: #008080; font-family: 'Poppins', 'Inter', Arial, sans-serif;">Dynamo Stitches Team</p>

                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle; font-size: 14px;">✉</td>
                                    <td style="padding-bottom: 6px;">
                                        <a href="mailto:order@dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">order@dynamostitches.com</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle; font-size: 14px;">🌐</td>
                                    <td style="padding-bottom: 6px;">
                                        <a href="https://www.dynamostitches.com" style="font-size: 13.5px; color: #008080; text-decoration: none; font-family: 'Inter', Arial, sans-serif;">www.dynamostitches.com</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle; font-size: 14px;">📞</td>
                                    <td style="padding-bottom: 6px;">
                                        <span style="font-size: 13.5px; color: #374151; font-family: 'Inter', Arial, sans-serif;">+1 (469)-819-2874</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-right: 8px; vertical-align: middle; font-size: 14px;">👤</td>
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
