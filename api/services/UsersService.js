import User from "../database/models/user.js";
import NotFoundError from "../errors/NotFoundError.js";
import ConflictError from "../errors/ConflictError.js";

class UsersService {
    async get_user(user_id) {
        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("No user with id");
        }

        return user.toDTO();
    }

    async update_user(user_id, body) {
        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("No user with id");
        }

        if (body?.login) {
            const existing = await User.find({ login: body.login });
            if (existing) {
                throw new ConflictError("Login already taken");
            }
            user.login = body.login;
        }
        if (body?.full_name) {
            user.full_name = body.full_name;
        }

        await user.save();
        return user.toDTO();
    }
}

export default new UsersService();
