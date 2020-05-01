const express= require('express')
const router = express.Router()
const jwt= require('jsonwebtoken')
const md5 = require('md5')

router.route('/auth/login')
  .post((req,res) => {
    let credentials = req.body

    let userList = req.app.get('users')

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

    let generatedToken = jwt.sign(jwtPayload, "asldfkjasidowe", {
      expiresIn: '15 days'
    })

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
