// noinspection JSUnusedGlobalSymbols

import {copy, isNumber, isObject, isString} from "../utils"

export class PuzzleFilter {
    /**
     * @type {String|null}
     */
    ids = null

    /**
     * @type {String|null}
     */
    uuids = null

    /**
     * @type {Object[]|Number[]}
     */
    types =  []

    /**
     * @type {Object[]|Number[]}
     */
    themes = []

    /**
     * @type {Number[]}
     */
    excludedPuzzles = []

    /**
     * @type {{from: null, to: null}}
     */
    plycount = {
        from: null,
        to: null,
    }

    /**
     * @type {{from: null, to: null}}
     */
    glickoRating = {
        from: null,
        to: null,
    }

    /**
     * @type {{from: null, to: null}}
     */
    blitzGlickoRating = {
        from: null,
        to: null,
    }

    /**
     * @param {Number[]} excludedPuzzles
     * @return {Object}
     */
    toDto(excludedPuzzles = []) {
        let ids = [], uuids = []

        if (isString(this.ids)) {
            ids = this.ids.split(" ").map(id => Number(String(id).trim()))
        }

        if (isString(this.uuids)) {
            uuids = this.uuids.split(" ").map(uuid => String(uuid).trim())
        }

        return {
            ids,
            uuids,
            types:             this.#getIdsFromArray(this.types),
            themes:            this.#getIdsFromArray(this.themes),
            excludedPuzzles:   this.excludedPuzzles.concat(excludedPuzzles),
            glickoRating:      copy(this.glickoRating),
            blitzGlickoRating: copy(this.blitzGlickoRating),
            plycount:          copy(this.plycount),
        }
    }

    /**
     * @param {Object} DTO
     * @param {Object[]} themes
     * @param {Object[]} types
     * @return {PuzzleFilter}
     */
    static makeFromDto(DTO, themes = [], types = []) {
        const filter = Object.assign(new this(), DTO)
        filter.ids = DTO.ids?.join(" ")
        filter.uuids = DTO.uuids?.join(" ")

        const themeIds = {}
        const typeIds = {}

        DTO.themes.forEach(themeId => {
            themeIds[themeId] = true
        })

        DTO.types.forEach(typeId => {
            typeIds[typeId] = true
        })

        filter.themes = []
        filter.types = []

        themes.forEach(category => {
            category.themes.forEach(theme => {
                if (theme.id in themeIds) {
                    filter.themes.push(theme)
                }
            })
        })

        types.forEach(type => {
            if (type.id in typeIds) {
                filter.types.push(type)
            }
        })

        return filter
    }

    /**
     * @param {Array} array
     * @return {Number[]}
     */
    #getIdsFromArray(array) {
        return array.map(type => {
            if (isObject(type)) {
                return type.id
            } else if (isNumber(type)) {
                return type
            }

            throw new Error("Неподдерживаемое значение в массиве.")
        })
    }
}
