import { Page } from '@playwright/test'

import { test } from './fixtures'

test.describe.configure({ mode: 'parallel' })

test.describe('users', () => {
	test.describe('forceSetup is true', () => {
		let page: Page
		let teardown: VoidFunction
		let baseURL: string

		test.beforeAll(async ({ setup, browser, helpers }) => {
			const setupResult = await setup({ forceSetup: true })
			teardown = setupResult.teardown
			baseURL = setupResult.baseURL
			page = await browser.newPage()

			await helpers.createFirstUser({ page, baseURL })
			await page.waitForURL(/^(.*?)\/admin\/setup-totp(\?back=.*?)?$/g)
			await helpers.setupTotp({ page, baseURL })
			await page.goto(`${baseURL}/admin`)
		})

		test.afterAll(async () => {
			await teardown()
			await page.close()
		})

		test.describe('create new user', () => {
			test.skip('should not see TOTP field', async () => {})

			test.skip('should not be able to set totpSecret via API', async () => {})

			test.skip('should not be able to set totpSecret via GraphQL', async () => {})
		})

		test.describe('get user', () => {
			test.skip('should not see TOTP field', async () => {})

			test.skip('should not be able to see totpSecret via API', async () => {})

			test.skip('should not be able to see totpSecret via GraphQL', async () => {})
		})
	})

	test.describe('forceSetup is false', () => {
		let page: Page
		let teardown: VoidFunction
		let baseURL: string

		test.beforeAll(async ({ setup, browser, helpers }) => {
			const setupResult = await setup()
			teardown = setupResult.teardown
			baseURL = setupResult.baseURL
			page = await browser.newPage()
			await helpers.createFirstUser({ page, baseURL })
			await page.waitForURL(/^(.*?)\/admin$/g)
			await helpers.setupTotp({ page, baseURL })
			await page.goto(`${baseURL}/admin`)
		})

		test.afterAll(async () => {
			await teardown()
			await page.close()
		})

		test.describe('create new user', () => {
			test.skip('should not see TOTP field', async () => {})

			test.skip('should not be able to set totpSecret via API', async () => {})

			test.skip('should not be able to set totpSecret via GraphQL', async () => {})
		})

		test.describe('get user', () => {
			test.skip('should not see TOTP field', async () => {})

			test.skip('should not be able to see totpSecret via API', async () => {})

			test.skip('should not be able to see totpSecret via GraphQL', async () => {})
		})
	})
})
