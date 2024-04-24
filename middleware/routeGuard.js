import {Store} from "vuex"
import {Route} from "vue-router"
import {toConsole} from "../utils"

/**
 * @param {Store} store
 * @param {Route} route
 * @param {function} redirect
 * @return {Promise<void>}
 */
export async function routeGuard({store, route, redirect}) {
    toConsole("Выполнился middleware 'routeGuard', окружение: " + process.env.VUE_ENV)

    if (route.path.toLowerCase().includes("login")) {
        return
    }

    const isUserAuthenticated = store.state.user.isAuthenticated
    toConsole("isUserAuthenticated at middleware 'routeGuard'", isUserAuthenticated)

    if (!isUserAuthenticated) {
        if (!route.path.endsWith("/")) {
            route.path = `${route.path}/`
        }

        const uri = encodeURI(`/login?returnPath=${route.path}`)

        if (process.server) {
            return redirect(uri)
        }

        if (process.client) {
            await window.$nuxt.$router.push(uri)
        }
    }
}
