import transporter from "../utils/email";

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

    async sendHtmlEmail(to: string, subject: string, html: string) {
        try {
            const info = await transporter.sendMail({
                from: `"Dynamo Stitches" <${this.config.emailUser}>`,
                to,
                subject,
                html,
            });
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

export default new EmailService();
