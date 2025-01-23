import type { I18nClient } from '@payloadcms/translations'
import type { TextFieldServerComponent } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../i18n.js'
import type { PayloadTOTPConfig } from '../../types.js'

import { getTotpSecret } from '../../utilities/getTotpSecret.js'
import styles from './index.module.css'
import Remove from './Remove.js'
import Setup from './Setup.js'

export const TOTPField: TextFieldServerComponent = async (args) => {
	const pluginOptions = args.pluginOptions as PayloadTOTPConfig
	const i18n = args.i18n as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
	const {
		data: { id },
		payload,
		req: { url },
		user,
	} = args

	if (!user || user.id !== id) {
		return null
	}

	let configured = false

	if (id) {
		const totpSecret = await getTotpSecret(user, payload)

		if (totpSecret) {
			configured = true
		}
	}

	return (
		<div className={styles.root}>
			<svg aria-hidden="true" height="24" version="1.1" viewBox="0 0 24 24" width="24">
				<path d="M10.25 5.25A.75.75 0 0 1 11 4.5h2A.75.75 0 0 1 13 6h-2a.75.75 0 0 1-.75-.75ZM12 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
				<path d="M4 2.75C4 1.784 4.784 1 5.75 1h12.5c.966 0 1.75.784 1.75 1.75v18.5A1.75 1.75 0 0 1 18.25 23H5.75A1.75 1.75 0 0 1 4 21.25Zm1.75-.25a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25Z"></path>
			</svg>
			<div className={styles.text}>
				<label className="field-label">
					{i18n.t('totpPlugin:authApp')}
					{configured && (
						<span className={styles.status}>{i18n.t('totpPlugin:configured')}</span>
					)}
				</label>
				<span className={styles.description}>{i18n.t('totpPlugin:fieldDescription')}</span>
			</div>
			<div className={styles.action}>
				{configured && !pluginOptions.forceSetup && (
					<Remove
						i18n={i18n}
						payload={payload}
						pluginOptions={pluginOptions}
						user={user}
					/>
				)}
				{!configured && !pluginOptions.forceSetup && <Setup backUrl={url} i18n={i18n} />}
			</div>
		</div>
	)
}
