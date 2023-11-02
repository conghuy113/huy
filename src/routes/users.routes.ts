import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const usersRoute = Router()

export default usersRoute

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRoute.get('/login', loginValidator, loginController)

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
usersRoute.post('/register', registerValidator, wrapAsync(registerController))

/*
    des: đăng xuất
    path:/users/logout
    method:POST
    header: {Authorization: 'Bearer <access_token>'}
    body: {refresh_token: string}
*/
usersRoute.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
