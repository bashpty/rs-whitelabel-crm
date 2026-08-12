import { useState } from 'react'
import { transacciones, etapasKanban, kpiTransacciones, estadoDocConfig } from '../data/transactions.js'
import { DollarSign, Activity, CheckCircle, BarChart3, ChevronRight, X, FileText } from 'lucide-react'

const fmt = (v) => '$' + new Intl.NumberFormat('en-US').format(v)

export default function TransactionPipeline() {
  const [seleccionada, setSeleccionada] = useState(null)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Pipeline de Transacciones
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Seguimiento de deals activos · Kanban por etapa de cierre
          </p>
        </div>
        <button className="btn btn-accent btn-sm font-display flex-shrink-0 gap-1.5">
          <ChevronRight className="w-4 h-4" />
          Nueva Transacción
        </button>
      </div>

      {/* ── KPI Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { titulo: 'Volumen Total Pipeline', valor: fmt(kpiTransacciones.volumenTotal),    desc: 'Todas las etapas',     icon: DollarSign },
          { titulo: 'Transacciones Activas',  valor: kpiTransacciones.transaccionesActivas, desc: 'En proceso activo',    icon: Activity },
          { titulo: 'Cerradas Este Trimestre',valor: kpiTransacciones.cerradasTrimestre,    desc: 'Q1 2024',              icon: CheckCircle },
          { titulo: 'Valor Promedio Deal',     valor: fmt(kpiTransacciones.valorPromedio),   desc: 'Por transacción',      icon: BarChart3 },
        ].map((k) => (
          <div key={k.titulo} className="stat bg-base-100 border border-base-300 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary leading-tight">
                {k.titulo}
              </div>
              <k.icon className="w-4 h-4 text-secondary flex-shrink-0" />
            </div>
            <div className="stat-value font-display text-xl text-primary mt-1 leading-tight">{k.valor}</div>
            <div className="stat-desc font-mono-crm text-[10px] text-accent mt-0.5">{k.desc}</div>
          </div>
        ))}
      </div>

      {/* ── Kanban Board ───────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-3">
        {etapasKanban.map((etapa) => {
          const items = transacciones.filter((t) => t.etapa === etapa.id)
          return (
            <div key={etapa.id} className="flex-shrink-0 w-64">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`badge ${etapa.colorClase} badge-sm font-mono-crm text-[10px]`}>
                    {etapa.label}
                  </span>
                </div>
                <span className="font-mono-crm text-[10px] text-secondary bg-base-200 px-1.5 py-0.5 rounded">
                  {items.length}
                </span>
              </div>

              <div className={`rounded-lg p-2 min-h-[120px] space-y-3 ${etapa.bgClase} border border-base-300`}>
                {items.map((trx) => (
                  <button
                    key={trx.id}
                    onClick={() => setSeleccionada(trx)}
                    className="kanban-card w-full text-left bg-base-100 rounded-lg p-3 border border-base-300 card-gold"
                  >
                    <div className="font-display font-semibold text-[12px] text-primary leading-tight">
                      {trx.nombrePropiedad}
                    </div>
                    <div className="font-mono-crm text-[9px] text-secondary mt-0.5">{trx.id}</div>

                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-mono-crm text-[10px] text-secondary">Comprador</span>
                        <span className="font-mono-crm text-[10px] text-primary font-medium truncate max-w-[100px]">
                          {trx.comprador}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono-crm text-[10px] text-secondary">Valor</span>
                        <span className="font-mono-crm text-[10px] text-accent font-medium">
                          {fmt(trx.valorOferta || trx.valorListado)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between mb-0.5">
                        <span className="font-mono-crm text-[9px] text-secondary">Progreso</span>
                        <span className="font-mono-crm text-[9px] text-accent">{trx.progreso}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${trx.progreso}%` }}
                        />
                      </div>
                    </div>

                    {trx.fechaCierreEstimado && (
                      <div className="mt-2 font-mono-crm text-[9px] text-secondary">
                        Cierre est.: {trx.fechaCierreEstimado}
                      </div>
                    )}
                  </button>
                ))}

                {items.length === 0 && (
                  <div className="flex items-center justify-center h-20">
                    <span className="font-mono-crm text-[10px] text-secondary/50">Sin transacciones</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Detail Drawer ──────────────────────────────── */}
      {seleccionada && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setSeleccionada(null)} />
          <div className="relative w-full max-w-md bg-base-100 h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-base-300 bg-base-200 flex-shrink-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display font-semibold text-base text-primary leading-tight">
                    {seleccionada.nombrePropiedad}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono-crm text-[10px] text-secondary">{seleccionada.id}</span>
                    <span className={`badge ${etapasKanban.find((e) => e.id === seleccionada.etapa)?.colorClase} badge-sm font-mono-crm text-[10px]`}>
                      {etapasKanban.find((e) => e.id === seleccionada.etapa)?.label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSeleccionada(null)} className="btn btn-ghost btn-sm btn-circle flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono-crm text-[10px] text-secondary uppercase">Progreso Global</span>
                  <span className="font-mono-crm text-[10px] text-accent font-medium">{seleccionada.progreso}%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${seleccionada.progreso}%` }}
                  />
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-sm text-primary">Partes Involucradas</h3>
                {[
                  { label: 'Comprador',  val: seleccionada.comprador, sub: seleccionada.empresaCompradora },
                  { label: 'Vendedor',   val: seleccionada.vendedor, sub: null },
                  { label: 'Agente',     val: seleccionada.agente,   sub: 'LUX-SPATIAL CRM' },
                ].map((p) => (
                  <div key={p.label} className="flex justify-between p-3 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-mono-crm text-[9px] text-secondary uppercase">{p.label}</div>
                      <div className="font-display font-semibold text-sm text-primary">{p.val}</div>
                      {p.sub && <div className="font-mono-crm text-[10px] text-secondary">{p.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial */}
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-sm text-primary">Financiero</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: 'Precio de Lista',  v: fmt(seleccionada.valorListado) },
                    { k: 'Oferta Realizada', v: seleccionada.valorOferta ? fmt(seleccionada.valorOferta) : 'Pendiente' },
                    { k: 'Descuento',        v: seleccionada.valorOferta
                      ? `${(((seleccionada.valorListado - seleccionada.valorOferta) / seleccionada.valorListado) * 100).toFixed(1)}%`
                      : '—'
                    },
                    { k: 'Fecha Cierre Est.', v: seleccionada.fechaCierreEstimado || 'TBD' },
                  ].map(({ k, v }) => (
                    <div key={k} className="bg-base-200 rounded-lg p-2.5">
                      <div className="font-mono-crm text-[9px] text-secondary uppercase">{k}</div>
                      <div className="font-display font-semibold text-sm text-primary mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              {seleccionada.documentos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-sm text-primary">Documentación</h3>
                  {seleccionada.documentos.map((doc) => (
                    <div key={doc.nombre} className="flex items-center justify-between p-2.5 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span className="font-body text-xs text-primary">{doc.nombre}</span>
                      </div>
                      <span className={`badge ${estadoDocConfig[doc.estado].clase} badge-xs font-mono-crm text-[9px]`}>
                        {estadoDocConfig[doc.estado].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {seleccionada.notas && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                  <div className="font-mono-crm text-[9px] text-secondary uppercase mb-1">Notas del Agente</div>
                  <p className="font-body text-xs text-primary leading-relaxed">{seleccionada.notas}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-base-300 flex gap-2 flex-shrink-0">
              <button className="btn btn-primary btn-sm flex-1 font-display">Actualizar Etapa</button>
              <button className="btn btn-accent btn-sm flex-1 font-display">Ver Propiedad</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
