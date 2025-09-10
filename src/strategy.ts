import type { AuthStrategy } from 'payload'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers.js'

import { getTotpSecret } from './utilities/getTotpSecret.js'
import { resolvePluginOptions } from './utilities/totpUtils.js'

export const strategy: AuthStrategy = {
	name: 'totp',
	authenticate: async (args) => {
		const { payload } = args
		const cookieStore = await cookies()
		const token = cookieStore.get(`${payload.config.cookiePrefix}-totp`)

		if (!token) {
			return {
				user: null,
			}
		}

		let userId: string
		let originalStrategyName: string

		try {
			const result = jwt.verify(token.value, payload.secret) as {
				originalStrategy: string
				userId: string
			}

			userId = result.userId
			originalStrategyName = result.originalStrategy
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			// TODO: Log it
			return {
				user: null,
			}
		}

		const originalStrategy = payload.authStrategies.find(
			(strategy) => strategy.name === originalStrategyName,
		)

		if (!originalStrategy) {
			return {
				user: null,
			}
		}

		const originalStrategyResult = await originalStrategy.authenticate(args)

		if (originalStrategyResult.user?.id === userId) {
			// Ensure the user still has TOTP configured; otherwise, do not honor the TOTP cookie
			const pluginOptions = resolvePluginOptions(payload)
			if (!pluginOptions) {
				return { user: null }
			}

			const secret = await getTotpSecret({
				collection: pluginOptions.collection,
				payload,
				user: originalStrategyResult.user,
			})

			if (!secret) {
				return { user: null }
			}

			return {
				user: {
					...originalStrategyResult.user,
					_strategy: 'totp',
				},
			}
		} else {
			return {
				user: null,
			}
		}
	},
}
