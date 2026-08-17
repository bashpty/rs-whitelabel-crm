import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Key, DollarSign, Calendar, Building2, Plus } from 'lucide-react'
import { leasesApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const LEASE_STATUSES = ['ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING']
const statusBadge = { ACTIVE: 'bg-success/10 text-success', EXPIRED: 'bg-error/10 text-error', TERMINATED: 'bg-base-200 text-secondary', PENDING: 'bg-warning/10 text-warning' }

function LeaseForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? leasesApi.update(defaultValues.id, data) : leasesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leases'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="ID de Propiedad (UUID)" required error={errors.propertyId?.message}>
        <input {...register('propertyId', { required: 'La propiedad es obligatoria' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      </FormField>
      <FormField label="ID del Inquilino (UUID)" required error={errors.tenantContactId?.message}>
        <input {...register('tenantContactId', { required: 'El inquilino es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      </FormField>
      <FormField label="Monto de Renta (USD/mes)" required error={errors.rentAmount?.message}>
        <input {...register('rentAmount', { required: 'El monto es obligatorio', valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" placeholder="2500" />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Fecha de Inicio" required error={errors.commencementDate?.message}>
          <input {...register('commencementDate', { required: 'La fecha de inicio es obligatoria' })} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
        <FormField label="Fecha de Vencimiento" required error={errors.expirationDate?.message}>
          <input {...register('expirationDate', { required: 'La fecha de vencimiento es obligatoria' })} type="date" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
      </div>
      <FormField label="Estado" error={errors.status?.message}>
        <select {...register('status')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {LEASE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Arrendamiento'}</button>
      </div>
    </form>
  )
}

export default function LeasingOccupancy() {
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leases', page],
    queryFn: () => leasesApi.list({ page, limit: 15 }),
  })
  const deleteMutation = useMutation({ mutationFn: (id) => leasesApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['leases'] }) })

  const leases = data?.data ?? []
  const meta = data?.meta

  const kpis = [
    { titulo: 'Total Contratos', valor: meta?.total ?? '—', icon: Key },
    { titulo: 'Activos', valor: leases.filter((l) => l.status === 'ACTIVE').length, icon: Building2 },
    { titulo: 'Renta Mensual Total', valor: `$${leases.filter((l) => l.status === 'ACTIVE').reduce((s, l) => s + (l.rentAmount ?? 0), 0).toLocaleString()}`, icon: DollarSign },
    { titulo: 'Vencen Pronto', valor: leases.filter((l) => { if (!l.expirationDate) return false; const d = new Date(l.expirationDate); const n = new Date(); return (d - n) < 30 * 86400000 && d > n }).length, icon: Calendar },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Arrendamientos y Ocupación</h1>
          <p className="text-sm text-secondary mt-0.5">Gestión de contratos de arrendamiento activos</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nuevo Arrendamiento</button>
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
            <thead><tr className="border-b border-base-300 bg-base-200">{['ID', 'Estado', 'Renta/Mes', 'Inicio', 'Vencimiento', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={6} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={6} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar arrendamientos</td></tr>}
              {leases.map((l) => (
                <tr key={l.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{l.id?.slice(0, 8)}…</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge[l.status] ?? 'bg-base-200 text-secondary'}`}>{l.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{l.rentAmount != null ? `$${Number(l.rentAmount).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{l.commencementDate ? new Date(l.commencementDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{l.expirationDate ? new Date(l.expirationDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', lease: l })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar arrendamiento?')) deleteMutation.mutate(l.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Arrendamiento' : 'Nuevo Arrendamiento'}>
        <LeaseForm defaultValues={modal?.lease} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
