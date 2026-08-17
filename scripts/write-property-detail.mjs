import { writeFileSync } from 'fs'
import { join } from 'path'

const pages = join(import.meta.dirname, '..', 'src', 'pages')

writeFileSync(join(pages, 'PropertyDetail.jsx'), `
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, MapPin, Maximize2, Layers, Phone, Mail,
  Calendar, ChevronRight, Compass, CheckCircle2,
  DollarSign, TrendingUp, FileText, Map, Wifi, AlertCircle,
} from 'lucide-react'
import { propertiesApi, spatialNodesApi, documentsApi } from '../lib/api.js'

const fmt = (v) => v != null ? '$' + new Intl.NumberFormat('en-US').format(v) : '—'

const tourBadgeClass = {
  SYNCED:  'badge-success text-success-content',
  SYNCING: 'badge-warning text-warning-content',
  PENDING: 'badge-ghost text-secondary',
}

const tourLabel = { SYNCED: 'Sincronizado GSV', SYNCING: 'Sincronizando…', PENDING: 'Pendiente GSV' }

export default function PropertyDetail() {
  const { id } = useParams()
  const [tab, setTab]   = useState('resumen')
  const [nombre, setNombre]   = useState('')
  const [email, setEmail]     = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

  const { data: pData, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.get(id),
    enabled: !!id,
  })
  const { data: nodesData } = useQuery({
    queryKey: ['spatial-nodes', id],
    queryFn: () => spatialNodesApi.list({ propertyId: id, limit: 100 }),
    enabled: !!id,
  })
  const { data: docsData } = useQuery({
    queryKey: ['documents-property', id],
    queryFn: () => documentsApi.list({ limit: 50 }),
    enabled: !!id,
  })

  const property = pData?.data
  const nodes    = nodesData?.data ?? []
  const docs     = docsData?.data ?? []
  const fin      = property?.financials ?? {}

  if (isLoading) {
    return <div className="flex items-center justify-center h-96 font-mono-crm text-xs text-secondary">Cargando propiedad…</div>
  }
  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-secondary font-mono-crm text-sm">Propiedad no encontrada.</p>
        <Link to="/portafolio" className="btn btn-accent btn-sm font-display">Volver al Portafolio</Link>
      </div>
    )
  }

  const tourStatus = property.spatialTourStatus ?? 'PENDING'
  const hasTour    = !!property.gsvUrl && tourStatus === 'SYNCED'

  return (
    <div className="space-y-0 -mt-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Link to="/portafolio" className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors font-display">
          <ArrowLeft className="w-4 h-4" /> Portafolio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-base-300" />
        <span className="text-sm font-display font-medium text-primary">{property.title}</span>
        {property.mlsId && (
          <span className="font-mono-crm text-[10px] text-secondary bg-base-200 px-2 py-0.5 rounded">{property.mlsId}</span>
        )}
        <span className={\`badge badge-sm font-mono-crm text-[10px] \${tourBadgeClass[tourStatus]}\`}>{tourLabel[tourStatus]}</span>
      </div>

      {/* Tour Viewport */}
      <div className="relative w-full bg-primary rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {hasTour ? (
          <iframe
            src={\`\${property.gsvUrl}?logo=0&info=1&fs=1&vr=0&sd=1&initload=0&thumbs=1\`}
            title={\`Tour virtual — \${property.title}\`}
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0"
            allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Wifi className="w-12 h-12 text-primary-content/30" />
            <p className="text-primary-content/60 font-display text-sm">
              {tourStatus === 'SYNCING' ? 'Tour sincronizando — disponible en breve' : 'Tour virtual no configurado'}
            </p>
            {tourStatus === 'PENDING' && (
              <Link to="/ingestion-espacial" className="btn btn-accent btn-sm font-display">Iniciar Ingestión Espacial</Link>
            )}
          </div>
        )}

        {/* Top-right overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
            <Compass className="w-5 h-5 text-white/80" />
          </div>
          {hasTour && (
            <div className="bg-black/40 backdrop-blur-sm rounded-full flex items-center gap-1.5 px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono-crm text-[10px] text-white/90 tracking-wide">Tour Verificado GSV</span>
            </div>
          )}
        </div>

        {/* Spatial hotspot (decorative) */}
        {hasTour && nodes.length > 0 && (
          <div className="absolute top-1/3 left-1/4 z-10">
            <div className="relative group">
              <button className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-content text-[10px] font-bold">+</span>
              </button>
              <div className="absolute left-9 top-0 bg-black/60 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="font-mono-crm text-[10px] text-white/90">Nodo {nodes[0].nodeId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom dock */}
        {hasTour && nodes.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-3">
              <select className="select select-xs bg-white/10 text-white border-white/20 font-display text-[12px] min-w-[160px] focus:outline-none">
                {nodes.map((n) => <option key={n.id} value={n.id} className="text-primary bg-base-100">Nodo {n.stepIndex + 1}</option>)}
              </select>
              <div className="h-4 w-px bg-white/20" />
              <button className="btn btn-xs btn-ghost text-white/70 hover:text-white gap-1 font-mono-crm text-[10px]">
                <Map className="w-3.5 h-3.5" /> Plano
              </button>
              <button className="btn btn-xs btn-ghost text-white/70 hover:text-white gap-1 font-mono-crm text-[10px]">
                <Maximize2 className="w-3.5 h-3.5" /> Pantalla Completa
              </button>
            </div>
          </div>
        )}

        {/* Title overlay bottom-left */}
        {hasTour && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-16 pt-8 pointer-events-none">
            <div className="font-display font-bold text-white text-sm uppercase tracking-wider">
              {property.title}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 pt-5">
        {/* Left — Tabs */}
        <div className="space-y-0">
          <div className="mb-4">
            <h1 className="text-xl font-display font-semibold text-primary leading-tight">{property.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {(property.latitude && property.longitude) && (
                <>
                  <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <span className="font-mono-crm text-xs text-secondary">{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</span>
                </>
              )}
              <span className="badge badge-outline badge-sm text-secondary border-base-300 text-[11px]">{property.propertyType ?? '—'}</span>
            </div>
          </div>

          <div role="tablist" className="tabs tabs-lifted">
            {[
              { id: 'resumen',    label: 'Resumen' },
              { id: 'financiero', label: 'Financiero' },
              { id: 'plano',      label: 'Plano & Nodos' },
              { id: 'documentos', label: 'Documentos' },
            ].map((t) => (
              <button key={t.id} role="tab" onClick={() => setTab(t.id)}
                className={\`tab font-display text-sm \${tab === t.id ? 'tab-active text-primary border-b-2 border-accent' : 'text-secondary'}\`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-base-100 border border-base-300 border-t-0 rounded-b-lg p-5">
            {/* Resumen */}
            {tab === 'resumen' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Layers, label: 'Tipo', val: property.propertyType ?? '—' },
                    { icon: DollarSign, label: 'Valoración', val: fmt(property.valuation) },
                    { icon: Layers, label: 'Nodos Tour', val: nodes.length || '—' },
                    { icon: MapPin, label: 'Estado', val: property.status ?? '—' },
                    { icon: TrendingUp, label: 'Moneda', val: property.currency ?? 'USD' },
                    { icon: CheckCircle2, label: 'GSV', val: tourLabel[tourStatus] },
                  ].map((d) => (
                    <div key={d.label} className="bg-base-200 rounded-lg p-3 flex items-center gap-2">
                      <d.icon className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div>
                        <div className="font-display font-semibold text-primary text-sm">{d.val}</div>
                        <div className="font-mono-crm text-[9px] text-secondary uppercase">{d.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {property.gsvUrl && (
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono-crm text-[9px] uppercase text-secondary">URL del Tour Virtual</div>
                      <a href={property.gsvUrl} target="_blank" rel="noopener noreferrer"
                        className="font-mono-crm text-[10px] text-accent truncate block hover:underline">
                        {property.gsvUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Financiero */}
            {tab === 'financiero' && (
              <div className="space-y-4">
                {Object.keys(fin).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(fin).map(([k, v]) => (
                      <div key={k} className="bg-base-200 rounded-lg p-3">
                        <div className="font-mono-crm text-[9px] text-secondary uppercase tracking-wider mb-1">{k}</div>
                        <div className="font-display font-bold text-primary text-base">
                          {typeof v === 'number' ? fmt(v) : String(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary font-mono-crm text-xs">
                    Sin datos financieros. Edite la propiedad para agregar proyecciones.
                  </div>
                )}
              </div>
            )}

            {/* Plano & Nodos */}
            {tab === 'plano' && (
              <div className="space-y-4">
                {nodes.length === 0 ? (
                  <div className="bg-base-200 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-base-300">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="font-display text-sm text-secondary">Sin nodos espaciales configurados</p>
                      <Link to="/ingestion-espacial" className="btn btn-accent btn-xs mt-3 font-display">Ingesta Espacial</Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-sm text-primary">Nodos Configurados</h3>
                      <span className="font-mono-crm text-[10px] text-secondary">{nodes.length} nodos</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {nodes.map((n, i) => (
                        <div key={n.id} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                          <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                          <span className="font-mono-crm text-[11px] text-primary truncate">{n.nodeId}</span>
                          <span className="font-mono-crm text-[9px] text-secondary ml-auto">S-{String(n.stepIndex).padStart(2,'0')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Documentos */}
            {tab === 'documentos' && (
              <div className="space-y-2">
                {docs.length === 0 ? (
                  <p className="text-center py-8 font-mono-crm text-xs text-secondary">Sin documentos vinculados a esta propiedad.</p>
                ) : (
                  docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                        <div>
                          <div className="font-display text-sm text-primary">{doc.title}</div>
                          <div className="font-mono-crm text-[9px] text-secondary uppercase">{doc.type}</div>
                        </div>
                      </div>
                      {doc.documentUrl && (
                        <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer"
                          className="btn btn-ghost btn-xs text-accent font-mono-crm text-[10px]">Ver →</a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Info Card */}
        <div className="lg:sticky lg:top-0 self-start space-y-4">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-5 gap-4">
              <div>
                <div className="font-display font-bold text-2xl text-primary">{fmt(property.valuation)}</div>
                {fin.tasaCap != null && fin.noi != null && (
                  <div className="font-mono-crm text-[10px] text-accent mt-0.5">
                    Tasa Cap {fin.tasaCap}% · NOI {fmt(fin.noi)}/año
                  </div>
                )}
              </div>
              <div className="divider my-0 before:bg-base-300 after:bg-base-300" />
              <button className="btn btn-accent w-full font-display font-semibold gap-2">
                <Calendar className="w-4 h-4" /> Agendar Tour Privado
              </button>
              <button className="btn btn-outline w-full font-display gap-2">
                <Phone className="w-4 h-4" /> Llamar al Agente
              </button>
              <div className="divider my-0 before:bg-base-300 after:bg-base-300">
                <span className="font-mono-crm text-[10px] text-secondary">o enviar consulta</span>
              </div>
              <div className="space-y-2">
                <input type="text" placeholder="Tu nombre completo" className="input input-sm input-bordered w-full font-display" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input type="email" placeholder="Correo electrónico" className="input input-sm input-bordered w-full font-display" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="tel" placeholder="Teléfono" className="input input-sm input-bordered w-full font-display" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                <textarea placeholder="Mensaje o consulta..." className="textarea textarea-bordered w-full text-sm font-display resize-none h-20" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
                <button className="btn btn-primary w-full font-display text-sm">Enviar Consulta</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 p-4">
            <div className="font-mono-crm text-[9px] text-secondary uppercase tracking-widest mb-2">Datos del Activo</div>
            {[
              ['ID', property.id?.slice(0, 8) + '…'],
              ['MLS ID', property.mlsId],
              ['Listado', property.createdAt ? new Date(property.createdAt).toLocaleDateString() : null],
              ['Tipo', property.propertyType],
              ['Nodos Espaciales', nodes.length || null],
              ['Coordenadas', property.latitude && property.longitude ? \`\${property.latitude.toFixed(4)}, \${property.longitude.toFixed(4)}\` : null],
            ].filter(([, v]) => v != null).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-base-200 last:border-0">
                <span className="font-mono-crm text-[10px] text-secondary">{k}</span>
                <span className="font-mono-crm text-[10px] text-primary font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
`.trimStart())

console.log('PropertyDetail.jsx written')
