import axios from "axios"
// import { sm4encry } from '@fgdf/fgdf-web-utils'

// const SM4Util = sm4encry.SM4Util
// window.SM4Util = SM4Util

axios.defaults.timeout = 1000 * 60

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        error.response.data = {
            error: error.response.statusText
        };
        return Promise.reject(error.response)
    }
)

// 请求方法
function http(params) {
    let CancelToken = axios.CancelToken;
    let options = {
        // withCredentials: true,
        cancelToken: new CancelToken(function (cancel) {
            params.cancel = cancel;
        })
    }
    options = {
        ...options,
        ...params
    }
    return new Promise((resolve) => {
        axios(options).then(response => {
            if (response.data.code && response.data.code !== 200) {
                resolve({
                    error: response.data.message || ""
                })
            } else {
                if (response.decryptFlag) {
                    // response.data = JSON.parse(SM4Util.decryptData_ECB(response.data))
                    response.data = JSON.parse(response.data)
                }
                resolve(response.data)
            }
        }).catch(error => {
            resolve({
                error: error.data || ""
            })
        })
    })
}

export default http