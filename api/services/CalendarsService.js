import User from "../database/models/user.js";
import Calendar from "../database/models/calendar.js";
import NotFoundError from "../errors/NotFoundError.js";

class CalendarsService {
    async new_calender(name, description, author_id, color, timezone) {
        const author = User.findById(author_id);
        if (!author) {
            throw new NotFoundError("No user with id");
        }

        const calendar = await Calendar.create({
            name,
            description,
            author: author_id,
            color: color || "#3b82f6",
            timezone: timezone || "UTC",
            editors: [],
            followers: [],
        });

        return calendar.toDTO();
    }

    async get_calendars(user_id, status) {
        let query = {};

        if (status === "owned") {
            query.author = user_id;
        }
        else if (status === "editable") {
            query.editors = user_id;
        }
        else if (status === "followed") {
            query.followers = user_id;
        }
        else {
            query.$or = [
                { author: user_id },
                { editors: user_id },
                { followers: user_id }
            ];
        }

        const calendars = await Calendar.find(query)
            .populate("author", "login email pfp_url")
            .populate("editors", "login email pfp_url");

        return calendars.map(calendar => calendar.toDTO());
    }
}

export default new CalendarsService();
