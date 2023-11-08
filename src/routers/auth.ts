import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema, EmailVerificationBody } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, sendReVerificationToken, verifyEmail } from '#/controllers/user';

const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail )
router.post("/Re-Verify-Email", sendReVerificationToken )
router.post("/forget-password", generateForgetPasswordLink )

export default router;
