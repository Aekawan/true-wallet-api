import * as R from 'ramda'
import qrcode from 'qrcode'
import generatePayload from 'promptpay-qr'
import dotenv from 'dotenv'
import { getToken, getProfile, getBalance, getTranscritons, getTranscriton, logOut, topup } from './wallet'
import { getAccessToken, saveAccessToken, getAccount } from './firebase'
import { defualtDate, checkPrivateKay } from './utils'

//config is here
dotenv.config();

export const index = async (req, res, next) => {
  const accessToken = await getAccessToken()
  if (accessToken) {
    res.send('wellcome ' + accessToken)
  }
  res.send('wellcome to wallet to money')
  next()
}

export const execute = async (accessToken, fn, options = {}) => {
  const response = await fn(accessToken, options)
  if (!response) {
    const { token } = await goLogin()
    if (token) return await fn(token, options)
    return { message: 'error' }
  }
  return response
}

export const goLogin = async () => {
  const { username, password, type } = await getAccount()
  const response = await getToken({ username, password, type })
  const accessToken = R.pathOr('', ['data', 'accessToken'])(response)
  return await saveAccessToken(accessToken)
}

export const signIn = async (req, res, next) => {
  if (R.isEmpty(req.body)) return res.send({ message: `can't retive access token` })
  const key = R.propOr('', 'key')(req.body)
  if (!checkPrivateKay(key)) return res.send({ message: `can't retive access token` })
  const username = R.propOr('', 'username')(req.body)
  const password = R.propOr('', 'password')(req.body)
  const type = R.propOr('', 'type')(req.body)
  const response = await getToken({ username, password, type })
  const accessToken = R.pathOr('', ['data', 'accessToken'])(response)
  const token = await saveAccessToken(accessToken)
  res.send(token)
  next()
}

export const signOut = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const response = await logOut(accessToken)
  res.send(response)
  next()
}

export const profile = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const response = await execute(accessToken, getProfile)
  res.send(response)
  next()
}

export const balance = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const response = await execute(accessToken, getBalance)
  res.send(response)
  next()
}

export const transcritons = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const startDate = R.propOr(defualtDate(-1), 'startDate')(req.body || req.query)
  const endDate = R.propOr(defualtDate(), 'endDate')(req.body || req.query)
  const limit = R.propOr(20, 'limit')(req.body || req.query)
  const response = await execute(accessToken, getTranscritons, { startDate, endDate, limit })
  res.send(response)
  next()
}

export const transcriton = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const id = req.params.id
  const response = await execute(accessToken, getTranscriton, { id })
  res.send(response)
  next()
}

export const topupCard = async (req, res, next) => {
  const accessToken = await getAccessToken()
  const cashcard = R.propOr('', 'cashcard')(req.body)
  const response = await execute(accessToken, topup, { cashcard })
  res.send(response)
  next()
}

export const genQrCode = async (req, res, next) => {
  const eWalletId = R.propOr(process.env.EWALLET_ID || '', 'eWalletId')(req.body)
  const amount = R.propOr(100, 'amount')(req.body)
  const payload = generatePayload(eWalletId, { amount })
  const options = { type: 'svg' }
  const qrSvg = await qrcode.toString(payload, options, (err, svg) => {
      if (err) return err
      return svg
  })
  res.set('Content-Type', 'image/svg+xml')
  res.send(qrSvg)
  next()
}
