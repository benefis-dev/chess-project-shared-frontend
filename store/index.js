// noinspection JSUnusedGlobalSymbols

import {Route} from "vue-router"
import {Commit, Dispatch} from "vuex"
import {TokenService} from "../services/TokenService"
import {UserService} from "../services/UserService"
import {AuthTokensNotFound} from "../exceptions/AuthTokensNotFound"
import {toConsole} from "../utils"

export const state = () => {}

export const actions = {
    /**
     * Главная цель данной функции - получить токены от сервиса хранения токенов и сохранить их в Store.
     *
     * @param {Commit} commit
     * @param {Dispatch} dispatch
     * @param {TokenService} $tokenService
     * @param {Route} route
     * @param {UserService} $userService
     * @return {Promise<void>}
     */
    async nuxtServerInit({commit, dispatch}, {$tokenService, route, $userService}) {
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

        if (process.env.isAdminPanel) {
            await dispatch("dictionaries/fetchDictionary", "puzzle")
            await dispatch("puzzleTypes/fetchPuzzleTypes")
            await dispatch("puzzleThemes/fetchPuzzleThemes")
        }
    }
}
