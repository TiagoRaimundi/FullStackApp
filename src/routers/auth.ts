
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



import formidable from 'formidable';
import path from 'path'
import fs from 'fs'

router.post('/update-profile', async (req, res) => {
    //handle the file upload
    if(!req.headers["content-type"]?.startsWith("multipart/form-data"))
        return res.status(422).json({error: "Only accepts form-data!"})

        const dir = path.join(__dirname, "../public/profiles")

        try {
            await fs.readdirSync(dir)
        } catch (error) {
            await fs.mkdirSync(dir)
        } 

    const form = formidable({
        uploadDir: dir,
        filename(name, ext, part, form) {
            return Date.now() + "_" + part.originalFilename
        }
    });
    form.parse(req, (err, fields, files) => {
        //console.log("fields: ", fields)
        //console.log("files: ", files)

        res.json({uploaded: true})
    })

})


  
export default router;
