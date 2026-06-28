import { loginResponseSchema, type meResponseSchema } from '@/features/auth/model/auth.schemas.ts'
import * as z from 'zod'

// export type MeResponse = {
//     userId: string
//     login: string
// }
//
// export type LoginResponse = {
//     refreshToken: string
//     accessToken: string
// }
//
// // Arguments
// export type LoginArgs = {
//     code: string
//     redirectUri: string
//     rememberMe: boolean
//     accessTokenTTL?: string // e.g. "3m"
// }




export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// Arguments
export type LoginArgs = {
    code: string
    redirectUri: string
    rememberMe: boolean
    accessTokenTTL?: string // e.g. "3m"
}