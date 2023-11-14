
import { Router, Request, Response } from 'express';
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, updatePasswordSchema } from '../utils/validationSchema';
import { validate } from '#/middleware/validator';
import { create, generateForgetPasswordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user';
import { isValidPassResetToken, mustAuth } from '#/middleware/auth';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '#/utils/variables';
import User from '../models/user';

const router = Router()

router.post("/create", validate(CreateUserSchema),
create)
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail )
router.post("/Re-Verify-Email", sendReVerificationToken )
router.post("/forget-password", generateForgetPasswordLink )
router.post("/verify-pass-reset-token",validate(TokenAndIDValidation), isValidPassResetToken, grantValid)
router.post('/update-password', validate(updatePasswordSchema), isValidPassResetToken, updatePassword)
router.post('/sign-in', validate(SignInValidationSchema), signIn)
router.get('/is-auth', mustAuth, (req, res)=>{  
    res.json({
        profile: req.user,
     })
 
})

router.get('/public', (req, res)=>{  
    res.json({
        message: "You are in public route."
     })
 
})

router.get('/private', mustAuth, (req, res)=>{  
    res.json({
        message: "You are in private route."
     })
 
})
  
export default router;
