import type { NextRequest } from 'next/server.js'

import { NextResponse } from 'next/server.js'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const response = NextResponse.next()

	response.headers.append('x-pathname', pathname)

	return response
}
