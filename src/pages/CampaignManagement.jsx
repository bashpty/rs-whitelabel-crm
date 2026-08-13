import { useState } from 'react'
import { TrendingUp, TrendingDown, Megaphone, Users, BarChart2, DollarSign, Plus, Filter, ArrowUpRight } from 'lucide-react'

const kpis = [
  { label: 'Presupuesto Activo Total', value: '$4.2M', trend: '+12.5% vs Q2', up: true, icon: DollarSign },
  { label: 'Campañas Activas',         value: '14',    trend: 'En 3 regiones',   up: null, icon: Megaphone },
  { label: 'Impresiones Totales',      value: '12.8M', trend: '+8.2% vs Q2',  up: true, icon: BarChart2 },
  { label: 'Tasa de Conversión',       value: '4.2%',  trend: '-0.5% vs Q2',  up: false, icon: Users },
]

const campaigns = [
  {
    id: 'C-001',
    nombre: "Q3 'The Pinnacle' Pre-Lease",
    descripcion: 'Campaña LinkedIn e Instagram dirigida a HNW para pre-arrendamiento de penthouse en Manhattan.',
    estado: 'ACTIVA',
    canal: 'SOCIAL',
    presupuesto: '$450,000',
    cpa: '$1,200',
    performance: [30, 45, 60, 85, 100],
    gold: true,
  },
  {
    id: 'C-002',
    nombre: 'Investor Q2 Briefing',
    descripcion: 'Newsletter trimestral sobre rendimiento del portafolio, actualizaciones espaciales y oportunidades de activos en distress.',
    estado: 'BORRADOR',
    canal: 'EMAIL',
    presupuesto: '$15,000',
    cpa: '—',
    performance: [],
    gold: false,
  },
  {
    id: 'C-003',
    nombre: 'Miami Commercial Expo',
    descripcion: 'Anuncios móviles geo-cercados y secuencias de email de seguimiento para asistentes del Q3 Real Estate Expo.',
    estado: 'ACTIVA',
    canal: 'MULTI-CANAL',
    presupuesto: '$85,000',
    cpa: '$800',
    performance: [40, 55, 50, 70, 65],
    gold: false,
  },
  {
    id: 'C-004',
    nombre: 'Geneva Vertex Pre-Sales',
    descripcion: 'Lanzamiento de pre-ventas para The Vertex Estate en Ginebra. Medios premium y relaciones públicas institucionales.',
    estado: 'PLANIFICADA',
    canal: 'PR + DIGITAL',
    presupuesto: '$200,000',
    cpa: '$2,500',
    performance: [],
    gold: false,
  },
  {
    id: 'C-005',
    nombre: 'Dubai Aura Residences Launch',
    descripcion: 'Campaña de lanzamiento de alta visibilidad para Torre A en Dubai Marina. Vídeo cinematic + paid social.',
    estado: 'ACTIVA',
    canal: 'SOCIAL + VIDEO',
    presupuesto: '$620,000',
    cpa: '$980',
    performance: [20, 35, 58, 72, 90],
    gold: true,
  },
  {
    id: 'C-006',
    nombre: 'Lease Renewal Drive – EMEA',
    descripcion: 'Campaña de retención y renovación para cartera EMEA con vencimientos en los próximos 90 días.',
    estado: 'ACTIVA',
    canal: 'EMAIL',
    presupuesto: '$32,000',
    cpa: '$450',
    performance: [60, 70, 75, 80, 85],
    gold: false,
  },
]

const estadoClases = {
  ACTIVA:      'bg-accent/10 text-accent border border-accent/30',
  BORRADOR:    'bg-base-200 text-secondary border border-base-300',
  PLANIFICADA: 'bg-base-200 text-secondary border border-base-300',
}

const MiniChart = ({ bars }) => (
  <div className="h-12 flex items-end gap-0.5 w-full bg-base-200 p-1.5 rounded border border-base-300">
    {bars.map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-t transition-all"
        style={{
          height: `${h}%`,
          background: i === bars.length - 1 ? 'hsl(var(--a))' : 'hsl(var(--p)/0.3)',
        }}
      />
    ))}
  </div>
)

export default function CampaignManagement() {
  const [filtro, setFiltro] = useState('TODAS')

  const filtradas = filtro === 'TODAS' ? campaigns : campaigns.filter((c) => c.estado === filtro)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Orquestación de Campañas
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Campañas de marketing multi-canal · Generación de leads de alto valor
          </p>
        </div>
        <button className="btn btn-accent btn-sm font-display flex-shrink-0 gap-1.5">
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </button>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="stat bg-base-100 border border-base-300 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary leading-tight">
                {k.label}
              </div>
              <k.icon className="w-4 h-4 text-secondary flex-shrink-0" />
            </div>
            <div className="stat-value font-display text-xl text-primary mt-1 leading-tight">{k.value}</div>
            <div className={`stat-desc font-mono-crm text-[10px] mt-0.5 flex items-center gap-1 ${k.up === true ? 'text-accent' : k.up === false ? 'text-error' : 'text-secondary'}`}>
              {k.up === true && <TrendingUp className="w-3 h-3" />}
              {k.up === false && <TrendingDown className="w-3 h-3" />}
              {k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
        {['TODAS', 'ACTIVA', 'BORRADOR', 'PLANIFICADA'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`btn btn-xs font-mono-crm ${filtro === f ? 'btn-accent' : 'btn-ghost border border-base-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Campaign Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtradas.map((c) => (
          <article
            key={c.id}
            className={`bg-base-100 rounded-lg border border-base-300 flex flex-col overflow-hidden hover:shadow-md transition-shadow ${c.gold ? 'border-t-4 border-t-accent' : ''}`}
          >
            <div className="p-4 flex-1 flex flex-col">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`font-mono-crm text-[9px] uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${estadoClases[c.estado] || 'bg-base-200 text-secondary'}`}>
                  {c.estado === 'ACTIVA' && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />}
                  {c.estado}
                </span>
                <span className="font-mono-crm text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-base-200 text-secondary border border-base-300">
                  {c.canal}
                </span>
              </div>

              <h3 className="font-display font-semibold text-sm text-primary leading-tight mb-1">{c.nombre}</h3>
              <p className="text-xs text-secondary leading-relaxed mb-4 flex-1">{c.descripcion}</p>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-base-300">
                <div>
                  <span className="font-mono-crm text-[9px] uppercase text-secondary block mb-0.5">Presupuesto</span>
                  <span className="font-display font-semibold text-sm text-primary">{c.presupuesto}</span>
                </div>
                <div>
                  <span className="font-mono-crm text-[9px] uppercase text-secondary block mb-0.5">CPA Target</span>
                  <span className="font-display font-semibold text-sm text-primary">{c.cpa}</span>
                </div>
              </div>

              {/* Mini chart */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-mono-crm text-[9px] text-primary font-medium uppercase tracking-wider">Performance</span>
                  {c.performance.length > 0
                    ? <span className="font-mono-crm text-[9px] text-accent">Leads vs Target</span>
                    : <span className="font-mono-crm text-[9px] text-secondary">Sin datos</span>
                  }
                </div>
                {c.performance.length > 0
                  ? <MiniChart bars={c.performance} />
                  : (
                    <div className="h-12 flex items-center justify-center bg-base-200 rounded border border-base-300 border-dashed">
                      <span className="font-mono-crm text-[9px] text-secondary">Pendiente de lanzamiento</span>
                    </div>
                  )
                }
              </div>
            </div>

            {/* Footer action */}
            <div className="px-4 py-2.5 border-t border-base-300 bg-base-200 flex justify-between items-center">
              <span className="font-mono-crm text-[9px] text-secondary">{c.id}</span>
              <button className="flex items-center gap-1 text-xs text-primary font-display font-medium hover:text-accent transition-colors">
                Ver detalle <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
