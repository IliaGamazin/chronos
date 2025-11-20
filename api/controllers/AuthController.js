import AuthService from "../services/AuthService.js";

export async function register(req, res, next) {
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

export async function login(req, res, next) {
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
