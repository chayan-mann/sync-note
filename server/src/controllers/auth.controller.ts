import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config'; 

const generateToken = (id: string) => {
    // Use the validated, type-safe configuration.
    // This will now compile without any errors.
    return jwt.sign({ id }, process.env.JWT_SECRET as string
    );
};

export const signup = async (req: Request, res: Response) => {
    console.log("SIGNUP CONTROLLER REACHED!");

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select('+password');

        if (user && (await bcrypt.compare(password, user.password!))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};