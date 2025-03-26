import type { CollectionConfig } from 'payload'

export const posts: CollectionConfig = {
	slug: 'posts',
	admin: {
		useAsTitle: 'title',
	},
	access: {
		read: () => true,
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
			},
		},
	},
}
