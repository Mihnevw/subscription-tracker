import Subscription from "../models/subscription.model.js";

import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user.id
        });

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            retries: 0,
        })

        //await workflowClient.trigger({
        //    url: `${SERVER_URL}`
        //})

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        //Проверяваме дали потребителят е същият като този в токена
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }
        //Ако сме собственик на акаунта, взимаме всички абонаменти на потребителя
        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

//Добавяне на още контролери