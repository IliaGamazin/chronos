import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: { type: String, trim: true },
    type: {
        type: String,
        enum: ["fullday", "task", "arrangement"],
        default: "arrangement"
    },

    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },

    recurrence: {
        freq: {
            type: String,
            enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
        },
        interval: { type: Number },

        until: { type: Date },
        count: { type: Number },

        byweekday: [{ type: Number, min: 0, max: 6 }],
        bymonth: [{ type: Number, min: 1, max: 12 }],
        bymonthday: [{ type: Number }],
        bysetpos: [{ type: Number }]
    },

    calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

eventSchema.index({ start_date: 1, end_date: 1 });
eventSchema.index({ "recurrence.freq": 1 });
eventSchema.index({ "recurrence.until": 1 });

eventSchema.methods.toDTO = function() {
    let startVal = this.start_date.toISOString();
    let endVal = this.end_date.toISOString();

    if (this.type === 'fullday' || this.type === 'task') {
        startVal = startVal.split('T')[0];
        endVal = endVal.split('T')[0];
    }

    const dto = {
        id: this._id.toString(),
        title: this.name,
        start: startVal,
        end: endVal,
        allDay: this.type === 'fullday' || this.type === 'task',

        extendedProps: {
            description: this.description,
            type: this.type,
            author: this.author,
            calendar: this.calendar
        }
    };

    if (this.recurrence && this.recurrence.freq) {
        dto.rrule = {
            freq: this.recurrence.freq.toLowerCase(),
            interval: this.recurrence.interval,
            wkst: 1,
            dtstart: this.start_date.toISOString().replace("Z", "")
        };

        if (this.recurrence.until) {
            dto.rrule.until = this.recurrence.until.toISOString().replace("Z", "");
        }

        const props = ['count', 'byweekday', 'bymonthday', 'bysetpos'];
        props.forEach(prop => {
            if (this.recurrence[prop] && this.recurrence[prop].length > 0) {
                dto.rrule[prop] = this.recurrence[prop];
            }
        });
    }

    return dto;
};

export default mongoose.model("Event", eventSchema);