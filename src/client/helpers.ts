import { Secret, TOTP } from 'otpauth'

import type { PayloadTOTPConfig, UserWithTotp } from '../types.js'

type CommonArgs = {
	apiRoute?: string
	serverURL?: string
}

type VerifyArgs = {
	token: string
} & CommonArgs

type SetupArgs = {
	secret: string
	token: string
} & CommonArgs

export type VerifyResponse = {
	message?: string
	ok: boolean
}

const buildApiURL = ({ apiRoute = '/api', serverURL }: CommonArgs, path: string) => {
	const base = `${serverURL ?? ''}${apiRoute}`
	return `${base}${path}`
}

export async function verifyTotp({ token, ...rest }: VerifyArgs): Promise<VerifyResponse> {
	const url = buildApiURL(rest, '/verify-totp')

	const res = await fetch(url, {
		body: JSON.stringify({ token }),
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	})

	// When server fails hard, fall back to a generic error
	try {
		return (await res.json()) as VerifyResponse
	} catch {
		return { message: 'An error has occurred.', ok: false }
	}
}

export async function setupTotp({ secret, token, ...rest }: SetupArgs): Promise<VerifyResponse> {
	const url = buildApiURL(rest, '/setup-totp')

	const res = await fetch(url, {
		body: JSON.stringify({ secret, token }),
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	})

	try {
		return (await res.json()) as VerifyResponse
	} catch {
		return { message: 'An error has occurred.', ok: false }
	}
}

type AdminArgs = { userId: string } & CommonArgs

export async function adminRemoveTotp({ userId, ...rest }: AdminArgs): Promise<VerifyResponse> {
  const url = buildApiURL(rest, '/admin/remove-user-totp')

  const res = await fetch(url, {
    body: JSON.stringify({ userId }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  try {
    return (await res.json()) as VerifyResponse
  } catch {
    return { message: 'An error has occurred.', ok: false }
  }
}

export async function adminResetTotp({ userId, ...rest }: AdminArgs): Promise<VerifyResponse> {
  const url = buildApiURL(rest, '/admin/reset-user-totp')

  const res = await fetch(url, {
    body: JSON.stringify({ userId }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  try {
    return (await res.json()) as VerifyResponse
  } catch {
    return { message: 'An error has occurred.', ok: false }
  }
}

export function generateTotpSecret(size = 32) {
	const secret = new Secret({ size })
	return { base32: secret.base32, secret }
}

export type OtpAuthURLArgs = {
	label: string
	secretBase32: string
} & Partial<Pick<TOTP, 'algorithm' | 'digits' | 'issuer' | 'period'>>

export function buildOtpAuthURL({
	algorithm = 'SHA1',
	digits = 6,
	issuer = 'Payload',
	label,
	period = 30,
	secretBase32,
}: OtpAuthURLArgs) {
	const totp = new TOTP({
		algorithm,
		digits,
		issuer,
		label,
		period,
		secret: Secret.fromBase32(secretBase32),
	})
	return totp.toString()
}

export type TwoFAState = {
	hasTotp: boolean
	requiresSetup: boolean
	requiresVerification: boolean
}

export function get2FAState(user: UserWithTotp, pluginOptions?: PayloadTOTPConfig): TwoFAState {
	const hasTotp = Boolean(user?.hasTotp)
	const requiresVerification = hasTotp && user?._strategy !== 'totp'
	const requiresSetup = !hasTotp && Boolean(user?.forceTotp || pluginOptions?.forceSetup)
	return { hasTotp, requiresSetup, requiresVerification }
}

export type UsersMe = {
	strategy?: string
	user?: Partial<UserWithTotp>
}

export async function fetchMe({ apiRoute = '/api', serverURL }: CommonArgs = {}): Promise<UsersMe> {
	const url = `${serverURL ?? ''}${apiRoute}/users/me`
	const res = await fetch(url, { credentials: 'include' })
	try {
		return (await res.json()) as UsersMe
	} catch {
		return {}
	}
}
