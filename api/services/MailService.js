import Mailer from "./Mailer.js";

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
