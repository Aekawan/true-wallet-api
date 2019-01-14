import restify from 'restify'
import dotenv from 'dotenv'
import {
  index,
  signIn,
  profile,
  balance,
  transcritons,
  transcriton,
  signOut,
  genQrCode,
  topupCard
 } from './controller'

//config is here
dotenv.config()
const server = restify.createServer()
server.use(restify.plugins.bodyParser({}))
server.use(restify.plugins.queryParser());

server.get('/', index)
server.get('/profile', profile)
server.get('/balance', balance)
server.get('/transections', transcritons)
server.get('/transection/:id', transcriton)
server.get('/signout', signOut)
server.post('/token', signIn)
server.post('/qrcode', genQrCode)
server.post('/topup', topupCard)

server.listen(process.env.PORT || 8080, () => {
  console.log('%s listening at %s', server.name, server.url)
})