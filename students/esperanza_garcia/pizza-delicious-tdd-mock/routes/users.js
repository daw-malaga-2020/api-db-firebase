const express = require('express')
const router = express.Router()
const md5= require('md5')

router.route('/users')
  .get((req,res)=>{
    let userList = req.app.get('users')

    userList= userList.map((item)=> {
      delete item.password
    })

    res.json(userList)
  })
  .post((req,res) => {
    let userList = req.app.get('users')

    let newUser = {...{id: userList.length + 1}, ...req.body}
    newUser.password = md5(newUser.password)

    userList.push(newUser)
    req.app.set('users', userList)

    delete newUser.password

    res.status(201).json(newUser)

  })
router.route('/users/:id')
  .get((req,res)=>{
    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItem= userList.find(item=> item.id === searchId)
    if(!foundItem){
      req.status(404).json({'message':'El elemnto '})
    }
    delete foundItem.password

    res.json(foundItem)
  })
  .put((req,res)=>{
    let userList= req.app.get('users')
    let searchId= parseInt(req.params.id)

    let foundItemIndex= userList.findIndex(item=> item.id=== searchId)
    if(foundItemIndex===-1){
      res.status(404).json({ 'message': 'El usuario que intentas editar no existe' })
      return
    }
    let updateUser= userList[foundItemIndex]
    updateUser= {...updateUser, ...req.body}
    userList[foundItemIndex]= updateUser

    delete updateUser.password

    res.json(updateUser)
  })
  .delete((req,res)=>{
    let userList= req.app.get('users')
    let searchId= parseInt(req.params.id)

    let foundItemIndex= userList.findIndex(item=> item.id=== searchId)
    if(foundItemIndex===-1){
      res.status(404).json({ 'message': 'El usuario que intentas eliminar no existe' })
      return
    }

    userList.splice(foundItemIndex, 1)
    req.app.set('users', userList)

    res.status(204).json()
  })

module.exports = router
