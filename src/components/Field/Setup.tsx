/* eslint-disable no-restricted-exports */

import type { I18nClient } from '@payloadcms/translations'

import { Button } from '@payloadcms/ui'
import Link from 'next/link.js'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../i18n/types.js'

type Args = {
	backUrl?: string
	i18n: I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
}

export default function Setup({ backUrl, i18n }: Args) {
	let url = '/admin/setup-totp'

	if (backUrl) {
		url += `?back=${encodeURIComponent(backUrl)}`
	}

	return (
		<Button
			buttonStyle="secondary"
			el="link"
			Link={Link as unknown as React.ElementType}
			size="small"
			url={url}
		>
			{i18n.t('totpPlugin:setup:button')}
		</Button>
	)
}
