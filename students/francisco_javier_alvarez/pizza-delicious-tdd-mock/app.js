'use stric'

// Dependencia usadas
const express = require('express')
const bearerToken = require('express-bearer-token')

// Instancia express
const app = express()

// Middleware usados
app.use(bearerToken())
app.use(express.json())

// Rutas de ficheros externos
const articlesRoutes = require('./routes/articles')
const authRoutes = require('./routes/auth')
const contactsRoutes = require('./routes/contacts')
const ordersRoutes = require('./routes/orders')
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')

// Variables locales
app.set("articles", [])
app.set("contacts", [])
app.set("orders", [])
app.set("products", [])
app.set("users", [{
    id: 1,
    name: 'Francisco J.',
    lastname: 'Álvarez',
    email: 'test@test.es',
    password: '098f6bcd4621d373cade4e832627b4f6',
    profile: 'admin',
    enabled: true
}])

app.use(productsRoutes)
app.use(usersRoutes)
app.use(authRoutes)
app.use(articlesRoutes)
app.use(ordersRoutes)
app.use(contactsRoutes)

module.exports = app