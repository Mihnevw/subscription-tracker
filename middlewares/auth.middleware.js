import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { JWT_SECRET } from "../config/env.js";

//Някой прави заявка -> получаване на потребителски данни -> упълномощаване на средата -> проверка -> ако е валидно -> следващо -> получаване на потребителски данни
const authorize = async (req, res, next) => {
    try {
        //Получаваме токена на потребителя
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { //Когато правим токен към res започваме с Bearer-СТАНДАРТ
            token = req.headers.authorization.split(' ')[1]; //Ще върнем само втората част от низа, който ще е действителния токен 
        }

        if (!token) {
            const error = new Error('Unauthorized');
            error.status = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        //Проверяваме дали user-а съществува
        const user = await User.findById(decoded.id);
        if (!user) {
            const error = new Error('Unauthorized');
            error.status = 401;
            throw error;
        }

        //Ако съществува user-а го добавяме към req
        req.user = user;

        next(); //Слагаме next за да продължи заявката към следващата-Заради това е middleware
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
        //Тук ще има next(error) само ако има следващ middleware-грешка
    }
}

export default authorize;