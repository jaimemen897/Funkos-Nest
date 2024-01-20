import { readFileSync } from 'fs'
import { resolve } from 'path'

export function getSSLOptions() {
  const key = readFileSync(
    resolve(process.env.SSL_KEY || './cert/keystore.p12'),
  )
  const cert = readFileSync(resolve(process.env.SSL_CERT || './cert/cert.pem'))

  return { key, cert }
}
