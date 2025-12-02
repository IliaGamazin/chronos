import UsersService from "../services/UsersService.js";

export const me = async (req, res, next) => {
    try {
        const user = await UsersService.get_user(req.user.id);
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};

export const get_user = async (req, res, next) => {
    try {
        const user = await UsersService.get_user(req.params.user_id);
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};

export const set_avatar = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error);
    }
};

export const update_user = async (req, res, next) => {
    try {
        const user = await UsersService.update_user(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
