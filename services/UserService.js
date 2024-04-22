import {Store} from "vuex"
import {Voyager} from "./Voyager"
import {TokenService} from "./TokenService"
import {Toaster} from "./Toaster"
import {AuthenticationError} from "../exceptions/AuthenticationError"

export class UserService {
    /**
     * @type {Voyager}
     */
    #voyager

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
     * @param {Voyager} voyager
     * @param {Store} store
     * @param {TokenService} tokenService
     * @param {Toaster} toaster
     */
    constructor(voyager, store, tokenService, toaster) {
        this.#voyager = voyager
        this.#store = store
        this.#tokenService = tokenService
        this.#toaster = toaster
    }

    /**
     * @returns {Promise<boolean>}
     */
    async checkAuthentication() {
        try {
            const {isOk} = await this.#voyager.get("/v1/users.isAuthenticated")

            return isOk
        } catch (e) {
            if (e instanceof AuthenticationError) {
                this.#toaster.error(e.message)
            }

            return false
        }
    }

    /**
     * @param {Object} credentials
     * @returns {Promise<boolean>}
     */
    async login(credentials) {
        const response = await this.#voyager.plainPost("/v1/users.loginByEmail", credentials)
        await this.#afterLogin(response)

        return response.isOk
    }

    /**
     * @param {Object} credentials
     * @returns {Promise<boolean>}
     */
    async privilegedLogin(credentials) {
        const response = await this.#voyager.plainPost("/v1/admin.users.loginByEmail", credentials)
        await this.#afterLogin(response)

        return response.isOk
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        await this.#voyager.get("/v1/users.logout", {headers: {
            "X-RefreshToken": this.#store.getters["credentials/refreshToken"],
        }})

        await this.#store.dispatch("credentials/clearAuthData")
        await this.#tokenService.removeTokens()
    }

    /**
     * @param {Boolean} isOk
     * @param {Object} payload
     */
    async #afterLogin({isOk, payload}) {
        if (isOk) {
            await this.#tokenService.saveTokens(payload)
            await this.#store.dispatch("credentials/setupAuthData", payload)
            this.#store.commit("user/toggleIsAuthenticated", true)
        }
    }
}
