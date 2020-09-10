import crypto from 'crypto-js'
import { isEmpty } from './index'

/**
 * Summary. Function to use the AES method of the crypto library to encrypt a string value
 * using a secret key.
 *
 * @param {string} value    Value to be encrypted with the AES algorithm.
 * @param {string} secret   Secret key to encrypt the value.
 *
 * @return {string}         Encrypted value
 */
export const encryptionAES = (value, secret) =>
  crypto.AES.encrypt(value, secret).toString()

/**
 * Summary. Function to use the AES method of the crypto library to decrypt a string value using
 * the secret key it was encrypted in UTF-8 character encoding.
 *
 * @param {string} value    String that represent a value encrypted with the AES algorithm.
 * @param {string} secret   Secret key used to encrypt the encrypted string.
 *
 * @return {string}         Decrypted value, if it is not a valid hash for the AES algorithm,
 *                          it returns the first argument passed
 */
export const decryptionAES = (hash, secret) => {
  if (!isEmpty(hash)) {
    const encoding = crypto.enc.Utf8
    return crypto.AES.decrypt(hash, secret).toString(encoding)
  }
  return hash
}
