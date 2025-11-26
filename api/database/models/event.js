import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [30, "Name cannot exceed 30 characters"]
    },
    description: {
        type: String, trim: true
    },
    type: {
        type: String,
        enum: ["fullday", "task", "arrangement"],
        required: true
    },
    start_date: {
        type: Date, required: true
    },
    end_date: {
        type: Date, required: true
    },
    timezone: {
        type: String, default: "UTC"
    },

    calendars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calendar",
        required: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    editors: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],

    recurrence: {
        frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
        interval: { type: Number, default: 1 },
        weekdays: [{ type: Number, min: 0, max: 6 }],
        start_date: { type: Date },
        end_date: { type: Date },
    }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
