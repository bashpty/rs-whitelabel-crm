import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Building2, Layers, TrendingUp, Users, Plus } from 'lucide-react'
import { projectsApi, unitsApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const PROJECT_STATUSES = ['PLANNING', 'UNDER_CONSTRUCTION', 'COMPLETED', 'ON_HOLD', 'CANCELLED']
const UNIT_STATUSES = ['AVAILABLE', 'RESERVED', 'SOLD', 'LEASED']
const statusBadge = { PLANNING: 'bg-base-200 text-secondary', UNDER_CONSTRUCTION: 'bg-warning/10 text-warning', COMPLETED: 'bg-success/10 text-success', ON_HOLD: 'bg-error/10 text-error', CANCELLED: 'bg-error/10 text-error' }

function ProjectForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? projectsApi.update(defaultValues.id, data) : projectsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Nombre del Proyecto" required error={errors.name?.message}>
        <input {...register('name', { required: 'El nombre es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Torre Norte Fase 2" />
      </FormField>
      <FormField label="Estado" error={errors.status?.message}>
        <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Inicio" error={errors.startDate?.message}>
          <input {...register('startDate')} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
        <FormField label="Fin Esperado" error={errors.expectedEndDate?.message}>
          <input {...register('expectedEndDate')} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
      </div>
      <FormField label="Presupuesto Total (USD)" error={errors.totalBudget?.message}>
        <input {...register('totalBudget', { valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Proyecto'}</button>
      </div>
    </form>
  )
}

export default function ProjectControl() {
  const [projPage, setProjPage] = useState(1)
  const [unitPage, setUnitPage] = useState(1)
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data: projData, isLoading: projLoading } = useQuery({
    queryKey: ['projects', projPage],
    queryFn: () => projectsApi.list({ page: projPage, limit: 10 }),
  })
  const { data: unitData, isLoading: unitLoading } = useQuery({
    queryKey: ['units', unitPage],
    queryFn: () => unitsApi.list({ page: unitPage, limit: 15 }),
  })
  const deleteProj = useMutation({ mutationFn: (id) => projectsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) })

  const projects = projData?.data ?? []
  const units = unitData?.data ?? []
  const projMeta = projData?.meta
  const unitMeta = unitData?.meta

  const kpis = [
    { titulo: 'Proyectos', valor: projMeta?.total ?? '—', icon: Building2 },
    { titulo: 'En Construcción', valor: projects.filter((p) => p.status === 'UNDER_CONSTRUCTION').length, icon: TrendingUp },
    { titulo: 'Unidades', valor: unitMeta?.total ?? '—', icon: Layers },
    { titulo: 'Disponibles', valor: units.filter((u) => u.status === 'AVAILABLE').length, icon: Users },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Control de Proyectos</h1>
          <p className="text-sm text-secondary mt-0.5">Gestión de proyectos de desarrollo inmobiliario</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nuevo Proyecto</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titulo} className="stat bg-base-100 border border-base-300 rounded-lg p-4">
            <div className="flex justify-between items-start"><div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary">{k.titulo}</div><k.icon className="w-4 h-4 text-secondary" /></div>
            <div className="stat-value font-display text-xl text-primary mt-1">{k.valor}</div>
          </div>
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Proyectos</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Estado', 'Presupuesto', 'Inicio', 'Fin Esperado', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {projLoading && <tr><td colSpan={6} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{p.name}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge[p.status] ?? 'bg-base-200 text-secondary'}`}>{p.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{p.totalBudget != null ? `$${Number(p.totalBudget).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{p.expectedEndDate ? new Date(p.expectedEndDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', project: p })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar proyecto?')) deleteProj.mutate(p.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={projMeta} onPageChange={setProjPage} />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Unidades</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Unidad', 'Tipo', 'Piso', 'Área (m²)', 'Precio', 'Estado'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {unitLoading && <tr><td colSpan={6} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{u.unitNumber ?? u.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.type ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.floor ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.areaSqm ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{u.price != null ? `$${Number(u.price).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.status ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={unitMeta} onPageChange={setUnitPage} />
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Proyecto' : 'Nuevo Proyecto'}>
        <ProjectForm defaultValues={modal?.project} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
