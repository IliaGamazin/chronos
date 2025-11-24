import pkg from 'jsonwebtoken';
import AppError from "../errors/AppError.js";
import mongoose from "mongoose";
const { JsonWebTokenError } = pkg;

export const error_handler = (error, req, res, next) => {
    console.error(`${req.method} ${req.path} - Error:` + error);
    console.log(error);
    if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "JWT Token Error",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }

    if (error instanceof mongoose.Error.ValidationError) {
        const first = Object.values(error.errors)[0].message;
        return res.status(400).json({
            success: false,
            message: "MongoDB Validation Error",
            error: {
                name: error.name,
                message: first
            }
        })
    }

    if (!(error instanceof AppError)) {
        error = new AppError(
            error.message || 'Internal server error',
            error.status || 500
        );
    }

    return res.status(error.status).json(error.toJSON());
}
