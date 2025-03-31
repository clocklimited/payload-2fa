import type { CollectionConfig } from 'payload'
import { totpAccess } from 'payload-totp'

export const posts: CollectionConfig = {
	slug: 'posts',
	admin: {
		useAsTitle: 'title',
	},
	access: {
		read: () => true,
		create: (args) => {
			return (
				args.req.headers.get('authorization') === 'Bearer 123' ||
				totpAccess(({ req: { user } }) => Boolean(user))(args)
			)
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
	custom: {
		totp: {
			disableAccessWrapper: {
				read: true,
				create: true,
			},
		},
	},
}
