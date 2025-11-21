class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            success: false,
            error: {
                type: this.constructor.name,
                message: this.message,
                status: this.status,
            }
        };
    }
}

export default AppError;
