import User from "../database/models/user.js";

class AuthService {
    async register(login, email, full_name, password) {
        const user = await User.create({
            login, email, full_name, password
        })

        return user;
    }
}

export default new AuthService();
