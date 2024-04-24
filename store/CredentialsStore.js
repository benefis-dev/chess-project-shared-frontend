// noinspection JSUnusedGlobalSymbols

import {isNumber, isString, getPayloadFromJWT} from "../utils"

export class CredentialsStore {
    static state = () => ({
        accessToken: null,
        refreshToken: null,
        accessTokenExpiresAt: 0,
    })

    static getters = {
        accessToken: (state) => state.accessToken,
        refreshToken: (state) => state.refreshToken,
        accessTokenExpiresAt: (state) => state.accessTokenExpiresAt,
    }

    static mutations = {
        setTokens(state, {accessToken, refreshToken}) {
            if (!isString(accessToken) || !isString(refreshToken)) {
                throw new Error("Некорректно переданы accessToken или refreshToken")
            }

            state.accessToken = accessToken
            state.refreshToken = refreshToken
        },

        clearTokens(state) {
            state.accessToken = null
            state.refreshToken = null
        },

        setAccessTokenExpiresAt(state, payload) {
            if (!isNumber(payload)) {
                throw new Error("Время истечения жизни токена должно иметь тип Number")
            }

            state.accessTokenExpiresAt = payload
        },
    }

    static actions = {
        setupAuthData({commit}, tokens) {
            commit("setTokens", tokens)

            const payload = getPayloadFromJWT(tokens.accessToken)

            commit("user/setUserData", payload, {root: true})
            commit("setAccessTokenExpiresAt", payload?.exp)
        },

        clearAuthData({commit}) {
            commit("clearTokens")
            commit("setAccessTokenExpiresAt", 0)

            commit("user/clearUserData", null, {root: true})
            commit("user/toggleIsAuthenticated", false, {root: true})
        },
    }
}
