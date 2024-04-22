import {TokenService} from "../services/TokenService"

export default ({$axios}, inject) => {
    inject("tokenService", new TokenService($axios))
}
