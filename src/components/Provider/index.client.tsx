/* eslint-disable no-restricted-exports */

'use client'

import { useAuth } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation.js'
import { useEffect } from 'react'

import type { UserWithTotp } from '../../types.js'

type Args = {
	children: React.ReactNode
	forceSetup?: boolean
	setupUrl: string
	verifyUrl: string
}

export default function TOTPProviderClient(args: Args) {
	const { children, forceSetup, setupUrl, verifyUrl } = args
	const { user } = useAuth<UserWithTotp>()
	const router = useRouter()
	const pathname = usePathname()

	// Compare only pathnames without relying on window origin
	const toPathname = (url: string) => (/^https?:\/\//i.test(url) ? new URL(url).pathname : url)
	const verifyPathname = toPathname(verifyUrl)
	const setupPathname = toPathname(setupUrl)

	useEffect(() => {
		if (
			user &&
			user.hasTotp &&
			user._strategy &&
			!['api-key', 'totp'].includes(user._strategy) &&
			pathname !== verifyPathname
		) {
			router.push(`${verifyUrl}?back=${encodeURIComponent(pathname)}`)
		} else if (
			user &&
			!user.hasTotp &&
			(user.forceTotp || forceSetup) &&
			pathname !== setupPathname &&
			user._strategy !== 'api-key'
		) {
			router.push(`${setupUrl}?back=${encodeURIComponent(pathname)}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return children
}
