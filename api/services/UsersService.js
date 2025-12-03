import User from "../database/models/user.js";
import NotFoundError from "../errors/NotFoundError.js";

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
