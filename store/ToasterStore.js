// noinspection JSUnusedGlobalSymbols

export class ToasterStore {
    static state = () => ({
        toasts: [],
        toasterType: null,
        toasterHideDelay: null,
    })

    static getters = {
        toasts: (state) => state.toasts,
        toasterType: (state) => state.toasterType,
        toasterHideDelay: (state) => state.toasterHideDelay,
    }

    static mutations = {
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
}
