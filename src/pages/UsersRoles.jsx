import { useState } from 'react'
import { UserPlus, Download, MoreVertical, Shield, Search, ChevronDown } from 'lucide-react'

const usuarios = [
  { initials: 'JD', nombre: 'Jonathan Davies', email: 'j.davies@lux-spatial.com', rol: 'Enterprise Admin', region: 'Global', activo: 'Ahora mismo', estado: 'ACTIVO' },
  { initials: 'SC', nombre: 'Sarah Chen',      email: 'schen@lux-spatial.com',    rol: 'Senior Broker',   region: 'Norteamérica', activo: 'Hace 2 horas', estado: 'ACTIVO' },
  { initials: 'MR', nombre: 'Marcus Reed',     email: 'm.reed@partner-firm.com',  rol: 'Agente',          region: 'EMEA (Comercial)', activo: 'Hace 1 día', estado: 'OFFLINE' },
  { initials: '?',  nombre: 'Elena Rostova',   email: 'e.rostova@lux-spatial.com',rol: 'Analista',        region: 'APAC',      activo: 'Nunca',     estado: 'PENDIENTE' },
  { initials: 'AM', nombre: 'Alex Müller',     email: 'a.muller@lux-spatial.com', rol: 'Senior Broker',   region: 'DACH',      activo: 'Hace 3 horas', estado: 'ACTIVO' },
  { initials: 'LT', nombre: 'Luisa Torres',    email: 'l.torres@lux-spatial.com', rol: 'Agente',          region: 'LATAM',     activo: 'Hace 5 horas', estado: 'ACTIVO' },
]

const politicas = [
  {
    nombre: 'Norteamérica – Prime',
    clase: 'Oficinas Comerciales',
    roles: 'Admin, Sr. Broker',
    resolucion: 'LOD 400 (Alta)',
    pii: 'Restringido',
    gold: true,
  },
  {
    nombre: 'EMEA – Secundaria',
    clase: 'Industrial / Logística',
    roles: 'Todos los Roles',
    resolucion: 'LOD 200 (Estándar)',
    pii: 'Permitido',
    gold: false,
  },
  {
    nombre: 'APAC – Restringida',
    clase: 'Residencial Luxury',
    roles: 'Admin',
    resolucion: 'LOD 300 (Alta)',
    pii: 'Restringido',
    gold: false,
  },
]

const estadoBadge = {
  ACTIVO:    'bg-accent/10 text-accent border border-accent/30',
  OFFLINE:   'bg-base-200 text-secondary border border-base-300',
  PENDIENTE: 'bg-warning/10 text-warning border border-warning/30',
}

export default function UsersRoles() {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Usuarios y Roles
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Directorio de acceso · Permisos de broker · Políticas de control espacial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost border border-base-300 font-display gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5">
            <UserPlus className="w-3.5 h-3.5" />
            Invitar Usuario
          </button>
        </div>
      </div>

      {/* ── Bento Layout ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ── User Table (2/3 width) ──────────────────── */}
        <div className="xl:col-span-2 bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input input-sm pl-9 bg-base-100 border-base-300 font-mono-crm text-xs w-52"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="select select-sm bg-base-100 border-base-300 font-mono-crm text-xs">
                <option>Todos los Roles</option>
                <option>Enterprise Admin</option>
                <option>Senior Broker</option>
                <option>Agente</option>
              </select>
              <select className="select select-sm bg-base-100 border-base-300 font-mono-crm text-xs">
                <option>Todos los Estados</option>
                <option>Activo</option>
                <option>Pendiente</option>
                <option>Offline</option>
              </select>
            </div>
            <span className="font-mono-crm text-[10px] text-secondary ml-auto">
              Mostrando 1-{filtrados.length} de {usuarios.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-base-300 bg-base-200">
                  {['Usuario', 'Rol / Región', 'Último Acceso', 'Estado', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {filtrados.map((u) => (
                  <tr key={u.email} className="hover:bg-base-200 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary text-primary-content flex items-center justify-center font-mono-crm text-[10px] font-bold flex-shrink-0">
                          {u.initials}
                        </div>
                        <div>
                          <div className="font-display font-medium text-xs text-primary">{u.nombre}</div>
                          <div className="font-mono-crm text-[10px] text-secondary">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-display font-medium text-xs text-primary">{u.rol}</div>
                      <div className="font-mono-crm text-[10px] text-secondary">{u.region}</div>
                    </td>
                    <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.activo}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 w-fit ${estadoBadge[u.estado]}`}>
                        {u.estado === 'ACTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />}
                        {u.estado === 'PENDIENTE' && <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />}
                        {u.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn btn-ghost btn-xs btn-circle">
                        <MoreVertical className="w-3.5 h-3.5 text-secondary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Access Policies (1/3 width) ─────────────── */}
        <div className="bg-base-100 border border-base-300 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-primary text-primary-content rounded-t-lg">
            <h4 className="font-display font-semibold text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Políticas de Acceso
            </h4>
            <p className="font-mono-crm text-[10px] text-primary-content/60 mt-0.5">
              Reglas de gobernanza de datos espaciales
            </p>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {politicas.map((p) => (
              <div
                key={p.nombre}
                className={`border border-base-300 rounded-lg p-3 relative overflow-hidden ${p.gold ? 'border-t-4 border-t-accent' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-display font-semibold text-xs text-primary">{p.nombre}</div>
                    <div className="font-mono-crm text-[9px] text-secondary mt-0.5">{p.clase}</div>
                  </div>
                  <Shield className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                </div>
                <div className="space-y-1.5 mt-3 pt-2 border-t border-base-300">
                  {[
                    { k: 'Roles Permitidos', v: p.roles },
                    { k: 'Resolución de Datos', v: p.resolucion },
                    { k: 'Exportar PII', v: p.pii, error: p.pii === 'Restringido' },
                  ].map(({ k, v, error }) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="font-mono-crm text-[9px] text-secondary">{k}:</span>
                      <span className={`font-mono-crm text-[9px] font-medium ${error ? 'text-error' : 'text-primary'}`}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full py-1 border border-base-300 rounded text-secondary hover:text-primary hover:bg-base-200 transition-colors font-mono-crm text-[10px]">
                  Editar Política
                </button>
              </div>
            ))}

            <button className="w-full py-2.5 border border-dashed border-base-300 rounded-lg text-secondary hover:text-primary hover:border-primary transition-all font-mono-crm text-[10px] flex items-center justify-center gap-1.5">
              + Crear Política
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
