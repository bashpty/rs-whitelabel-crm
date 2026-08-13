import { useState } from 'react'
import { Plus, Filter, Calendar, AlertTriangle, ChevronRight, User, Badge, MessageSquare } from 'lucide-react'

const diasCalendario = [
  { mes: 'OCT', dia: '24', activo: true, eventos: 2 },
  { mes: 'OCT', dia: '25', activo: false, eventos: 1 },
  { mes: 'OCT', dia: '26', activo: false, eventos: 0 },
  { mes: 'OCT', dia: '27', activo: false, eventos: 3 },
  { mes: 'OCT', dia: '28', activo: false, eventos: 1 },
]

const visitas = [
  {
    id: 'V-001',
    hora: '10:00 AM – 11:30 AM',
    estado: 'PROGRAMADA',
    estadoClase: 'bg-accent/10 text-accent',
    propiedad: 'Penthouse en The Spire, Piso 88',
    cliente: 'Eleanor Vance (Lead)',
    agente: 'M. Sterling',
    completada: false,
    feedback: null,
  },
  {
    id: 'V-002',
    hora: '08:30 AM – 09:15 AM',
    estado: 'COMPLETADA',
    estadoClase: 'bg-base-200 text-secondary',
    propiedad: '2400 Grand Ave, Suite 400',
    cliente: 'James Harmon',
    agente: 'S. Chen',
    completada: true,
    feedback: '"Las vistas son excepcionales, pero preocupado por el ruido del HVAC en la sala de reuniones secundaria. Solicita especificaciones técnicas."',
  },
  {
    id: 'V-003',
    hora: '02:00 PM – 03:00 PM',
    estado: 'PROGRAMADA',
    estadoClase: 'bg-accent/10 text-accent',
    propiedad: 'One Vanderbilt – Oficina Floor 42',
    cliente: 'Meridian Capital Group',
    agente: 'A. Müller',
    completada: false,
    feedback: null,
  },
]

const solicitudesMantenimiento = [
  {
    id: 'MR-009',
    titulo: 'Fallo de HVAC – Sala de Servidores',
    descripcion: 'Sistema de enfriamiento completamente fuera de servicio. Temperatura en aumento rápido.',
    prioridad: 'EMERGENCIA',
    estado: 'ABIERTA',
    propiedadId: '#8892-A',
    prioridadClase: 'bg-error text-error-content',
    estadoClase: 'text-error',
    borderColor: 'border-l-error',
  },
  {
    id: 'MR-007',
    titulo: 'Infiltración de Agua – Lobby',
    descripcion: 'Fuga menor detectada cerca de la entrada principal durante lluvia intensa. Plomero en sitio.',
    prioridad: 'ALTA',
    estado: 'EN PROGRESO',
    propiedadId: '#1024-C',
    prioridadClase: 'bg-warning/10 text-warning border border-warning/30',
    estadoClase: 'text-warning',
    borderColor: 'border-l-accent',
  },
  {
    id: 'MR-005',
    titulo: 'Pintura Desgastada – Corredor B',
    descripcion: 'Daño cosmético reportado por inquilino. Programado para retoque.',
    prioridad: 'BAJA',
    estado: 'RESUELTA',
    propiedadId: '#1024-C',
    prioridadClase: 'bg-base-200 text-secondary border border-base-300',
    estadoClase: 'text-secondary',
    borderColor: 'border-l-base-300',
    resuelta: true,
  },
]

export default function ViewingsMaintenance() {
  const [diaActivo, setDiaActivo] = useState(0)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Visitas y Operaciones de Campo
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Programación de visitas · Salud de activos · Solicitudes de mantenimiento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost border border-base-300 font-display gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5">
            <Plus className="w-4 h-4" />
            Nueva Visita
          </button>
        </div>
      </div>

      {/* ── Bento Layout ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ── Left: Calendar + Viewings ──────────────── */}
        <div className="xl:col-span-8 space-y-4">
          {/* Calendar Context */}
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between">
              <h2 className="font-display font-semibold text-sm text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Agenda de Visitas
              </h2>
              <div className="flex gap-1 bg-base-300 p-0.5 rounded">
                <button className="btn btn-xs bg-base-100 text-primary border-0 shadow-sm font-mono-crm">Día</button>
                <button className="btn btn-xs btn-ghost text-secondary font-mono-crm">Semana</button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2">
              {diasCalendario.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setDiaActivo(i)}
                  className={`min-w-[64px] p-2.5 rounded-lg border flex flex-col items-center transition-all ${
                    diaActivo === i
                      ? 'border-accent bg-accent/10 text-primary'
                      : 'border-base-300 hover:border-accent/30 text-secondary'
                  }`}
                >
                  <span className="font-mono-crm text-[9px] uppercase tracking-wider">{d.mes}</span>
                  <span className="font-display font-bold text-base">{d.dia}</span>
                  {d.eventos > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Viewings Timeline */}
            <div className="p-4 space-y-4">
              {visitas.map((v) => (
                <div key={v.id} className="relative pl-6">
                  <div className={`absolute left-1.5 top-2 w-2.5 h-2.5 rounded-full border-2 border-base-100 z-10 ${v.completada ? 'bg-secondary' : 'bg-accent'}`} />
                  {/* Connector line */}
                  <div className="absolute left-[13px] top-5 bottom-[-16px] w-px bg-base-300 last:hidden" />

                  <div className={`bg-base-100 border border-base-300 rounded-lg p-4 ${v.completada ? 'opacity-80 bg-base-200' : ''} hover:shadow-sm transition-shadow`}>
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono-crm text-[10px] font-medium text-primary">{v.hora}</span>
                          <span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${v.estadoClase}`}>
                            {v.estado}
                          </span>
                        </div>
                        <h3 className={`font-display font-semibold text-sm text-primary leading-tight mb-1.5 ${v.completada ? 'line-through text-secondary' : ''}`}>
                          {v.propiedad}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-secondary flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {v.cliente}
                          </span>
                          <span className="flex items-center gap-1">
                            <Badge className="w-3 h-3" />
                            Agente: {v.agente}
                          </span>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-xs btn-circle flex-shrink-0 self-start">
                        <ChevronRight className="w-3.5 h-3.5 text-secondary" />
                      </button>
                    </div>

                    {v.feedback && (
                      <div className="mt-3 p-3 bg-base-100 border border-base-300 rounded">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <MessageSquare className="w-3 h-3 text-accent" />
                          <span className="font-mono-crm text-[10px] text-primary font-medium uppercase tracking-wider">Feedback del Cliente</span>
                        </div>
                        <p className="text-xs text-secondary italic leading-relaxed">{v.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Asset Health / Maintenance ──────── */}
        <div className="xl:col-span-4">
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between">
              <h2 className="font-display font-semibold text-sm text-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Salud del Activo
              </h2>
              <span className="bg-base-200 border border-base-300 px-2 py-0.5 rounded font-mono-crm text-[10px] text-secondary">
                {solicitudesMantenimiento.filter((m) => !m.resuelta).length} Activas
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {solicitudesMantenimiento.map((m) => (
                <div
                  key={m.id}
                  className={`border border-base-300 rounded-lg p-3 relative overflow-hidden border-l-4 ${m.borderColor} ${m.resuelta ? 'opacity-60 bg-base-200' : 'bg-base-100'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${m.prioridadClase}`}>
                      {m.prioridad}
                    </span>
                    <span className={`font-mono-crm text-[10px] font-bold ${m.estadoClase}`}>{m.estado}</span>
                  </div>
                  <h4 className={`font-display font-semibold text-xs text-primary mb-1 ${m.resuelta ? 'line-through text-secondary' : ''}`}>
                    {m.titulo}
                  </h4>
                  <p className={`text-xs leading-relaxed mb-2 ${m.resuelta ? 'text-secondary/60' : 'text-secondary'}`}>
                    {m.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-base-300">
                    <span className="font-mono-crm text-[9px] text-secondary">ID: {m.propiedadId}</span>
                    {!m.resuelta && (
                      <button className={`font-mono-crm text-[10px] hover:underline ${m.prioridad === 'EMERGENCIA' ? 'text-error' : 'text-primary'}`}>
                        {m.prioridad === 'EMERGENCIA' ? 'Despachar Proveedor' : 'Ver Actualización'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-base-300 bg-base-200">
              <button className="w-full border border-base-300 text-secondary hover:text-primary hover:bg-base-100 transition-colors font-mono-crm text-[10px] py-2 rounded">
                Ver Registro Completo de Mantenimiento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
