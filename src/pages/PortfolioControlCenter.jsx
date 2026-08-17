import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Building2, Layers, MapPin, TrendingUp, Plus, Play } from 'lucide-react'
import { portfoliosApi, propertiesApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'
import Modal from '../components/ui/Modal.jsx'
import FormField from '../components/ui/FormField.jsx'

const PROPERTY_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'MIXED_USE']
const TOUR_STATUSES = ['PENDING', 'SYNCING', 'SYNCED']
const tourBadge = { PENDING: 'bg-base-200 text-secondary', SYNCING: 'bg-warning/10 text-warning', SYNCED: 'bg-success/10 text-success' }

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
      <FormField label="Título / Referencia" required error={errors.title?.message}>
        <input {...register('title', { required: 'El título es obligatorio' })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="Torre Reforma 401" />
      </FormField>
      <FormField label="Tipo de Propiedad" required error={errors.propertyType?.message}>
        <select {...register('propertyType', { required: 'El tipo es obligatorio' })} className="select select-sm w-full bg-base-100 border-base-300">
          <option value="">Seleccionar…</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Valuación (USD)" error={errors.valuation?.message}>
          <input {...register('valuation', { valueAsNumber: true, min: { value: 0, message: 'Debe ser positivo' } })} type="number" className="input input-sm w-full bg-base-100 border-base-300" />
        </FormField>
        <FormField label="MLS ID" error={errors.mlsId?.message}>
          <input {...register('mlsId')} className="input input-sm w-full bg-base-100 border-base-300" placeholder="LUX-001" />
        </FormField>
      </div>
      {portfolios?.length > 0 && (
        <FormField label="Portafolio" error={errors.portfolioId?.message}>
          <select {...register('portfolioId')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Sin portafolio</option>
            {portfolios.map((pf) => <option key={pf.id} value={pf.id}>{pf.name}</option>)}
          </select>
        </FormField>
      )}
      <div className="border-t border-base-300 pt-4 space-y-3">
        <div className="font-mono-crm text-[9px] uppercase tracking-widest text-secondary">Tour Virtual GSV</div>
        <FormField label="URL del Tour (Kuula / GSV)" error={errors.gsvUrl?.message} hint="Ej: https://kuula.co/share/...">
          <input
            {...register('gsvUrl', { pattern: { value: /^https?:\/\//i, message: 'URL inválida (debe comenzar con http/https)' } })}
            className="input input-sm w-full bg-base-100 border-base-300"
            placeholder="https://kuula.co/share/XXXXX"
          />
        </FormField>
        <FormField label="Estado de Sincronización GSV" error={errors.spatialTourStatus?.message}>
          <select {...register('spatialTourStatus')} className="select select-sm w-full bg-base-100 border-base-300">
            <option value="">Seleccionar…</option>
            {TOUR_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
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
    { titulo: 'Valor Total', valor: `$${properties.reduce((s, p) => s + (p.valuation ?? 0), 0).toLocaleString()}`, icon: TrendingUp },
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
            <thead><tr className="border-b border-base-300 bg-base-200">{['ID / Activo', 'Tipo', 'Valoración', 'Estado GSV', 'Acciones'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {prLoading && <tr><td colSpan={5} className="text-center py-12 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {prError && <tr><td colSpan={5} className="text-center py-12 text-error font-mono-crm text-xs">Error al cargar propiedades</td></tr>}
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-display font-semibold text-xs text-primary">{p.title ?? p.id?.slice(0, 8)}</div>
                    {p.mlsId && <div className="font-mono-crm text-[9px] text-secondary mt-0.5">{p.mlsId}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{p.propertyType ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary font-medium">{p.valuation != null ? `$${Number(p.valuation).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${tourBadge[p.spatialTourStatus] ?? 'bg-base-200 text-secondary'}`}>
                      {p.spatialTourStatus ?? 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/portafolio/${p.id}`}
                        className="btn btn-accent btn-xs font-mono-crm gap-1"
                      >
                        <Play className="w-3 h-3" /> Ver Tour
                      </Link>
                      <button onClick={() => setModal({ mode: 'editProperty', property: p })} className="btn btn-ghost btn-xs font-mono-crm">Editar</button>
                      <button onClick={() => { if (window.confirm('¿Eliminar propiedad?')) deleteProp.mutate(p.id) }} className="btn btn-ghost btn-xs text-error font-mono-crm">Eliminar</button>
                    </div>
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
