import User from '../models/user';
import { Router, Request, Response, NextFunction } from 'express';
import { CreateUserSchema } from '../utils/validationSchema'; // Assuming this is where your schema is defined
import { CreateUser } from '#/@types/user';
import { validate } from '#/middleware/validator';

const router = Router();
router.post("/create",
    
    validate(CreateUserSchema),
    async (req: CreateUser, res) => {
        const { email, password, name } = req.body
        CreateUserSchema.validate({ email, password, name }).catch(error => {

        })
        const user = await User.create({ name, email, password })
        res.json({ user })

    })
export default router;
