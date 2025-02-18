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

		// TODO: Report `user as any` to Payload
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (pluginOptions.forceSetup && (user as any)._strategy === 'totp') {
			if (originalAccess) {
				return originalAccess(args)
			} else {
				return true
			}
		} else {
			if (user.hasTotp) {
				// TODO: Report `user as any` to Payload
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if ((user as any)._strategy === 'totp') {
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
