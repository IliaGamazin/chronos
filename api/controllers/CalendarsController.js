import CalendarsService from "../services/CalendarsService.js";

export const get_calendars = async (req, res, next) => {
    try {
        const calendars = await CalendarsService.get_calendars(
            req.user.id,
            req.query.status
        );
        return res.status(200).json({
            success: true,
            data: calendars
        });
    }
    catch (error) {
        next(error);
    }
}

export const get_calendar = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error);
    }
}

export const new_calendar = async (req, res, next) => {
    try {
        const calendar = await CalendarsService.new_calender(
            req.body.name,
            req.body.description,
            req.user.id,
            req.body.color,
            req.body.timezone
        );

        return res.status(201).json({
            success: true,
            data: calendar
        });
    }
    catch (error) {
        next(error);
    }
}

export const invite = async (req, res, next) => {
    try {
        const allowed = ["editor", "follower"]
        const role = req.query.role;
        if (!allowed.includes(role)) {
            return res.status(400).json({
                success: false,
                error: {
                    name: "Query Param Error",
                    message: "Invalid role. Must be 'editor' or 'follower'"
                }
            });
        }

        const token = await CalendarsService.invite_link(
            req.user.id,
            req.params.calendar_id,
            role
        );

        return res.status(200).json({
            success: true,
            data: token
        });
    }
    catch (error) {
        next(error);
    }
}

export const invite_accept = async (req, res, next) => {
    try {
        await CalendarsService.invite_accept(
            req.user.id,
            req.params.token,
        );

        return res.status(201).send();
    }
    catch (error) {
        next(error);
    }
}

export const update_calendar = async (req, res, next) => {
    try {
        const calendar = await CalendarsService.update_calendar(
            req.user.id,
            req.params.calendar_id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: calendar
        });
    }
    catch (error) {
        next(error);
    }
}

export const delete_calendar = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error);
    }
}
