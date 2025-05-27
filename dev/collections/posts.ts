import type { CollectionConfig } from 'payload'

import { totpAccess } from '@clocklimited/payload-2fa'

export const posts: CollectionConfig = {
	slug: 'posts',
	access: {
		create: (args) => {
			return (
				args.req.headers.get('authorization') === 'Bearer 123' ||
				totpAccess(({ req: { user } }) => Boolean(user))(args)
			)
		},
		read: () => true,
	},
	admin: {
		useAsTitle: 'title',
	},
	custom: {
		totp: {
			disableAccessWrapper: {
				create: true,
				read: true,
			},
		},
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'content',
			type: 'textarea',
			required: true,
		},
	],
}
