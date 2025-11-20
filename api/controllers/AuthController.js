import AuthService from "../services/AuthService.js";

export async function register(req, res, next) {
    try {
        const user = await AuthService.register(
            req.body.login,
            req.body.email,
            req.body.full_name,
            req.body.password,
        );

        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
}

export async function login(req, res) {

}