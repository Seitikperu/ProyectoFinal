'use client'
import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { IngresoAlmacen, SalidaAlmacen, Material, CentroCosto, AlmacenFilter, PaginationResult } from '@/types/database'

const sb = getSupabaseClient()

export function useKPIAlmacen() {
  const [data, setData] = useState<{ total: number; valor: number; materiales: number; proveedores: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: rows } = await sb.from('ingreso_almacen').select('total, codigo, proveedor')
      if (!rows) { setLoading(false); return }
      const codigos = new Set(rows.map(r => r.codigo).filter(Boolean))
      const provs   = new Set(rows.map(r => r.proveedor).filter(Boolean))
      setData({
        total: rows.length,
        valor: rows.reduce((a, r) => a + (r.total ?? 0), 0),
        materiales: codigos.size,
        proveedores: provs.size,
      })
      setLoading(false)
    }
    fetch()
  }, [])

  return { data, loading }
}

export function useFamiliaStats(limit = 6) {
  const [data, setData] = useState<{ familia: string; valor: number; items: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data: rows } = await sb.from('ingreso_almacen').select('familia, total').not('familia', 'is', null)
      if (!rows) { setLoading(false); return }
      const grouped: Record<string, { familia: string; valor: number; items: number }> = {}
      rows.forEach(r => {
        const k = r.familia!
        if (!grouped[k]) grouped[k] = { familia: k, valor: 0, items: 0 }
        grouped[k].valor += r.total ?? 0
        grouped[k].items += 1
      })
      setData(Object.values(grouped).sort((a, b) => b.valor - a.valor).slice(0, limit))
      setLoading(false)
    }
    fetch()
  }, [limit])

  return { data, loading }
}

export function useIngresos(filter: AlmacenFilter = {}, page = 1, pageSize = 25) {
  const [result, setResult] = useState<PaginationResult<IngresoAlmacen>>({ data: [], count: 0, page, pageSize, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      let q = sb.from('ingreso_almacen').select('*', { count: 'exact' })
        .order('fecha', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (filter.busqueda)    q = q.or(`descripcion.ilike.%${filter.busqueda}%,codigo.ilike.%${filter.busqueda}%,proveedor.ilike.%${filter.busqueda}%`)
      if (filter.familia)     q = q.eq('familia', filter.familia)
      if (filter.fecha_desde) q = q.gte('fecha', filter.fecha_desde)
      if (filter.fecha_hasta) q = q.lte('fecha', filter.fecha_hasta)

      const { data, count, error: err } = await q
      if (err) throw err
      setResult({ data: data ?? [], count: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [filter, page, pageSize])

  useEffect(() => { fetchData() }, [fetchData])
  return { ...result, loading, error, refetch: fetchData }
}

export function useSalidas(filter: AlmacenFilter = {}, page = 1, pageSize = 25) {
  const [result, setResult] = useState<PaginationResult<SalidaAlmacen>>({ data: [], count: 0, page, pageSize, totalPages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let q = sb.from('salida_almacen').select('*', { count: 'exact' })
        .order('fecha', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (filter.busqueda)    q = q.or(`descripcion.ilike.%${filter.busqueda}%,codigo.ilike.%${filter.busqueda}%`)
      if (filter.fecha_desde) q = q.gte('fecha', filter.fecha_desde)
      if (filter.fecha_hasta) q = q.lte('fecha', filter.fecha_hasta)

      const { data, count } = await q
      setResult({ data: data ?? [], count: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) })
      setLoading(false)
    }
    fetchData()
  }, [filter, page, pageSize])

  return { ...result, loading }
}

export function useMateriales(busqueda = '', page = 1, pageSize = 20) {
  const [result, setResult] = useState<PaginationResult<Material>>({ data: [], count: 0, page, pageSize, totalPages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let q = sb.from('materiales').select('*', { count: 'exact' })
        .order('codigo').range((page - 1) * pageSize, page * pageSize - 1)
      if (busqueda) q = q.or(`descripcion.ilike.%${busqueda}%,codigo.ilike.%${busqueda}%`)
      const { data, count } = await q
      setResult({ data: data ?? [], count: count ?? 0, page, pageSize, totalPages: Math.ceil((count ?? 0) / pageSize) })
      setLoading(false)
    }
    fetchData()
  }, [busqueda, page, pageSize])

  return { ...result, loading }
}

export function useCentrosCosto(soloAlmacen = false) {
  const [data, setData] = useState<CentroCosto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      let q = sb.from('centros_costo').select('*').order('cod_ceco').limit(500)
      if (soloAlmacen) q = q.eq('filtro_almacen', 'SI')
      const { data } = await q
      setData(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [soloAlmacen])

  return { data, loading }
}
