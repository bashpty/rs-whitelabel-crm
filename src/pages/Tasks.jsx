import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { CheckSquare, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react'
import { tasksApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const statusBadge = { PENDING: 'bg-base-200 text-secondary', IN_PROGRESS: 'bg-accent/10 text-accent', COMPLETED: 'bg-success/10 text-success', CANCELLED: 'bg-error/10 text-error' }

function TaskForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? tasksApi.update(defaultValues.id, data) : tasksApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Título" required error={errors.title?.message}>
        <input {...register('title', { required: 'El título es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Enviar contrato al cliente" />
      </FormField>
      <FormField label="Descripción" error={errors.description?.message}>
        <textarea {...register('description')} className="textarea textarea-sm w-full bg-base-100 border-base-300 h-20" placeholder="Detalles de la tarea…" />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Estado" error={errors.status?.message}>
          <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Seleccionar…</option>
            {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Prioridad" error={errors.priority?.message}>
          <select {...register('priority')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Seleccionar…</option>
            {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Fecha de Vencimiento" error={errors.dueDate?.message}>
        <input {...register('dueDate')} type="datetime-local" className="input input-sm w-full bg-base-100 border-base-300" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Tarea'}</button>
      </div>
    </form>
  )
}

export default function Tasks() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatus] = useState('')
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', page, statusFilter],
    queryFn: () => tasksApi.list({ page, limit: 15, status: statusFilter }),
  })
  const deleteMutation = useMutation({ mutationFn: (id) => tasksApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) })

  const tasks = data?.data ?? []
  const meta = data?.meta

  const kpis = [
    { titulo: 'Total Tareas', valor: meta?.total ?? '—', icon: CheckSquare },
    { titulo: 'Pendientes', valor: tasks.filter((t) => t.status === 'PENDING').length, icon: Clock },
    { titulo: 'En Progreso', valor: tasks.filter((t) => t.status === 'IN_PROGRESS').length, icon: AlertTriangle },
    { titulo: 'Completadas', valor: tasks.filter((t) => t.status === 'COMPLETED').length, icon: CheckCircle },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Gestión de Tareas</h1>
          <p className="text-sm text-secondary mt-0.5">Control operativo de actividades del equipo</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nueva Tarea</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titulo} className="stat bg-base-100 border border-base-300 rounded-lg p-4">
            <div className="flex justify-between items-start"><div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary">{k.titulo}</div><k.icon className="w-4 h-4 text-secondary" /></div>
            <div className="stat-value font-display text-xl text-primary mt-1">{k.valor}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="select select-sm bg-base-100 border-base-300 font-mono-crm text-xs">
          <option value="">Todos los Estados</option>
          {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Título', 'Estado', 'Prioridad', 'Vencimiento', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={5} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={5} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar tareas</td></tr>}
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{t.title}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge[t.status] ?? 'bg-base-200 text-secondary'}`}>{t.status}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{t.priority ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', task: t })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar tarea?')) deleteMutation.mutate(t.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Tarea' : 'Nueva Tarea'}>
        <TaskForm defaultValues={modal?.task} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
