'use strict'

const expressApp = require('./app')

const port = process.env.PORT || 8082

expressApp.listen(port, ()=> console.info(`Server is running in http://localhost:${port}`))
