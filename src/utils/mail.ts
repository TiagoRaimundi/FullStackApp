import { CreateUser } from '#/@types/user';
import { RequestHandler } from 'express';
import { generateToken } from '#/utils/helpers';
import User from '#/models/user';
import EmailVerificationToken from '#/models/emailVerificationToken';
import nodemailer from 'nodemailer'
import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from '#/utils/variables';
import { generateTemplate } from '#/mail/template';
import path from 'path'

const generateMailTransporter = () => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
      });
      return transport

}

interface Profile {
    name: string
    email: string
    userId: string
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
const transport = generateMailTransporter()

const {name, email, userId} = profile

await EmailVerificationToken.create({
    owner: userId,
    token
})
const WelcomeMessage = `Hi ${name}, Welcome to Podify!
 There are so much thing that we do
 for verified users. Use the given OTP to verify your email.`

transport.sendMail({
    to: email,
    subject: "Welcome Message",
    from: VERIFICATION_EMAIL,
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
        filename: ' logo.png',
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

}

