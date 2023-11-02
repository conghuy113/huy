import { Router } from 'express'
import {
  emailVerifyTokenController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
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

/*
  des:verify email token
  khi ng dùng đăng ký, họ sẽ nhận được mail có link dạng
  http://localhost:4000/users/verify-email?token=<email_verify_token>
  nếu mà em nhấp vào link thì sẽ tạo ra req gửi lên email_verify_token lên server
  server kiểm tra cái email_verify_token có hợp lệ hay không ?
  thì từ decoded_email_verify_token lấy ra user_id
  và vào user_id đó để update email_verify_token thành '', verify = 1, update_at

  path: /users/verify-email
  method:POST
  body: {email_verify_token:string}
*/
usersRoute.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))
