import Holidays from "date-holidays";

export const get_holiday_calendar_name = (code) => {
    try {
        let regionCode = code;

        if (code.includes('-') || code.includes('_')) {
            const parts = code.split(/[-_]/);
            if (parts.length === 2) {
                regionCode = parts[1];
            }
        }

        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        return `${regionNames.of(regionCode.toUpperCase())} Holidays`;
    }
    catch (error) {
        return `${code} Holidays`;
    }
}

export const get_holiday_calendar = (country_code) => {
    return {
        id: `holidays-${country_code}`,
        name: get_holiday_calendar_name(country_code),
        description: "Public holidays",
        color: "#bf3efd",
        timezone: "UTC",
        editors: [],
        followers: [],
        role: "follower"
    };
}

export const is_holiday_calendar = (calendar_id) => {
    return typeof calendar_id === "string" && calendar_id.startsWith("holidays-");
};

export const get_country_from_calendar_id = (calendar_id) => {
    return calendar_id.replace("holidays-", "");
};

export const get_holidays = (country_code, start_date, end_date, language = "en") => {
    try {
        const hd = new Holidays(country_code);
        hd.setLanguages(language);

        const start_year = start_date.getFullYear();
        const end_year = end_date.getFullYear();

        let all_holidays = [];
        for (let year = start_year; year <= end_year; year++) {
            const year_holidays = hd.getHolidays(year);
            if (year_holidays) {
                all_holidays = all_holidays.concat(year_holidays);
            }
        }

        return all_holidays
            .filter(h => h.type === "public")
            .filter(h => {
                const holiday_date = new Date(h.date);
                return holiday_date >= start_date && holiday_date < end_date;
            })
            .map(h => ({
                name: h.name,
                date: h.date,
                type: h.type,
                start: h.start,
                end: h.end
            }));
    }
    catch (error) {
        console.error(`Error fetching holidays for ${country_code}:`, error);
        return [];
    }
};

export const map_holidays_to_events = (holidays, calendar_id, timezone = 'UTC') => {
    return holidays.map(holiday => {
        const startStr = holiday.date.split(' ')[0];

        const endDateRaw = holiday.end ? holiday.end : holiday.start;
        const duration = new Date(endDateRaw).getTime() - new Date(holiday.start).getTime();

        const startDateAnchor = new Date(`${startStr}T00:00:00Z`);
        const endDateAnchor = new Date(startDateAnchor.getTime() + duration);
        const endStr = endDateAnchor.toISOString().split('T')[0];

        return {
            id: `holiday-${calendar_id}-${holiday.date}`,
            title: holiday.name,
            start: startStr,
            end: endStr,

            allDay: true,
            editable: false,
            extendedProps: {
                description: "Public holiday",
                type: "fullday",
                author: null,
                calendar: calendar_id,
                is_holiday: true
            }
        };
    });
};

export const get_language_from_locale = (locale) => {
    return locale.split(/[-_]/)[0];
};

export const get_holiday_events = (calendar_ids, start_date, end_date, locale) => {
    const holiday_calendar_ids = calendar_ids.filter(id => is_holiday_calendar(id));

    if (holiday_calendar_ids.length === 0) {
        return [];
    }

    const language = get_language_from_locale(locale);
    let all_holiday_events = [];

    for (const calendar_id of holiday_calendar_ids) {
        const country_code = get_country_from_calendar_id(calendar_id);

        const holidays = get_holidays(country_code, start_date, end_date, language);
        const events = map_holidays_to_events(holidays, calendar_id);
        all_holiday_events = all_holiday_events.concat(events);
    }

    return all_holiday_events;
};
