import type { Page } from '@playwright/test'

type Args = {
	adminRoute?: string
	baseURL: string
	email: string
	page: Page
	password: string
}

export async function login({ adminRoute = '/admin', baseURL, email, page, password }: Args) {
	await page.goto(`${baseURL}${adminRoute}/login`)
	await page.getByLabel('Email').pressSequentially(email)
	await page.getByLabel('Password').pressSequentially(password)
	await page.getByRole('button', { name: 'Login' }).click({ delay: 1000 })
}
