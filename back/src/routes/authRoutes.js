import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { profileColors } from "../lib/colors.js";
import { sendEmailConfirmation } from "../services/emailService.js";
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