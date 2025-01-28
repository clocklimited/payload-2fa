import { createServer } from 'http'
import next from 'next'
import type { NextServerOptions } from 'next/dist/server/next.js'
import { parse } from 'url'

export async function prepareServer(dirname: string, dev = true) {
	const opts: NextServerOptions = {
		dev,
		dir: dirname,
	}

	// @ts-expect-error next types do not import
	const app = next(opts)
	const handle = app.getRequestHandler()

	await app.prepare()

	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url!, true)
		void handle(req, res, parsedUrl)
	})

	return server
}
