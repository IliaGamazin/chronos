import Mailer from "./Mailer.js";
import User from "../database/models/user.js"
import Event from "../database/models/event.js"

export const send_email = async (to, subject, content) => {
    await Mailer.emails.send({
        from: "onboarding@resend.dev",
        to,
        content,
        subject,
        html: content
    });
};

export const send_invite_link = async (from, to, link) => {
    await send_email(
        to,
        `${from} invited you to follow/edit the calendar`,
        `<a>${link}</a>`
    );
}

export const send_reminder = async (reminder) => {
    try {
        const user = await User.findById(reminder.user_id);
        const event = await Event.findById(reminder.event_id).populate("calendar");
        if (!event || !user) {
            return;
        }

        const formatted_date = reminder.occurrence_date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: event.type === 'arrangement' ? '2-digit' : undefined,
            minute: event.type === 'arrangement' ? '2-digit' : undefined
        });

        const timing_text = reminder.reminder_type === '15min'
            ? 'in 15 minutes'
            : 'tomorrow';

        console.log(user.email);

        await Mailer.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: `Reminder: ${event.name} ${timing_text}`,
            html: `
                <h2>Event Reminder</h2>
                <p>This is a reminder that your event <strong>${event.name}</strong> is ${timing_text}.</p>
                <p><strong>When:</strong> ${formatted_date} UTC</p>
                ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
                <p><strong>Calendar:</strong> ${event.calendar.name}</p>
            `
        });
    }
    catch(error) {
        console.error(error);
    }
}
