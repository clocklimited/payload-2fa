import type { I18nClient } from '@payloadcms/translations'
import type { TextFieldServerProps, Where } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../i18n/types.js'
import type { PayloadTOTPConfig, UserWithTotp } from '../../types.js'

import styles from './index.module.css'
import AdminManageClient from './manage.client.js'
import Remove from './Remove.js'
import Setup from './Setup.js'

type Args = {
	pluginOptions: PayloadTOTPConfig
} & TextFieldServerProps

export const TOTPField = async (args: Args) => {
	const pluginOptions = args.pluginOptions
	const i18n = args.i18n as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
	const {
		data,
		payload,
		req: { url },
		user: _user,
	} = args

	const user = _user as unknown as UserWithTotp
	const { id } = (data as { id: string }) || { id: undefined }

	// Determine target document's TOTP state
	const doc = data as { forceTotp?: boolean; hasTotp?: boolean }
	const docHasTotp = Boolean(doc?.hasTotp)
	const docForceTotp = Boolean(doc?.forceTotp)
	const needsSetup = !docHasTotp && (docForceTotp || Boolean(pluginOptions.forceSetup))
	const disabled = !docHasTotp && !needsSetup
	const enabled = docHasTotp

	const isSelf = Boolean(user && user.id === id)

	// Only show inline actions for self when not globally or per-user forced
	const allowInlineSelf = !user?.forceTotp && !pluginOptions.forceSetup

	let canAdminManage = false
	if (!isSelf && pluginOptions.adminManageAccess) {
		try {
			const fn = pluginOptions.adminManageAccess as unknown as (input: unknown) => boolean | Promise<boolean | Where> | Where
			const res = fn({ req: args.req })
			const allowed = res instanceof Promise ? await res : res
			canAdminManage = Boolean(allowed)
		} catch {
			canAdminManage = false
		}
	}

	if (!isSelf && !canAdminManage) {
		return null
	}

	return (
		<div className={styles.root} id="totp-ui-field">
			<svg aria-hidden="true" height="24" version="1.1" viewBox="0 0 24 24" width="24">
				<path d="M10.25 5.25A.75.75 0 0 1 11 4.5h2A.75.75 0 0 1 13 6h-2a.75.75 0 0 1-.75-.75ZM12 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
				<path d="M4 2.75C4 1.784 4.784 1 5.75 1h12.5c.966 0 1.75.784 1.75 1.75v18.5A1.75 1.75 0 0 1 18.25 23H5.75A1.75 1.75 0 0 1 4 21.25Zm1.75-.25a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25Z"></path>
			</svg>
			<div className={styles.text}>
				<label className="field-label">
					{i18n.t('totpPlugin:authApp')}
					{enabled && <span className={styles.status}>{i18n.t('totpPlugin:configured')}</span>}
					{needsSetup && <span className={styles.status}>{i18n.t('totpPlugin:setup:title')}</span>}
					{disabled && <span className={styles.status}>Disabled</span>}
				</label>
				<span className={styles.description}>{i18n.t('totpPlugin:fieldDescription')}</span>
			</div>
			<div className={styles.action}>
				{isSelf ? (
					<>
						{enabled && allowInlineSelf && (
							<Remove
								i18n={i18n}
								payload={payload}
								pluginOptions={pluginOptions}
								user={user}
							/>
						)}
						{!enabled && allowInlineSelf && (
							<Setup backUrl={url} i18n={i18n} payload={payload} />
						)}
					</>
				) : (
					<AdminManageClient
						apiRoute={payload.config.routes.api}
						disabled={disabled}
						enabled={enabled}
						needsSetup={needsSetup}
						serverURL={payload.config.serverURL}
						targetUserId={id}
					/>
				)}
			</div>
		</div>
	)
}
