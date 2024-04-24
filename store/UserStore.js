// noinspection JSUnusedGlobalSymbols

import {isObject, isPropertyExists} from "../utils"

export class UserStore {
    static state = () => ({
        userId: null,
        userName: null,
        userSurname: null,
        userRoles: [],
        isAuthenticated: false,
    })

    static getters = {
        aggregate: (state) => state,
    }

    static mutations = {
        toggleIsAuthenticated(state, payload) {
            state.isAuthenticated = payload
        },

        setUserData(state, payload) {
            if (isObject(payload)) {
                for (let prop in payload) {
                    if (isPropertyExists(prop, state)) {
                        state[prop] = payload[prop]
                    }
                }
            }
        },

        clearUserData(state) {
            state.userId = null
            state.userName = null
            state.userSurname = null
            state.userRoles = []
        },
    }
}
