import type { I18nClient } from '@payloadcms/translations'
import type { AdminViewProps, ServerComponentProps } from 'payload'

import { MinimalTemplate } from '@payloadcms/next/templates'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { redirect } from 'next/navigation.js'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../../i18n.js'
import type { PayloadTOTPConfig, UserWithTotp } from '../../../types.js'

import Form from './Form.js'
import styles from './index.module.css'

type Args = {
	pluginOptions: PayloadTOTPConfig
} & AdminViewProps &
	ServerComponentProps

export const TOTPVerify: React.FC<Args> = (args) => {
	const i18n = args.i18n as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
	const {
		initPageResult: {
			req: { payload, user: _user },
		},
		pluginOptions,
		searchParams: { back },
	} = args

	const user = _user as unknown as UserWithTotp

	if (!user) {
		const url = formatAdminURL({
			adminRoute: payload.config.routes.admin,
			path: '/login',
		})

		redirect(url)
	}

	// TODO: Report `user as any` to Payload
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!user.hasTotp || (user.hasTotp && (user as any)._strategy === 'totp')) {
		const url = formatAdminURL({
			adminRoute: payload.config.routes.admin,
			path: '/',
		})

		redirect(url)
	}

	return (
		<MinimalTemplate className={styles.root}>
			<h1>{i18n.t('totpPlugin:verify:title')}</h1>
			<p>
				{i18n
					.t('totpPlugin:setup:enterCode')
					.replace('{digits}', (pluginOptions.totp?.digits || 6).toString())}
			</p>
			<Form
				back={(typeof back === 'string' && back) || undefined}
				length={pluginOptions.totp?.digits}
			/>
		</MinimalTemplate>
	)
}
