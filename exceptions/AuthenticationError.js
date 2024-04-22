import {BusinessLogicError} from "./BusinessLogicError"

export class AuthenticationError extends BusinessLogicError {
    constructor(message) {
        super(message)
    }
}
