import UnauthorizedError from "../errors/UnauthorizedError.js";
import { verify_access_token } from "../services/JwtService.js";

export const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        throw new UnauthorizedError("Auth header is required");
    }

    const token = header.split(' ')[1];
    if (!token) {
        throw new UnauthorizedError("Access token is required");
    }

    req.user = verify_access_token(token);
    next();
}
