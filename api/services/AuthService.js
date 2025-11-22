import bcrypt from "bcryptjs";

import User from "../database/models/user.js";
import ConflictError from "../errors/ConflictError.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

import { generate_token_pair } from "./JwtService.js";

class AuthService {
    async register(login, email, full_name, password) {
        const existing = await User.findOne({
            $or: [
                { login },
                { email: email.toLowerCase() }
            ]
        });
        if (existing) {
            throw new ConflictError("User with email/login already exists");
        }

        const user = await User.create({
            login, email, full_name, password
        });

        return user.toDTO();
    }

    async login(login, password) {
        const user = await User.findOne({ login });
        if (!user) {
            throw new NotFoundError("No user with login");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new UnauthorizedError("Incorrect password");
        }

        return user.toDTO();
    }

    send_auth_response(res, user, message, status) {
        const payload = {
            id: user.id,
            login: user.login,
            email: user.email,
        }

        const tokens = generate_token_pair(payload);

        res.cookie('refresh_token', tokens.refresh_token, {
            secure: false,
            same_site: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            domain: 'localhost'
        });

        res.status(status).json({
            message,
            user,
            access_token: tokens.access_token
        })
    }
}

export default new AuthService();
