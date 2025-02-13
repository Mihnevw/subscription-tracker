import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import errorMiddleware from './middlewares/error.middlewares.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

//middlewares
app.use(express.json());// Това позволява на приложението да обработва JSON данни изпратени в зявки на сървъра
app.use(express.urlencoded({ extended: false }));// Това позволява на приложението да обработва URL-encoded данни изпратени в зявки на сървъра
app.use(cookieParser());
app.use(arcjetMiddleware);

//Path '/api/v1/auth/sign-up'
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker');
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;