import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    occurrence_date: {
        type: Date,
        required: true
    },
    reminder_type: {
        type: String,
        enum: ["15min", "1day"],
        required: true
    },
    sent_at: {
        type: Date,
        default: Date.now
    }
});

reminderSchema.index(
    { user: 1, event: 1, occurrence_date: 1, reminder_type: 1 },
    { unique: true }
);

export default mongoose.model("Reminder", reminderSchema);