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

export const update_calendar = async (req, res, next) => {
    try {

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
