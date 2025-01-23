import { test as base } from '@playwright/test'
import type { Server } from 'http'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { fileURLToPath } from 'url'

import { prepareServer } from '../dev/prepareServer'

export const test = base.extend<
	{
		forEachWorker: void
		helpers: {
			createFirstUser: () => Promise<void>
		}
		forceSetup: boolean
	},
	{
		setupDatabase: () => Promise<MongoMemoryReplSet>
		setupServer: () => Promise<Server>
	}
>({
	forceSetup: [false, { option: true }],
	baseURL: async ({}, use) => {
		await use(`http://localhost:${3000 + test.info().workerIndex}/admin`)
	},
	setupDatabase: [
		async ({}, use) => {
			await use(async () => {
				const memoryDB = await MongoMemoryReplSet.create({
					replSet: {
						dbName: `payload-totp-${test.info().workerIndex}`,
					},
				})

				return memoryDB
			})
		},
		{ scope: 'worker' },
	],
	setupServer: [
		async ({}, use) => {
			await use(async () => {
				const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dev')
				const server = await prepareServer(dirname, false)

				return server
			})
		},
		{ scope: 'worker' },
	],
	forEachWorker: [
		async ({ setupDatabase, setupServer, forceSetup }, use) => {
			const database = await setupDatabase()
			process.env.DATABASE_URI = `${database.getUri()}&retryWrites=true`

			if (forceSetup) {
				process.env.FORCE_SETUP = '1'
			}

			const server = await setupServer()
			server.listen(3000 + test.info().workerIndex)

			await use()

			if (server) {
				server.close()
			}

			if (database) {
				await database.stop()
			}
		},
		{ auto: true },
	],
	helpers: async ({ page }, use) => {
		await use({
			createFirstUser: async () => {
				await page.getByLabel('Email').fill('human@domain.com')
				await page.getByLabel('New Password').fill('123456')
				await page.getByLabel('Confirm Password').fill('123456')
				await page.getByRole('button', { name: 'Create' }).dispatchEvent('click')
			},
		})
	},
})
