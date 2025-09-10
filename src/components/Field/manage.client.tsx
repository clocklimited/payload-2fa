/* eslint-disable no-restricted-exports */
"use client"

import { Button, Modal, toast, useModal } from '@payloadcms/ui'
import { useCallback, useState } from 'react'

import { adminRemoveTotp, adminResetTotp, type VerifyResponse } from '../../client/helpers.js'

type Props = {
  apiRoute: string
  serverURL: string
  targetUserId: string
}

type AdminActionFn = (args: { apiRoute?: string; serverURL?: string; userId: string }) => Promise<VerifyResponse>

type ConfirmModalProps = {
  confirmLabel: string
  description: string
  disabled: boolean
  onConfirm: () => void
  slug: string
  title: string
}

function ConfirmModal({ slug, confirmLabel, description, disabled, onConfirm, title }: ConfirmModalProps) {
  const { closeAll } = useModal() as { closeAll?: () => void }
  return (
    <Modal slug={slug}>
      <div style={{ display: 'grid', gap: 12 }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button buttonStyle="secondary" onClick={() => (typeof closeAll === 'function' ? closeAll() : undefined)} size="small" type="button">
            Cancel
          </Button>
          <Button disabled={disabled} onClick={onConfirm} size="small" type="button">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function AdminManageClient({ apiRoute, serverURL, targetUserId }: Props) {
  const [pending, setPending] = useState(false)
  const { closeAll, openModal } = useModal() as { closeAll?: () => void; openModal: (slug: string) => void }
  const removeSlug = `admin-remove-totp-${targetUserId}`
  const resetSlug = `admin-reset-totp-${targetUserId}`

  const doAction = useCallback(
    async (fn: AdminActionFn) => {
      setPending(true)
      try {
        const data = await fn({ apiRoute, serverURL, userId: targetUserId })
        if (!data.ok) {
          toast.error(data.message || 'Operation failed')
        } else {
          toast.success('Operation succeeded')
          if (typeof closeAll === 'function') {
            closeAll()
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        toast.error('Something went wrong')
      } finally {
        setPending(false)
      }
    },
    [apiRoute, closeAll, serverURL, targetUserId],
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

      <ConfirmModal
        confirmLabel="Confirm Remove"
        description="This will revoke their authenticator. They can re-setup later."
        disabled={pending}
        onConfirm={() => doAction(adminRemoveTotp)}
        slug={removeSlug}
        title="Remove 2FA for this user?"
      />

      <ConfirmModal
        confirmLabel="Confirm Reset"
        description="This will revoke their authenticator and require setup again."
        disabled={pending}
        onConfirm={() => doAction(adminResetTotp)}
        slug={resetSlug}
        title="Reset 2FA for this user?"
      />
    </div>
  )
}
