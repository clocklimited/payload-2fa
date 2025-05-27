import type { GlobalConfig } from 'payload'

export const settings: GlobalConfig = {
	slug: 'settings',
	access: {
		read: () => true,
	},
	custom: {
		totp: {
			disableAccessWrapper: {
				read: true,
			},
		},
	},
	fields: [
		{
			name: 'darkMode',
			type: 'checkbox',
			defaultValue: false,
			label: 'Dark Mode',
		},
		{
			name: 'maintenance',
			type: 'checkbox',
			defaultValue: false,
			label: 'Maintenance Mode',
		},
	],
}
