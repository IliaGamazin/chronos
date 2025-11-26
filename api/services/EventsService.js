import User from "../database/models/user.js";
import Calendar from "../database/models/calendar.js";
import Event from "../database/models/event.js";

import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

class EventsService {
    async new_event(user_id, body) {
        const author = await User.findById(user_id);
        if (!author) {
            throw new NotFoundError("No user with id");
        }

        const calendar = await Calendar.findById(body.calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new UnauthorizedError("You don't have permission to update this calendar");
        }

        const event = await Event.create({
            name: body.name,
            description: body.description,
            type: body.type,
            start_date: body.start_date,
            end_date: body.end_date,
            timezone: body.timezone,
            calendar: calendar._id,
            author: author._id,
            recurrence: body.recurrence,
        });

        await event.populate("author", "login email pfp_url");
        await event.populate("calendar", "name color");

        return event.toDTO();
    }

    async get_events() {

    }

    async get_event() {

    }
}

export default new EventsService();
