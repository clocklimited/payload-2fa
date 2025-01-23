import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('create first user', { tag: '@smoke' }, () => {
	test.describe.configure({ mode: 'parallel' })

	test.describe(() => {
		test.use({
			forceSetup: true,
		})

		test.fixme(
			'forceSetup is true',
			{
				annotation: {
					type: 'issue',
					description: 'https://github.com/payloadcms/payload/issues/10674',
				},
			},
			async ({ baseURL, page, helpers }) => {
				await page.goto(baseURL || '')

				await test.step('field should be not visible', async () => {
					await expect(page.getByText('Authenticator app')).not.toBeVisible()
				})

				await helpers.createFirstUser()

				await test.step('should redirect to dashboard after signup', async () => {
					await expect(page).toHaveURL(`${baseURL}/setup-totp`)
				})
			},
		)
	})

	test('forceSetup is false', async ({ baseURL, page, helpers }) => {
		await page.goto(baseURL || '')

		await test.step('field should be not visible', async () => {
			await expect(page.getByText('Authenticator app')).not.toBeVisible()
		})

		await helpers.createFirstUser()

		await test.step('should redirect to dashboard after signup', async () => {
			await expect(page).toHaveTitle('Dashboard - Payload')
		})
	})
})
