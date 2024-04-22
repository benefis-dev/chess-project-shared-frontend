// noinspection JSUnusedGlobalSymbols

export const state = () => ({
    toasts: [],
    toasterType: null,
    toasterHideDelay: null,
})

export const getters = {
    toasts: (state) => state.toasts,
    toasterType: (state) => state.toasterType,
    toasterHideDelay: (state) => state.toasterHideDelay,
}

export const mutations = {
    push(state, {toasts, type, delay}) {
        state.toasts = toasts
        state.toasterType = type
        state.toasterHideDelay = delay
    },

    clear(state) {
        state.toasts = []
        state.toasterType = null
        state.toasterHideDelay = null
    },
}
