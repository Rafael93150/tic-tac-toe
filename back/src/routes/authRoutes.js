import User from "../models/user.js";
import Token from "../models/token.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { profileColors } from "../lib/colors.js";
import { sendEmailConfirmation, sendResetPasswordEmail } from "../services/emailService.js";
import randomCharacters from "../lib/randomCharacters.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(username && email && password))
            throw new Error("Invalid arguments");

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.sendStatus(409);

        const authentificationToken = randomCharacters(6);

        const user = new User({
            username,
            email,
            color: profileColors[
                Math.floor(Math.random() * profileColors.length)
            ],
            password: hashedPassword,
            authentificationToken,
        });

        const payload = {
            userId: user._id,
        };

        const options = {
            expiresIn: "12h",
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, options);

        await sendEmailConfirmation(
            email,
            authentificationToken
        );

        await user.save();

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({
            error: `An error occurred while registering: ${error}`,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.sendStatus(401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.sendStatus(401);
        }

        if (!user.confirmed) {
            return res.status(403).json({
                error: "Please confirm your email address",
            });
        }

        const payload = {
            userId: user._id,
            role: user.role,
        };

        const options = {
            expiresIn: "12h",
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, options);
        res.json({
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            error: `An error occurred while logging in: ${error}`,
        });
    }
};

export const confirmEmail = async (req, res) => {
    try {
        const { email, authentificationToken } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.sendStatus(404);
        }

        if (user.authentificationToken !== authentificationToken) {
            return res.sendStatus(401);
        }

        user.confirmed = true;
        user.authentificationToken = null;

        await user.save();

        res.sendStatus(200);
    }
    catch (error) {
        res.status(500).json({
            error: `An error occurred while confirming email: ${error}`,
        });
    }
}


export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            email
        });
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        let token = await Token.findOne({
            userId: user._id
        });
        if (!token) {
            token = new Token({
                token: crypto.randomBytes(32).toString('hex'),
                userId: user._id,
            });
            await token.save();
        }

        await sendResetPasswordEmail(
            email,
            token.token
        );
        res.sendStatus(200);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const tokenParams = req.params.token;

        const token = await Token.findOne({ token: tokenParams });

        if (!token) {
            const error = new Error('Could not find token.');
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findById(token.userId);
        const hashedPw = await bcrypt.hash(req.body.newPassword, 12);
        await User.updateOne({ _id: user._id }, { $set: { password: hashedPw } })
        await token.deleteOne();
        res.sendStatus(200);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};