import EventsService from "../services/EventsService.js";

export const get_events = async (req, res, next) => {
  const locale = req.headers['accept-language']?.split(',')[0] || 'PIVO';

  console.log(locale); // "en-US"

  try {
        const calendar_ids = [].concat(req.query.calendars)
        const events = await EventsService.get_events(
            req.user.id,
            calendar_ids,
            req.query.from,
            req.query.to
        );

        return res.status(200).json({
            success: true,
            data: events
        });
    }
    catch (error) {
        next(error);
    }
};

export const get_event = async (req, res, next) => {
    try {
        const event = await EventsService.get_event(
            req.user.id,
            req.params.event_id,
        );

        return res.status(200).json({
            success: true,
            data: event
        });
    }
    catch (error) {
        next(error);
    }
};

export const new_event = async (req, res, next) => {
    try {
        const allowed_types = ["fullday", "task", "arrangement"];
        const allowed_recurs = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

        if (!allowed_types.includes(req.body.type)) {
            return res.status(400).json({
                success: false,
                error: {
                    name: "Query Param Error",
                    message: "Invalid event type"
                }
            });
        }

        const recurrence = req.body.recurrence;
        if (recurrence && !allowed_recurs.includes(recurrence.freq)) {
            return res.status(400).json({
                success: false,
                error: {
                    name: "Query Param Error",
                    message: "Invalid recurrence frequency"
                }
            });
        }

        const event = await EventsService.new_event(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            data: event
        });
    }
    catch (error) {
        next(error);
    }
};

export const update_event = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error);
    }
};

export const delete_event = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error);
    }
};
