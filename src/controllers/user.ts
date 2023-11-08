import { CreateUser, VerifyEmailRequest } from '#/@types/user';
import { RequestHandler } from 'express';
import User from '#/models/user';
import { sendForgetPasswordLink, sendVerificationMail } from '#/utils/mail';
import { generateToken } from '#/utils/helpers';
import EmailVerificationToken from '#/models/emailVerificationToken';
import { isValidObjectId } from 'mongoose';
import passwordResetToken from '#/models/passwordResetToken';

import crypto from 'crypto'
import { PASSWORD_RESET_LINK } from '#/utils/variables';


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

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'Account not found!' });
    }

    // Remover tokens de redefinição de senha antigos
    await passwordResetToken.findOneAndDelete({ owner: user._id });

    // Gerar um novo token
    const token = crypto.randomBytes(36).toString('hex');

    // Criar um novo documento para o token de redefinição de senha
    await passwordResetToken.create({ owner: user._id, token });

    // Criar o link de redefinição de senha
    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

    // Enviar o link para o e-mail do usuário
    sendForgetPasswordLink({ email: user.email, link: resetLink });

    res.json({ message: "Check your registered email to reset your password." });
};

export const isValidPassResetToken: RequestHandler = async (req, res) => {
    const { token, userId } = req.body;

    const resetToken = await passwordResetToken.findOne({ owner: userId });
    if (!resetToken) {
        return res.status(403).json({ error: "Unauthorized access, invalid token!" });
    }

    const matched = await resetToken.compareToken(token);
    if (!matched) {
        return res.status(403).json({ error: "Unauthorized access, invalid token!" });
    }

    res.json({ message: "Your token is valid." });
};
