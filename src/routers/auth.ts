import User from '../models/user';
import { Router, Request, Response, NextFunction } from 'express';
import { CreateUser } from '#/@types/user';


const router = Router();

router.post("/create",
    (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name is missing!' });
        }
        
        if (name.length < 3) {
            return res.status(400).json({ error: 'Invalid name! Name should be at least 3 characters long.' });
        }
        
        next();
    },
    async (req: Request & { body: CreateUser }, res: Response) => {
        try {
            const { email, password, name } = req.body;
            const user = await User.create({ name, email, password });
            res.status(201).json({ user }); // 201 means "Created"
        } catch (error) {
            res.status(500).json({ error: "There was an error creating the user." });
        }
    }
);

export default router;
