import axios from 'axios'
import { endpoints, requests } from './config.json'
import _ from 'lodash'

function interpolateVariables(s, data) {
  var regex = new RegExp(':(' + Object.keys(data).join('|') + ')', 'g');
  return s.replace(regex, (m, $1) => data[$1] || m);
}

export default class APIClient {
  params = {}
  data = {}
  token = ''

  constructor(token = undefined) {
    this._axiosInstance = axios.create({
      baseURL: endpoints[process.env.NODE_ENV],
    })

    if (token) {
      this._token = token
      this._axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
    }

    this._requests = requests
  }

  setToken(value) {
    if (value) {
      this._token = value
      this._axiosInstance.defaults.headers.Authorization = `Bearer: ${this._token}`
    } else {
      this._token = ''
      delete this._axiosInstance.defaults.headers.Authorization
    }
  }

  request(type, params = {}, data = {}) {
    _.assign(params, this.params)
    _.assign(data, this.data)
    const req = this._requests[type]
    const url = params ? interpolateVariables(req['path'], params) : req['path']

    switch (req['method']) {
      case 'GET':
        return this._axiosInstance.get(url)

      case 'POST':
      case 'PUT':
      case 'PATCH':
        const method = req['method'].toLowerCase()
        return this._axiosInstance[method](url, data)

      case 'DELETE':
        return this._axiosInstance.delete(url)
    }

  }

  addParam(name, value) {
    this.params[name] = value
  }

  addPOSTParam(name, value) {
    this.data[name] = value
  }

  addInterceptor(f) {
    this._axiosInstance.interceptors.response.use(f)
  }
}
