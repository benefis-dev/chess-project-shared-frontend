// noinspection JSUnusedGlobalSymbols

import {Store} from "vuex"
import {Voyager} from "./Voyager"
import {BrowserStorage} from "../classes/BrowserStorage"
import {PuzzleFilter} from "../classes/PuzzleFilter"
import {isNull, isObject, isString, uuidV4} from "../utils"

export class PuzzleService {
    static PUZZLE_FILTER_KEY = "puzzle_filter"
    static VISITOR_UUID_KEY = "visitor_uuid"
    static VISITOR_UNSAVED_DATA_REMINDER_KEY = "dontRemindAboutUnsavedData"

    /**
     * @type {Voyager}
     */
    #voyager

    /**
     * @type {Store}
     */
    #store

    /**
     * @param {Voyager} voyager
     * @param {Store} store
     */
    constructor(voyager, store) {
        this.#voyager = voyager
        this.#store = store
    }

    /**
     * @param {Object[]} themes
     * @param {Object[]} types
     * @return {PuzzleFilter|null}
     */
    getPreviousPuzzleFilter(themes = [], types = []) {
        const DTO = BrowserStorage.getItem(PuzzleService.PUZZLE_FILTER_KEY)

        if (isObject(DTO)) {
            return PuzzleFilter.makeFromDto(DTO, themes, types)
        }

        return null
    }

    savePuzzleFilter(DTO) {
        BrowserStorage.setItem(PuzzleService.PUZZLE_FILTER_KEY, DTO)
    }

    /**
     * @return {Promise<Array>}
     */
    async getPlayerRatings() {
        if (this.#store.state.user.isAuthenticated) {
            const {payload} = await this.#voyager.get(`/v1/openSolving.getUserRatings`)

            return payload
        }

        const visitorUuid = this.#getOrSetVisitorUuid()
        const {payload} = await this.#voyager.plainGet(`/v1/openSolving.getVisitorRatings/${visitorUuid}`)

        return payload
    }

    /**
     * @param {Object} result
     * @return {Promise<Object>}
     */
    async saveSolvingResult(result) {
        if (this.#store.state.user.isAuthenticated) {
            const {payload} = await this.#voyager.post("/v1/openSolving.saveUserSolvingResult", result)

            return payload
        }

        const visitorUuid = this.#getOrSetVisitorUuid()
        const {payload} = await this.#voyager.plainPost(`/v1/openSolving.saveVisitorSolvingResult/${visitorUuid}`, result)

        return payload
    }

    /**
     * Получить задачу для свободного решения.
     *
     * @param {Object} filterDto
     * @return {Promise<Object>}
     */
    async fetchPuzzleForOpenSolving(filterDto) {
        if (this.#store.state.user.isAuthenticated) {
            return await this.#voyager.post("/v1/openSolving.fetchPuzzleByUser", filterDto)
        }

        const visitorUuid = this.#getOrSetVisitorUuid()

        return await this.#voyager.plainPost(`/v1/openSolving.fetchPuzzleByVisitor/${visitorUuid}`, filterDto)
    }

    /**
     * @return {Promise<Boolean>}
     */
    async isPlayerNewbie() {
        if (this.#store.state.user.isAuthenticated) {
            return await this.#voyager.get("/v1/openSolving.isUserNewbie")
        }

        const visitorUuid = this.#getOrSetVisitorUuid()

        return await this.#voyager.plainGet(`/v1/openSolving.isVisitorNewbie/${visitorUuid}`)
    }

    /**
     * @return {Boolean}
     */
    getRemindVisitorAboutUnsavedData() {
        const isRemind = BrowserStorage.getItem(PuzzleService.VISITOR_UNSAVED_DATA_REMINDER_KEY)

        if (isString(isRemind)) {
            return Boolean(Number(isRemind))
        }

        return false
    }

    /**
     * @param {Boolean} value
     */
    toggleRemindVisitorAboutUnsavedData(value) {
        BrowserStorage.setItem(PuzzleService.VISITOR_UNSAVED_DATA_REMINDER_KEY, Number(value))
    }

    /**
     * @return {String}
     */
    #getOrSetVisitorUuid() {
        let visitorUuid = BrowserStorage.getItem(PuzzleService.VISITOR_UUID_KEY)

        if (isNull(visitorUuid)) {
            visitorUuid = uuidV4()
            BrowserStorage.setItem(PuzzleService.VISITOR_UUID_KEY, visitorUuid)
        }

        return visitorUuid
    }
}
