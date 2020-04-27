// config.js

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  const result = dotenv.config()

  if (result.error) {
    throw result.error
  }

  const envs = result.parsed


} else {
  module.exports = process.env
}
