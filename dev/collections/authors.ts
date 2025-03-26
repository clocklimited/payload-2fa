import type { CollectionConfig } from 'payload'

export const authors: CollectionConfig = {
	slug: 'authors',
	fields: [
		{
			name: 'firstname',
			type: 'text',
			required: true,
		},
		{
			name: 'lastname',
			type: 'text',
			required: true,
		},
	],
}
