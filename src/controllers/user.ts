import { CreateUser, VerifyEmailRequest } from '#/@types/user';
import { RequestHandler } from 'express';
import User from '#/models/user';
import jwt from 'jsonwebtoken'
import { sendForgetPasswordLink, sendPassResetSuccessEmail, sendVerificationMail } from '#/utils/mail';
import { generateToken } from '#/utils/helpers';
import EmailVerificationToken from '#/models/emailVerificationToken';
import { isValidObjectId } from 'mongoose';
import passwordResetToken from '#/models/passwordResetToken';

import crypto from 'crypto'
import { JWT_SECRET, PASSWORD_RESET_LINK } from '#/utils/variables';
import { RequestWithFiles } from '#/middleware/fileParser';
import cloudinary from '#/cloud';
import formidable from 'formidable';

export const create: RequestHandler = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = generateToken();

        await EmailVerificationToken.create({
            owner: user._id,
            token
        });

        await sendVerificationMail(token, { name, email, userId: user._id.toString() });
        res.status(201).json({ user: { id: user._id, name, email } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user or send verification email.' });
    }
};

export const verifyEmail: RequestHandler = async (req, res) => {
    const { token, userId } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(403).json({ error: "Invalid user ID!" });
    }

    try {
        const verificationToken = await EmailVerificationToken.findOne({ owner: userId });
        if (!verificationToken || !(await verificationToken.compareToken(token))) {
            return res.status(403).json({ error: "Invalid or expired token!" });
        }

        await User.findByIdAndUpdate(userId, { verified: true });
        await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
        res.json({ message: "Your email has been verified." });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify email.' });
    }
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(403).json({ error: "Invalid request!" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "User not found!" });
        }

        if (user.verified) {
            return res.status(409).json({ error: "Email already verified." });
        }

        await EmailVerificationToken.findOneAndDelete({ owner: userId });
        const token = generateToken();

        await sendVerificationMail(token, {
            name: user.name,
            email: user.email,
            userId: user._id.toString(),
        });

        res.json({ message: "Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send re-verification email.' });
    }
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Account not found!' });
        }

        // Remove any existing password reset tokens for this user
        await passwordResetToken.findOneAndDelete({ owner: user._id });

        // Generate a new token
        const token = crypto.randomBytes(36).toString('hex');

        // Create a new password reset token in the database
        await passwordResetToken.create({ owner: user._id, token });

        // Generate the password reset link
        const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

        // Send the password reset link to the user's email
        await sendForgetPasswordLink({ email: user.email, link: resetLink });

        res.json({ message: "Check your registered email to reset your password." });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

export const grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
    const { password, userId } = req.body

    const user = await User.findById(userId)
    if (!user) return res.status(403).json({ error: "Unauthorized access" })

    const matched = await user.comparePassword(password)
    if (matched) return res.status(422).json({ error: "The new password must be different!" })

    user.password = password
    await user.save()

    passwordResetToken.findOneAndDelete({ owner: user._id })
    //send the success email

    sendPassResetSuccessEmail(user.name, user.email)
    res.json({ message: "Password resets successfully." })
};


export const signIn: RequestHandler = async (req, res) => {
    const { password, email } = req.body

    const user = await User.findOne({
        email
    })
    if (!user) return res.status(403).json({ error: "Email/Password mismatch!" })

    //comare the password
    const matched = await user.comparePassword(password)
    if (!matched) return res.status(403).json({ error: "Email/Password mismatch!" })

    //generate the token for later use.
    const token = jwt.sign({ userId: user._id }, JWT_SECRET)
    user.tokens.push(token)

    await user.save()

    res.json({ profile: { 
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        following: user.followings.length
     },
    token
 })
};
export const updateProfile: RequestHandler = async (req: RequestWithFiles, res) => {
 const {name} = req.body
 const avatar = req.files?.avatar as formidable.File

 const user = await User.findById(req.user.id)
 if(!user) throw new Error("Something went wrong, user not found!")

 if(typeof name !== "string") return res.status(422).json({error: "Invalid name"})

 if(name.trim().length < 3) return res.status(422).json({error: "Invalid name!"})

 user.name = name

 if(avatar){
    // if there is already an avatar file, we want to remove that


    //upload new avatar file
    const {secure_url, public_id} = await cloudinary.uploader.upload(avatar.filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face"
    })
    user.avatar = {url: secure_url, publicId: public_id}
 }

 await user.save()
 res.json({avatar: user.avatar})

 req.user.id
};