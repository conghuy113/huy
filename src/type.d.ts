//file này dùng để định nghĩa lại Req truyền lên cilent
import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'

declare module 'express' {
  interface Request {
    user?: User //trong 1 request có thể có hoặc không có user.
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
