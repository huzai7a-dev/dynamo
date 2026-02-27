import nodemailer from 'nodemailer';

const config = useRuntimeConfig();
const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: Number(config.emailPort),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

export default transporter;
