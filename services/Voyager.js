// noinspection JSUnusedGlobalSymbols

import {AuthenticationError} from "../exceptions/AuthenticationError"
import {NuxtAxiosInstance} from "@nuxtjs/axios"
import dayjs from "dayjs"
import {Store} from "vuex"
import {TokenService} from "./TokenService"
import {Toaster} from "./Toaster"

export class Voyager {
    /**
     * @type {NuxtAxiosInstance}
     */
    #axios

    /**
     * @type {Store}
     */
    #store

    /**
     * @type {TokenService}
     */
    #tokenService

    /**
     * @type {Toaster}
     */
    #toaster

    /**
     * @param {NuxtAxiosInstance} axios
     * @param {Store} store
     * @param {TokenService} tokenService
     * @param {Toaster} toaster
     */
    constructor(axios, store, tokenService, toaster) {
        this.#axios = axios.create({
            baseURL: process.env.apiUrl,
        })

        this.#store = store
        this.#tokenService = tokenService
        this.#toaster = toaster
    }

    /**
     * @param {string} url
     * @param {Object|null} config
     * @returns {Promise<*>}
     */
    async get(url, config = null) {
        await this.#checkAndSetTokens()

        return await this.#makeRequest(() => this.#axios.get(url, config))
    }

    /**
     * @param {string} url
     * @param {Object|null} config
     * @returns {Promise<*>}
     */
    async plainGet(url, config = null) {
        return await this.#makeRequest(() => this.#axios.get(url, config))
    }

    /**
     * @param {string} url
     * @param {Object} data
     * @param {Object|null} config
     * @returns {Promise<*>}
     */
    async post(url, data, config = null) {
        await this.#checkAndSetTokens()

        return await this.#makeRequest(() => this.#axios.post(url, data, config))
    }

    /**
     * @param {string} url
     * @param {Object} data
     * @param {Object|null} config
     * @returns {Promise<*>}
     */
    async plainPost(url, data, config = null) {
        return await this.#makeRequest(() => this.#axios.post(url, data, config))
    }

    /**
     * @returns {Promise<void>}
     */
    async #checkAndSetTokens() {
        const expiresAt = this.#store.getters["credentials/accessTokenExpiresAt"]

        // Если истёк срок действия accessToken
        if (!dayjs.unix(expiresAt).isAfter(dayjs())) {
            await this.#refreshTokens()
        }

        this.#axios.setToken(this.#store.getters["credentials/accessToken"], "Bearer")
    }

    /**
     * @param {function} request
     * @returns {Promise<*>}
     */
    async #makeRequest(request) {
        let response = await request()

        if (response.status === 401) {
            await this.#refreshTokens()
            response = await request()
        }

        if (!response.data.isOk) {
            this.#toaster.error(response.data.errors)
        }

        if (response.data.messages.length > 0) {
            this.#toaster.message(response.data.messages)
        }

        return response.data
    }

    async #refreshTokens() {
        const {isOk, payload, errors} = await this.#axios.$get('/v1/users.refreshTokens', {headers: {
            "X-RefreshToken": this.#store.getters["credentials/refreshToken"],
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
        }})

        if (!isOk) {
            throw new AuthenticationError(errors.join(", "))
        }

        await this.#tokenService.saveTokens(payload)
        await this.#store.dispatch("credentials/setupAuthData", payload)
    }
}
