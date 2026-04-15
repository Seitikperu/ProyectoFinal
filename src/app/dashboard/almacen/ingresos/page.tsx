'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import ModalIngreso from '@/components/almacen/ModalIngreso'
import { showToast } from '@/components/ui/Toast'
import type { IngresoAlmacen } from '@/types/database'

const sb = getSupabaseClient()

const fmtUSD   = (n: number | null) => n == null ? '—' : '$' + n.toLocaleString('es-NI', { minimumFractionDigits: 2 })
const fmtFecha = (s: string | null) => s ? new Date(s + 'T00:00:00').toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function IngresosPage() {
    const router = useRouter()
    const [rows, setRows]           = useState<IngresoAlmacen[]>([])
    const [count, setCount]         = useState(0)
    const [loading, setLoading]     = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [page, setPage]           = useState(1)
    const [busqueda, setBusqueda]   = useState('')
    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')
    const [realtime,  setRealtime]  = useState(false)
    const PAGE_SIZE = 25

  // ── Carga de datos vía Supabase ───────────────────────────────────────────
  const fetchData = useCallback(async () => {
        setLoading(true)
        try {
                let q = sb
                  .from('ingreso_almacen')
                  .select('*', { count: 'exact' })
                  .order('fecha', { ascending: false })
                  .order('id',    { ascending: false })
                  .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

          if (busqueda)   q = q.or(`codigo.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%,proveedor.ilike.%${busqueda}%`)
                if (fechaDesde) q = q.gte('fecha', fechaDesde)
                if (fechaHasta) q = q.lte('fecha', fechaHasta)

          const { data, count: total, error } = await q
                if (error) throw error
                setRows((data ?? []) as IngresoAlmacen[])
                setCount(total ?? 0)
        } catch (err) {
                showToast('error', 'Error al cargar datos', err instanceof Error ? err.message : 'Error desconocido')
        } finally {
                setLoading(false)
        }
  }, [page, busqueda, fechaDesde, fechaHasta])

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => { fetchData() }, [fetchData])

  // ── Supabase Realtime — suscripción a ingreso_almacen ─────────────────────
  useEffect(() => {
        const channel = sb
          .channel('ingresos-realtime')
          .on(
                    'postgres_changes',
            { event: '*', schema: 'public', table: 'ingreso_almacen' },
                    (payload) => {
                                if (payload.eventType === 'INSERT') {
                                              if (page === 1) {
                                                              setRows(prev => [payload.new as IngresoAlmacen, ...prev].slice(0, PAGE_SIZE))
                                                              setCount(c => c + 1)
                                              }
                                }
                                if (payload.eventType === 'DELETE') {
                                              setRows(prev => prev.filter(r => r.id !== (payload.old as IngresoAlmacen).id))
                                              setCount(c => Math.max(0, c - 1))
                                }
                                if (payload.eventType === 'UPDATE') {
                                              setRows(prev => prev.map(r => r.id === (payload.new as IngresoAlmacen).id ? payload.new as IngresoAlmacen : r))
                                }
                    }
                  )
          .subscribe((status) => { setRealtime(status === 'SUBSCRIBED') })

                return () => { sb.removeChannel(channel) }
  }, [page])

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  // ── Debounce en búsqueda ───────────────────────────────────────────────────
  useEffect(() => {
        const t = setTimeout(() => setPage(1), 400)
        return () => clearTimeout(t)
  }, [busqueda, fechaDesde, fechaHasta])

  return (
        <div className="p-6 space-y-4 max-w-screen-2xl mx-auto">
        
          {/* ── Botón Retroceder ── */}
              <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors group"
                      >
                      <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                      </svg>svg>
                      Retroceder
              </button>
        
          {/* ── Cabecera ── */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                                <div className="flex items-center gap-2">
                                            <h1 className="text-xl font-bold text-white">Ingresos al Almacén</h1>h1>
                                  {/* Indicador Realtime */}
                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                        realtime
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
                                                          <span className={`w-1.5 h-1.5 rounded-full ${realtime ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}/>
                                              {realtime ? 'Tiempo real activo' : 'Conectando…'}
                                            </div>div>
                                </div>div>
                                <p className="text-slate-400 text-sm mt-0.5">
                                  {loading ? 'Cargando…' : `${count.toLocaleString('es-NI')} registros`}
                                </p>p>
                      </div>div>
              
                      <button
                                  onClick={() => setShowModal(true)}
                                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                </svg>svg>
                                + Nuevo Ingreso
                      </button>
              </div>div>
        
          {/* ── Filtros ── */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <input
                                              type="text"
                                              placeholder="Buscar código, descripción, proveedor…"
                                              value={busqueda}
                                              onChange={e => setBusqueda(e.target.value)}
                                              className="lg:col-span-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Desde</label>label>
                                            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
                                                            className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Hasta</label>label>
                                            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
                                                            className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>div>
                      </div>div>
                {(busqueda || fechaDesde || fechaHasta) && (
                    <button
                                  onClick={() => { setBusqueda(''); setFechaDesde(''); setFechaHasta(''); setPage(1) }}
                                  className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2">
                                Limpiar filtros
                    </button>
                      )}
              </div>div>
        
          {/* ── Tabla ── */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                            <thead>
                                                          <tr className="border-b border-slate-800">
                                                            {['Fecha','Código','Descripción','Proveedor','Cantidad','Unidad','P.U. </div>
