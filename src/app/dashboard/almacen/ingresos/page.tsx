'use client'
import { useState, useCallback } from 'react'
import { useIngresos } from '@/lib/hooks/useAlmacen'
import type { AlmacenFilter } from '@/types/database'

const fmtUSD = (n: number | null) => n == null ? '—' : '$' + n.toLocaleString('es-NI', { minimumFractionDigits: 2 })
const fmtFecha = (s: string | null) => s ? new Date(s + 'T00:00:00').toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function IngresosPage() {
  const [filter, setFilter] = useState<AlmacenFilter>({})
  const [page, setPage] = useState(1)
  const { data, count, totalPages, loading, error } = useIngresos(filter, page, 25)

  return (
    <div className="p-6 space-y-4 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Ingresos al Almacén</h1>
          <p className="text-slate-400 text-sm mt-0.5">{loading ? 'Cargando...' : count.toLocaleString('es-NI') + ' registros'}</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Nuevo Ingreso
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" placeholder="Buscar código, descripción, proveedor..."
            className="lg:col-span-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => { setFilter(f => ({ ...f, busqueda: e.target.value || undefined })); setPage(1) }}/>
          <input type="date" className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => { setFilter(f => ({ ...f, fecha_desde: e.target.value || undefined })); setPage(1) }}/>
          <input type="date" className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => { setFilter(f => ({ ...f, fecha_hasta: e.target.value || undefined })); setPage(1) }}/>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><p className="text-red-400 text-sm">{error}</p></div>}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Fecha','Código','Descripción','Proveedor','Cantidad','Unidad','P.U. USD','Total USD','Familia'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:8}).map((_,i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  {Array.from({length:9}).map((_,j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"/></td>
                  ))}
                </tr>
              )) : data.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-slate-500 py-12">No se encontraron registros</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i%2===0?'':'bg-slate-800/10'}`}>
                  <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap text-xs">{fmtFecha(row.fecha)}</td>
                  <td className="px-4 py-2.5"><code className="text-blue-400 text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">{row.codigo ?? '—'}</code></td>
                  <td className="px-4 py-2.5 text-white max-w-xs"><p className="truncate">{row.descripcion ?? '—'}</p></td>
                  <td className="px-4 py-2.5 text-slate-300 text-xs whitespace-nowrap">{row.proveedor ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-300 text-right">{row.cantidad?.toLocaleString('es-NI') ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{row.unidad ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-300 text-right whitespace-nowrap">{fmtUSD(row.pu_usd)}</td>
                  <td className="px-4 py-2.5 text-green-400 font-medium text-right whitespace-nowrap">{fmtUSD(row.total)}</td>
                  <td className="px-4 py-2.5 text-xs"><span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded truncate inline-block max-w-24">{row.familia ?? '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <p className="text-slate-400 text-xs">Página {page} de {totalPages} — {count.toLocaleString('es-NI')} registros</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800">← Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800">Siguiente →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
