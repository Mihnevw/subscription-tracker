import nodemailer from 'nodemailer';

import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'stilianmihnev@gmail.com';

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
});

export default transport;
