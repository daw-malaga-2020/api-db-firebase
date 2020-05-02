const express= require('express')
const router = express.Router()
const jwt= require('jsonwebtoken')
const config = require('../modules/config')
const md5 = require('md5')

router.route('/auth/login')
  .post((req,res) => {
    let userList = req.app.get('users')

    let credentials = req.body


    let foundItem = userList.find(item => (item.email === credentials.email && item.password === md5(credentials.password)))

    if(!foundItem){
      res.status(401).json({'message': 'El usuario y/o contraseña no son correctos o no existen'})
      return
    }
    delete foundItem.password

    let jwtPayload = {
      id: foundItem.id,
      firstname: foundItem.firstname,
      profile: foundItem.profile
    }

    let generatedToken = jwt.sign(jwtPayload, config.APP_SECRET, {
      expiresIn: config.APP_TOKEN_VALIDITY_IN_DAYS + 'days'
    })

    if(!generatedToken){
      res.status(500).json({'message':' No ha sido posible iniciar sesión con este usuario.Inténtalo más tarde'})
      return
    }

    res.json({ 'token': generatedToken })
  })


router.route('/auth/forgotten-password')
  .post((req,res) => {

    let userList= req.app.get('users')
    let searchEmail= req.body.email

    let foundItem = userList.find(item=> item.email === searchEmail)

    if(!foundItem){
      res.status(404).json({'message': 'El email introducido no existe o no es correcto'})
      return
    }


    res.json({'message': 'Te hemos enviado un email para recuperar tu contraseña de forma segura'})

  })

module.exports = router
