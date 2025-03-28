import type { GlobalConfig } from 'payload'

export const settings: GlobalConfig = {
	slug: 'settings',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'darkMode',
			type: 'checkbox',
			label: 'Dark Mode',
			defaultValue: false,
		},
		{
			name: 'maintenance',
			type: 'checkbox',
			label: 'Maintenance Mode',
			defaultValue: false,
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
