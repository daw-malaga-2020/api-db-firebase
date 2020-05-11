'use strict'
const config = require('../modules/config')
const jwt = require('jsonwebtoken')
const defaultUserProfile = 'user'

function authenticationVerify (allowedProfiles, authRequired = true){
  return (req, res, next) => {

    req.user = null

    if(!authRequired && !req.token){
      next()
    }

    if (!req.token){
      res.status(403).json({'message': 'Debes estar autenticado para usar este método'})
      return
    }
    jwt.verify(req.token, config.APP_SECRET, (err, tokenData) => {

      if (err) {
        res.status(403).json ( {'message':'La sesión ha sido cerrada. Identifícate de nuevo.'})
        return
      }

      let userProfile = tokenData.profile || defaultUserProfile

      if(!isAllowedProfile(userProfile, allowedProfiles)){
        res.status(403).json({'message': 'No tienes permisos suficientes'})
        return
      }
      req.user = tokenData
      next()
    })

  }
}

function isAllowedProfile(current, alloweds) {
  if (typeof alloweds === 'string') {
    alloweds = [alloweds]
  }

  return (alloweds.indexOf(current) !== -1) ? true : false
}
module.exports = authenticationVerify
