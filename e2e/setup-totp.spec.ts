import { Page } from '@playwright/test'

import { test } from './fixtures'

test.describe.configure({ mode: 'parallel' })

test.describe('setup totp', () => {
	const params = [true, false]

	params.forEach((forceSetup) => {
		test.describe(`forceSetup is ${forceSetup ? 'true' : 'false'}`, () => {
			let page: Page
			let teardown: VoidFunction
			let baseURL: string

			test.beforeAll(async ({ setup, browser, helpers }) => {
				const setupResult = await setup({ forceSetup })
				teardown = setupResult.teardown
				baseURL = setupResult.baseURL
				page = await browser.newPage()

				await helpers.createFirstUser({ page, baseURL })
				// navigate to setup TOTP page
				await page.goto(`${baseURL}/admin`)
			})

			test.afterAll(async () => {
				await teardown()
				await page.close()
			})

			test.skip('should see QR', async () => {})

			test.skip('wrong token should show an error', async () => {})

			test.describe('after PIN verification', async () => {
				test.skip('should redirect back after input', async () => {})

				test.skip('auth strategy should be totp', async () => {})

				test.skip('payload-totp cookie should be set', async () => {})
			})

			test.describe('when user has TOTP configured', () => {
				test.skip('should redirect to main page when navigating to setup page', async () => {})

				test.skip('API for TOTP setup should restrict access', async () => {})
			})
		})
	})
})
