import type { CheckboxField, Config, TextField, UIField } from 'payload'

import type { PayloadTOTPConfig } from './types.js'

import { removeEndpointHandler } from './api/remove.js'
import { setSecret } from './api/setSecret.js'
import { verifyToken } from './api/verifyToken.js'
import { deleteCookieAfterLogout } from './hooks/deleteCookieAfterLogout.js'
import { setHasTotp } from './hooks/setHasTotp.js'
import { i18n } from './i18n.js'
import { strategy } from './strategy.js'
import { totpAccess } from './totpAccess.js'

export const payloadTotp =
	(pluginOptions: PayloadTOTPConfig) =>
	(config: Config): Config => {
		return {
			...config,
			admin: {
				...(config.admin || {}),
				components: {
					...(config.admin?.components || {}),
					providers: [
						...(config.admin?.components?.providers || []),
						{
							path: 'payload-totp/rsc#TOTPProvider',
							serverProps: {
								pluginOptions,
							},
						},
					],
					views: {
						...(config.admin?.components?.views || {}),
						SetupTOTP: {
							Component: {
								path: 'payload-totp/rsc#TOTPSetup',
								serverProps: {
									pluginOptions,
								},
							},
							exact: true,
							path: '/setup-totp',
							sensitive: false,
							strict: true,
						},
						VerifyTOTP: {
							Component: {
								path: 'payload-totp/rsc#TOTPVerify',
								serverProps: {
									pluginOptions,
								},
							},
							exact: true,
							path: '/verify-totp',
							sensitive: false,
							strict: true,
						},
					},
				},
			},
			collections: [
				...(config.collections || []).map((collection) => {
					if (collection.slug === pluginOptions.collection) {
						return {
							...collection,
							access: {
								...(collection.access || {}),
								create: collection.custom?.totp?.disableAccessWrapper?.create
									? collection.access?.create
									: totpAccess({
											originalAccess: collection.access?.create,
											pluginOptions,
										}),
								delete: collection.custom?.totp?.disableAccessWrapper?.delete
									? collection.access?.delete
									: totpAccess({
											originalAccess: collection.access?.delete,
											pluginOptions,
										}),
								read: collection.custom?.totp?.disableAccessWrapper?.read
									? collection.access?.read
									: totpAccess({
											originalAccess: collection.access?.read,
											pluginOptions,
										}),
								readVersions: collection.custom?.totp?.disableAccessWrapper
									?.readVersions
									? collection.access?.readVersions
									: totpAccess({
											originalAccess: collection.access?.readVersions,
											pluginOptions,
										}),
								unlock: collection.custom?.totp?.disableAccessWrapper?.unlock
									? collection.access?.unlock
									: totpAccess({
											originalAccess: collection.access?.unlock,
											pluginOptions,
										}),
								update: collection.custom?.totp?.disableAccessWrapper?.update
									? collection.access?.update
									: totpAccess({
											originalAccess: collection.access?.update,
											pluginOptions,
										}),
							},
							auth: {
								...(typeof collection.auth === 'object' ? collection.auth : {}),
								strategies: [
									strategy,
									...(typeof collection.auth === 'object'
										? collection.auth?.strategies || []
										: []),
								],
							},
							fields: [
								...(collection.fields || []),
								{
									name: 'totpSecret',
									type: 'text',
									access: {
										create: () => false,
										read: () => false,
										update: () => false,
									},
									admin: {
										disableBulkEdit: true,
										disableListColumn: true,
										disableListFilter: true,
										hidden: true,
									},
									disableBulkEdit: true,
									disableListColumn: true,
									disableListFilter: true,
								} as TextField,
								{
									name: 'totpSecretUI',
									type: 'ui',
									admin: {
										components: {
											Field: {
												path: 'payload-totp/rsc#TOTPField',
												serverProps: {
													pluginOptions,
												},
											},
										},
										disableListColumn: true,
									},
								} as UIField,
								{
									name: 'hasTotp',
									type: 'checkbox',
									access: {
										read: ({ data, req: { user } }) =>
											data && user && data?.id === user?.id,
									},
									admin: {
										disableBulkEdit: true,
										disableListColumn: true,
										disableListFilter: true,
										hidden: true,
									},
									hooks: {
										afterRead: [setHasTotp(pluginOptions)],
									},
									virtual: true,
								} as CheckboxField,
							],
							hooks: {
								...(collection.hooks || {}),
								afterLogout: [
									...(collection.hooks?.afterLogout || []),
									deleteCookieAfterLogout,
								],
							},
						}
					} else {
						return {
							...collection,
							access: {
								...(collection.access || {}),
								create: collection.custom?.totp?.disableAccessWrapper?.create
									? collection.access?.create
									: totpAccess({
											originalAccess: collection.access?.create,
											pluginOptions,
										}),
								delete: collection.custom?.totp?.disableAccessWrapper?.delete
									? collection.access?.delete
									: totpAccess({
											originalAccess: collection.access?.delete,
											pluginOptions,
										}),
								read: collection.custom?.totp?.disableAccessWrapper?.read
									? collection.access?.read
									: totpAccess({
											originalAccess: collection.access?.read,
											pluginOptions,
										}),
								readVersions: collection.custom?.totp?.disableAccessWrapper
									?.readVersions
									? collection.access?.readVersions
									: totpAccess({
											originalAccess: collection.access?.readVersions,
											pluginOptions,
										}),
								unlock: collection.custom?.totp?.disableAccessWrapper?.unlock
									? collection.access?.unlock
									: totpAccess({
											originalAccess: collection.access?.unlock,
											pluginOptions,
										}),
								update: collection.custom?.totp?.disableAccessWrapper?.update
									? collection.access?.update
									: totpAccess({
											originalAccess: collection.access?.update,
											pluginOptions,
										}),
							},
						}
					}
				}),
			],
			endpoints: [
				...(config.endpoints || []),
				{
					handler: setSecret(pluginOptions),
					method: 'post',
					path: '/setup-totp',
				},
				{
					handler: verifyToken(pluginOptions),
					method: 'post',
					path: '/verify-totp',
				},
				{
					handler: removeEndpointHandler(pluginOptions),
					method: 'post',
					path: '/remove-totp',
				},
			],
			globals: [
				...(config.globals || []).map((global) => {
					return {
						...global,
						access: {
							...(global.access || {}),
							read: global.custom?.totp?.disableAccessWrapper?.read
								? global.access?.read
								: totpAccess({
										originalAccess: global.access?.read,
										pluginOptions,
									}),
							readDrafts: global.custom?.totp?.disableAccessWrapper?.readDrafts
								? global.access?.readDrafts
								: totpAccess({
										originalAccess: global.access?.readDrafts,
										pluginOptions,
									}),
							readVersions: global.custom?.totp?.disableAccessWrapper?.readVersions
								? global.access?.readVersions
								: totpAccess({
										originalAccess: global.access?.readVersions,
										pluginOptions,
									}),
							update: global.custom?.totp?.disableAccessWrapper?.update
								? global.access?.update
								: totpAccess({
										originalAccess: global.access?.update,
										pluginOptions,
									}),
						},
					}
				}),
			],
			i18n: i18n(config.i18n),
		}
	}
