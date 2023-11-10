import User from '../models/user';
import { Router, Request, Response } from 'express';
import { CreateUserSchema, TokenAndIDValidation, updatePasswordSchema } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, generateForgetPasswordLink, grantValid, sendReVerificationToken, updatePassword, verifyEmail } from '#/controllers/user';
import { isValidPassResetToken } from '#/middleware/auth';



const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail )
router.post("/Re-Verify-Email", sendReVerificationToken )
router.post("/forget-password", generateForgetPasswordLink )
router.post("/verify-pass-reset-token",validate(TokenAndIDValidation), isValidPassResetToken, grantValid)
router.post('/update-password', validate(updatePasswordSchema), isValidPassResetToken, updatePassword)
export default router;
