import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.use(
  (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  },
  (req, res, next) => {
    console.log('Time2: ', Date.now())
    next()
  }
)

export default usersRouter

usersRouter.get('/login', loginValidator, loginController)
/*
Description: Registor new user
Path: /registor
Method:POST
body:{
    email:string
    password:string
    confirm_password: string
    date_of_birth:string theo chuẩn ISO 8601
}
 */
usersRouter.post('/register', registerValidator, registerController)
