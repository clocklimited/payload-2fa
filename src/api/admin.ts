import type { I18nClient } from '@payloadcms/translations'
import type { BasePayload, PayloadHandler } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../i18n/types.js'
import type { PayloadTOTPConfig, UserWithTotp } from '../types.js'

import { removeTotpForUser, resetTotpForUser } from '../server/admin.js'

function ensureAdminAccess(pluginOptions: PayloadTOTPConfig, req: Parameters<PayloadHandler>[0]) {
  if (!req.user) {
    return false
  }
  if (!pluginOptions.adminManageAccess) {
    return false
  }
  // Reuse Access fn shape
  try {
    const result = pluginOptions.adminManageAccess({ req } as unknown as Parameters<NonNullable<typeof pluginOptions.adminManageAccess>>[0])
    if (result instanceof Promise) {
      return result
    }
    return Boolean(result)
  } catch {
    return false
  }
}

export function adminRemoveHandler(pluginOptions: PayloadTOTPConfig) {
  const handler: PayloadHandler = async (req) => {
    const { payload } = req as unknown as { payload: BasePayload; user?: UserWithTotp }
    const i18n = req.i18n as unknown as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>

    const hasAccess = await ensureAdminAccess(pluginOptions, req)
    if (!hasAccess) {
      return Response.json({ message: i18n.t('error:unauthorized'), ok: false })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any
    try {
      data = req.json && (await req.json())
    } catch {
      /* ignore */
    }

    if (typeof data !== 'object' || typeof data['userId'] !== 'string') {
      return Response.json({ message: i18n.t('error:unspecific'), ok: false })
    }

    const res = await removeTotpForUser({ payload, userId: data['userId'] })
    if (!res.ok) {
      return Response.json({ message: res.message || i18n.t('error:unspecific'), ok: false })
    }
    return Response.json({ ok: true })
  }

  return handler
}

export function adminResetHandler(pluginOptions: PayloadTOTPConfig) {
  const handler: PayloadHandler = async (req) => {
    const { payload } = req as unknown as { payload: BasePayload; user?: UserWithTotp }
    const i18n = req.i18n as unknown as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>

    const hasAccess = await ensureAdminAccess(pluginOptions, req)
    if (!hasAccess) {
      return Response.json({ message: i18n.t('error:unauthorized'), ok: false })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any
    try {
      data = req.json && (await req.json())
    } catch {
      /* ignore */
    }

    if (typeof data !== 'object' || typeof data['userId'] !== 'string') {
      return Response.json({ message: i18n.t('error:unspecific'), ok: false })
    }

    const res = await resetTotpForUser({ payload, userId: data['userId'] })
    if (!res.ok) {
      return Response.json({ message: res.message || i18n.t('error:unspecific'), ok: false })
    }
    return Response.json({ ok: true })
  }

  return handler
}

export interface IResponse {
  message?: string
  ok: boolean
}
