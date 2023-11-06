import express from 'express'
import "dotenv/config"
import './db/index'
import path from 'path'

console.log(path.join(__dirname, "../mail/logo.png" ))

import authRouter from './routers/auth'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/auth", authRouter)

const PORT = process.env.PORT || 8989
app.listen(PORT, () => {
    console.log('Port is listening on port ' + PORT)
})