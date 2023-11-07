import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema, EmailVerificationBody } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, verifyEmail } from '#/controllers/user';

const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail )

export default router;
