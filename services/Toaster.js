// noinspection JSUnusedGlobalSymbols

import {Store} from "vuex"
import {isNull, isNumber, isString, flatten} from "../utils"

export class Toaster {
    /**
     * @type {Store}
     */
    #store

    /**
     * @type {Number}
     */
    #messagesDisplayTime

    /**
     * @param {Store} store
     * @param {Number} messagesDisplayTime
     */
    constructor(store, messagesDisplayTime) {
        this.#store = store

        if (!isNumber(messagesDisplayTime)) {
            throw new Error("Значение свойства 'messagesDisplayTime' должно быть числом")
        }

        this.#messagesDisplayTime = messagesDisplayTime
    }

    /**
     * @param {Object|Array|String} error
     * @param {Number|null} delay
     */
    error(error, delay = null) {
        this.#pushToToaster(error, "error", delay)
    }

    /**
     * @param {Object|Array|String} message
     * @param {Number|null} delay
     */
    message(message, delay = null) {
        this.#pushToToaster(message, "success", delay)
    }

    /**
     * Очищает все сообщения.
     */
    clear() {
        this.#store.commit("toaster/clear")
    }

    /**
     * @returns {String[]}
     */
    getToasts() {
        return this.#store.getters["toaster/toasts"]
    }

    /**
     * @param {Object|Array|String} toasts
     * @param {String} type
     * @param {Number|null} delay
     */
    #pushToToaster(toasts, type, delay) {
        const tempToasts = []
        flatten(toasts, tempToasts)

        tempToasts.forEach(toast => {
            if (!isString(toast)) {
                throw new Error("Каждое сообщение должно быть строкой")
            }
        })

        if (!isNull(delay) && !isNumber(delay)) {
            throw new Error("Время жизни сообщения должно быть числом")
        }

        if (isNull(delay)) {
            delay = this.#messagesDisplayTime
        }

        this.#store.commit("toaster/push", {toasts: tempToasts, type, delay})
    }
}
