import { Router } from 'express'
import {
  emailVerifyTokenController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordValidator
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

/*
  des: resend email verify token
  khi email thất lạc, hoặc email_verify_token hết hạn, thì ng dùng 
  có nhu cầu resend_email_verify_token

  Method:POST
  path:/users/resend-verify-email
  headers: {Authorization : "Bearer <access_token>"} // đăng nhập mới được resend
  body: 
*/
usersRoute.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
  des: khi người dùng quên mật khẩu, họ gửi email xin mình tạo cho forgot_password_token
  path: /users/forgot-password
  method: POST
  body:{email: string}
*/
usersRoute.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
  des: khi người dùng nhấp vào link trong email để reset password
  họ sẽ gửi 1 req theo forgot_password_token lên server
  server sẽ kiểm tra forgot_password_token có hợp lệ hay không ?
  sau đó chuyển hướng họ đến trang reset password

  path: /users/verify-forgot-password
  method:POST
  body: {forgot_password_token: string}
*/
usersRoute.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRoute.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordValidator,
  wrapAsync(resetPasswordController)
)
