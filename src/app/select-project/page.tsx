'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PROYECTOS, Proyecto } from '@/lib/context/ProyectoContext'

export default function SelectProjectPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null)
  const [hovering, setHovering] = useState<string | null>(null)
  const [selecting, setSelecting] = useState<string | null>(null)

  // Verificar sesión
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cis_usuario')
      if (!raw) { router.replace('/login'); return }
      setUsuario(JSON.parse(raw))
    } catch {
      router.replace('/login')
    }
  }, [router])

  function seleccionar(p: Proyecto) {
    setSelecting(p.id)
    sessionStorage.setItem('cis_proyecto', JSON.stringify(p))
    // Pequeña pausa visual para animación de selección
    setTimeout(() => router.push('/dashboard'), 350)
  }

  if (!usuario) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Cargando…
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Encabezado ── */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">CIS Nicaragua</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Bienvenido, <span className="text-white font-medium">{usuario.nombre}</span></span>
          <button
            onClick={() => { sessionStorage.removeItem('cis_usuario'); sessionStorage.removeItem('cis_proyecto'); router.push('/login') }}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-slate-800"
            title="Cerrar sesión">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Contenido central ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
            Sistema de Gestión de Almacén
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Selecciona tu Proyecto</h1>
          <p className="text-slate-400 text-base max-w-md">
            Elige la unidad operativa para acceder a sus datos de inventario, ingresos y salidas.
          </p>
        </div>

        {/* ── Tarjetas de proyecto ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          {PROYECTOS.map(p => {
            const isHover    = hovering  === p.id
            const isSelected = selecting === p.id

            return (
              <button
                key={p.id}
                onClick={() => seleccionar(p)}
                onMouseEnter={() => setHovering(p.id)}
                onMouseLeave={() => setHovering(null)}
                disabled={!p.activo || !!selecting}
                className={`relative group text-left rounded-2xl border p-6 transition-all duration-300 overflow-hidden
                  ${isSelected
                    ? `${p.colorBg} scale-95 shadow-2xl`
                    : isHover
                      ? `${p.colorBg} scale-[1.02] shadow-xl`
                      : 'bg-slate-900 border-slate-800 hover:scale-[1.02]'}
                  ${!p.activo ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {/* Shimmer de fondo al hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent
                  transition-opacity duration-300 ${isHover || isSelected ? 'opacity-100' : 'opacity-0'}`}/>

                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                )}

                {/* Icono */}
                <div className={`w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-2xl mb-4 transition-colors
                  ${isHover || isSelected ? 'bg-slate-700' : ''}`}>
                  {isSelected
                    ? <svg className="w-6 h-6 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    : p.icono
                  }
                </div>

                {/* Texto */}
                <h2 className={`text-lg font-bold mb-1 transition-colors ${isHover || isSelected ? p.color : 'text-white'}`}>
                  {p.nombre}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">{p.descripcion}</p>

                {/* ID del filtro */}
                <div className="mt-4 flex items-center gap-2">
                  <code className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    {p.id}
                  </code>
                  {p.activo && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                      Activo
                    </span>
                  )}
                </div>

                {/* Flecha de entrada */}
                <div className={`absolute bottom-5 right-5 transition-all duration-300 ${isHover && !isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                  <svg className={`w-5 h-5 ${p.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              </button>
            )
          })}
        </div>

        {/* Nota informativa */}
        <div className="mt-10 flex items-start gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 max-w-xl w-full">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-slate-400 text-xs leading-relaxed">
            Los datos mostrados en el dashboard (ingresos, salidas, stock) se filtran automáticamente según el proyecto seleccionado. Puedes cambiar de proyecto en cualquier momento desde el menú lateral.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-slate-700 text-xs">© 2025 CIS Nicaragua · Unidad Minera Jabalí · v2.0</p>
      </footer>
    </div>
  )
}
