import type { Access } from 'payload'

import type { PayloadTOTPConfig, UserWithTotp } from './types.js'

type Args = {
	originalAccess?: Access
	pluginOptions: PayloadTOTPConfig
}

export const totpAccess: (args: Args) => Access = (outerFnArgs) => {
	const { originalAccess, pluginOptions } = outerFnArgs

	return async (args) => {
		const {
			req: { user },
		} = args as unknown as { req: { user: UserWithTotp } }

		if (!user) {
			return false
		}

		if (pluginOptions.forceSetup && user._strategy === 'totp') {
			if (originalAccess) {
				return originalAccess(args)
			} else {
				return true
			}
		} else {
			if (user.hasTotp) {
				if (user._strategy === 'totp') {
					if (originalAccess) {
						return originalAccess(args)
					} else {
						return true
					}
				} else {
					return false
				}
			} else {
				if (originalAccess) {
					return originalAccess(args)
				} else {
					return true
				}
			}
		}
	}
}
