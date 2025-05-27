import { payloadTotp } from '@clocklimited/payload-2fa'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { authors } from './collections/authors.js'
import { posts } from './collections/posts.js'
import { users } from './collections/users.js'
import { settings } from './globals/settings.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
	process.env.ROOT_DIR = dirname
}

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [users, authors, posts],
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || '',
	}),
	editor: lexicalEditor(),
	globals: [settings],
	plugins: [
		payloadTotp({
			collection: 'users',
			disableAccessWrapper: process.env.DISABLE_ACCESS_WRAPPER === '1',
			forceSetup: process.env.FORCE_SETUP === '1',
			userSpecificForceTotpField: {
				enabled: true,
			},
		}),
	],
	routes: {
		admin: process.env.ADMIN_ROUTE || '/admin',
		api: process.env.API_ROUTE || '/api',
	},
	secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
	serverURL: process.env.SERVER_URL || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
})
