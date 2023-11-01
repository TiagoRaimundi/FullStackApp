import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create } from '#/controllers/user';

const router = Router();

router.post("/create", validate(CreateUserSchema),create, async (req, res) => {
    
    try {
        // Assuming req.body has been validated and matches the CreateUser type
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        // If there's an error in the User.create operation, send an appropriate response
        res.status(500).json({ error: 'There was an error creating the user.' });
    }
});

export default router;
