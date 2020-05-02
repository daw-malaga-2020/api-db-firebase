const express = require('express')
const bearerToken = require('express-bearer-token')
const cors = require('cors')

const app= express()

app.use(express.json())
app.use(bearerToken())
app.use(cors())

const productsRoutes= require('./routes/products')
const articlesRoutes= require('./routes/articles')
const contactsRoutes = require('./routes/contacts')
const ordersRoutes = require('./routes/orders')
const usersRoutes= require('./routes/users')
const authRoutes = require('./routes/auth')


app.set("products", [])
app.set("articles", [])
app.set("contacts", [])
app.set("orders", [])
app.set("users", [{
  id:1,
  firstName: 'Espe',
  lastname: 'García',
  email: 'esp@gmail.com',
  password: '',
  profile: 'admin',
  enabled: true
},
{
  id:1,
  firstName: 'user1',
  lastname: 'García',
  email: 'user@gmail.com',
  password: '',
  profile: 'user',
  enabled: true
}
])


app.use(productsRoutes)
app.use(articlesRoutes)
app.use(contactsRoutes)
app.use(ordersRoutes)
app.use(usersRoutes)
app.use(authRoutes)

module.exports= app
