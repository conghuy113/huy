import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
app.use(express.json())
const port = 4000
databaseService.connect()

//localhost:4000
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)

//localhost:4000/users/tweets
app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
