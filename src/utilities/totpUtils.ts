import type { BasePayload } from 'payload'

import { Secret, TOTP } from 'otpauth'

import type { PayloadTOTPConfig, UserWithTotp } from '../types.js'

export function resolvePluginOptions(
  payload: BasePayload,
  override?: PayloadTOTPConfig,
): PayloadTOTPConfig | undefined {
  if (override) {
    return override
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const custom = (payload.config as any)?.custom
  return custom?.totp?.pluginOptions as PayloadTOTPConfig | undefined
}

export function createTOTP({
  pluginOptions,
  secretBase32,
  user,
}: {
  pluginOptions: PayloadTOTPConfig
  secretBase32: string
  user: UserWithTotp
}) {
  return new TOTP({
    algorithm: pluginOptions.totp?.algorithm || 'SHA1',
    digits: pluginOptions.totp?.digits || 6,
    issuer: pluginOptions.totp?.issuer || 'Payload',
    label: user.email || user.username,
    period: pluginOptions.totp?.period || 30,
    secret: Secret.fromBase32(secretBase32),
  })
}

export function isValidToken(totp: TOTP, token: number | string): boolean {
  const delta = totp.validate({ token: token.toString(), window: 1 })
  return delta !== null
}
