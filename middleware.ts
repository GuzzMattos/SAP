import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')

  if (!user) {
    return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
  }
}

// rotas protegidas
export const config = {
  matcher: ['/admin/:path*'],
}