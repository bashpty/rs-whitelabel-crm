import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Megaphone, Users, DollarSign, BarChart2, Plus } from 'lucide-react'
import { campaignsApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const CAMPAIGN_TYPES = ['DRIP_EMAIL', 'SMS', 'DIRECT_MAIL', 'SOCIAL']
const CAMPAIGN_STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']
const typeBadge = { DRIP_EMAIL: 'bg-accent/10 text-accent', SMS: 'bg-primary/10 text-primary', DIRECT_MAIL: 'bg-warning/10 text-warning', SOCIAL: 'bg-success/10 text-success' }

function CampaignForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? campaignsApi.update(defaultValues.id, data) : campaignsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaigns'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Nombre de la Campaña" required error={errors.name?.message}>
        <input {...register('name', { required: 'El nombre es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Campaña Q4 2025" />
      </FormField>
      <FormField label="Tipo" required error={errors.type?.message}>
        <select {...register('type', { required: 'El tipo es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {CAMPAIGN_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <FormField label="Estado" error={errors.status?.message}>
        <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {CAMPAIGN_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Presupuesto (USD)" error={errors.budget?.message}>
          <input {...register('budget', { valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" placeholder="5000" />
        </FormField>
        <FormField label="Fecha de Inicio" error={errors.startDate?.message}>
          <input {...register('startDate')} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
      </div>
      <FormField label="Fecha de Fin" error={errors.endDate?.message}>
        <input {...register('endDate')} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Campaña'}</button>
      </div>
    </form>
  )
}

export default function CampaignManagement() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['campaigns', page],
    queryFn: () => campaignsApi.list({ page, limit: 12 }),
  })
  const deleteMutation = useMutation({ mutationFn: (id) => campaignsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }) })

  const campaigns = data?.data ?? []
  const meta = data?.meta

  const kpis = [
    { titulo: 'Total Campañas', valor: meta?.total ?? '—', icon: Megaphone },
    { titulo: 'Activas', valor: campaigns.filter((c) => c.status === 'ACTIVE').length, icon: BarChart2 },
    { titulo: 'Presupuesto Total', valor: `$${campaigns.reduce((s, c) => s + (c.budget ?? 0), 0).toLocaleString()}`, icon: DollarSign },
    { titulo: 'Tipos Únicos', valor: new Set(campaigns.map((c) => c.type)).size, icon: Users },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Gestión de Campañas</h1>
          <p className="text-sm text-secondary mt-0.5">Orquestación de campañas de marketing</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nueva Campaña</button>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Tipo', 'Estado', 'Presupuesto', 'Inicio', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={6} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={6} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar campañas</td></tr>}
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{c.name}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${typeBadge[c.type] ?? 'bg-base-200 text-secondary'}`}>{c.type}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.status ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{c.budget != null ? `$${Number(c.budget).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', campaign: c })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar campaña?')) deleteMutation.mutate(c.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Campaña' : 'Nueva Campaña'}>
        <CampaignForm defaultValues={modal?.campaign} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
