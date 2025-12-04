import User from "../database/models/user.js";
import Calendar from "../database/models/calendar.js";
import Event from "../database/models/event.js";

import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

class EventsService {
    async new_event(user_id, body) {
        const author = await User.findById(user_id);
        if (!author) throw new NotFoundError("User not found");

        const calendar = await Calendar.findById(body.calendar_id);
        if (!calendar) throw new NotFoundError("Calendar not found");

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors?.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new UnauthorizedError("You don't have permission to add events to this calendar");
        }

        const start = new Date(body.start_date);
        const end = new Date(body.end_date);
        if (start >= end) {
            throw new Error("End date must be after start date");
        }

        const eventData = {
            name: body.name,
            description: body.description,
            type: body.type,
            start_date: start,
            end_date: end,
            timezone: body.timezone || "UTC",
            calendar: calendar._id,
            author: author._id
        };

        if (body.recurrence && body.recurrence.freq) {
            eventData.recurrence = {
                freq: body.recurrence.freq.toUpperCase(),
                interval: body.recurrence.interval || 1,
                until: body.recurrence.until,
                count: body.recurrence.count,
                byweekday: body.recurrence.byweekday,
                bymonthday: body.recurrence.bymonthday,
                bysetpos: body.recurrence.bysetpos
            };
        }

        const event = await Event.create(eventData);

        await event.populate("author", "login email pfp_url");
        await event.populate("calendar", "name color");

        return event.toDTO();
    }

    async get_events(user_id, calendars, from, to) {
        const calendars_db = await Calendar.find({
            _id: { $in: calendars }
        });

        const accessible = calendars_db.filter(calendar => {
            const isEditor = calendar.editors?.some(id => id.toString() === user_id);
            const isFollower = calendar.followers?.some(id => id.toString() === user_id);
            const isAuthor = calendar.author.toString() === user_id;

            return isEditor || isFollower || isAuthor;
        });

        if (accessible.length !== calendars.length) {
            throw new NotFoundError("Access denied or calendar not found");
        }

        const accessible_calendar_ids = accessible.map(c => c._id);

        const queryStart = new Date(from);
        const queryEnd = new Date(to);

        const events = await Event.find({
            calendar: { $in: accessible_calendar_ids },
            $or: [
                {
                    "recurrence.freq": { $exists: false },
                    start_date: { $gte: queryStart, $lt: queryEnd }
                },
                {
                    "recurrence.freq": { $exists: true },
                    start_date: { $lt: queryEnd },
                    $or: [
                        { "recurrence.until": { $exists: false } },
                        { "recurrence.until": { $gte: queryStart } }
                    ]
                }
            ]
        })
            .populate("author", "login email pfp_url")
            .populate("calendar", "name color");

        return events.map(event => event.toDTO());
    }

    async get_event() {

    }
}

export default new EventsService();
