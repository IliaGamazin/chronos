import AppError from "./AppError.js";

export default class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
