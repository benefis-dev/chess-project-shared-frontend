import cloneDeep from "lodash.clonedeep"
import dayjs from "dayjs"
import {v4} from "uuid"
import {PuzzleFilter} from "./classes/PuzzleFilter"
import {toByteArray} from "base64-js"

/**
 * Выполняет глубокое копирование. Принимает только массивы или объекты.
 *
 * @param {Array|Object} value
 * @return {*}
 */
export function copy(value) {
    if (!isArray(value) && !isObject(value)) {
        throw new Error("Функция 'copy' может принимать только массивы или объекты")
    }

    return cloneDeep(value)
}

export function isUndefined(value) {
    return typeof value === "undefined"
}

export function isString(value) {
    return typeof value === "string"
}

export function isNumber(value) {
    return typeof value === "number"
}

export function isBoolean(value) {
    return typeof value === "boolean"
}

/**
 *
 * @param {*} value
 * @return {Boolean}
 */
export function isNull(value) {
    return value === null
}

/**
 *
 * @param {*} value
 * @return {Boolean}
 */
export function isArray(value) {
    if (!isFunction(Array.isArray)) {
        return toString.call(value) === "[object Array]"
    }

    return Array.isArray(value)
}

/**
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @return {Boolean} True if `value` is an `Object` but not `null`.
 */
export function isObject(value) {
    return value != null && typeof value === "object"
}

/**
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @return {Boolean} True if `value` is a `Function`.
 */
export function isFunction(value) {
    return typeof value === "function"
}

/**
 * @param {String} propName
 * @param {Object} object
 * @return {Boolean}
 */
export function isPropertyExists(propName, object) {
    if (isString(propName) && isObject(object)) {
        return propName in object
    }

    return false
}

/**
 * @param {String|null} JWT
 * @return {Object}
 */
export function getPayloadFromJWT(JWT) {
    if (!isString(JWT)) {
        throw new Error("JWT должен быть строкой")
    }

    let [, payload ,] = JWT.split(".")

    if (process.server) {
        return JSON.parse(Buffer.from(payload, "base64").toString())
    }

    const residue = payload.length % 4

    // Если длина строки не кратна 4
    if (residue > 0) {
        payload = payload + "=".repeat(residue)
    }

    return JSON.parse(new TextDecoder().decode(toByteArray(payload)))
}

/**
 * Установка свойств для изменения порядка элементов в списках.
 *
 * @param {Array} list
 * @param {Array} recursive
 * @returns {Array}
 */
export function setPropsForReordering(list, recursive = []) {
    if (!isArray(list) || !isArray(recursive)) {
        throw new Error("Функция 'setPropsForReordering' может принимать только массивы")
    }

    list.forEach((item, index) => {
        item.isShowUpBtn   = index !== 0
        item.isShowDownBtn = index !== (list.length - 1)

        item.idToUp   = (index !== 0) ? list[index - 1].id : list[index].id
        item.idToDown = (index !== (list.length - 1)) ? list[index + 1].id : list[index].id

        if (recursive.length > 0) {
            recursive.forEach(property => {
                if (isArray(item[property])) {
                    setPropsForReordering(item[property])
                }
            })
        }
    })
}

/**
 * @param value
 * @returns {boolean|string}
 */
export function requiredFieldRule(value) {
    return !!value || "Поле обязательно для заполнения"
}

/**
 * @param string
 * @returns {string}
 */
export function upperFirst(string) {
    if (!isString(string)) {
        throw new Error("Функция 'uppercaseFirst' может принимать только строку")
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Возвращает псевдослучайную последовательность цифр в виде строки длиной от 15 до 20 символов.
 * Ведущий символ, как правило - ноль.
 *
 * @return {string}
 */
export function uniqueValue() {
    return Math.random().toString().replace(".", "")
}

/**
 * @param {Array} list
 * @param {Array} recursive
 * @returns {Array}
 */
export function setUniqueProp(list, recursive = []) {
    if (!isArray(list) || !isArray(recursive)) {
        throw new Error("Функция 'setUniqueProp' может принимать только массивы")
    }

    list.forEach(item => {
        item.unique = uniqueValue()

        if (recursive.length > 0) {
            recursive.forEach(property => {
                if (isArray(item[property])) {
                    setUniqueProp(item[property])
                }
            })
        }
    })
}

/**
 * @param {String} id
 * @returns {Promise<HTMLElement>}
 */
export function resolveElementById(id) {
    if (!isString(id)) {
        throw new Error("Функция 'resolveElementById' может принимать только строку")
    }

    return new Promise((resolve, reject) => {
        const timeout = 50
        let maxAttempts = 10

        let timerId = window.setTimeout(function tick() {
            maxAttempts--
            let el = document.getElementById(id)

            if (el instanceof HTMLElement) {
                window.clearTimeout(timerId)
                resolve(el)
            } else {
                if (maxAttempts === 0) {
                    reject(`Не удалось найти элемент "${id}"`)
                }

                timerId = window.setTimeout(tick, timeout)
            }
        }, timeout)
    })
}

/**
 * @param {any} value
 * @param {string} stub
 * @returns {string}
 */
export function valueOrStub(value, stub = "—") {
    if (!isString(stub)) {
        throw new Error("Функция 'valueOrStub' вторым параметром может принимать только строку")
    }

    if (isNull(value) || isUndefined(value) || (isString(value) && value.length === 0)) {
        return stub
    }

    return value
}

/**
 * @param {Number} perPage
 * @returns {Object}
 */
export function paginationFactory(perPage = 20) {
    if (!isNumber(perPage)) {
        throw new Error("Функция 'paginationFactory' может принимать первым параметром только число")
    }

    if (perPage <= 0) {
        throw new Error("Параметр 'perPage' должен быть больше 0")
    }

    return {
        items: [],
        page: 1,
        perPage,
        total: 0,
        pageCount: 0,
    }
}

/**
 * @param {string} dateTime
 * @returns {string}
 */
export function toDateTime(dateTime) {
    if (isString(dateTime)) {
        return dayjs(dateTime).format('DD.MM.YYYY HH:mm:ss')
    }

    return valueOrStub(dateTime)
}

/**
 * @param {any} value
 * @param {string} yesCaption
 * @param {string} noCaption
 * @returns {string}
 */
export function boolCaption(value, yesCaption = "Да", noCaption = "Нет") {
    if (!isBoolean(value)) {
        throw new Error("Функция 'boolCaption' может принимать первым параметром только булево значение")
    }

    if (!isString(yesCaption) || !isString(noCaption)) {
        throw new Error("Функция 'boolCaption' может принимать вторым и третьим параметром только строку")
    }

    return value ? yesCaption : noCaption
}

/**
 * @param {Object} entity
 * @param {Array} exclude
 * @returns {FormData}
 */
export function createFormDataFromEntity(entity, exclude = []) {
    if (!isObject(entity)) {
        throw new Error("Функция 'createFormDataFromEntity' может принимать первым параметром только объект")
    }

    if (!isArray(exclude)) {
        throw new Error("Функция 'createFormDataFromEntity' может принимать вторым параметром только массив")
    }

    const formData = new FormData()

    for (let key in entity) {
        let value = entity[key]

        if (isBoolean(value)) {
            value = Number(value)
        }

        if (isNull(value)) {
            value = ""
        }

        if (!exclude.includes(key)) {
            formData.append(key, value)
        }
    }

    return formData
}

/**
 * @param {string|null} imageUrl
 * @param {string} name
 * @param {string} color
 * @returns {string}
 */
export function imagePlaceholder(imageUrl, name, color) {
    if (isNull(imageUrl)) {
        let letters = name.split(" ").map(str => str.charAt(0)).join("").slice(0, 2)
        letters = letters.toUpperCase()

        return `https://placehold.co/100x100/${color}/white?text=${letters}`
    }

    return imageUrl
}

/**
 * @param {Array|Object|string} value
 * @param {Array<String>} result
 */
export function flatten(value, result) {
    if (!isArray(result)) {
        throw new Error("Функция 'flatten' может принимать вторым параметром только массив")
    }

    if (isArray(value)) {
        value.forEach(item => flatten(item, result))

    } else if (isObject(value)) {
        for (const key in value) {
            flatten(value[key], result)
        }
    } else if (isString(value)) {
        result.push(value)
    }
}

/**
 * @returns {PuzzleFilter}
 */
export function puzzleFilterFactory() {
    return new PuzzleFilter()
}

/**
 * @param {Number} ms Время в миллисекундах
 * @returns {Promise<unknown>}
 */
export async function sleep(ms) {
    if (!isNumber(ms)) {
        throw new Error("Функция 'sleep' может принимать первым параметром только число")
    }

    return new Promise(resolve => {
        window.setTimeout(() => resolve(true), ms)
    })
}

export function toConsole(...args) {
    if (process.env.NODE_ENV === "development") {
        console.log(...args)
    }
}

/**
 * @return {String}
 */
export function uuidV4() {
    return v4()
}

/**
 * @param date
 * @param format
 * @param locale
 * @return {dayjs.Dayjs}
 */
export function dayJs(date = undefined, format = undefined, locale = undefined) {
    return dayjs(date, format, locale)
}

/**
 * @param {Array} list
 * @param {Number} size
 * @return {Array}
 */
export function chunk(list, size) {
    if (!isArray(list)) {
        throw new Error("Функция 'chunk' может принимать первым параметром только массив")
    }

    if (!isNumber(size)) {
        throw new Error("Функция 'chunk' может принимать вторым параметром только целое число")
    }

    let i = 0
    let tempList = []
    const result = []

    while (i < list.length) {
        tempList.push(list[i])

        if (tempList.length === size) {
            result.push(tempList)
            tempList = []
        }

        if (i === (list.length - 1) && tempList.length > 0) {
            result.push(tempList)
        }

        i++
    }

    return result
}

/**
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
export function randomInt(min, max) {
    if (!isNumber(min) || !isNumber(max)) {
        throw new Error("Функция 'randomInt' может принимать параметрами только целые числа")
    }

    const rand = min + Math.random() * (max + 1 - min)

    return Math.floor(rand)
}

/**
 * @return {RegExp}
 */
export function uuidRegExp() {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
}
