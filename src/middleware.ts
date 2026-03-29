import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
        const pathname = request.nextUrl.pathname

  // Rutas públicas (sin autenticación requerida)
  const isPublic = ['/login', '/auth'].some(p => pathname.startsWith(p))

  // Verificar sesión mediante cookie personalizada
  const session = request.cookies.get('cis_session')

  // Sin sesión en ruta privada → redirigir a /login
  if (!session && !isPublic) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('redirectTo', pathname)
            return NextResponse.redirect(url)
  }

  // Con sesión en /login → redirigir a /select-project
  if (session && pathname === '/login') {
            const url = request.nextUrl.clone()
            url.pathname = '/select-project'
            return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
        matcher: [
                  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
                ],
}
