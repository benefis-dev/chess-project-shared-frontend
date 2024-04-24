// noinspection JSUnusedGlobalSymbols

import {isString, isObject, isArray} from "../utils"

export class BrowserStorage {
    /**
     * @param {String} key
     * @param {any} value
     */
    static setItem(key, value) {
        if (isObject(value) || isArray(value)) {
            value = JSON.stringify(value)
        }

        window.localStorage.setItem(key, value)
    }

    /**
     * @param {String} key
     * @return {any|null}
     */
    static getItem(key) {
        const item = window.localStorage.getItem(key)

        if (isString(item)) {
            const first = item.charAt(0)
            const last = item.charAt(item.length - 1)
            let isJson = false

            if (first === "[" && last === "]") {
                isJson = true
            } else if (first === "{" && last === "}") {
                isJson = true
            }

            if (isJson) {
                return JSON.parse(item)
            }
        }

        return item
    }

    /**
     * @param {String} key
     */
    static removeItem(key) {
        window.localStorage.removeItem(key)
    }
}
