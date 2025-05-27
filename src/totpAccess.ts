import type { Access, BasePayload } from 'payload'

import type { UserWithTotp } from './types.js'

export const totpAccess: (innerAccess?: Access) => Access = (innerAccess) => {
	return async (args) => {
		const {
			req: {
				payload: {
					config: {
						custom: {
							totp: { pluginOptions },
						},
					},
				},
				user,
			},
		} = args as unknown as { req: { payload: BasePayload; user: UserWithTotp } }

		const fn = innerAccess || (() => !!args.req.user)

		if (!user) {
			return fn(args)
		}

		if (
			((user.forceTotp || pluginOptions.forceSetup) && user._strategy === 'totp') ||
			user._strategy === 'api-key'
		) {
			return fn(args)
		} else {
			if (user.hasTotp) {
				if (user._strategy === 'totp') {
					return fn(args)
				} else {
					return false
				}
			} else {
				return fn(args)
			}
		}
	}
}
