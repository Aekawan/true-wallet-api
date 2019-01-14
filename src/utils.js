import rp from 'request-promise-native'
import moment from 'moment'
import cryptr from 'cryptr'
import dotenv from 'dotenv'

// config is here
dotenv.config()
const crypto = new cryptr(process.env.HASH_KEY);

export const decrypt = (str) => { 
  if(!str) return ''
  return crypto.decrypt(str)
}

export const checkPrivateKay = privateKey => {
  if (privateKey === process.env.PRIVATE_KEY) return true
  return false
}

export const httpRequest = async (headers, method = 'GET', url, data = '') => {
  const options = {
    header: headers,
    method,
    body: data,
    uri: url,
    json: true
  }

  return rp(options)
    .then(res => res)
    .catch(err => err)
}

export const request = {
  GET: async (url) => {
    const headers = {
      "Host": process.env.HOST_URL,
      "Content-Type": "application/json"
    }
    return await httpRequest(headers, 'GET', url, false)
  },
  POST: async (url, data) => {
    const headers = {
      "Host": process.env.HOST_URL,
      "Content-Type": "application/json"
    }
    return await httpRequest(headers, 'POST', url, data)
  }
}

export const defualtDate = (subtract = '') => {
  if (subtract) return moment().subtract(Math.abs(subtract), 'days').format('YYYY-MM-DD')
  return moment().format('YYYY-MM-DD')
}
