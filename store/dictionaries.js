// noinspection JSUnusedGlobalSymbols

import {isNull, isObject} from "../utils"

export const state = () => ({
    puzzle: null,
})

export const getters = {
    puzzle: (state) => {
        if (isNull(state.puzzle) || !isObject(state.puzzle)) {
            throw new Error("Словарь `puzzle` не заполнен")
        }

        return state.puzzle
    },
}

export const mutations = {
    addDictionary(state, {dictName, dictValue}) {
        state[dictName] = dictValue
    },
}

export const actions = {
    async fetchDictionary({commit}, dictName) {
        const {payload} = await this.$voyager.plainGet(`/v1/dictionary/model/${dictName}`)
        commit("addDictionary", {dictName, dictValue: payload})
    },
}
