import {NuxtAxiosInstance} from "@nuxtjs/axios"

/**
 * @param {NuxtAxiosInstance} $axios
 */
export default ({$axios}) => {
    $axios.defaults.responseType = "json"
    $axios.defaults.validateStatus = () => true
}
