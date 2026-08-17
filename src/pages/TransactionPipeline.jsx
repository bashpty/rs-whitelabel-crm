import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { GitBranch, DollarSign, TrendingUp, Layers, Plus } from 'lucide-react'
import { dealsApi, pipelineStagesApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const DEAL_STATUSES = ['ACTIVE', 'WON', 'LOST', 'ON_HOLD']
const statusBadge = { ACTIVE: 'bg-accent/10 text-accent', WON: 'bg-success/10 text-success', LOST: 'bg-error/10 text-error', ON_HOLD: 'bg-warning/10 text-warning' }

function DealForm({ onSuccess, onClose, defaultValues, stages }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? dealsApi.update(defaultValues.id, data) : dealsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deals'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Título" required error={errors.title?.message}>
        <input {...register('title', { required: 'El título es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Venta unidad 4B" />
      </FormField>
      <FormField label="Valor del Deal (USD)" error={errors.value?.message}>
        <input {...register('value', { valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" placeholder="250000" />
      </FormField>
      <FormField label="Estado" required error={errors.status?.message}>
        <select {...register('status', { required: 'El estado es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {DEAL_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      {stages?.length > 0 && (
        <FormField label="Etapa del Pipeline" error={errors.pipelineStageId?.message}>
          <select {...register('pipelineStageId')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Sin etapa</option>
            {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormField>
      )}
      <FormField label="Fecha de Cierre Esperada" error={errors.expectedCloseDate?.message}>
        <input {...register('expectedCloseDate')} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Deal'}</button>
      </div>
    </form>
  )
}

export default function TransactionPipeline() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatus] = useState('')
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['deals', page, statusFilter],
    queryFn: () => dealsApi.list({ page, limit: 15, status: statusFilter }),
  })
  const { data: stagesData } = useQuery({ queryKey: ['pipeline-stages'], queryFn: () => pipelineStagesApi.list({ limit: 100 }) })
  const deleteMutation = useMutation({ mutationFn: (id) => dealsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }) })

  const deals = data?.data ?? []
  const meta = data?.meta
  const stages = stagesData?.data ?? []
  const totalValue = deals.reduce((s, d) => s + (d.value ?? 0), 0)

  const kpis = [
    { titulo: 'Total Deals', valor: meta?.total ?? '—', icon: GitBranch },
    { titulo: 'Valor Total', valor: `$${totalValue.toLocaleString()}`, icon: DollarSign },
    { titulo: 'Activos', valor: deals.filter((d) => d.status === 'ACTIVE').length, icon: TrendingUp },
    { titulo: 'Etapas', valor: stages.length, icon: Layers },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Pipeline de Transacciones</h1>
          <p className="text-sm text-secondary mt-0.5">Gestión de deals y etapas del pipeline</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nuevo Deal</button>
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
          {DEAL_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Título', 'Estado', 'Valor', 'Cierre Esperado', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={5} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={5} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar deals</td></tr>}
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{d.title}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge[d.status] ?? 'bg-base-200 text-secondary'}`}>{d.status}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{d.value != null ? `$${Number(d.value).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', deal: d })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar deal?')) deleteMutation.mutate(d.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Deal' : 'Nuevo Deal'}>
        <DealForm defaultValues={modal?.deal} stages={stages} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
