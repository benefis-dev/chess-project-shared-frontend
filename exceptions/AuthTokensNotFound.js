import {BusinessLogicError} from "./BusinessLogicError"

export class AuthTokensNotFound extends BusinessLogicError {
    constructor(message) {
        super(message)
    }
}
