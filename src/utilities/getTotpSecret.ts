import type { Payload, User } from 'payload'

type Args = {
	collection: string
	payload: Payload
	user: User
}

export async function getTotpSecret({
	collection,
	payload,
	user,
}: Args): Promise<string | undefined> {
	if (!user) {
		return undefined
	}

	const { totpSecret } = (await payload.findByID({
		id: user.id,
		collection,
		overrideAccess: true,
		select: {
			totpSecret: true,
		},
		showHiddenFields: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any)) as { totpSecret?: null | string } // TODO: Report this to Payload

	return totpSecret as string | undefined
}
