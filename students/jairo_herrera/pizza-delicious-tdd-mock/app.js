'use strict'

//dependencias usadas
const express = require('express')
const bearerToken = require('express-bearer-token')

//instancia de express
const app = express()

//configuramos middlewares usado
app.use(bearerToken())
app.use(express.json())

//traemos las rutas de ficheros externos
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const articlesRoutes = require('./routes/articles')
const ordersRoutes = require('./routes/orders')
const contactsRoutes = require('./routes/contacts')

//crea variables globales para escribir/leer los datos desde cualquier sitio
app.set("products", [])
app.set("articles", [])
app.set("orders", [])
app.set("contacts", [])
//inicia usuario de pruebas
app.set("users", [{
  id: 1,
  firstname: 'Jairo',
  lastname: 'Herrera',
  email: 'test@test.es',
  password: '098f6bcd4621d373cade4e832627b4f6',
  profile: 'admin',
  enabled: true
}])
//contraseña: test
app.set("orders", [])
app.set("contacts", [])

//enganchamos las rutas
app.use(productsRoutes)
app.use(usersRoutes)
app.use(authRoutes)
app.use(articlesRoutes)
app.use(ordersRoutes)
app.use(contactsRoutes)

//exponemos la instancia configurada de la app
module.exports = app
