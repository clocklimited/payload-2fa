import type { Page } from '@playwright/test';

import { test as base } from '@playwright/test'
import { spawn } from 'child_process'
import { mkdir, rm } from 'fs/promises'
import getPort, { portNumbers } from 'get-port'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { platform } from 'node:os'
import { Secret, TOTP } from 'otpauth'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

import type { ISetupArgs, ISetupResult } from './types'

import { createFirstUser } from './helpers/create-first-user'
import { login } from './helpers/login'
import { logout } from './helpers/logout'
import { promptTotp } from './helpers/prompt-totp'

export const test = base.extend<
	{
		helpers: {
			createFirstUser: typeof createFirstUser
			login: typeof login
			logout: typeof logout
			promptTotp: typeof promptTotp
			setupTotp: (args: {
				adminRoute?: string
				baseURL: string
				page: Page
			}) => Promise<{ totpSecret: string }>
		}
	},
	{
		setup: (args?: ISetupArgs) => ISetupResult
	}
>({
	helpers: async ({}, use) => {
		await use({
			createFirstUser,
			login,
			logout,
			promptTotp,
			setupTotp: async ({
				adminRoute = '/admin',
				back = '/admin',
				baseURL,
				page,
			}: {
				adminRoute?: string
				back?: string
				baseURL: string
				page: Page
			}) => {
				await page.goto(`${baseURL}${adminRoute}/setup-totp?back=${encodeURI(back)}`)
				await page.getByRole('button', { name: 'Add code manually' }).click()
				const totpSecret = await page.getByRole('code').textContent()

				const totp = new TOTP({
					algorithm: 'SHA1',
					digits: 6,
					issuer: 'Payload',
					label: 'human@domain.com',
					period: 30,
					secret: Secret.fromBase32(totpSecret || ''),
				})

				const token = totp.generate()

				await page.locator('css=input:first-child[type="text"]').focus()
				await page
					.locator('css=input:first-child[type="text"]')
					.pressSequentially(token, { delay: 300 })
				await page.waitForURL(`${baseURL}${back}`)

				return { totpSecret: totpSecret || '' }
			},
		})
	},
	setup: [
		async ({}, use) => {
			await use(
				async ({
					adminRoute = '/admin',
					apiRoute = '/api',
					disableAccessWrapper,
					forceSetup,
					overrideBaseURL,
					overridePort,
					serverURL = '',
				}: ISetupArgs = {}) => {
					const port = overridePort || (await getPort({ port: portNumbers(3000, 3099) }))
					const dbName = `payload-2fa-${uuidv4()}`
					const dbPath = `./tmp/${dbName}`
					await mkdir(dbPath, { recursive: true })
					const baseURL = overrideBaseURL || `http://localhost:${port}`

					const mongod = await MongoMemoryServer.create({
						instance: {
							dbName,
							dbPath,
							port: await getPort({ port: portNumbers(27017, 27117) }),
						},
					})

					const child = spawn('pnpm', ['dev:start'], {
						cwd: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
						env: {
							...process.env,
							ADMIN_ROUTE: adminRoute,
							API_ROUTE: apiRoute,
							DATABASE_URI: `${mongod.getUri()}&retryWrites=true`,
							DISABLE_ACCESS_WRAPPER: disableAccessWrapper ? '1' : undefined,
							FORCE_SETUP: forceSetup ? '1' : undefined,
							NODE_ENV: 'production',
							PORT: port.toString(),
							SERVER_URL: serverURL,
						},
						shell: platform() === 'win32',
						stdio: 'inherit',
					})

					await new Promise((resolve, reject) => {
						const timeout = setTimeout(() => reject(new Error('Server timeout')), 10000)

						const interval = setInterval(async () => {
							try {
								const response = await fetch(`${baseURL}${adminRoute}`)
								if (response.ok) {
									clearTimeout(timeout)
									clearInterval(interval)
									resolve(null)
								}
							} catch (err) {}
						}, 500)
					})

					return {
						baseURL,
						port,
						teardown: async () => {
							await new Promise((resolve, reject) => {
								child.on('close', resolve)
								child.on('error', reject)
								child.kill()
							})

							if (mongod) {
								await mongod.stop()
							}

							rm(path.resolve(dbPath), { recursive: true })
						},
					}
				},
			)
		},
		{ scope: 'worker' },
	],
})
