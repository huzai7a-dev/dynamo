import transporter from "../utils/email";
import type { UploadedAsset } from "./upload.service";

export interface EmailAttachment {
    filename: string;
    path: string;
    contentType?: string;
    contentDisposition?: string;
    cid?: string;
}

export function buildMailAttachments(uploaded: UploadedAsset[], fallbackPrefix = "attachment", filePrefix?: string): EmailAttachment[] {
    if (!uploaded || !uploaded.length) return [];
    return uploaded.map((a, i) => {
        const ext = a.format || '';
        const name = a.originalFilename || `${fallbackPrefix}-${i + 1}`;
        let filename = name.includes('.') ? name : (ext ? `${name}.${ext}` : name);
        if (filePrefix) {
            filename = `${filePrefix}_${filename}`;
        }
        return {
            filename,
            path: a.url,
            contentType: a.resourceType === 'image' ? `image/${ext || 'jpeg'}` : (ext === 'pdf' ? 'application/pdf' : undefined)
        };
    });
}

class EmailService {
    private config = useRuntimeConfig();

    async sendEmail(to: string, subject: string, text: string) {
        try {
            const info = await transporter.sendMail({
                from: `"Dynamo Stitches" <${this.config.emailUser}>`,
                to,
                subject,
                text,
            });
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sendHtmlEmail(to: string, subject: string, html: string, attachments?: EmailAttachment[]) {
        try {
            const info = await transporter.sendMail({
                from: `"Dynamo Stitches" <${this.config.emailUser}>`,
                to,
                subject,
                html,
                attachments,
            });
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

export default new EmailService();
