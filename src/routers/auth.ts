import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema, TokenAndIDValidation } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, generateForgetPasswordLink, isValidPassResetToken, sendReVerificationToken, verifyEmail } from '#/controllers/user';

const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail )
router.post("/Re-Verify-Email", sendReVerificationToken)
router.post("/forget-password", generateForgetPasswordLink)
router.post("/verify-pass-reset-token", validate(TokenAndIDValidation), isValidPassResetToken)

export default router;
