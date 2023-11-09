import { CreateUser } from '#/@types/user';
import { RequestHandler } from 'express';
import { generateToken } from '#/utils/helpers';
import User from '#/models/user';
import emailVerificationToken from '#/models/emailVerificationToken';
import nodemailer from 'nodemailer'
import { MAILTRAP_PASS, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from '#/utils/variables';
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

interface Options {
  email: string
  link: string
}
export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter()

  const { name, email, userId } = profile


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
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: 'welcome.png',
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      }
    ]
  })

}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter()

  const { email, link } = options


  const message = "We just received a request that you forgot your password. No problem you can use the lin below and create brand new password"


  transport.sendMail({
    to: email,
    subject: "Reset Password Link",
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: 'Forget Password',
      message,
      logo: 'cid: logo',
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password"
    }),
    attachments: [
      {
        filename: ' logo.png',
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      }
    ]
  })

}
export const sendPassResetSuccessEmail = async (name: string, email: string) => {
  const transport = generateMailTransporter()

  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password`

  transport.sendMail({
    to: email,
    subject: "Password Reset Successfully",
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: 'Password Reset Successfully',
      message,
      logo: 'cid: logo',
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in"
    }),
    attachments: [
      {
        filename: ' logo.png',
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: 'forget_password.png',
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      }
    ]
  })

}


