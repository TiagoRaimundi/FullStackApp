
import { Router, Request, Response } from 'express';
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, updatePasswordSchema } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, generateForgetPasswordLink, grantValid, sendProfile, sendReVerificationToken, signIn, updatePassword, updateProfile, verifyEmail } from '#/controllers/auth';
import { isValidPassResetToken, mustAuth } from '#/middleware/auth';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '#/utils/variables';
import User from '../models/user';
import fileParser from '#/middleware/fileParser';

const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail )
router.post("/Re-Verify-Email", sendReVerificationToken )
router.post("/forget-password", generateForgetPasswordLink )
router.post("/verify-pass-reset-token",validate(TokenAndIDValidation), isValidPassResetToken, grantValid)
router.post('/update-password', validate(updatePasswordSchema), isValidPassResetToken, updatePassword)
router.post('/sign-in', validate(SignInValidationSchema), signIn)
router.get('/is-auth', mustAuth, sendProfile)


router.post("/update-profile",mustAuth, fileParser, updateProfile)
  
export default router;
