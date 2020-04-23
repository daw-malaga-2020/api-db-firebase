"use strict"
const express = require('express')
const app = express()
const faker = require('faker')

app.use(express.json())
const port = process.env.PORT || 8080

let usersList= [
  {
    "id":1,
    "name":"pepe",
    "lastname": "perez"
  },
  {
    "id":2,
    "name":"maria",
    "price": "ramirez"
  }
]

app.route('/users')
    .get((req, res)=>{

      res.json(usersList)
    })
    .post((req, res)=>{
      console.info(req.body)

     let nextId = usersList.length + 1
      let newUser={"id": nextId}
         /*
        "id": nextId,
        "name":faker.name.firstName(),
        "price":faker.name.lastName()
      } */

      newUser= {...newUser,...req.body}

      userList.push(newUser)

      res.json(newUser)
    })
app.route('/users/:userId')
    .get((req,res)=>{
      let userId = req.params.id

      let foundUser = usersList.find(user => user.id === userId)

      console.log(`${userId} ${foundUser}`)

      if(!foundUser){
        res.status(404).json({"mensaje":"no lo encontramos"})
      }
      res.json(foundUser)
    })


app.listen(port, ()=>{
  console.info(`El servidor está corriendo en http://localhost:${port}`)
})
