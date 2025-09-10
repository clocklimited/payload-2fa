import type { ServerComponentProps } from 'payload'

import { formatAdminURL } from '@payloadcms/ui/shared'
import { headers } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

import type { PayloadTOTPConfig, UserWithTotp } from '../../types.js'

import TOTPProviderClient from './index.client.js'

type Args = {
	children: React.ReactNode
	pluginOptions: PayloadTOTPConfig
} & ServerComponentProps

export const TOTPProvider = async (args: Args) => {
	const { children, payload, pluginOptions, user: _user } = args
	const user = _user as UserWithTotp
	const headersList = await headers()
	const pathname = headersList.get('x-pathname')!

	const verifyUrl = formatAdminURL({
		adminRoute: payload.config.routes.admin,
		path: '/verify-totp',
		serverURL: payload.config.serverURL,
	})

	const setupUrl = formatAdminURL({
		adminRoute: payload.config.routes.admin,
		path: '/setup-totp',
		serverURL: payload.config.serverURL,
	})

	// Ensure we compare pathnames only without relying on a dummy origin
	const toPathname = (url: string) =>
		/^https?:\/\//i.test(url) ? new URL(url).pathname : url
	const verifyPathname = toPathname(verifyUrl)
	const setupPathname = toPathname(setupUrl)

	if (
		user &&
		user.hasTotp &&
		!['api-key', 'totp'].includes(user._strategy) &&
		pathname !== verifyPathname
	) {
		redirect(`${verifyUrl}?back=${encodeURIComponent(pathname)}`)
	} else if (
		user &&
		!user.hasTotp &&
		(user.forceTotp || pluginOptions.forceSetup) &&
		pathname !== setupPathname &&
		user._strategy !== 'api-key'
	) {
		redirect(`${setupUrl}?back=${encodeURIComponent(pathname)}`)
	} else {
		return (
			<TOTPProviderClient
				forceSetup={pluginOptions.forceSetup}
				setupUrl={setupUrl}
				verifyUrl={verifyUrl}
			>
				{children}
			</TOTPProviderClient>
		)
	}
}
