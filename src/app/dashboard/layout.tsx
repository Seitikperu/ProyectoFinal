'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV = [
  { group: 'Almacén', items: [
    { label: 'Dashboard',  href: '/dashboard' },
    { label: 'Ingresos',   href: '/dashboard/almacen/ingresos' },
    { label: 'Salidas',    href: '/dashboard/almacen/salidas' },
    { label: 'Inventario', href: '/dashboard/almacen/inventario' },
    { label: 'Materiales', href: '/dashboard/almacen/materiales' },
  ]},
  { group: 'Producción', items: [
    { label: 'Control Diario', href: '/dashboard/produccion' },
    { label: 'Plan Mensual',   href: '/dashboard/produccion/plan-mes' },
    { label: 'Explosivos',     href: '/dashboard/produccion/explosivos' },
    { label: 'Vibraciones',    href: '/dashboard/produccion/vibraciones' },
  ]},
  { group: 'Maestros', items: [
    { label: 'Proveedores', href: '/dashboard/maestros/proveedores' },
    { label: 'CeCos',       href: '/dashboard/maestros/cecos' },
    { label: 'Personal',    href: '/dashboard/maestros/personal' },
    { label: 'Equipos',     href: '/dashboard/maestros/equipos' },
    { label: 'Labores',     href: '/dashboard/maestros/labores' },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const sb = getSupabaseClient()

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    await sb.auth.signOut()
    router.push('/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 w-60">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">CIS Nicaragua</p>
          <p className="text-slate-500 text-xs">Unidad Minera Jabalí</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-1.5">{group}</p>
            <ul className="space-y-0.5">
              {items.map(({ label, href }) => {
                const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)}
                      className={`flex items-center px-2.5 py-2 rounded-lg text-sm transition-colors ${
                        active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}>
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-slate-800 pt-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-xs font-medium">{user?.email?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.email ?? 'Usuario'}</p>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Salir">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <div className="hidden md:flex flex-shrink-0"><Sidebar /></div>
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)}/>
          <div className="relative w-72 flex-shrink-0"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950">
          <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="text-white font-medium text-sm">CIS Nicaragua</span>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
