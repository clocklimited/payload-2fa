/* eslint-disable no-restricted-exports */

import type { I18nClient } from '@payloadcms/translations'

import { CopyToClipboard } from '@payloadcms/ui'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../../../i18n/types.js'

import ShowSecretClient from './index.client.js'
import styles from './index.module.css'

type Args = {
	i18n: I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
	secret: string
}

export default function ShowSecret({ i18n, secret }: Args) {
	const button = {
		className: styles.link,
		text: i18n.t('totpPlugin:setup:addCodeManually'),
	}

	const secretNode = (
		<div className={styles.secret}>
			<code>{[...chunks(secret.split(''), 4)].map((chunk) => chunk.join('')).join(' ')}</code>
			<CopyToClipboard value={secret} />
		</div>
	)

	return <ShowSecretClient button={button} secret={secretNode} />
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
	for (let i = 0; i < arr.length; i += n) {
		yield arr.slice(i, i + n)
	}
}
