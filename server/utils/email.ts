import nodemailer, { type Transporter } from 'nodemailer';
import { EmailAccount } from '#shared/types/enums';

function accountCredentials(config: ReturnType<typeof useRuntimeConfig>, account: EmailAccount) {
    switch (account) {
        case EmailAccount.ACCOUNTS_ACC:
            return { user: config.accountsAccountUser, pass: config.accountsAccountPass };
        case EmailAccount.ORDER_ACC:
            return { user: config.orderAccountUser, pass: config.orderAccountPass };
        case EmailAccount.ADMIN_ACC:
            return { user: config.adminAccountUser, pass: config.adminAccountPass };
    }
}

function buildTransporter(account: EmailAccount) {
    const config = useRuntimeConfig();
    const { user, pass } = accountCredentials(config, account);
    return nodemailer.createTransport({
        host: config.emailHost,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: { user, pass },
    });
}

const transporters = new Map<EmailAccount, Transporter>();

export function getTransporter(account: EmailAccount): Transporter {
    if (!transporters.has(account)) {
        transporters.set(account, buildTransporter(account));
    }
    return transporters.get(account)!;
}

export function getEmailUser(account: EmailAccount): string {
    return accountCredentials(useRuntimeConfig(), account).user as string;
}
