import path from 'path'
import { fileURLToPath } from 'url'

import { prepareServer } from './prepareServer.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const server = await prepareServer(dirname, true)

server.listen(parseInt(process.env.PORT || '3000'))
