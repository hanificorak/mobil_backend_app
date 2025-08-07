const express = require('express')
require('dotenv').config()
const authRoutes = require('./routes/auth')
const paramRoutes = require('./routes/param')
const appointmentRoutes = require('./routes/appointment')
const settingsRoutes = require('./routes/settings')
const profileRoutes = require('./routes/profile')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // form verileri için (opsiyonel)

app.use('/api/auth', authRoutes)
app.use('/api/param', paramRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.listen(3000, () => {
  console.log('OK 3000')
})
