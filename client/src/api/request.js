import axios from 'axios'

const ERR_OK = 0 // 错误码

export function request(url, method = 'get') {
  return function (params = {}, config = {}) {
    return axios[method](url, params, config).then(res => {
      const { code, data } = res.data
      console.log(res.data)
      if (code === ERR_OK) return data
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}
