
import { CreateUser } from '#/@types/user';
import { RequestHandler } from 'express';
import { generateToken } from '#/utils/helpers';
import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationToken';
import nodemailer from 'nodemailer'
import { MAILTRAP_PASS, MAILTRAP_USER } from '#/utils/variables';
import { generateTemplate } from '#/mail/template';
import path from 'path'
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
    const WelcomeMessage = `Hi ${name}, Welcome to Podify!
     There are so much thing that we do
     for verified users. Use the given OTP to verify your email.`
   
    transport.sendMail({
        to: user.email,
        subject: "Welcome Message",
        from: "auth@myapp",
        html: generateTemplate({
          title: 'Welcome to podify',
          message: WelcomeMessage,
          logo: 'cid: logo',
          banner: "cid:welcome",
          link: "#",
          btnTitle: token
        }),
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, "../mail/logo.png" ),
            cid: "logo",
          },
          {
            filename: 'welcome.png',
            path: path.join(__dirname, "../mail/welcome.png" ),
            cid: "welcome",
          }
        ]
    })
    res.status(201).json({user})
}
