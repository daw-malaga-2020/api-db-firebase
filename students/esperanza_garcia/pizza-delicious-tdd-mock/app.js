const express = require('express')
const jwt = require('jsonwebtoken')
const bearerToken = require('express-bearer-token')

const app= express()

app.use(express.json())

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
app.set("users", [])


app.use(productsRoutes)
app.use(articlesRoutes)
app.use(contactsRoutes)
app.use(ordersRoutes)
app.use(usersRoutes)
app.use(authRoutes)

module.exports= app
