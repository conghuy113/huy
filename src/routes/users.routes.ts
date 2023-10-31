import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

export default usersRouter

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
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
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
