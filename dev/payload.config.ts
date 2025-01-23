import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadTotp } from 'payload-totp'
import { fileURLToPath } from 'url'

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
	collections: [
		{
			slug: 'users',
			fields: [],
			auth: true,
		},
	],
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || '',
	}),
	editor: lexicalEditor(),
	plugins: [
		payloadTotp({
			collection: 'users',
			forceSetup: process.env.FORCE_SETUP === '1',
		}),
	],
	secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
})
