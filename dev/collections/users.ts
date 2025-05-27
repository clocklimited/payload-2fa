import type { CollectionConfig } from 'payload'

export const users: CollectionConfig = {
	slug: 'users',
	admin: {
		defaultColumns: ['email', 'updatedAt']
	},
	auth: {
		useAPIKey: true,
	},
	fields: [],
}
