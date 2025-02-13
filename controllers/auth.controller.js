import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// Implement sign up logic here-Create user
export const signUp = async (req, res, next) => {
    //Atomic Operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Вмъкване на нов user
        const { name, email, password } = req.body;
        //Порверка дали има такъв user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password
        const salt = await bcrypt.hash(password, 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session }); //Това ще върне масив от нови user-и

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        //Готови сме да се ангажираме с транзакцията
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created',
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (error) {
        //Когато нещо се обърка в транзакцията не прави нищо 
        await session.abortTransaction();
        session.endSession();
        next(error);

    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const passwordValidate = await bcrypt.compare(password, user.password);

        if (!passwordValidate) {
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {

}
