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
}

export default new CalendarsService();
