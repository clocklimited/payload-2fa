import type { CustomTranslationsObject } from './types.js'

export const en: CustomTranslationsObject = {
	totpPlugin: {
		authApp: 'Authenticator app',
		configured: 'Configured',
		errors: {
			alreadySet: 'You already have TOTP configured.',
		},
		fieldDescription:
			'Use an authentication app or browser extension to get two-factor authentication codes when prompted.',
		forceTotp: {
			description: 'If checked, this user will be required to set up and use TOTP.',
			label: 'Force TOTP',
		},
		setup: {
			addCodeManually: 'Add code manually',
			button: 'Setup',
			description:
				'You will need a two-factor authentication app such as <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="nofollow noopener noreferrer">Google Authenticator</a> to complete this process. After installing one, scan the QR code below using your application.',
			enterCode: 'Enter the {digits}-digit authentication code generated by your app:',
			incorrectCode: 'Incorrect code. If this error persists, rescan the QR code.',
			title: 'Setup Two-Factor Authentication',
		},
		verify: {
			title: 'Verification',
		},
	},
}

