import moment from 'moment-timezone'
import sha1 from 'sha1'
import * as R from 'ramda'
import { request } from './utils'

export const getToken = async ({ username = '', password = '', type = 'phone' }) => {
  const url = process.env.SIGNIN_URL
  const data = {
    "username": username,
    "password": sha1(username + password),
    "type": type,
  }
  return await request.POST(url, data)
}

export const logOut = async (token = '') => {
  const url = `${process.env.SIGN_OUT}${token}`
  const response = await request.POST(url)
  return response
}

export const getProfile = async (token = '') => {
  const url = `${process.env.PROFILE_URL}${token}`
  const response = await request.GET(url)
  return R.propOr('', 'data')(response)
}

export const getBalance = async (token = '') => {
  const url = `${process.env.BALANCE_URL}${token}`
  const response = await request.GET(url)
  return R.propOr('', 'data')(response)
}

export const getTranscritons = async (token, { startDate, endDate, limit }) => {
  const url = `${process.env.TRANSECTIONS_URL}${token}/?startDate=${startDate}&endDate=${endDate}&limit=${limit}`
  const response = await request.GET(url)
  return R.propOr('', 'data')(response)
}

export const getTranscriton = async (token, { id }) => {
  const url = `${process.env.ACTIVITIES_URL}/${id}/detail/${token}`
  const response = await request.GET(url)
  return R.propOr('', 'data')(response)
}

export const topup = async (token = '', { cashcard = '' }) => {
  const time = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')
  const url = `${process.env.TOPUP_URL}${time}/${token}/cashcard/${cashcard}`
  const response = await request.POST(url)
  return response
}
