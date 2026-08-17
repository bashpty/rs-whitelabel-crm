import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Users, Eye, Flame, MapPin, Plus } from 'lucide-react'
import { contactsApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const CONTACT_TYPES = ['LEAD', 'CLIENT', 'INVESTOR', 'VENDOR']
const typeBadge = { LEAD: 'bg-accent/10 text-accent', CLIENT: 'bg-base-200 text-secondary', INVESTOR: 'bg-warning/10 text-warning', VENDOR: 'bg-base-200 text-secondary' }

function ContactForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? contactsApi.update(defaultValues.id, data) : contactsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contacts'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nombre" required error={errors.firstName?.message}>
          <input {...register('firstName', { required: 'El nombre es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Jane" />
        </FormField>
        <FormField label="Apellido" required error={errors.lastName?.message}>
          <input {...register('lastName', { required: 'El apellido es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Doe" />
        </FormField>
      </div>
      <FormField label="Email" error={errors.email?.message}>
        <input {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' } })} type="email" className="input input-sm w-full bg-base-100 border-base-300" placeholder="jane@example.com" />
      </FormField>
      <FormField label="Teléfono" error={errors.phone?.message}>
        <input {...register('phone')} className="input input-sm w-full bg-base-100 border-base-300" placeholder="+1 555 000 0000" />
      </FormField>
      <FormField label="Tipo" required error={errors.type?.message}>
        <select {...register('type', { required: 'El tipo es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <FormField label="Fuente del Lead" error={errors.leadSource?.message}>
        <input {...register('leadSource')} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Referral, Website…" />
      </FormField>
      <FormField label="Puntuación de Intención (0-100)" error={errors.intentScore?.message}>
        <input {...register('intentScore', { min: { value: 0, message: 'Mínimo 0' }, max: { value: 100, message: 'Máximo 100' }, valueAsNumber: true })} type="number" className="input input-sm w-full bg-base-100 border-base-300" placeholder="75" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Contacto'}</button>
      </div>
    </form>
  )
}

export default function LeadIntentDashboard() {
  const [page, setPage] = useState(1)
  const [typeFilter, setType] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const qc = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', page, typeFilter],
    queryFn: () => contactsApi.list({ page, limit: 15, type: typeFilter }),
  })
  const deleteMutation = useMutation({ mutationFn: (id) => contactsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }) })
  const contacts = data?.data ?? []
  const meta = data?.meta
  const kpis = [
    { titulo: 'Total Contactos', valor: meta?.total ?? '—', icon: Users },
    { titulo: 'Score Promedio', valor: contacts.length ? Math.round(contacts.reduce((s, c) => s + (c.intentScore ?? 0), 0) / contacts.length) : '—', icon: Eye },
    { titulo: 'Alto Intento (>80)', valor: contacts.filter((c) => (c.intentScore ?? 0) > 80).length, icon: Flame },
    { titulo: 'Página', valor: `${page} / ${meta?.totalPages ?? 1}`, icon: MapPin },
  ]
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Directorio de Contactos y Leads</h1>
          <p className="text-sm text-secondary mt-0.5">Índice global · Clasificación por intención de compra</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Nuevo Contacto</button>
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
        <select value={typeFilter} onChange={(e) => { setType(e.target.value); setPage(1) }} className="select select-sm bg-base-100 border-base-300 font-mono-crm text-xs">
          <option value="">Todos los Tipos</option>
          {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Tipo', 'Email', 'Teléfono', 'Score', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={6} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={6} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar contactos</td></tr>}
              {contacts.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-base-200 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${typeBadge[c.type] ?? 'bg-base-200 text-secondary'}`}>{c.type}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    {c.intentScore != null && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-base-300 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${c.intentScore}%` }} /></div>
                        <span className="font-mono-crm text-[10px] text-primary">{c.intentScore}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setModal({ mode: 'edit', contact: c }) }} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm('¿Eliminar contacto?')) deleteMutation.mutate(c.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-base-100 h-full shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-base-300 bg-base-200 flex justify-between items-start">
              <div><h2 className="font-display font-semibold text-sm text-primary">{selected.firstName} {selected.lastName}</h2></div>
              <button onClick={() => setSelected(null)} className="btn btn-ghost btn-xs btn-circle">✕</button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {[['Email', selected.email], ['Teléfono', selected.phone], ['Fuente', selected.leadSource], ['Score', selected.intentScore], ['Creado', selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : null]].map(([k, v]) => v != null && <div key={k}><div className="font-mono-crm text-[9px] uppercase text-secondary mb-0.5">{k}</div><div className="font-display text-xs text-primary">{String(v)}</div></div>)}
            </div>
          </div>
        </div>
      )}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Contacto' : 'Nuevo Contacto'}>
        <ContactForm defaultValues={modal?.contact} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
