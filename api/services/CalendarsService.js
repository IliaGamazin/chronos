import User from "../database/models/user.js";
import Event from "../database/models/event.js";
import Calendar from "../database/models/calendar.js";
import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

import {generate_invite_token, verify_invite_token} from "./JwtService.js";
import {get_holiday_calendar} from "./HolidayService.js"
import {send_invite_link} from "./MailService.js"
import ConflictError from "../errors/ConflictError.js";
import ForbiddenError from "../errors/ForbiddenError.js";

class CalendarsService {
    async new_calender(name, description, author_id, color, timezone) {
        const author = await User.findById(author_id);
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

    async get_calendar(user_id, calendar_id) {
        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("No user with id");
        }

        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());
        const is_follower = calendar.followers.some(id => id.toString() === user_id.toString());

        if (!is_author && is_editor && !is_follower) {
            throw new UnauthorizedError("You don't have permission to access this calendar");
        }

        return calendar.toDTO();
    }

    async get_calendars(user_id, status, country_code) {
        let query = {};
        console.log(country_code);
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
            .populate("editors", "login email pfp_url")
            .populate("followers", "login email pfp_url");

        const calendars_with_role = calendars.map(calendar => {
            const dto = calendar.toDTO();

            if (calendar.author._id.toString() === user_id.toString()) {
                dto.role = "owner";
            }
            else if (calendar.editors.some(editor => editor._id.toString() === user_id.toString())) {
                dto.role = "editor";
            }
            else if (calendar.followers.some(follower => follower._id.toString() === user_id.toString())) {
                dto.role = "follower";
            }

            return dto;
        });

        calendars_with_role.push(get_holiday_calendar(country_code));

        return calendars_with_role;
    }

    async invite_link(user_id, calendar_id, role) {
        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new UnauthorizedError("You don't have permission to invite to this calendar");
        }

        return generate_invite_token({
            user_id,
            calendar_id,
            role
        });
    }

    async invite_accept(user_id, token) {
        const decoded = verify_invite_token(token);
        const { calendar_id, role } = decoded;

        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.id === calendar.author) {
            throw new ConflictError("You already own this calendar");
        }

        if (role === "editor") {
            if (calendar.editors.some(id => id.toString() === user_id.toString())) {
                throw new ConflictError("You're already an editor");
            }

            await Calendar.findByIdAndUpdate(calendar_id, {
                $addToSet: { editors: user_id },
                $pull: { followers: user_id }
            });
        }
        else if (role === "follower") {
            if (calendar.editors.some(id => id.toString() === user_id.toString())) {
                throw new ConflictError("You're already an editor with higher permissions");
            }

            if (calendar.followers.some(id => id.toString() === user_id.toString())) {
                throw new ConflictError("You're already following this calendar");
            }

            await Calendar.findByIdAndUpdate(calendar_id, {
                $addToSet: { followers: user_id }
            });
        }
    }

    async invite_mail(from, to, link) {
        await send_invite_link(from, to, link);
    }

    async update_calendar(user_id, calendar_id, body) {
        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new UnauthorizedError("You don't have permission to update this calendar");
        }

        if (body?.name) {
            calendar.name = body.name;
        }
        if (body?.description) {
            calendar.description = body.description;
        }
        if (body?.color) {
            calendar.color = body.color;
        }
        if (body?.timezone) {
            calendar.timezone = body.timezone;
        }

        await calendar.save();
        await calendar.populate("author", "login email pfp_url");
        await calendar.populate("editors", "login email pfp_url");
        await calendar.populate("followers", "login email pfp_url");

        return calendar.toDTO();
    }

    async delete_calendar(user_id, calendar_id) {
        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const is_author = calendar.author.toString() === user_id.toString();

        if (!is_author || user.default_calendar.toString() === calendar._id.toString()) {
            throw new ForbiddenError("You can't delete this calendar");
        }

        await Event.deleteMany({ calendar: calendar_id });
        await Calendar.findByIdAndDelete(calendar_id);
    }

    async unfollow_calendar(user_id, calendar_id) {
        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const is_author = calendar.author.toString() === user._id.toString();
        const is_default = user.default_calendar.toString() === calendar._id.toString();

        if (is_author || is_default) {
            throw new ForbiddenError("You can't unfollow this calendar");
        }

        await Calendar.findByIdAndUpdate(
            calendar_id,
            {
                $pull: {
                    editors: user_id,
                    followers: user_id
                }
            }
        );
    }

    async remove_collaborator(user_id, calendar_id, collaborator_id) {
        const calendar = await Calendar.findById(calendar_id);
        if (!calendar) {
            throw new NotFoundError("No calendar with id");
        }

        const is_author = calendar.author.toString() === user_id.toString();
        const is_editor = calendar.editors.some(id => id.toString() === user_id.toString());

        if (!is_author && !is_editor) {
            throw new ForbiddenError("You don't have rights to remove collaborators");
        }

        const is_collaborator_editor = calendar.editors.some(id => id.toString() === collaborator_id.toString());
        const is_collaborator_follower = calendar.followers.some(id => id.toString() === collaborator_id.toString());

        if (!is_collaborator_editor && !is_collaborator_follower) {
            throw new NotFoundError("User is not a collaborator of this calendar");
        }

        if (is_collaborator_editor && !is_author) {
            throw new ForbiddenError("Only the author can remove editors");
        }

        await Calendar.findByIdAndUpdate(
            calendar_id,
            {
                $pull: {
                    editors: collaborator_id,
                    followers: collaborator_id
                }
            }
        );
    }
}

export default new CalendarsService();
