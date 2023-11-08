import { CreateUser, VerifyEmailRequest } from '#/@types/user';
import { RequestHandler } from 'express';
import User from '#/models/user';
import { sendVerificationMail } from '#/utils/mail';
import { generateToken } from '#/utils/helpers';
import EmailVerificationToken from '#/models/emailVerificationToken';
import { isValidObjectId } from 'mongoose';

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

    const user = await User.findOne({email})
    if(!user) return res.status(403).json({error: 'Account not found!'})

    //generate the link
    //https://yourapp.com/reset-passwod?token=hfkshf4322hfjkds&userId=67jhfdsahf43

    




};
