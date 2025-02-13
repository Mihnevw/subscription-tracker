import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); //Извличаме всички user-и

        res.status(200).json({ succes: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); //Селектираме всички полета без password
        //Вземаме динамично id-то на user-а от req.params.id

        if (!user) {
            const error = new Error(`User with id ${req.params.id} not found`);
            error.status = 404;
            throw error;
        }

        res.status(200).json({ succes: true, data: user });
    } catch (error) {
        next(error);
    }
}