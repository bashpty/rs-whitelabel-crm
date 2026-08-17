import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { CalendarCheck, Wrench, Clock, CheckCircle, Plus } from 'lucide-react'
import { viewingsApi, maintenanceApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const VIEWING_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const ISSUE_TYPES = ['PLUMBING', 'ELECTRICAL', 'HVAC', 'APPLIANCE', 'GENERAL']
const MAINT_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const vBadge = { SCHEDULED: 'bg-accent/10 text-accent', COMPLETED: 'bg-success/10 text-success', CANCELLED: 'bg-error/10 text-error', NO_SHOW: 'bg-base-200 text-secondary' }
const mBadge = { OPEN: 'bg-error/10 text-error', IN_PROGRESS: 'bg-warning/10 text-warning', RESOLVED: 'bg-success/10 text-success', CLOSED: 'bg-base-200 text-secondary' }

function ViewingForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? viewingsApi.update(defaultValues.id, data) : viewingsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['viewings'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="ID de Propiedad (UUID)" required error={errors.propertyId?.message}>
        <input {...register('propertyId', { required: 'La propiedad es obligatoria' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" />
      </FormField>
      <FormField label="ID de Contacto (UUID)" required error={errors.contactId?.message}>
        <input {...register('contactId', { required: 'El contacto es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" />
      </FormField>
      <FormField label="ID de Agente (UUID)" required error={errors.assignedUserId?.message}>
        <input {...register('assignedUserId', { required: 'El agente es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" />
      </FormField>
      <FormField label="Fecha y Hora" required error={errors.scheduledAt?.message}>
        <input {...register('scheduledAt', { required: 'La fecha es obligatoria' })} type="datetime-local" className="input input-sm w-full bg-base-100 border-base-300" />
      </FormField>
      <FormField label="Estado" error={errors.status?.message}>
        <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {VIEWING_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Visita'}</button>
      </div>
    </form>
  )
}

function MaintenanceForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? maintenanceApi.patch(defaultValues.id, data) : maintenanceApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['maintenance'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="ID de Propiedad (UUID)" required error={errors.propertyId?.message}>
        <input {...register('propertyId', { required: 'La propiedad es obligatoria' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" />
      </FormField>
      <FormField label="ID de Contacto (UUID)" required error={errors.contactId?.message}>
        <input {...register('contactId', { required: 'El contacto es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" />
      </FormField>
      <FormField label="Tipo de Problema" required error={errors.issueType?.message}>
        <select {...register('issueType', { required: 'El tipo es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <FormField label="Descripción" required error={errors.description?.message}>
        <textarea {...register('description', { required: 'La descripción es obligatoria' })} className="textarea textarea-sm w-full bg-base-100 border-base-300 h-20" />
      </FormField>
      <FormField label="Estado" error={errors.status?.message}>
        <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {MAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Solicitud'}</button>
      </div>
    </form>
  )
}

export default function ViewingsMaintenance() {
  const [vPage, setVPage] = useState(1)
  const [mPage, setMPage] = useState(1)
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data: vData, isLoading: vLoading } = useQuery({ queryKey: ['viewings', vPage], queryFn: () => viewingsApi.list({ page: vPage, limit: 10 }) })
  const { data: mData, isLoading: mLoading } = useQuery({ queryKey: ['maintenance', mPage], queryFn: () => maintenanceApi.list({ page: mPage, limit: 10 }) })
  const deleteV = useMutation({ mutationFn: (id) => viewingsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['viewings'] }) })
  const deleteM = useMutation({ mutationFn: (id) => maintenanceApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }) })

  const viewings = vData?.data ?? []
  const maintenance = mData?.data ?? []

  const kpis = [
    { titulo: 'Total Visitas', valor: vData?.meta?.total ?? '—', icon: CalendarCheck },
    { titulo: 'Programadas', valor: viewings.filter((v) => v.status === 'SCHEDULED').length, icon: Clock },
    { titulo: 'Solicitudes Mant.', valor: mData?.meta?.total ?? '—', icon: Wrench },
    { titulo: 'Resueltas', valor: maintenance.filter((m) => m.status === 'RESOLVED').length, icon: CheckCircle },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Visitas y Mantenimiento</h1>
          <p className="text-sm text-secondary mt-0.5">Agenda de visitas y solicitudes de mantenimiento</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ mode: 'viewing' })} className="btn btn-ghost btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Visita</button>
          <button onClick={() => setModal({ mode: 'maintenance' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Mantenimiento</button>
        </div>
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
        <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex justify-between items-center">
          <span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Visitas Programadas</span>
          <button onClick={() => setModal({ mode: 'viewing' })} className="btn btn-ghost btn-xs font-mono-crm"><Plus className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Propiedad ID', 'Contacto ID', 'Estado', 'Fecha', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {vLoading && <tr><td colSpan={5} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {viewings.map((v) => (
                <tr key={v.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{v.propertyId?.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{v.contactId?.slice(0, 8)}…</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${vBadge[v.status] ?? 'bg-base-200 text-secondary'}`}>{v.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{v.scheduledAt ? new Date(v.scheduledAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'editViewing', viewing: v })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar visita?')) deleteV.mutate(v.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={vData?.meta} onPageChange={setVPage} />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex justify-between items-center">
          <span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Solicitudes de Mantenimiento</span>
          <button onClick={() => setModal({ mode: 'maintenance' })} className="btn btn-ghost btn-xs font-mono-crm"><Plus className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Propiedad ID', 'Tipo', 'Estado', 'Descripción', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {mLoading && <tr><td colSpan={5} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {maintenance.map((m) => (
                <tr key={m.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{m.propertyId?.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{m.issueType ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${mBadge[m.status] ?? 'bg-base-200 text-secondary'}`}>{m.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary max-w-xs truncate">{m.description ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'editMaintenance', maintenance: m })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar solicitud?')) deleteM.mutate(m.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={mData?.meta} onPageChange={setMPage} />
      </div>

      <Modal open={modal?.mode === 'viewing' || modal?.mode === 'editViewing'} onClose={() => setModal(null)} title={modal?.mode === 'editViewing' ? 'Editar Visita' : 'Nueva Visita'}>
        <ViewingForm defaultValues={modal?.viewing} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal open={modal?.mode === 'maintenance' || modal?.mode === 'editMaintenance'} onClose={() => setModal(null)} title={modal?.mode === 'editMaintenance' ? 'Editar Solicitud' : 'Nueva Solicitud de Mantenimiento'}>
        <MaintenanceForm defaultValues={modal?.maintenance} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
