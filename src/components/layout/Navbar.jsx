import { Bell, Search, ChevronDown } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="navbar bg-primary text-primary-content px-6 min-h-[60px] shadow-sm z-20 flex-shrink-0">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-content/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar propiedades, prospectos, ID..."
            className="input input-sm w-72 pl-9 bg-white/10 text-primary-content placeholder:text-primary-content/35
                       border border-white/20 focus:outline-none focus:border-accent focus:bg-white/15 transition-colors"
          />
        </div>
      </div>

      <div className="flex-none flex items-center gap-2">
        <div className="indicator">
          <span className="indicator-item badge badge-accent badge-xs font-mono-crm">3</span>
          <button className="btn btn-ghost btn-sm btn-circle text-primary-content/70 hover:text-primary-content hover:bg-white/10">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="divider divider-horizontal mx-1 h-6 before:bg-white/15 after:bg-white/15" />

        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="avatar placeholder">
              <div className="w-8 rounded-full bg-accent text-accent-content flex items-center justify-center">
                <span className="text-xs font-display font-semibold">JD</span>
              </div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-display font-medium leading-tight">Juan Directivo</div>
              <div className="text-[10px] font-mono-crm text-primary-content/45 leading-tight">Director General</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-primary-content/40" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 text-base-content rounded-box w-48 mt-2 border border-base-300"
          >
            <li><a className="text-sm font-body">Mi Perfil</a></li>
            <li><a className="text-sm font-body">Preferencias</a></li>
            <li><a className="text-sm font-body">Cambiar Rol</a></li>
            <li><div className="divider my-0.5" /></li>
            <li><a className="text-sm font-body text-error">Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
