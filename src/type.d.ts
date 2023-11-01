//file này dùng để định nghĩa lại Req truyền lên cilent
import { Request } from 'express'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User //trong 1 request có thể có hoặc không có user
  }
}
