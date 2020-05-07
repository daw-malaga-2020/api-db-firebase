const express = require('express')
const router = express.Router()
const md5 = require('md5')


router.route('/users')
  .get((req, res) => {
    let userList = req.app.get('users')

    filteredList = userList.map((item) => {
      let clonedItem = {...item}

      delete clonedItem.password

      return clonedItem
    })

    res.json(filteredList)
  })
  .post((req, res) => {

      let userList = req.app.get('users')

      let newItem = { ...{ id: userList.length + 1 }, ...req.body }

      //el password se guarda siempre encriptado con un método no reversible (md5, sha512, ...)
      newItem.password = md5(newItem.password)

      userList.push(newItem)
      req.app.set('users', userList)

      let clonedItem = {...newItem}

      delete clonedItem.password

      res.status(201).json(clonedItem)


  })

router.route('/users/:id')
  .get((req, res) => {

    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItem = userList.find(item => item.id === searchId)

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    let clonedItem = {...foundItem}

    delete clonedItem.password

    res.json(clonedItem)
  })
  .put((req, res) => {

    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = userList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = userList[foundItemIndex]

    updatedItem = { ...updatedItem, ...req.body }

    userList[foundItemIndex] = updatedItem
    req.app.set('users', userList)

    let clonedItem = {...updatedItem}

    delete clonedItem.password

    res.json(clonedItem)
  })
  .delete((req, res) => {
    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = userList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    userList.splice(foundItemIndex, 1)
    req.app.set('users',userList)

    res.status(204).json()
  })

module.exports = router
