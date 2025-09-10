import type { BasePayload } from 'payload'

import type { PayloadTOTPConfig } from '../types.js'

import { resolvePluginOptions } from '../utilities/totpUtils.js'

export type AdminTotpResponse = {
  message?: string
  ok: boolean
}

type AdminArgs = {
  payload: BasePayload
  pluginOptions?: PayloadTOTPConfig
  userId: string
}

export async function removeTotpForUser({ payload, pluginOptions: override, userId }: AdminArgs): Promise<AdminTotpResponse> {
  const pluginOptions = resolvePluginOptions(payload, override)
  if (!pluginOptions) {
    return { message: 'TOTP is not configured.', ok: false }
  }

  try {
    await payload.update({
      id: userId,
      collection: pluginOptions.collection,
      data: { totpSecret: null },
      overrideAccess: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    return { ok: true }
  } catch (_err) {
    return { message: 'Failed to remove TOTP.', ok: false }
  }
}

export async function resetTotpForUser({ payload, pluginOptions: override, userId }: AdminArgs): Promise<AdminTotpResponse> {
  const pluginOptions = resolvePluginOptions(payload, override)
  if (!pluginOptions) {
    return { message: 'TOTP is not configured.', ok: false }
  }

  const data: Record<string, unknown> = { totpSecret: null }
  if (pluginOptions.userSpecificForceTotpField?.enabled) {
    data['forceTotp'] = true
  }

  try {
    await payload.update({
      id: userId,
      collection: pluginOptions.collection,
      data,
      overrideAccess: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    return { ok: true }
  } catch (_err) {
    return { message: 'Failed to reset TOTP.', ok: false }
  }
}
