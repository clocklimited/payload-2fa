import { Page } from '@playwright/test'

import { test } from './fixtures'

test.describe.configure({ mode: 'parallel' })

test.describe('remove totp', () => {
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
			await helpers.setupTotp({ page, baseURL })
			await page.goto(`${baseURL}/admin/account`)
		})

		test.afterAll(async () => {
			await teardown()
			await page.close()
		})

		test.skip('remove TOTP api should restrict access', async () => {})
	})

	test.describe('forceSetup is false', () => {
		let page: Page
		let teardown: VoidFunction
		let baseURL: string

		test.beforeAll(async ({ setup, browser, helpers }) => {
			const setupResult = await setup({})
			teardown = setupResult.teardown
			baseURL = setupResult.baseURL
			page = await browser.newPage()

			await helpers.createFirstUser({ page, baseURL })
			await helpers.setupTotp({ page, baseURL })
			await page.goto(`${baseURL}/admin/account`)
		})

		test.afterAll(async () => {
			await teardown()
			await page.close()
		})

		test.skip('click on Remove button should show modal', async () => {})

		test.skip('modal should show a PIN verification', async () => {})

		test.skip('wrong PIN should show an error', async () => {})

		test.describe('after PIN verification', () => {
			test.skip('should hide modal', async () => {})

			test.skip('should see Setup button', async () => {})

			test.skip('auth strategy should be the default one', async () => {})

			test.skip('payload-totp cookie should be removed', async () => {})
		})
	})
})
