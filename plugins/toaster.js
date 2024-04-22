import {Toaster} from "../services/Toaster"

export default ({store, $config}, inject) => {
    inject("toaster", new Toaster(store, $config))
}
