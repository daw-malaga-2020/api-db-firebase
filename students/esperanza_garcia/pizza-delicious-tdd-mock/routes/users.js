const express = require('express')
const router = express.Router()
const md5= require('md5')
const authMiddleware = require('../middlewares/authentication')

const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/users')
  .get(methodAllowedOnlyForAdmins,(req,res)=>{
    let userList = req.app.get('users')

    filteredList = userList.map((item) => {
      let clonedUser = { ...item }

      delete clonedUser.password

      return clonedUser
    })

    res.json(filteredList)
  })
  .post(methodAllowedForUsersAndAdmins,(req,res) => {
    let userList = req.app.get('users')

    let newUser = {...{id: userList.length + 1}, ...req.body}
    newUser.password = md5(newUser.password)

    userList.push(newUser)
    req.app.set('users', userList)

    let clonedUser = {...newUser}

    delete clonedUser.password

    res.status(201).json(newUser)

  })
router.route('/users/:id')
  .get(methodAllowedForUsersAndAdmins,(req,res)=>{
    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItem= userList.find(item=> item.id === searchId)
    if(req.user.profile !== 'admin'){
      foundItem = userList.find(item=> item.id === searchId && item.id === req.user.id)
    }

    if(!foundItem){
      req.status(404).json({'message':'El usuario que intentas obtener no existe'})
      return
    }
    let clonedUser = {...foundItem}
    delete clonedUser.password

    res.json(clonedUser)
  })
  .put(methodAllowedForUsersAndAdmins,(req,res)=>{
    let userList= req.app.get('users')
    let searchId= parseInt(req.params.id)

    let foundItemIndex= userList.findIndex(item=> item.id=== searchId)
    if (req.user.profile !== 'admin') {
      foundItemIndex = userList.find(item => item.id === searchId && item.id === req.user.id)
    }

    if(foundItemIndex===-1){
      res.status(404).json({ 'message': 'El usuario que intentas editar no existe' })
      return
    }
    let updateUser= userList[foundItemIndex]

    updateUser= {...updateUser, ...req.body}

    userList[foundItemIndex]= updateUser

    req.app.set('users', userList)

    let clonedUser= {...updateUser}

    delete clonedUser.password

    res.json(clonedUser)
  })
  .delete(methodAllowedForUsersAndAdmins, (req,res)=>{
    let userList= req.app.get('users')
    let searchId= parseInt(req.params.id)

    let foundItemIndex= userList.findIndex(item=> item.id=== searchId)
    if (req.user.profile !== 'admin') {
      foundItemIndex = userList.find(item => item.id === searchId && item.id === req.user.id)
    }

    if(foundItemIndex===-1){
      res.status(404).json({ 'message': 'El usuario que intentas eliminar no existe' })
      return
    }

    userList.splice(foundItemIndex, 1)
    req.app.set('users', userList)

    res.status(204).json()
  })

module.exports = router
