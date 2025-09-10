import type { BasePayload } from 'payload'

import type { PayloadTOTPConfig, UserWithTotp } from '../types.js'

import { setCookie } from '../setCookie.js'
import { getTotpSecret } from '../utilities/getTotpSecret.js'
import { createTOTP, isValidToken, resolvePluginOptions } from '../utilities/totpUtils.js'

export type TotpResponse = {
	message?: string
	ok: boolean
}

type CommonArgs = {
	payload: BasePayload
	pluginOptions?: PayloadTOTPConfig
	user?: UserWithTotp
	userId?: string
}

export type VerifyTotpArgs = { token: string } & CommonArgs

export async function verifyTotp({
	payload,
	pluginOptions: override,
	token,
	user,
	userId,
}: VerifyTotpArgs): Promise<TotpResponse> {
	const pluginOptions = resolvePluginOptions(payload, override)
	if (!pluginOptions) {
		return { message: 'TOTP is not configured.', ok: false }
	}

		let theUser = user
		if (!theUser && userId) {
			const findArgs = {
				id: userId,
				collection: pluginOptions.collection,
				overrideAccess: true,
			} as any // eslint-disable-line @typescript-eslint/no-explicit-any
			theUser = (await payload.findByID(findArgs)) as unknown as UserWithTotp
		}
	if (!theUser) {
		return { message: 'Unauthorized, you must be logged in to make this request.', ok: false }
	}

	const secretBase32 = await getTotpSecret({
		collection: pluginOptions.collection,
		payload,
		user: theUser,
	})
	if (!secretBase32) {
		return { message: 'TOTP is not configured.', ok: false }
	}

	const totp = createTOTP({ pluginOptions, secretBase32, user: theUser })
	if (!isValidToken(totp, token)) {
		return { message: 'Incorrect TOTP code.', ok: false }
	}

	const collection = payload.collections[pluginOptions.collection]
	await setCookie({
		authConfig: collection.config.auth,
		cookiePrefix: payload.config.cookiePrefix,
		secret: payload.secret,
		user: theUser,
	})

	return { ok: true }
}

export type SetupTotpArgs = { secretBase32: string; token: string } & CommonArgs

export async function setupTotp({
	payload,
	pluginOptions: override,
	secretBase32,
	token,
	user,
	userId,
}: SetupTotpArgs): Promise<TotpResponse> {
	const pluginOptions = resolvePluginOptions(payload, override)
	if (!pluginOptions) {
		return { message: 'TOTP is not configured.', ok: false }
	}

		let theUser = user
		if (!theUser && userId) {
			const findArgs = {
				id: userId,
				collection: pluginOptions.collection,
				overrideAccess: true,
			} as any // eslint-disable-line @typescript-eslint/no-explicit-any
			theUser = (await payload.findByID(findArgs)) as unknown as UserWithTotp
		}
	if (!theUser) {
		return { message: 'Unauthorized, you must be logged in to make this request.', ok: false }
	}

	// Prevent re-setup if already configured
	const existing = await getTotpSecret({
		collection: pluginOptions.collection,
		payload,
		user: theUser,
	})
	if (existing) {
		return { message: 'TOTP is already configured.', ok: false }
	}

	const totp = createTOTP({ pluginOptions, secretBase32, user: theUser })
	if (!isValidToken(totp, token)) {
		return { message: 'Incorrect TOTP code.', ok: false }
	}

	await payload.update({
		id: theUser.id,
		collection: pluginOptions.collection,
		data: { totpSecret: secretBase32 },
		overrideAccess: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any)

	const collection = payload.collections[pluginOptions.collection]
	await setCookie({
		authConfig: collection.config.auth,
		cookiePrefix: payload.config.cookiePrefix,
		secret: payload.secret,
		user: theUser,
	})

	return { ok: true }
}

export type HasTotpArgs = { user?: UserWithTotp; userId?: string } & Omit<
	CommonArgs,
	'user' | 'userId'
>

export async function hasTotp({
	payload,
	pluginOptions: override,
	user,
	userId,
}: HasTotpArgs): Promise<boolean> {
	const pluginOptions = resolvePluginOptions(payload, override)
	if (!pluginOptions) {
		return false
	}

		let theUser = user
		if (!theUser && userId) {
			const findArgs = {
				id: userId,
				collection: pluginOptions.collection,
				overrideAccess: true,
			} as any // eslint-disable-line @typescript-eslint/no-explicit-any
			theUser = (await payload.findByID(findArgs)) as unknown as UserWithTotp
		}
	if (!theUser) {
		return false
	}

	const secretBase32 = await getTotpSecret({
		collection: pluginOptions.collection,
		payload,
		user: theUser,
	})
	return Boolean(secretBase32)
}
