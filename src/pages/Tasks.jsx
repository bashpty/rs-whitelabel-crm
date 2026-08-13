import { useState } from 'react'
import { Plus, AlertTriangle, CheckSquare, Clock, ChevronRight } from 'lucide-react'

const tabs = [
  { id: 'HOY',       label: 'Hoy' },
  { id: 'PROXIMAS',  label: 'Próximas' },
  { id: 'VENCIDAS',  label: 'Vencidas', badge: 2 },
  { id: 'COMPLETADAS', label: 'Completadas' },
]

const tareas = [
  {
    id: 'T-001',
    titulo: 'Inspección Final: Penthouse 740 Park Ave',
    descripcion: 'Verificar que el escaneo espacial coincida con modificaciones del cliente antes del cierre.',
    tipo: 'Inspección',
    vencimiento: 'Oct 12, 10:00 AM',
    asignado: 'JD',
    estado: 'VENCIDAS',
    urgente: true,
  },
  {
    id: 'T-002',
    titulo: 'Revisión de Rendimientos Q3 con Sterling Trust',
    descripcion: 'Discutir los modelos 3D actualizados para la expansión de la cartera comercial.',
    tipo: 'Llamada Cliente',
    vencimiento: 'Hoy, 2:30 PM',
    asignado: 'JD',
    estado: 'HOY',
    urgente: false,
  },
  {
    id: 'T-003',
    titulo: 'Subir Escaneos LiDAR – 15 Central Park West',
    descripcion: 'Procesar datos de nube de puntos y mapear al ID de propiedad #9928.',
    tipo: 'Datos Espaciales',
    vencimiento: 'Hoy, 5:00 PM',
    asignado: 'SC',
    estado: 'HOY',
    urgente: false,
  },
  {
    id: 'T-004',
    titulo: 'Preparar Term Sheet – Globex Suite 250',
    descripcion: 'Redactar términos de renovación de arrendamiento para Globex Corporation.',
    tipo: 'Legal',
    vencimiento: 'Oct 15, 9:00 AM',
    asignado: 'AM',
    estado: 'PROXIMAS',
    urgente: false,
  },
  {
    id: 'T-005',
    titulo: 'Revisión de Oferta – Retail 101',
    descripcion: 'Analizar contraoferta de Bean Roasters y coordinar con legal.',
    tipo: 'Negociación',
    vencimiento: 'Oct 16, 3:00 PM',
    asignado: 'LT',
    estado: 'PROXIMAS',
    urgente: false,
  },
  {
    id: 'T-006',
    titulo: 'Actualizar Masterplan – Dubai Tower A',
    descripcion: 'Sincronizar cambios de unidades PH-401 con plano V3.2.',
    tipo: 'Datos Espaciales',
    vencimiento: 'Oct 10, 11:00 AM',
    asignado: 'MR',
    estado: 'VENCIDAS',
    urgente: true,
  },
  {
    id: 'T-007',
    titulo: 'Envío de NDA – Geneva Vertex',
    descripcion: 'Acuerdo de confidencialidad enviado y firmado por ambas partes.',
    tipo: 'Legal',
    vencimiento: 'Oct 8, 2:00 PM',
    asignado: 'SC',
    estado: 'COMPLETADAS',
    urgente: false,
  },
]

const coloresTipo = {
  'Inspección':     'bg-base-200 text-secondary',
  'Llamada Cliente':'bg-accent/10 text-accent',
  'Datos Espaciales':'bg-base-200 text-secondary',
  'Legal':          'bg-warning/10 text-warning',
  'Negociación':    'bg-base-200 text-secondary',
}

export default function Tasks() {
  const [tabActiva, setTabActiva] = useState('HOY')
  const [completadas, setCompletadas] = useState(new Set(['T-007']))

  const filtradas = tareas.filter((t) => t.estado === tabActiva)

  const toggleCompletada = (id) => {
    setCompletadas((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Tareas y Productividad
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Inspecciones · Seguimientos de cliente · Escaneos espaciales
          </p>
        </div>
        <button className="btn btn-accent btn-sm font-display flex-shrink-0 gap-1.5">
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-base-300">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTabActiva(t.id)}
            className={`px-4 py-2.5 font-mono-crm text-[11px] uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${
              tabActiva === t.id
                ? 'border-accent text-accent font-medium'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            {t.label}
            {t.badge && (
              <span className="bg-error text-error-content font-mono-crm text-[9px] px-1.5 py-0.5 rounded-full">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Task List ──────────────────────────────────── */}
      <div className="space-y-3">
        {filtradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare className="w-10 h-10 text-base-300 mb-3" />
            <p className="font-display font-medium text-sm text-secondary">Sin tareas en esta categoría</p>
          </div>
        )}

        {filtradas.map((t) => {
          const done = completadas.has(t.id)
          return (
            <div
              key={t.id}
              className={`bg-base-100 rounded-lg p-4 border border-base-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow relative overflow-hidden ${
                t.urgente ? 'border-t-4 border-t-accent' : ''
              } ${done ? 'opacity-60' : ''}`}
            >
              {t.urgente && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />
              )}

              <div className="flex items-start gap-3 flex-1 ml-1">
                {/* Checkbox */}
                <button
                  onClick={() => toggleCompletada(t.id)}
                  className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    done ? 'border-accent bg-accent' : 'border-base-300 hover:border-accent'
                  }`}
                >
                  {done && <CheckSquare className="w-3 h-3 text-accent-content" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${coloresTipo[t.tipo] || 'bg-base-200 text-secondary'}`}>
                      {t.tipo}
                    </span>
                    {t.urgente && (
                      <span className="flex items-center gap-1 text-error font-mono-crm text-[9px]">
                        <AlertTriangle className="w-3 h-3" />
                        Vencida
                      </span>
                    )}
                  </div>
                  <h3 className={`font-display font-semibold text-sm text-primary leading-tight mb-0.5 ${done ? 'line-through text-secondary' : ''}`}>
                    {t.titulo}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">{t.descripcion}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between md:justify-end border-t border-base-300 md:border-t-0 pt-3 md:pt-0">
                <div className="flex flex-col items-end">
                  <span className="font-mono-crm text-[9px] uppercase text-secondary">Vencimiento</span>
                  <span className={`font-mono-crm text-[10px] font-medium ${t.urgente ? 'text-error' : 'text-primary'}`}>
                    {t.vencimiento}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center font-mono-crm text-[10px] font-bold flex-shrink-0">
                  {t.asignado}
                </div>
                <button className="btn btn-ghost btn-xs btn-circle">
                  <ChevronRight className="w-3.5 h-3.5 text-secondary" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
