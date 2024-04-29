// noinspection JSUnusedGlobalSymbols

import {NuxtAxiosInstance} from "@nuxtjs/axios"
import {AuthTokensNotFound} from "../exceptions/AuthTokensNotFound"
import {isString} from "../utils"

export class TokenService {
    /**
     * @type {String}
     */
    #tokenStorageServicePath

    /**
     * @type {NuxtAxiosInstance}
     */
    #axios

    /**
     * @param {String} baseURL
     * @param {String} tokenStorageServicePath
     * @param {NuxtAxiosInstance} axios
     */
    constructor(baseURL, tokenStorageServicePath, axios) {
        if (!isString(baseURL)) {
            throw new Error("Параметр 'baseURL' должен быть строкой.")
        }

        if (!isString(tokenStorageServicePath)) {
            throw new Error("Параметр 'tokenStorageServicePath' должен быть строкой.")
        }

        this.#axios = axios.create({
            baseURL,
            withCredentials: true,
        })

        this.#tokenStorageServicePath = tokenStorageServicePath
    }

    /**
     * @param {Object} tokenPair
     * @return {Promise<void>}
     */
    async saveTokens(tokenPair) {
        await this.#axios.$post(this.#tokenStorageServicePath, tokenPair)
    }

    /**
     * @return {Promise<*>}
     */
    async getTokens() {
        const {isOk, payload, error} = await this.#axios.$get(this.#tokenStorageServicePath)

        if (!isOk) {
            throw new AuthTokensNotFound(error ?? "Неизвестная ошибка от сервиса хранения токенов.")
        }

        return payload
    }

    /**
     * @return {Promise<void>}
     */
    async removeTokens() {
        await this.#axios.$delete(this.#tokenStorageServicePath)
    }
}
