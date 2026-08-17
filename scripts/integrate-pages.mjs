import { writeFileSync } from 'fs'
import { join } from 'path'

const pages = join(import.meta.dirname, '..', 'src', 'pages')

// ─── LeadIntentDashboard ────────────────────────────────────────────────────
writeFileSync(join(pages, 'LeadIntentDashboard.jsx'), `
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
        <input {...register('email', { pattern: { value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: 'Email inválido' } })} type="email" className="input input-sm w-full bg-base-100 border-base-300" placeholder="jane@example.com" />
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
    { titulo: 'Página', valor: \`\${page} / \${meta?.totalPages ?? 1}\`, icon: MapPin },
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${typeBadge[c.type] ?? 'bg-base-200 text-secondary'}\`}>{c.type}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    {c.intentScore != null && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-base-300 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: \`\${c.intentScore}%\` }} /></div>
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
`.trimStart())

// ─── TransactionPipeline ─────────────────────────────────────────────────────
writeFileSync(join(pages, 'TransactionPipeline.jsx'), `
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
    { titulo: 'Valor Total', valor: \`$\${totalValue.toLocaleString()}\`, icon: DollarSign },
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${statusBadge[d.status] ?? 'bg-base-200 text-secondary'}\`}>{d.status}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{d.value != null ? \`$\${Number(d.value).toLocaleString()}\` : '—'}</td>
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
`.trimStart())

// ─── PortfolioControlCenter ──────────────────────────────────────────────────
writeFileSync(join(pages, 'PortfolioControlCenter.jsx'), `
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Building2, Layers, MapPin, TrendingUp, Plus } from 'lucide-react'
import { portfoliosApi, propertiesApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const PROPERTY_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'MIXED_USE']
const statusColors = { AVAILABLE: 'text-success', UNDER_CONTRACT: 'text-warning', SOLD: 'text-error', LEASED: 'text-accent', OFF_MARKET: 'text-secondary' }

function PortfolioForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? portfoliosApi.update(defaultValues.id, data) : portfoliosApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['portfolios'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Nombre del Portafolio" required error={errors.name?.message}>
        <input {...register('name', { required: 'El nombre es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Portfolio Premium CDMX" />
      </FormField>
      <FormField label="Descripción" error={errors.description?.message}>
        <textarea {...register('description')} className="textarea textarea-sm w-full bg-base-100 border-base-300 h-20" placeholder="Descripción…" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Portafolio'}</button>
      </div>
    </form>
  )
}

function PropertyForm({ onSuccess, onClose, defaultValues, portfolios }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? propertiesApi.update(defaultValues.id, data) : propertiesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['properties'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="Nombre / Referencia" required error={errors.name?.message}>
        <input {...register('name', { required: 'El nombre es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Torre Reforma 401" />
      </FormField>
      <FormField label="Dirección" error={errors.address?.message}>
        <input {...register('address')} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Av. Reforma 123, CDMX" />
      </FormField>
      <FormField label="Tipo de Propiedad" error={errors.propertyType?.message}>
        <select {...register('propertyType')} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Precio (USD)" error={errors.price?.message}>
          <input {...register('price', { valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
        <FormField label="Metros Cuadrados" error={errors.areaSqft?.message}>
          <input {...register('areaSqft', { valueAsNumber: true })} type="number" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
      </div>
      {portfolios?.length > 0 && (
        <FormField label="Portafolio" error={errors.portfolioId?.message}>
          <select {...register('portfolioId')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Sin portafolio</option>
            {portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormField>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Crear Propiedad'}</button>
      </div>
    </form>
  )
}

export default function PortfolioControlCenter() {
  const [propPage, setPropPage] = useState(1)
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data: pfData, isLoading: pfLoading } = useQuery({ queryKey: ['portfolios'], queryFn: () => portfoliosApi.list({ limit: 50 }) })
  const { data: prData, isLoading: prLoading, isError: prError } = useQuery({
    queryKey: ['properties', propPage],
    queryFn: () => propertiesApi.list({ page: propPage, limit: 15 }),
  })
  const deleteProp = useMutation({ mutationFn: (id) => propertiesApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }) })
  const deletePf = useMutation({ mutationFn: (id) => portfoliosApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolios'] }) })

  const portfolios = pfData?.data ?? []
  const properties = prData?.data ?? []
  const prMeta = prData?.meta

  const kpis = [
    { titulo: 'Portafolios', valor: portfolios.length, icon: Layers },
    { titulo: 'Propiedades', valor: prMeta?.total ?? '—', icon: Building2 },
    { titulo: 'Valor Total', valor: \`$\${properties.reduce((s, p) => s + (p.price ?? 0), 0).toLocaleString()}\`, icon: TrendingUp },
    { titulo: 'Ciudades', valor: new Set(properties.map((p) => p.city).filter(Boolean)).size, icon: MapPin },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Centro de Control de Portafolio</h1>
          <p className="text-sm text-secondary mt-0.5">Activos inmobiliarios bajo gestión</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ mode: 'portfolio' })} className="btn btn-ghost btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Portafolio</button>
          <button onClick={() => setModal({ mode: 'property' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Propiedad</button>
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

      {/* Portfolios */}
      <div>
        <h2 className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary mb-2">Portafolios</h2>
        {pfLoading && <p className="text-xs text-secondary font-mono-crm">Cargando portafolios…</p>}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {portfolios.map((pf) => (
            <div key={pf.id} className="bg-base-100 border border-base-300 rounded-lg p-4 hover:border-accent/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="font-display font-medium text-sm text-primary">{pf.name}</div>
                <button onClick={() => { if (window.confirm('¿Eliminar portafolio?')) deletePf.mutate(pf.id) }} className="btn btn-ghost btn-xs text-error">✕</button>
              </div>
              {pf.description && <p className="font-mono-crm text-[10px] text-secondary mt-1 line-clamp-2">{pf.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200">
          <span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Propiedades</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Tipo', 'Ciudad', 'Precio', 'Estado', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {(prLoading) && <tr><td colSpan={6} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {prError && <tr><td colSpan={6} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar propiedades</td></tr>}
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{p.name}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{p.propertyType ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{p.city ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{p.price != null ? \`$\${Number(p.price).toLocaleString()}\` : '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] \${statusColors[p.status] ?? 'text-secondary'}">{p.status ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'editProperty', property: p })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar propiedad?')) deleteProp.mutate(p.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={prMeta} onPageChange={setPropPage} />
      </div>

      <Modal open={modal?.mode === 'portfolio'} onClose={() => setModal(null)} title="Nuevo Portafolio">
        <PortfolioForm onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal open={modal?.mode === 'property' || modal?.mode === 'editProperty'} onClose={() => setModal(null)} title={modal?.mode === 'editProperty' ? 'Editar Propiedad' : 'Nueva Propiedad'} size="lg">
        <PropertyForm defaultValues={modal?.property} portfolios={portfolios} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
`.trimStart())

// ─── CampaignManagement ───────────────────────────────────────────────────────
writeFileSync(join(pages, 'CampaignManagement.jsx'), `
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
    { titulo: 'Presupuesto Total', valor: \`$\${campaigns.reduce((s, c) => s + (c.budget ?? 0), 0).toLocaleString()}\`, icon: DollarSign },
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${typeBadge[c.type] ?? 'bg-base-200 text-secondary'}\`}>{c.type}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.status ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{c.budget != null ? \`$\${Number(c.budget).toLocaleString()}\` : '—'}</td>
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
`.trimStart())

// ─── Tasks ───────────────────────────────────────────────────────────────────
writeFileSync(join(pages, 'Tasks.jsx'), `
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${statusBadge[t.status] ?? 'bg-base-200 text-secondary'}\`}>{t.status}</span></td>
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
`.trimStart())

// ─── LeasingOccupancy ────────────────────────────────────────────────────────
writeFileSync(join(pages, 'LeasingOccupancy.jsx'), `
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
    { titulo: 'Renta Mensual Total', valor: \`$\${leases.filter((l) => l.status === 'ACTIVE').reduce((s, l) => s + (l.rentAmount ?? 0), 0).toLocaleString()}\`, icon: DollarSign },
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${statusBadge[l.status] ?? 'bg-base-200 text-secondary'}\`}>{l.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{l.rentAmount != null ? \`$\${Number(l.rentAmount).toLocaleString()}\` : '—'}</td>
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
`.trimStart())

// ─── DocumentVault ───────────────────────────────────────────────────────────
writeFileSync(join(pages, 'DocumentVault.jsx'), `
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { FolderOpen, FileText, Shield, Link, Plus } from 'lucide-react'
import { documentsApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const DOC_TYPES = ['CONTRACT', 'DISCLOSURE', 'TITLE', 'ID', 'LEASE', 'OFFER', 'OTHER']
const typeBadge = { CONTRACT: 'bg-accent/10 text-accent', DISCLOSURE: 'bg-warning/10 text-warning', TITLE: 'bg-primary/10 text-primary', ID: 'bg-base-200 text-secondary', LEASE: 'bg-success/10 text-success', OFFER: 'bg-error/10 text-error', OTHER: 'bg-base-200 text-secondary' }

function DocumentForm({ onSuccess, onClose, defaultValues }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues })
  const mutation = useMutation({
    mutationFn: (data) => defaultValues?.id ? documentsApi.patch(defaultValues.id, data) : documentsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); onSuccess?.() },
    onError: (e) => setError('root', { message: e.message }),
  })
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {errors.root && <div className="p-3 bg-error/10 border border-error/20 rounded text-xs text-error">{errors.root.message}</div>}
      <FormField label="ID del Deal (UUID)" required error={errors.dealId?.message}>
        <input {...register('dealId', { required: 'El deal es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300 font-mono-crm text-xs" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
      </FormField>
      <FormField label="Título del Documento" required error={errors.title?.message}>
        <input {...register('title', { required: 'El título es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Contrato de Compraventa" />
      </FormField>
      <FormField label="URL del Documento" required error={errors.documentUrl?.message}>
        <input {...register('documentUrl', { required: 'La URL es obligatoria', pattern: { value: /^https?:\\/\\//i, message: 'URL inválida (debe comenzar con http/https)' } })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="https://storage.example.com/doc.pdf" />
      </FormField>
      <FormField label="Tipo de Documento" required error={errors.type?.message}>
        <select {...register('type', { required: 'El tipo es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm font-display">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-sm font-display">{isSubmitting ? 'Guardando…' : defaultValues?.id ? 'Actualizar' : 'Subir Documento'}</button>
      </div>
    </form>
  )
}

export default function DocumentVault() {
  const [page, setPage] = useState(1)
  const [typeFilter, setType] = useState('')
  const [modal, setModal] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents', page, typeFilter],
    queryFn: () => documentsApi.list({ page, limit: 15, type: typeFilter }),
  })
  const deleteMutation = useMutation({ mutationFn: (id) => documentsApi.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }) })

  const documents = data?.data ?? []
  const meta = data?.meta

  const kpis = [
    { titulo: 'Total Documentos', valor: meta?.total ?? '—', icon: FileText },
    { titulo: 'Contratos', valor: documents.filter((d) => d.type === 'CONTRACT').length, icon: Shield },
    { titulo: 'Tipos Únicos', valor: new Set(documents.map((d) => d.type)).size, icon: FolderOpen },
    { titulo: 'Esta Página', valor: documents.length, icon: Link },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Bóveda de Documentos</h1>
          <p className="text-sm text-secondary mt-0.5">Repositorio legal seguro de documentos</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn btn-accent btn-sm font-display gap-1.5"><Plus className="w-4 h-4" /> Subir Documento</button>
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
          {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Título', 'Tipo', 'Deal ID', 'URL', ''].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {isLoading && <tr><td colSpan={5} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {isError && <tr><td colSpan={5} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar documentos</td></tr>}
              {documents.map((d) => (
                <tr key={d.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{d.title}</td>
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${typeBadge[d.type] ?? 'bg-base-200 text-secondary'}\`}>{d.type ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{d.dealId?.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    {d.documentUrl && <a href={d.documentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs font-mono-crm text-accent">Ver →</a>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', document: d })} className="btn btn-ghost btn-xs mr-1 font-mono-crm">Editar</button>
                    <button onClick={() => { if (window.confirm('¿Eliminar documento?')) deleteMutation.mutate(d.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Editar Documento' : 'Subir Documento'}>
        <DocumentForm defaultValues={modal?.document} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  )
}
`.trimStart())

// ─── ProjectControl ──────────────────────────────────────────────────────────
writeFileSync(join(pages, 'ProjectControl.jsx'), `
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${statusBadge[p.status] ?? 'bg-base-200 text-secondary'}\`}>{p.status ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{p.totalBudget != null ? \`$\${Number(p.totalBudget).toLocaleString()}\` : '—'}</td>
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
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{u.price != null ? \`$\${Number(u.price).toLocaleString()}\` : '—'}</td>
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
`.trimStart())

// ─── ViewingsMaintenance ─────────────────────────────────────────────────────
writeFileSync(join(pages, 'ViewingsMaintenance.jsx'), `
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${vBadge[v.status] ?? 'bg-base-200 text-secondary'}\`}>{v.status ?? '—'}</span></td>
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
                  <td className="px-4 py-3"><span className={\`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded \${mBadge[m.status] ?? 'bg-base-200 text-secondary'}\`}>{m.status ?? '—'}</span></td>
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
`.trimStart())

// ─── UsersRoles ───────────────────────────────────────────────────────────────
writeFileSync(join(pages, 'UsersRoles.jsx'), `
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserCog, Shield, Users, Key } from 'lucide-react'
import { usersApi, acpApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'

export default function UsersRoles() {
  const [uPage, setUPage] = useState(1)
  const [aPage, setAPage] = useState(1)

  const { data: uData, isLoading: uLoading } = useQuery({ queryKey: ['users', uPage], queryFn: () => usersApi.list({ page: uPage, limit: 15 }) })
  const { data: aData, isLoading: aLoading } = useQuery({ queryKey: ['acp', aPage], queryFn: () => acpApi.list({ page: aPage, limit: 15 }) })

  const users = uData?.data ?? []
  const acps = aData?.data ?? []

  const kpis = [
    { titulo: 'Total Usuarios', valor: uData?.meta?.total ?? '—', icon: Users },
    { titulo: 'Administradores', valor: users.filter((u) => u.role === 'ADMIN').length, icon: Shield },
    { titulo: 'Políticas de Acceso', valor: aData?.meta?.total ?? '—', icon: Key },
    { titulo: 'Roles Únicos', valor: new Set(users.map((u) => u.role).filter(Boolean)).size, icon: UserCog },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Usuarios y Roles</h1>
        <p className="text-sm text-secondary mt-0.5">Directorio de usuarios y control de acceso</p>
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
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Usuarios del Sistema</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Email', 'Rol', 'Creado'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {uLoading && <tr><td colSpan={4} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{u.firstName ?? ''} {u.lastName ?? ''}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.email ?? '—'}</td>
                  <td className="px-4 py-3"><span className="font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-base-200 text-secondary">{u.role ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={uData?.meta} onPageChange={setUPage} />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Políticas de Control de Acceso</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['ID', 'Rol', 'Recurso', 'Acciones'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {aLoading && <tr><td colSpan={4} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {acps.map((a) => (
                <tr key={a.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{a.id?.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{a.role ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{a.resource ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{Array.isArray(a.actions) ? a.actions.join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={aData?.meta} onPageChange={setAPage} />
      </div>
    </div>
  )
}
`.trimStart())

console.log('All pages written successfully!')
