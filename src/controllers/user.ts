
import { CreateUser } from '#/@types/user';
import { RequestHandler } from 'express';
import { generateToken } from '#/utils/helpers';
import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationToken';
import nodemailer from 'nodemailer'
import { MAILTRAP_PASS, MAILTRAP_USER } from '#/utils/variables';

export const create: RequestHandler = async (req: CreateUser, res) => {
    const {email,  password, name} = req.body


    const user = await User.create({name, email, password})

    //send verification email
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
      });

    const token = generateToken() 
    await EmailVerificationToken.create({
        owner: user._id,
        token
    })
   
    transport.sendMail({
        to: user.email,
        from: "auth@myapp",
        html: `<h1 fontSize: 14>Your verification token is ${token}</h1>`
    })
    res.status(201).json({user})
}
