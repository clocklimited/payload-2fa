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

	useEffect(() => {
		if (
			user &&
			user.hasTotp &&
			user._strategy &&
			user._strategy !== 'totp' &&
			pathname !== verifyUrl
		) {
			router.push(`${verifyUrl}?back=${encodeURIComponent(pathname)}`)
		} else if (user && !user.hasTotp && forceSetup && pathname !== setupUrl) {
			router.push(`${setupUrl}?back=${encodeURIComponent(pathname)}`)
		}
	}, [user, forceSetup, verifyUrl, setupUrl, pathname, router])

	return children
}
