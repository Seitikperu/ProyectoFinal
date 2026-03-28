'use client'
import { useState, useCallback } from 'react'
import { useMateriales } from '@/lib/hooks/useAlmacen'
import type { Material } from '@/types/database'

const PAGE_SIZE = 50

function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: string }) {
    const colors: Record<string, string> = {
          green: 'bg-green-900 text-green-300 border border-green-700',
          red: 'bg-red-900 text-red-300 border border-red-700',
          slate: 'bg-slate-800 text-slate-300 border border-slate-700',
          blue: 'bg-blue-900 text-blue-300 border border-blue-700',
    }
    return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color] ?? colors.slate}`}>
            {children}
          </span>span>
        )
}

function SkeletonRow() {
    return (
          <tr className="border-b border-slate-800">
            {[...Array(7)].map((_, i) => (
                    <td key={i} className="px-4 py-3">
                              <div className="h-4 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>td>
                  ))}
          </tr>tr>
        )
}

export default function Page() {
    const [busqueda, setBusqueda] = useState('')
        const [inputVal, setInputVal] = useState('')
            const [page, setPage] = useState(1)
                const [familiaFiltro, setFamiliaFiltro] = useState('')
                  
                    const { data, count, totalPages, loading } = useMateriales(busqueda, page, PAGE_SIZE)
                      
                        const handleSearch = useCallback(() => {
                              setBusqueda(inputVal)
                                    setPage(1)
                                          setFamiliaFiltro('')
                        }, [inputVal])
                          
                            const handleKeyDown = (e: React.KeyboardEvent) => {
                                  if (e.key === 'Enter') handleSearch()
                            }
                              
                                const handleClear = () => {
                                      setInputVal('')
                                            setBusqueda('')
                                                  setPage(1)
                                                        setFamiliaFiltro('')
                                }
                                  
                                    // Familias únicas del resultado actual
    const familias = Array.from(new Set(data.map((m: Material) => m.familia).filter(Boolean))) as string[]
      
        const filtered = familiaFiltro
              ? data.filter((m: Material) => m.familia === familiaFiltro)
              : data
          
            return (
                  <div className="p-6 max-w-screen-2xl mx-auto">
                    {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                                <div>
                                          <h1 className="text-xl font-bold text-white">Catálogo de Materiales</h1>h1>
                                          <p className="text-slate-400 text-sm mt-1">
                                            {loading ? 'Cargando...' : `${count.toLocaleString()} materiales registrados`}
                                          </p>p>
                                </div>div>
                        </div>div>
                  
                    {/* Filtros */}
                        <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex-1 min-w-[280px] flex gap-2">
                                          <div className="relative flex-1">
                                                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                      </svg>svg>
                                                      <input
                                                                      type="text"
                                                                      value={inputVal}
                                                                      onChange={e => setInputVal(e.target.value)}
                                                                      onKeyDown={handleKeyDown}
                                                                      placeholder="Buscar por código o descripción..."
                                                                      className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                          </div>div>
                                          <button
                                                        onClick={handleSearch}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                      >
                                                      Buscar
                                          </button>button>
                                  {(busqueda || familiaFiltro) && (
                                <button
                                                onClick={handleClear}
                                                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                              >
                                              Limpiar
                                </button>button>
                                          )}
                                </div>div>
                        
                          {familias.length > 0 && (
                              <select
                                            value={familiaFiltro}
                                            onChange={e => { setFamiliaFiltro(e.target.value); setPage(1) }}
                                            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          >
                                          <option value="">Todas las familias</option>option>
                                {familias.sort().map(f => (
                                                          <option key={f} value={f}>{f}</option>option>
                                                        ))}
                              </select>select>
                                )}
                        </div>div>
                  
                    {/* Tabla */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                          <table className="w-full text-sm">
                                                      <thead>
                                                                    <tr className="border-b border-slate-800 bg-slate-950">
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Código</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Descripción</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Unidad</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Familia</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Subfamilia</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Ubic. Jabalí</th>th>
                                                                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Estado</th>th>
                                                                    </tr>tr>
                                                      </thead>thead>
                                                      <tbody>
                                                        {loading ? (
                                    [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
                                  ) : filtered.length === 0 ? (
                                    <tr>
                                                      <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                                                                          <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                          </svg>svg>
                                                                          No se encontraron materiales
                                                      </td>td>
                                    </tr>tr>
                                  ) : (
                                    filtered.map((mat: Material) => (
                                                        <tr key={mat.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                                                            <td className="px-4 py-3">
                                                                                                  <span className="font-mono text-blue-400 text-xs">{mat.codigo}</span>span>
                                                                            </td>td>
                                                                            <td className="px-4 py-3 text-white max-w-xs">
                                                                                                  <span className="line-clamp-2">{mat.descripcion ?? '—'}</span>span>
                                                                            </td>td>
                                                                            <td className="px-4 py-3 text-slate-300">{mat.unidad_medida ?? '—'}</td>td>
                                                                            <td className="px-4 py-3">
                                                                              {mat.familia ? <Badge color="blue">{mat.familia}</Badge>Badge> : <span className="text-slate-600">—</span>span>}
                                                                            </td>td>
                                                                            <td className="px-4 py-3 text-slate-400 text-xs">{mat.subfamilia ?? '—'}</td>td>
                                                                            <td className="px-4 py-3 text-slate-400 text-xs">{mat.ubicacion_jabali ?? '—'}</td>td>
                                                                            <td className="px-4 py-3">
                                                                                                  <Badge color={mat.activo === 'SI' ? 'green' : 'red'}>
                                                                                                    {mat.activo === 'SI' ? 'Activo' : 'Inactivo'}
                                                                                                    </Badge>Badge>
                                                                            </td>td>
                                                        </tr>tr>
                                                      ))
                                  )}
                                                      </tbody>tbody>
                                          </table>table>
                                </div>div>
                        
                          {/* Paginación */}
                          {!loading && totalPages > 1 && (
                              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
                                          <span className="text-slate-500 text-sm">
                                                        Página {page} de {totalPages} — {count.toLocaleString()} registros
                                          </span>span>
                                          <div className="flex gap-2">
                                                        <button
                                                                          onClick={() => setPage(p => Math.max(1, p - 1))}
                                                                          disabled={page === 1}
                                                                          className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                                        >
                                                                        ← Anterior
                                                        </button>button>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                                                                  const p = start + i
                                                                                    return (
                                                                                                        <button
                                                                                                                              key={p}
                                                                                                                              onClick={() => setPage(p)}
                                                                                                                              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                                                                                                                      p === page
                                                                                                                                                        ? 'bg-blue-600 text-white'
                                                                                                                                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                                                                                                }`}
                                                                                                                            >
                                                                                                          {p}
                                                                                                          </button>button>
                                                                                                      )
                                            })}
                                                        <button
                                                                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                                          disabled={page === totalPages}
                                                                          className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                                        >
                                                                        Siguiente →
                                                        </button>button>
                                          </div>div>
                              </div>div>
                                )}
                        </div>div>
                  </div>div>
                )
}</tr>
