/* eslint-disable no-restricted-exports */

'use client'

import { toast } from '@payloadcms/ui'
import React, { useCallback, useRef, useState } from 'react'

import type { IResponse } from '../../../api/verifyToken.js'

import OTPInput from '../../OTPInput/index.js'

type Args = {
	apiRoute: string
	back?: string
	length?: number
	serverURL: string
}

export default function OTPForm({ apiRoute, back, length, serverURL }: Args) {
	const [isPending, setIsPending] = useState(false)
	const form = useRef<HTMLFormElement>(null)

	const onFilled = () => {
		if (form.current) {
			form.current.requestSubmit()
		}
	}

	const asyncOperation = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			event.stopPropagation()

			setIsPending(true)

			const formData = new FormData(event.target as HTMLFormElement)

			const res = await fetch(`${serverURL}${apiRoute}/verify-totp`, {
				body: JSON.stringify(Object.fromEntries(formData)),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'post',
			})

			const data = (await res.json()) as IResponse

			if (!data.ok && data.message) {
				toast.error(data.message)
				return false
			}

			return true
		},
		[serverURL, apiRoute],
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			asyncOperation(event)
				.then((ok) => {
					if (ok) {
						if (back) {
							// Use location, auth strategy must run again
							location.replace(back)
						} else {
							window.history.back()
						}
					}
					setIsPending(false)
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err)
					toast.error('Something went wrong')
					setIsPending(false)
				})
		},
		[back, asyncOperation],
	)

	return (
		<form onSubmit={handleSubmit} ref={form}>
			<OTPInput disabled={isPending} length={length} name="token" onFilled={onFilled} />
		</form>
	)
}
