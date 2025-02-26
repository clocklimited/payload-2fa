import type { CollectionAfterLogoutHook } from 'payload'

import { cookies } from 'next/headers.js'

export const deleteCookieAfterLogout: CollectionAfterLogoutHook = async ({ req: { payload } }) => {
	const cookiesList = await cookies()
	cookiesList.delete(`${payload.config.cookiePrefix}-totp`)
}
