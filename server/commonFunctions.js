const jwt = require('jsonwebtoken')
const crypto = require('crypto')

function generateToken(data) {
  return jwt.sign({ data }, 'superkey', { expiresIn: '6h' })
}

function hash(s) {
  return crypto.pbkdf2Sync(s, '_', 1000, 64, `sha512`).toString(`hex`)
}

function verifyHash(s, h) {
  return hash(s) === h
}

module.exports = {
  generateToken,
  hash,
  verifyHash
}