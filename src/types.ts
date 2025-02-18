import type { TOTP } from 'otpauth'
import type { CollectionSlug, User } from 'payload'

export type PayloadTOTPConfig = {
	collection: CollectionSlug
	disabled?: boolean
	forceSetup?: boolean
	totp?: Pick<TOTP, 'algorithm' | 'digits' | 'issuer' | 'period'>
}

export type UserWithTotp = {
	hasTotp: boolean
} & User
