'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { showToast } from '@/components/ui/Toast'
import { useProyecto } from '@/lib/context/ProyectoContext'

const sb = getSupabaseClient()

export default function ModalNuevoPersonal({ onClose, onSaved }: { onClose: () => void, onSaved: () => void }) {
  const { proyecto } = useProyecto()
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    trabajador: '',
    ocupacion: '',
    ceco: '',
    descrip_ceco: '',
    Acceso_Almacen: 'NO',
    autorizacion_salm: 'NO',
  })

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.trabajador.trim()) {
      showToast('Error', 'El nombre del trabajador es requerido', 'error')
      return
    }

    setLoading(true)
    const { error } = await sb.from('personal').insert({
      ...form,
      activo: 'SI',
      proyecto_nombre: proyecto?.nombre ?? 'General'
    })

    setLoading(false)

    if (error) {
      showToast('Error', error.message, 'error')
    } else {
      showToast('Éxito', 'Personal registrado correctamente', 'success')
      onSaved()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-lg font-bold text-white">Nuevo Trabajador</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={guardar} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo <span className="text-red-400">*</span></label>
            <input 
              autoFocus
              type="text" 
              value={form.trabajador} 
              onChange={e => setForm({ ...form, trabajador: e.target.value.toUpperCase() })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Ocupación</label>
            <input 
              type="text" 
              value={form.ocupacion} 
              onChange={e => setForm({ ...form, ocupacion: e.target.value.toUpperCase() })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ceco (Código)</label>
              <input 
                type="text" 
                value={form.ceco} 
                onChange={e => setForm({ ...form, ceco: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ceco (Descripción)</label>
              <input 
                type="text" 
                value={form.descrip_ceco} 
                onChange={e => setForm({ ...form, descrip_ceco: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Acceso Almacén</label>
              <select 
                value={form.Acceso_Almacen} 
                onChange={e => setForm({ ...form, Acceso_Almacen: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SI">SÍ</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Autorización Salidas</label>
              <select 
                value={form.autorizacion_salm} 
                onChange={e => setForm({ ...form, autorizacion_salm: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SI">SÍ</option>
                <option value="NO">NO</option>
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
              {loading ? 'Guardando...' : 'Guardar Personal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
