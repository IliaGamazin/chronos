import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Login is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Login must be at least 3 characters'],
        maxlength: [30, 'Login cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    full_name: {
        type: String,
        required: [true, 'Full name is required'],
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [30, 'Full name cannot exceed 30 characters'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    }
});

userSchema.pre('save', async function  (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    }
    catch (error) {
        next(error);
    }
});

export default mongoose.model('User', userSchema);
