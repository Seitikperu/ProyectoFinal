'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { showToast } from '@/components/ui/Toast'

const sb = getSupabaseClient()

export default function ModalNuevoCeco({ onClose, onSaved }: { onClose: () => void, onSaved: () => void }) {
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    cod_ceco: '',
    centro_costo: '',
    area: '',
    tipo_costo: '',
  })

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cod_ceco.trim() || !form.centro_costo.trim()) {
      showToast('Error', 'Código y descripción son requeridos', 'error')
      return
    }

    setLoading(true)
    const { error } = await sb.from('centros_costo').insert({
      ...form,
      status: 'ACTIVO',
    })

    setLoading(false)

    if (error) {
      showToast('Error', error.message, 'error')
    } else {
      showToast('Éxito', 'Centro de costo registrado correctamente', 'success')
      onSaved()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-lg font-bold text-white">Nuevo Centro de Costo</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={guardar} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Código Ceco <span className="text-red-400">*</span></label>
            <input 
              autoFocus
              type="text" 
              value={form.cod_ceco} 
              onChange={e => setForm({ ...form, cod_ceco: e.target.value.toUpperCase() })}
              placeholder="Ej. OP-012"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Descripción <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              value={form.centro_costo} 
              onChange={e => setForm({ ...form, centro_costo: e.target.value.toUpperCase() })}
              placeholder="Ej. MINA SUBTERRÁNEA"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Área</label>
              <input 
                type="text" 
                value={form.area} 
                onChange={e => setForm({ ...form, area: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Costo</label>
              <select 
                value={form.tipo_costo} 
                onChange={e => setForm({ ...form, tipo_costo: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="OPEX">OPEX</option>
                <option value="CAPEX">CAPEX</option>
                <option value="INVENTARIO">INVENTARIO</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              {loading ? 'Guardando...' : 'Guardar Ceco'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
