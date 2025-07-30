const express = require('express')
require('dotenv').config()
const authRoutes = require('./routes/auth')
const paramRoutes = require('./routes/param')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // form verileri için (opsiyonel)

app.use('/api/auth', authRoutes)
app.use('/api/param', paramRoutes)

app.listen(3000, () => {
  console.log('OK')
})
