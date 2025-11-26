const { DateTime, Interval } = require('luxon');

const get_event_duration = (event) => {
    const start = DateTime.fromISO(event.start);
    const end = DateTime.fromISO(event.end);
    return end.diff(start);
};

const init_context = (event, view_interval) => {
    const duration = get_event_duration(event);
    const interval = Math.max(1, event.recurrence.interval || 1);
    const recur_start = DateTime.fromISO(event.recurrence.start_date).setZone(event.timezone);

    let end_limit = view_interval.end;
    if (event.recurrence.end_date) {
        const recur_end = DateTime.fromISO(event.recurrence.end_date).setZone(event.timezone);
        end_limit = DateTime.min(view_interval.end, recur_end);
    }

    const view_start_buffered = view_interval.start.minus(duration);

    return { duration, interval, recur_start, end_limit, view_start_buffered };
};

const fast_forward = (cursor, buffer_date, unit, interval) => {
    if (cursor < buffer_date) {
        const diff_val = buffer_date.diff(cursor, unit)[unit];
        const units_to_skip = Math.floor(diff_val / interval) * interval;
        if (units_to_skip > 0) {
            return cursor.plus({ [unit]: units_to_skip });
        }
    }
    return cursor;
};

const create_instance = (start_date, duration, view_interval, event_id) => {
    const end_date = start_date.plus(duration);
    const instance_interval = Interval.fromDateTimes(start_date, end_date);

    if (view_interval.overlaps(instance_interval)) {
        return {
            id: event_id,
            start: start_date.toUTC().toISO(),
            end: end_date.toUTC().toISO(),
            is_recurring_instance: true
        };
    }
    return null;
};

export const expand_daily = (event, view_interval) => {
    const instances = [];
    const { duration, interval, recur_start, end_limit, view_start_buffered } = init_context(event, view_interval);

    let cursor = recur_start;

    cursor = fast_forward(cursor, view_start_buffered, 'days', interval);

    while (cursor <= end_limit) {
        const instance = create_instance(cursor, duration, view_interval, event._id);
        if (instance) instances.push(instance);

        cursor = cursor.plus({ days: interval });
    }

    return instances;
};

export const expand_weekly = (event, view_interval) => {
    const instances = [];
    const { duration, interval, recur_start, end_limit, view_start_buffered } = init_context(event, view_interval);
    const weekdays = event.recurrence.weekdays || [];

    const target_time = {
        hour: recur_start.hour,
        minute: recur_start.minute,
        second: recur_start.second,
        millisecond: recur_start.millisecond
    };

    let current_week_start = recur_start.startOf('week');

    current_week_start = fast_forward(current_week_start, view_start_buffered, 'weeks', interval);

    while (current_week_start <= end_limit) {
        for (const weekday of weekdays) {
            const candidate = current_week_start.plus({ days: weekday - 1 }).set(target_time);

            if (candidate < recur_start) continue;
            if (candidate >= end_limit) break;

            const instance = create_instance(candidate, duration, view_interval, event._id);
            if (instance) instances.push(instance);
        }

        current_week_start = current_week_start.plus({ weeks: interval });
    }

    return instances;
};

export const expand_monthly = (event, view_interval) => {
    const instances = [];
    const { duration, interval, recur_start, end_limit, view_start_buffered } = init_context(event, view_interval);
    const original_day = recur_start.day;

    let cursor = recur_start;

    cursor = fast_forward(cursor, view_start_buffered, 'months', interval);

    while (cursor <= end_limit) {
        if (cursor.daysInMonth >= original_day) {
            cursor = cursor.set({ day: original_day });
        }

        if (cursor.day === original_day) {
            const instance = create_instance(cursor, duration, view_interval, event._id);
            if (instance) instances.push(instance);
        }

        cursor = cursor.plus({ months: interval });
    }

    return instances;
};

export const expand_yearly = (event, view_interval) => {
    const instances = [];
    const { duration, interval, recur_start, end_limit, view_start_buffered } = init_context(event, view_interval);
    const original_month = recur_start.month;
    const original_day = recur_start.day;

    let cursor = recur_start;

    cursor = fast_forward(cursor, view_start_buffered, 'years', interval);

    while (cursor <= end_limit) {
        if (cursor.month !== original_month || cursor.day !== original_day) {
            const temp = cursor.set({ month: original_month });
            if (temp.daysInMonth >= original_day) {
                cursor = cursor.set({ month: original_month, day: original_day });
            }
        }

        if (cursor.month === original_month && cursor.day === original_day) {
            const instance = create_instance(cursor, duration, view_interval, event._id);
            if (instance) instances.push(instance);
        }

        cursor = cursor.plus({ years: interval });
    }

    return instances;
};
