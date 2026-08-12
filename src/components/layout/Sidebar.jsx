import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, GitBranch, Satellite, Settings, Zap } from 'lucide-react'

const navItems = [
  {
    to: '/portafolio',
    icon: LayoutDashboard,
    label: 'Control de Portafolio',
    sublabel: 'Activos y Tours',
  },
  {
    to: '/prospectos',
    icon: Users,
    label: 'Intención de Prospectos',
    sublabel: 'Analítica Espacial',
  },
  {
    to: '/transacciones',
    icon: GitBranch,
    label: 'Pipeline Transaccional',
    sublabel: 'Deals Activos',
  },
  {
    to: '/ingestion-espacial',
    icon: Satellite,
    label: 'Ingestión Espacial',
    sublabel: 'Pipeline 360°',
  },
  {
    to: '/configuracion',
    icon: Settings,
    label: 'Configuración',
    sublabel: 'Gobernanza del Sistema',
  },
]

export default function Sidebar() {
  return (
    <div className="sidebar-w bg-primary text-primary-content flex flex-col h-full flex-shrink-0 border-r border-white/10">
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-accent-content" />
          </div>
          <div>
            <div className="font-display font-semibold text-sm tracking-tight leading-tight">LUX-SPATIAL</div>
            <div className="font-mono-crm text-[9px] text-primary-content/45 tracking-widest uppercase leading-tight">
              CRM Enterprise v2.4
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="font-mono-crm text-[9px] text-primary-content/30 tracking-widest uppercase px-3 pb-2">
          Módulos Principales
        </div>

        {navItems.map(({ to, icon: Icon, label, sublabel }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? 'bg-accent text-accent-content'
                  : 'text-primary-content/65 hover:bg-white/8 hover:text-primary-content'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 ${
                    isActive ? 'text-accent-content' : 'text-primary-content/40 group-hover:text-primary-content/80'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[13px] font-display font-medium leading-tight truncate ${
                      isActive ? 'text-accent-content' : ''
                    }`}
                  >
                    {label}
                  </div>
                  <div
                    className={`font-mono-crm text-[9px] leading-tight mt-0.5 truncate ${
                      isActive ? 'text-accent-content/65' : 'text-primary-content/28'
                    }`}
                  >
                    {sublabel}
                  </div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Status Footer ─────────────────────────────── */}
      <div className="px-5 py-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse flex-shrink-0" />
          <span className="font-mono-crm text-[9px] text-primary-content/35 uppercase tracking-widest">
            Todos los sistemas operativos
          </span>
        </div>
        <div className="font-mono-crm text-[9px] text-primary-content/20">GSV API · OAuth2 · Activo</div>
      </div>
    </div>
  )
}
