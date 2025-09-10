/* eslint-disable no-restricted-exports */
'use client'

import { Button, ConfirmationModal, toast, useModal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import { useCallback, useState } from 'react'

import { adminRemoveTotp, adminResetTotp, type VerifyResponse } from '../../client/helpers.js'

type Props = {
	apiRoute: string
	serverURL: string
	targetUserId: string
}

type AdminActionFn = (args: {
	apiRoute?: string
	serverURL?: string
	userId: string
}) => Promise<VerifyResponse>

export default function AdminManageClient({ apiRoute, serverURL, targetUserId }: Props) {
	const [pending, setPending] = useState(false)
	const { closeModal, openModal } = useModal() as {
		closeModal: (slug: string) => void
		openModal: (slug: string) => void
	}
	const router = useRouter()
	const removeSlug = `admin-remove-totp-${targetUserId}`
	const resetSlug = `admin-reset-totp-${targetUserId}`

	const doAction = useCallback(
		async (fn: AdminActionFn, okMessage: string, slug: string) => {
			setPending(true)
			try {
				const data = await fn({ apiRoute, serverURL, userId: targetUserId })
				if (!data.ok) {
					toast.error(data.message || 'Operation failed')
				} else {
					toast.success(okMessage)
					closeModal(slug)
					// refresh the server-rendered field so status updates immediately
					router.refresh()
				}
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err)
				toast.error('Something went wrong')
			} finally {
				setPending(false)
			}
		},
		[apiRoute, closeModal, router, serverURL, targetUserId],
	)

	return (
		<div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
			<Button
				aria-label="Remove 2FA"
				buttonStyle="secondary"
				disabled={pending}
				onClick={() => openModal(removeSlug)}
				size="small"
				type="button"
			>
				Remove 2FA
			</Button>
			<Button
				aria-label="Reset 2FA"
				buttonStyle="secondary"
				disabled={pending}
				onClick={() => openModal(resetSlug)}
				size="small"
				type="button"
			>
				Reset 2FA
			</Button>

			<ConfirmationModal
				body="This will revoke their authenticator. They can re-setup later."
				confirmingLabel="Removing..."
				confirmLabel="Confirm Remove"
				heading="Remove 2FA for this user?"
				modalSlug={removeSlug}
				onCancel={() => closeModal(removeSlug)}
				onConfirm={async () => doAction(adminRemoveTotp, '2FA removed', removeSlug)}
			/>

			<ConfirmationModal
				body="This will revoke their authenticator and require setup again."
				confirmingLabel="Resetting..."
				confirmLabel="Confirm Reset"
				heading="Reset 2FA for this user?"
				modalSlug={resetSlug}
				onCancel={() => closeModal(resetSlug)}
				onConfirm={async () => doAction(adminResetTotp, '2FA reset', resetSlug)}
			/>
		</div>
	)
}
