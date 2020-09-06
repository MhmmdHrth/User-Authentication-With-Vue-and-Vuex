import axios from 'axios'

const instance = axios.create({
    baseURL:"https://identitytoolkit.googleapis.com/v1/accounts",
})

instance.interceptors.request.use(req => {
    console.log("Interceptors Request",req)
    return req
})

instance.interceptors.response.use(res => {
    console.log("Interceptors Response",res)
    return res
})

export default instance 