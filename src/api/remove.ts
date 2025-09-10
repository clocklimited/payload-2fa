import type { I18nClient } from '@payloadcms/translations'
import type { BasePayload, PayloadHandler } from 'payload'

// use shared utils to construct and validate TOTP

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../i18n/types.js'
import type { PayloadTOTPConfig, UserWithTotp } from '../types.js'

import { getTotpSecret } from '../utilities/getTotpSecret.js'
import { removeCookie } from '../utilities/removeCookie.js'
import { createTOTP, isValidToken } from '../utilities/totpUtils.js'

export function removeEndpointHandler(pluginOptions: PayloadTOTPConfig) {
	const handler: PayloadHandler = async (req) => {
		const { payload, user } = req as unknown as { payload: BasePayload; user: UserWithTotp }
		const i18n = req.i18n as unknown as I18nClient<
			CustomTranslationsObject,
			CustomTranslationsKeys
		>

		if (!user) {
			return Response.json({ message: i18n.t('error:unauthorized'), ok: false })
		}

		if (!user.hasTotp || user.forceTotp || pluginOptions.forceSetup) {
			return Response.json({ message: i18n.t('error:unauthorized'), ok: false })
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let data: any

		try {
			data = req.json && (await req.json())
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
		} catch (err) {}

		// TODO: A better validation
		if (typeof data !== 'object' || typeof data['token'] !== 'string') {
			return Response.json({ message: i18n.t('error:unspecific'), ok: false })
		}

		const totpSecret = await getTotpSecret({
			collection: pluginOptions.collection,
			payload,
			user,
		})

		const totp = createTOTP({ pluginOptions, secretBase32: totpSecret!, user: user as unknown as UserWithTotp })

		if (!isValidToken(totp, data['token'])) {
			return Response.json({ message: i18n.t('totpPlugin:setup:incorrectCode'), ok: false })
		}

		await payload.update({
			id: user.id,
			collection: user.collection,
			data: {
				totpSecret: null,
			},
			overrideAccess: true,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any) // TODO: Report this to Payload

		await removeCookie(payload.config.cookiePrefix)

		return Response.json({ ok: true })
	}

	return handler
}

export interface IResponse {
	message?: string
	ok: boolean
}
