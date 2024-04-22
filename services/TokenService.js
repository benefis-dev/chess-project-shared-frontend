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
            baseURL: process.env.selfUrl,
            withCredentials: true,
        })
    }

    /**
     * @param {Object} tokenPair
     * @return {Promise<void>}
     */
    async saveTokens(tokenPair) {
        await this.#axios.$post(process.env.tokenStorageServicePath, tokenPair)
    }

    /**
     * @return {Promise<*>}
     */
    async getTokens() {
        const {isOk, payload, error} = await this.#axios.$get(process.env.tokenStorageServicePath)

        if (!isOk) {
            throw new AuthTokensNotFound(error ?? "Неизвестная ошибка от сервиса хранения токенов.")
        }

        return payload
    }

    /**
     * @return {Promise<void>}
     */
    async removeTokens() {
        await this.#axios.$delete(process.env.tokenStorageServicePath)
    }
}
