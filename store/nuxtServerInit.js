import {Route} from "vue-router"
import {Commit, Dispatch} from "vuex"
import {toConsole} from "../utils"
import {AuthTokensNotFound} from "../exceptions/AuthTokensNotFound"

/**
 * У данной функции 2 цели:
 *      1) получить токены от сервиса хранения токенов и сохранить их в Store.
 *      2) установить свойство аутентифицирован ли пользователь.
 *
 * @param {Commit} commit
 * @param {Dispatch} dispatch
 * @param {TokenService} $tokenService
 * @param {Route} route
 * @param {UserService} $userService
 * @return {Promise<void>}
 */
export async function nuxtServerInit({commit, dispatch}, {$tokenService, route, $userService}) {
    toConsole("Выполнился nuxtServerInit, окружение: " + process.env.VUE_ENV)

    if (route.path.toLowerCase().includes("login")) {
        return
    }

    try {
        // Получим токены доступа
        const tokenPair = await $tokenService.getTokens()
        await dispatch("credentials/setupAuthData", tokenPair)

        // Проверим аутентифицирован ли пользователь
        const isAuthenticated = await $userService.checkAuthentication()
        commit("user/toggleIsAuthenticated", isAuthenticated)

    } catch (e) {
        if (e instanceof AuthTokensNotFound) {
            // Токенов нет, можно продолжать дальше
        } else {
            throw e
        }
    }
}
