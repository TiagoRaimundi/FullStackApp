import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema } from '../utils/validationSchema'; // Corrected import path

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
    try {
        // Destructure name, email, and password from the request body
        const { name, email, password } = req.body;

        // Validate the request body against the schema
        // await is used to ensure that the Promise returned by validate is resolved
        const validatedBody = await CreateUserSchema.validate({ name, email, password }, { abortEarly: false });

        // If validation is successful, create the user
        const user = await User.create(validatedBody);
        
        // Respond with the created user
        res.status(201).json({ user });
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            // Handle validation errors
            return res.status(400).json({ errors: error.errors });
        } else {
            // Handle all other errors
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

export default router;
