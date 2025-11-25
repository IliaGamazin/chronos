import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [30, "Name cannot exceed 30 characters"]
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    editors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    color: {
        type: String,
        default: '#3b82f6',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color (e.g., #3b82f6 or #fff)"]
    },
    timezone: {
        type: String,
        default: "UTC"
    }
}, { timestamps: true });

calendarSchema.methods.toDTO = function() {
    const format_user = (u) => (u && typeof u.toDTO === 'function') ? u.toDTO() : u;
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        author: format_user(this.author),
        editors: this.editors.map(format_user),
        followers: this.followers.map(format_user),
        color: this.color,
        timezone: this.timezone,
        created_at: this.createdAt,
        updated_at: this.updatedAt
    };
};

export default mongoose.model("Calendar", calendarSchema);
