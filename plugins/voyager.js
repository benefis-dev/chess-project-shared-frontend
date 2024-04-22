import {Voyager} from "../services/Voyager"

export default ({$axios, store, $tokenService, $toaster}, inject) => {
    inject("voyager", new Voyager($axios, store, $tokenService, $toaster))
}
