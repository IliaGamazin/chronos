import AuthService from "../services/AuthService.js";
import User from "../database/models/user.js";

import { verify_refresh_token } from "../services/JwtService.js";

export const register = async (req, res, next) => {
    try {
        const user = await AuthService.register(
            req.body.login,
            req.body.email,
            req.body.full_name,
            req.body.password,
        );

        return AuthService.send_auth_response(
            res, user, "Registration successful", 201
        );
    }
    catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await AuthService.login(
            req.body.login,
            req.body.password
        );
        return AuthService.send_auth_response(
            res, user, "Login successful", 200
        );
    }
    catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        delete res.cookie("refresh_token", null);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}

export const refresh = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Refresh token is required"
                }
            });
        }

        const decoded = verify_refresh_token(refresh_token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: "User not found"
                }
            });
        }

        return AuthService.send_auth_response(res, user, "Tokens refreshed successfully", 200);
    }
    catch (error) {
        next(error);
    }
}


