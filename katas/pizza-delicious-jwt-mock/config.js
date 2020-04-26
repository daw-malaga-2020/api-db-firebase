// config.js
const dotenv = require('dotenv')
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const envs = result.parsed

module.exports = envs
