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
        <input {...register('documentUrl', { required: 'La URL es obligatoria', pattern: { value: /^https?:\/\//i, message: 'URL inválida (debe comenzar con http/https)' } })} className="input input-sm w-full bg-base-100 border-base-300" placeholder="https://storage.example.com/doc.pdf" />
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
                  <td className="px-4 py-3"><span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${typeBadge[d.type] ?? 'bg-base-200 text-secondary'}`}>{d.type ?? '—'}</span></td>
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
