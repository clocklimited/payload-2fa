import type { Page } from '@playwright/test'

type Args = {
	adminRoute?: string
	baseURL: string
	forceTotp?: boolean
	page: Page
}

export async function createFirstUser({ adminRoute = '/admin', baseURL, forceTotp, page }: Args) {
	await page.goto(`${baseURL}${adminRoute}/create-first-user`)
	await page.getByLabel('Email').pressSequentially('human@domain.com')
	await page.getByLabel('New Password').pressSequentially('123456')
	await page.getByLabel('Confirm Password').pressSequentially('123456')
	if (forceTotp) {await page.getByLabel('Force TOTP').check()}

	await page.getByRole('button', { name: 'Create' }).click({ delay: 1000 })
}
