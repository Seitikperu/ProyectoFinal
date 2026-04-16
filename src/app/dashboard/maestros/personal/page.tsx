'use client'
import { useState, KeyboardEvent } from 'react'
import { usePersonal } from '@/lib/hooks/useAlmacen'
import { useProyecto } from '@/lib/context/ProyectoContext'
import { BackButton } from '@/components/ui/BackButton'
import ModalNuevoPersonal from '@/components/maestros/ModalNuevoPersonal'

function getBadgeClass(color: string) {
  const map: Record<string, string> = {
    green: 'bg-green-900/40 text-green-400 border border-green-800/50',
    red:   'bg-red-900/40 text-red-400 border border-red-800/50',
    blue:  'bg-blue-900/40 text-blue-400 border border-blue-800/50',
    slate: 'bg-slate-800 text-slate-400 border border-slate-700',
  }
  return map[color] ?? map.slate
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeClass(color)}`}>
      {label}
    </span>
  )
}

export default function Page() {
  const [input, setInput] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const { proyecto } = useProyecto()

  const { data, count, totalPages, loading, refetch } = usePersonal(busqueda, page, 50, proyecto?.nombre)

  function buscar() {
    setBusqueda(input.trim())
    setPage(1)
  }

  function limpiar() {
    setInput('')
    setBusqueda('')
    setPage(1)
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') buscar()
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-xl font-bold text-white">Personal</h1>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Cargando...' : `${count.toLocaleString()} registros`} en {proyecto?.nombre || 'General'}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Registrar Trabajador
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Buscar por Trabajador u Ocupación..."
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 w-72 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={buscar}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Buscar
          </button>
          {busqueda && (
            <button
              onClick={limpiar}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Trabajador</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Ocupación</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Ceco</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Autoriza Salida</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Acceso Almacen</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-slate-800 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No se encontró personal
                  </td>
                </tr>
              ) : (
                data.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{p.trabajador}</td>
                    <td className="py-3 px-4 text-slate-300">{p.ocupacion ?? '—'}</td>
                    <td className="py-3 px-4">
                      {p.ceco ? <Badge label={`${p.ceco} - ${p.descrip_ceco ?? ''}`} color="slate" /> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <Badge label={p.autorizacion_salm === 'SI' ? 'SÍ' : 'NO'} color={p.autorizacion_salm === 'SI' ? 'green' : 'slate'} />
                    </td>
                    <td className="py-3 px-4">
                      <Badge label={p.Acceso_Almacen === 'SI' ? 'SÍ' : 'NO'} color={p.Acceso_Almacen === 'SI' ? 'green' : 'slate'} />
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        label={p.activo === 'SI' ? 'Activo' : 'Inactivo'}
                        color={p.activo === 'SI' ? 'green' : 'red'}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <span className="text-slate-400 text-sm">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ModalNuevoPersonal 
          onClose={() => setShowModal(false)} 
          onSaved={() => {
            setShowModal(false)
            refetch?.()
          }} 
        />
      )}
    </div>
  )
}
