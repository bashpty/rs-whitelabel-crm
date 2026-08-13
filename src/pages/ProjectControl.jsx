import { useState } from 'react'
import { Plus, Filter, MapPin, MoreVertical, Lock, ExternalLink } from 'lucide-react'

const proyectos = [
  {
    id: 'PRJ-001',
    nombre: 'Aura Residences – Torre A',
    ubicacion: 'Dubai Marina',
    estado: 'En Construcción',
    estadoColor: 'text-accent',
    estadoDot: 'bg-accent',
    masterplan: 'Masterplan V3.2',
    unidades: [
      { id: '#PH-401', tipo: 'Penthouse Suite',  precio: '$4,250,000', estado: 'DISPONIBLE', estadoColor: 'text-accent' },
      { id: '#40-12A', tipo: 'Esquina 3 Hab.',   precio: '$1,850,000', estado: 'RESERVADA / Exp: 48h', estadoColor: 'text-warning', reservada: true },
      { id: '#39-01',  tipo: 'Estándar 2 Hab.',  precio: '$1,100,000', estado: 'VENDIDA', estadoColor: 'text-error', vendida: true },
      { id: '#38-06',  tipo: 'Studio Luxury',    precio: '$780,000',   estado: 'DISPONIBLE', estadoColor: 'text-accent' },
    ],
  },
  {
    id: 'PRJ-002',
    nombre: 'The Vertex Estate',
    ubicacion: 'Ginebra, Suiza',
    estado: 'Pre-construcción',
    estadoColor: 'text-info',
    estadoDot: 'bg-info',
    masterplan: 'Fase Conceptual',
    unidades: [],
    locked: true,
  },
  {
    id: 'PRJ-003',
    nombre: 'Pinnacle Tower – Fase II',
    ubicacion: 'Manhattan, NY',
    estado: 'Planificación',
    estadoColor: 'text-secondary',
    estadoDot: 'bg-secondary',
    masterplan: 'Masterplan V1.0',
    unidades: [
      { id: '#FL-10A', tipo: 'Oficina Premium', precio: '$3,100,000', estado: 'DISPONIBLE', estadoColor: 'text-accent' },
      { id: '#FL-10B', tipo: 'Oficina Estándar', precio: '$1,900,000', estado: 'DISPONIBLE', estadoColor: 'text-accent' },
    ],
  },
]

const estadoUnitBg = {
  'DISPONIBLE': 'bg-base-200',
  'VENDIDA': 'bg-base-200 opacity-60',
}

export default function ProjectControl() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Control de Desarrollo
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Proyectos macro · Inventario de unidades espaciales · Estatus de avance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost border border-base-300 font-display gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5">
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* ── Projects Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {proyectos.map((p) => (
          <article
            key={p.id}
            className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Project Header */}
            <div className="p-4 border-b border-base-300 bg-base-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`flex items-center gap-1.5 font-mono-crm text-[10px] uppercase tracking-wider font-medium ${p.estadoColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.estadoDot} ${p.estado === 'En Construcción' ? 'animate-pulse' : ''}`} />
                      {p.estado}
                    </span>
                    <span className="font-mono-crm text-[9px] text-secondary bg-base-300 px-2 py-0.5 rounded">{p.masterplan}</span>
                  </div>
                  <h2 className="font-display font-semibold text-base text-primary leading-tight">{p.nombre}</h2>
                  <div className="flex items-center gap-1 mt-1 text-secondary">
                    <MapPin className="w-3 h-3" />
                    <span className="font-mono-crm text-[10px]">{p.ubicacion}</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-xs btn-circle">
                  <MoreVertical className="w-3.5 h-3.5 text-secondary" />
                </button>
              </div>
            </div>

            {/* Unit Inventory */}
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-xs text-primary uppercase tracking-wider">Inventario de Unidades</h3>
                <button className="flex items-center gap-1 font-mono-crm text-[10px] text-accent hover:underline">
                  {p.locked ? 'Mapa Espacial' : 'Ver Masterplan'}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {p.locked ? (
                <div className="border border-dashed border-base-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                  <Lock className="w-8 h-8 text-base-300 mb-2" />
                  <h4 className="font-display font-semibold text-xs text-primary mb-1">Pre-ventas Bloqueadas</h4>
                  <p className="font-mono-crm text-[10px] text-secondary max-w-xs leading-relaxed">
                    Asignación de unidades restringida pendiente de aprobaciones municipales.
                  </p>
                  <button className="btn btn-xs btn-ghost border border-base-300 font-display mt-3">
                    Solicitar Acceso Anticipado
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {p.unidades.map((u) => (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-2.5 border border-base-300 rounded transition-colors hover:border-accent/30 ${u.vendida ? 'opacity-60 bg-base-200' : 'bg-base-100'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono-crm text-[10px] px-2 py-0.5 rounded ${u.vendida ? 'bg-base-300 text-secondary line-through' : 'bg-base-200 text-primary'}`}>
                          {u.id}
                        </span>
                        <span className="font-display text-xs text-primary">{u.tipo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-display font-semibold text-xs text-primary">{u.precio}</div>
                          <div className={`font-mono-crm text-[9px] ${u.estadoColor}`}>{u.estado}</div>
                        </div>
                        {u.vendida ? (
                          <button disabled className="btn btn-ghost btn-xs btn-circle opacity-40">
                            <Lock className="w-3 h-3" />
                          </button>
                        ) : (
                          <button className="btn btn-ghost btn-xs btn-circle">
                            <MoreVertical className="w-3.5 h-3.5 text-secondary" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {p.unidades.length === 0 && (
                    <div className="text-center py-6">
                      <span className="font-mono-crm text-[10px] text-secondary">Sin unidades registradas</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-base-300 bg-base-200 flex justify-between items-center">
              <span className="font-mono-crm text-[9px] text-secondary">{p.id}</span>
              {!p.locked && (
                <div className="flex items-center gap-3">
                  <span className="font-mono-crm text-[9px] text-accent">
                    {p.unidades.filter((u) => u.estado === 'DISPONIBLE').length} disponibles
                  </span>
                  <span className="font-mono-crm text-[9px] text-error">
                    {p.unidades.filter((u) => u.vendida).length} vendidas
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
