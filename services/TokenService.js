// noinspection JSUnusedGlobalSymbols

import {NuxtAxiosInstance} from "@nuxtjs/axios"
import {AuthTokensNotFound} from "../exceptions/AuthTokensNotFound"

export class TokenService {
    /**
     * @type {NuxtAxiosInstance}
     */
    #axios

    /**
     * @param {NuxtAxiosInstance} axios
     */
    constructor(axios) {
        this.#axios = axios.create({
            baseURL: process.env.SELF_URL,
            withCredentials: true,
        })
    }

    /**
     * @param {Object} tokenPair
     * @return {Promise<void>}
     */
    async saveTokens(tokenPair) {
        await this.#axios.$post(process.env.TOKEN_STORAGE_SERVICE_PATH, tokenPair)
    }

    /**
     * @return {Promise<*>}
     */
    async getTokens() {
        const {isOk, payload, error} = await this.#axios.$get(process.env.TOKEN_STORAGE_SERVICE_PATH)

        if (!isOk) {
            throw new AuthTokensNotFound(error ?? "Неизвестная ошибка от сервиса хранения токенов.")
        }

        return payload
    }

    /**
     * @return {Promise<void>}
     */
    async removeTokens() {
        await this.#axios.$delete(process.env.TOKEN_STORAGE_SERVICE_PATH)
    }
}
