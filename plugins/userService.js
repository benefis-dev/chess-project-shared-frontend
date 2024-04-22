import {UserService} from "../services/UserService"

export default ({$voyager, store, $tokenService, $toaster}, inject) => {
    inject("userService", new UserService($voyager, store, $tokenService, $toaster))
}
