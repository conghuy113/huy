import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
config()
const app = express()
app.use(express.json())
const port = process.env.PORT || 4000

// tạo folder uploads
initFolder()
databaseService.connect()

//localhost:4000
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/medias', mediasRouter) //route handler
app.use('/users', usersRouter)
//localhost:4000/users/rigister

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})

// app.use('/static', express.static(UPLOAD_DIR))
app.use('/static', staticRouter)
