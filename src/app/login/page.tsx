'use client'
import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const sb = getSupabaseClient()

  async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
                const { error } = await sb.auth.signInWithPassword({ email, password })
                if (error) {
                          setError(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message)
                          return
                }
                router.push(redirectTo)
                router.refresh()
        })
  }

  return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
              <div className="w-full max-w-sm">
                      <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
                                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                            </svg>svg>
                                </div>div>
                                <h1 className="text-2xl font-bold text-white">CIS Nicaragua</h1>h1>
                                <p className="text-slate-400 text-sm mt-1">Sistema de Gestión Minera</p>p>
                      </div>div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                                <h2 className="text-lg font-semibold text-white mb-6">Iniciar sesión</h2>h2>
                                <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Correo electrónico</label>label>
                                                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                                                                            placeholder="usuario@cis.com.ni"
                                                                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
                                            </div>div>
                                            <div>
                                                          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>label>
                                                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                                                                            placeholder="••••••••"
                                                                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
                                            </div>div>
                                  {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                                        <p className="text-red-400 text-sm">{error}</p>p>
                        </div>div>
                                            )}
                                            <button type="submit" disabled={isPending}
                                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                                              {isPending ? 'Verificando...' : 'Ingresar'}
                                            </button>button>
                                </form>form>
                      </div>div>
                      <p className="text-center text-xs text-slate-600 mt-6">Unidad Minera Jabalí · Nicaragua · v2.0</p>p>
              </div>div>
        </main>main>
      )
}

export default function LoginPage() {
    return (
          <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <LoginForm />
          </Suspense>Suspense>
        )
}</main>
