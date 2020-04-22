"use strict"

const express = require('express')
const faker = require('faker')

const app = express()

app.use(express.json())
const port = process.env.PORT || 8082

let userList = [
  {
    'id': 1,
    'firstname': 'Juan Manuel'
  }
]

app.route('/users')
  .get((req, res) => {
    res.json(userList)
  })
  .post((req, res) => {
    console.info(req.body)

    let nextId = userList.length + 1

    let newUserInfo = {
      "id": nextId
    }

    newUserInfo = { ...newUserInfo, ...req.body }


    userList.push(newUserInfo)

    res.json(newUserInfo)
  })

app.route('/users/:userId')
  .get((req, res) => {
    let userId = req.params.userId

    let foundUser = userList.find(user => user.id == userId)

    if (!foundUser) {
      res.status(404).json({ "message": "Usuario con id " + userId + " no encontrado" })
    }

    res.json(foundUser)
  })
  .put((req, res) => {
    let userId = req.params.userId

    let foundIndexUser = userList.findIndex(user => user.id == userId)

    if (foundIndexUser === -1) {
      res.status(404).json({ "message": "Usuario con id " + userId + " no encontrado" })
      return
    }

    let foundUser = userList[foundIndexUser]

    foundUser = { ...foundUser, ...req.body }

    userList[foundIndexUser] = foundUser

    res.json(foundUser)
  })
  .delete((req, res) => {
    let userId = req.params.userId

    let foundIndexUser = userList.findIndex(user => user.id == userId)

    if (foundIndexUser === -1) {
      res.status(404).json({ "message": "Usuario con id " + userId + " no encontrado" })
      return
    }

    delete userList[foundIndexUser]

    res.status(204).json('')
  })



app.listen(port, () => console.info(`Server running in http://localhost:${port}`))
