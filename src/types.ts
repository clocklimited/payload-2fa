import type { TOTP } from 'otpauth'
import type { Access, CheckboxField, CollectionSlug, User } from 'payload'

export type PayloadTOTPConfig = {
	adminManageAccess?: Access
	collection: CollectionSlug
	disableAccessWrapper?: boolean
	disabled?: boolean
	forceSetup?: boolean
	totp?: Partial<Pick<TOTP, 'algorithm' | 'digits' | 'issuer' | 'period'>>
	userSpecificForceTotpField?: {
		access?: CheckboxField['access']
		enabled?: boolean
	}
}

export type UserWithTotp = {
	forceTotp: boolean
	hasTotp: boolean
} & User
