'use strict'

//dependencias usadas
const express = require('express')
const bearerToken = require('express-bearer-token')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./modules/config')

mongoose.connect(config.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;


//instancia de express
const app = express()

//configuramos middlewares usados
app.use(bearerToken())
app.use(express.json())
app.use(cors())

//traemos las rutas de ficheros externos
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const articlesRoutes = require('./routes/articles')
const ordersRoutes = require('./routes/orders')
const contactsRoutes = require('./routes/contacts')

//crea variables globales para escribir/leer los datos desde cualquier sitio
app.set("articles", [])
app.set("orders", [])
app.set("contacts", [])

//enganchamos las rutas
app.use(productsRoutes)
app.use(usersRoutes)
app.use(authRoutes)
app.use(articlesRoutes)
app.use(ordersRoutes)
app.use(contactsRoutes)

//exponemos la instancia configurada de la app (para que quien importe este fichero haga lo que necesite con la instancia)
module.exports = app