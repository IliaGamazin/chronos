import User from "../database/models/user.js";
import Calendar from "../database/models/calendar.js";
import Event from "../database/models/event.js";

import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import {is_holiday_calendar, get_holiday_events} from "./HolidayService.js";
import ForbiddenError from "../errors/ForbiddenError.js";

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
        if (start > end) {
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

        if (body.type === "task") {
            eventData.done = false;
        }

        const event = await Event.create(eventData);
        await event.populate("author", "login email pfp_url");
        await event.populate("calendar", "name color");

        return event.toDTO();
    }

    async get_events(user_id, calendars, from, to, locale) {
        const regular_calendar_ids = calendars.filter(id => !is_holiday_calendar(id));
        const holiday_calendar_ids = calendars.filter(id => is_holiday_calendar(id));

        let all_events = [];

        if (regular_calendar_ids.length > 0) {
            const calendars_db = await Calendar.find({
                _id: { $in: regular_calendar_ids }
            });

            const accessible = calendars_db.filter(calendar => {
                const is_editor = calendar.editors?.some(id => id.toString() === user_id);
                const is_follower = calendar.followers?.some(id => id.toString() === user_id);
                const is_author = calendar.author.toString() === user_id;

                return is_editor || is_follower || is_author;
            });

            if (accessible.length !== calendars_db.length) {
                throw new NotFoundError("Access denied or calendar not found");
            }

            const accessible_calendar_ids = accessible.map(c => c._id);
            const query_start = new Date(from);
            const query_end = new Date(to);

            const events = await Event.find({
                calendar: { $in: accessible_calendar_ids },
                $or: [
                    {
                        "recurrence.freq": { $exists: false },
                        start_date: { $gte: query_start, $lt: query_end }
                    },
                    {
                        "recurrence.freq": { $exists: true },
                        start_date: { $lt: query_end },
                        $or: [
                            { "recurrence.until": { $exists: false } },
                            { "recurrence.until": { $gte: query_start } }
                        ]
                    }
                ]
            })
                .populate("author", "login email pfp_url")
                .populate("calendar", "name color");

            all_events = events.map(event => {
                const dto = event.toDTO();
                const calendar = calendars_db.find(c => c._id.toString() === event.calendar._id.toString());

                const is_author = calendar.author.toString() === user_id;
                const is_editor = calendar.editors?.some(id => id.toString() === user_id);

                dto.editable = is_author || is_editor;

                return dto;
            });
        }

        if (holiday_calendar_ids.length > 0) {
            const query_start = new Date(from);
            const query_end = new Date(to);

            const holiday_events = get_holiday_events(
                holiday_calendar_ids,
                query_start,
                query_end,
                locale
            );
            all_events = all_events.concat(holiday_events);
        }
        return all_events;
    }

    async toggle_task(event_id) {
        const event = await Event.findById(event_id);
        if (!event) {
            throw new NotFoundError("No event with id");
        }

        if (event.type !== "task") {
            throw new ForbiddenError("You can only toggle tasks");
        }

        event.done = !event.done;
        await event.save();
    }

    async delete_event(user_id, event_id) {
        const event = await Event.findById(event_id);
        if (!event) {
            throw new NotFoundError("No event with id");
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const calendar = await Calendar.findById(event.calendar.toString());
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new ForbiddenError("Insufficient permissions");
        }

        await Event.findByIdAndDelete(event_id);
    }

    async update_event(user_id, event_id, body) {
        console.log(body);

        const event = await Event.findById(event_id);
        if (!event) {
            throw new NotFoundError("No event with id");
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const calendar = await Calendar.findById(event.calendar.toString());
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new ForbiddenError("Insufficient permissions");
        }

        if (body.title && event.name !== body.title) {
            event.name = body.title;
        }

        if (body.description && event.description !== body.description) {
            event.description = body.description;
        }

        if (body.type && event.type !== body.type) {
            event.type = body.type;
        }

        const eventType = body.type || event.type;

        if (body.start_date) {
            if (eventType === 'fullday' || eventType === 'task' || body.allDay) {
                const date = new Date(body.start_date);
                event.start_date = date.toISOString().split('T')[0];
            }
            else {
                event.start_date = new Date(body.start_date).toISOString();
            }
        }

        if (body.end_date) {
            if (eventType === 'fullday' || eventType === 'task' || body.allDay) {
                const date = new Date(body.end_date);
                event.end_date = date.toISOString().split('T')[0];
            } else {
                event.end_date = new Date(body.end_date).toISOString();
            }
        }


        console.log(event);

        await event.save();
        await event.populate("author", "login email pfp_url");
        await event.populate("calendar", "name color");

        return event.toDTO();
    }


    async get_event() {

    }
}

export default new EventsService();
