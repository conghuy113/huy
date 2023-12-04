import { Router } from 'express'
import {
  emailVerifyTokenController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapAsync } from '~/utils/handlers'
const usersRoute = Router()

export default usersRoute

/*
  des: đăng nhập
  path: /users/login
  method: POST
  body: {email, password}
*/
usersRoute.post('/login', loginValidator, loginController)

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

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRoute.get('/me', accessTokenValidator, wrapAsync(getMeController))

usersRoute.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác bằng unsername
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
usersRoute.get('/:username', wrapAsync(getProfileController))

/*
des: Follow someone
path: '/follow'
method: post
headers: {Authorization: Bearer <access_token>}
body: {followed_user_id: string}
*/
usersRoute.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))
//accessTokenValidator dùng dể kiểm tra xem ngta có đăng nhập hay chưa, và có đc user_id của người dùng từ req.decoded_authorization
//verifiedUserValidator dùng để kiễm tra xem ngta đã verify email hay chưa, rồi thì mới cho follow người khác
//trong req.body có followed_user_id  là mã của người mà ngta muốn follow
//followValidator: kiểm tra followed_user_id truyền lên có đúng định dạng objectId hay không
//  account đó có tồn tại hay không
//followController: tiến hành thao tác tạo document vào collection followers
