import type { CollectionConfig } from 'payload'

export const users: CollectionConfig = {
	slug: 'users',
	fields: [],
	admin: {
		defaultColumns: ['email', 'updatedAt']
	},
	auth: {
		useAPIKey: true,
	},
}
