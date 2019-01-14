import * as admin from 'firebase-admin'
import * as R from 'ramda'
import { decrypt } from './utils'

//config is here
const serviceAccount = './firebase-key.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wallettomoney.firebaseio.com"
});

const db = admin.database();

export const saveAccessToken = async (token = '') => {
  return await db.ref('private').update({ token })
    .then(() => ({ message: 'save token success', token }))
    .catch(error => ({ message: 'save token success', error }))
}

export const getAccessToken = async () => {
  const res = await db.ref("private").once("value").then(snapshot => {
    return snapshot.val()
  })
  return R.propOr('', 'token')(res)
}

export const getAccount = async () => {
  const res = await db.ref("private").once("value").then(snapshot => {
    return snapshot.val()
  })
  return ({
    username: decrypt(R.propOr('', 'username')(res)),
    password: decrypt(R.propOr('', 'password')(res)),
    type: decrypt(R.propOr('', 'type')(res)),
  })
}
