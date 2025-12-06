import cron from "node-cron";
import pkg from 'rrule';
const {RRule} = pkg;

import Event from "../database/models/event.js";
import Reminder from "../database/models/reminder.js";

const POLL_INTERVAL_MINUTES = 1;

class CronService {
    constructor() {
        this.running = false;
    }

    start() {
        if (this.running) {
            return;
        }
        console.log("Starting Cron service");
        const cron_expr = `*/${POLL_INTERVAL_MINUTES} * * * *`;
        this.job = cron.schedule(cron_expr, () => this.query_reminders());
    }

    async query_reminders() {
        console.log(`[${new Date().toISOString()}] Running reminder check...`);

        const now = new Date();
        const in_fifteen_minutes = new Date(now.getTime() + 15 * 60 * 1000);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const tomorrow_end = new Date(tomorrow);
        tomorrow_end.setDate(tomorrow_end.getDate() + 1);
        tomorrow_end.setMilliseconds(-1);

        const reminders_to_send = [];

        const timed_reminders = await this.process_events(
            await this.get_timed_events(now, in_fifteen_minutes),
            now,
            in_fifteen_minutes,
            "15min"
        );
        reminders_to_send.push(...timed_reminders);

        const fullday_reminders = await this.process_events(
            await this.get_fullday_events(now, tomorrow, tomorrow_end),
            tomorrow,
            tomorrow_end,
            "1day"
        );
        reminders_to_send.push(...fullday_reminders);

        console.log(`Found ${reminders_to_send.length} reminders to send`);
        reminders_to_send.forEach((reminder) => {
            console.log(reminder)
        })
    }

    async get_timed_events(now, in_fifteen_minutes) {
        return Event.find({
            type: "arrangement",
            $or: [
                {
                    "recurrence.freq": {$exists: false},
                    start_date: {$gte: now, $lte: in_fifteen_minutes}
                },
                {
                    "recurrence.freq": {$exists: true},
                    $or: [
                        {"recurrence.until": {$gte: now}},
                        {"recurrence.until": {$exists: false}}
                    ]
                }
            ]
        }).populate('calendar');
    }

    async get_fullday_events(now, tomorrow, tomorrow_end) {
        return Event.find({
            type: {$in: ["fullday", "task"]},
            $or: [
                {
                    "recurrence.freq": {$exists: false},
                    start_date: {$gte: tomorrow, $lte: tomorrow_end}
                },
                {
                    "recurrence.freq": {$exists: true},
                    $or: [
                        {"recurrence.until": {$gte: now}},
                        {"recurrence.until": {$exists: false}}
                    ]
                }
            ]
        }).populate('calendar');
    }

    get_occurrences(event, start, end) {
        if (!event.recurrence || !event.recurrence.freq) {
            if (event.start_date >= start && event.start_date <= end) {
                return [event.start_date];
            }
            return [];
        }

        const rrule_options = {
            freq: RRule[event.recurrence.freq],
            dtstart: event.start_date,
            interval: event.recurrence.interval || 1,
            until: event.recurrence.until,
            count: event.recurrence.count,
            byweekday: event.recurrence.byweekday,
            bymonth: event.recurrence.bymonth,
            bymonthday: event.recurrence.bymonthday,
            bysetpos: event.recurrence.bysetpos
        }

        const rule = new RRule(rrule_options);
        return rule.between(start, end, true);
    }

    async process_events(events, start, end, reminder_type) {
        const reminders_to_send = [];
        for (const event of events) {
            const occurrences = this.get_occurrences(event, start, end);

            for (const occurrence of occurrences) {
                const users = this.get_calendar_users(event.calendar);
                const new_reminders = await this.process_event_reminders(
                    event,
                    users,
                    occurrence,
                    reminder_type
                );
                reminders_to_send.push(...new_reminders);
            }
        }

        return reminders_to_send;
    }

    async process_event_reminders(event, user_ids, occurrence_date, reminder_type) {
        const reminders_to_send = [];

        for (const user_id of user_ids) {
            const existing = await Reminder.findOne({
                user: user_id,
                event: event._id,
                occurrence_date: occurrence_date,
                reminder_type: reminder_type
            });

            if (!existing) {
                await Reminder.create({
                    user: user_id,
                    event: event._id,
                    occurrence_date: occurrence_date,
                    reminder_type: reminder_type
                });

                reminders_to_send.push({
                    user_id: user_id,
                    event_id: event._id,
                    event_name: event.name,
                    occurrence_date: occurrence_date,
                    reminder_type: reminder_type
                });
            }
        }

        return reminders_to_send;
    }

    get_calendar_users(calendar) {
        const user_ids = new Set();
        user_ids.add(calendar.author.toString());
        calendar.editors.forEach(id => user_ids.add(id.toString()));
        calendar.followers.forEach(id => user_ids.add(id.toString()));
        return Array.from(user_ids);
    }
}

export default CronService;
