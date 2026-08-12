import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Download, Search, LayoutGrid, List, RefreshCw, TrendingUp } from 'lucide-react'
import { propiedades, estadoTourConfig, kpiPortafolio } from '../data/properties.js'

const fmt = (v) => '$' + new Intl.NumberFormat('en-US').format(v)

export default function PortfolioControlCenter() {
  const [busqueda, setBusqueda]       = useState('')
  const [vistaActual, setVistaActual] = useState('tabla')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtradas = propiedades.filter((p) => {
    const ok =
      busqueda === '' ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase())
    const okEstado = filtroEstado === 'todos' || p.estadoTour === filtroEstado
    return ok && okEstado
  })

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Centro de Control de Portafolio
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Gestión de activos, estado de sincronización GSV y rendimiento de inversión
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="btn btn-outline btn-sm gap-1.5">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="btn btn-accent btn-sm gap-1.5 font-display">
            <Plus className="w-4 h-4" />
            Agregar Activo
          </button>
        </div>
      </div>

      {/* ── KPI Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            titulo: 'Activos Bajo Gestión',
            valor: fmt(kpiPortafolio.aumTotal),
            desc: '↑ 12.3% este trimestre',
            color: 'text-primary',
          },
          {
            titulo: 'Propiedades Activas',
            valor: kpiPortafolio.propiedadesActivas,
            desc: '3 comerciales · 3 residenciales',
            color: 'text-primary',
          },
          {
            titulo: 'Cobertura de Tours',
            valor: kpiPortafolio.coberturaTours + '%',
            desc: `${propiedades.filter((p) => p.estadoTour === 'sincronizado').length} de ${propiedades.length} sincronizados`,
            color: 'text-primary',
          },
          {
            titulo: 'Tasa Cap Promedio',
            valor: kpiPortafolio.tasaCapPromedio + '%',
            desc: '↑ 0.4% vs. año anterior',
            color: 'text-primary',
          },
        ].map((k) => (
          <div key={k.titulo} className="stat bg-base-100 border border-base-300 rounded-lg shadow-none p-4">
            <div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary leading-tight">
              {k.titulo}
            </div>
            <div className={`stat-value font-display text-2xl mt-1 ${k.color}`}>{k.valor}</div>
            <div className="stat-desc font-mono-crm text-[10px] text-accent mt-1">{k.desc}</div>
          </div>
        ))}
      </div>

      {/* ── Filter Toolbar ─────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center bg-base-100 px-4 py-3 rounded-lg border border-base-300">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o ID..."
            className="input input-sm input-bordered w-full pl-9 font-body"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {['todos', 'sincronizado', 'pendiente', 'error'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`btn btn-xs font-mono-crm tracking-wide ${
                filtroEstado === f ? 'btn-primary' : 'btn-ghost text-secondary'
              }`}
            >
              {f === 'todos' ? 'Todos' : estadoTourConfig[f].label}
            </button>
          ))}
        </div>

        <div className="join ml-auto">
          <button
            onClick={() => setVistaActual('tabla')}
            className={`join-item btn btn-sm ${vistaActual === 'tabla' ? 'btn-primary' : 'btn-outline'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVistaActual('cuadricula')}
            className={`join-item btn btn-sm ${vistaActual === 'cuadricula' ? 'btn-primary' : 'btn-outline'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Table View ─────────────────────────────────── */}
      {vistaActual === 'tabla' && (
        <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  {['ID / Activo', 'Tipo', 'Valoración', 'Tasa Cap', 'Estado GSV', 'Nodos', 'Acciones'].map(
                    (h) => (
                      <th key={h} className="th-crm py-3 px-4">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((p) => (
                  <tr key={p.id} className="hover:bg-base-200/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-display font-semibold text-sm text-primary leading-tight">{p.nombre}</div>
                      <div className="font-mono-crm text-[10px] text-secondary mt-0.5">
                        {p.id} · {p.ubicacion}
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="badge badge-outline badge-sm text-secondary border-base-300 font-body text-[11px]">
                        {p.tipo}
                      </span>
                    </td>
                    <td className="px-4">
                      <div className="font-display font-semibold text-primary text-sm">{fmt(p.valoracion)}</div>
                      <div className="font-mono-crm text-[10px] text-secondary">
                        Ingreso: {fmt(p.ingresoNeto)}/año
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-accent" />
                        <span className="font-mono-crm text-accent font-medium text-sm">
                          {p.tasaCapitalizacion}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className={`badge ${estadoTourConfig[p.estadoTour].clase} badge-sm font-mono-crm text-[10px]`}>
                        {estadoTourConfig[p.estadoTour].label}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="font-mono-crm text-sm text-secondary">{p.nodosEspaciales}</span>
                    </td>
                    <td className="px-4">
                      <div className="flex gap-1.5">
                        <Link
                          to={`/propiedades/${p.id}`}
                          className="btn btn-accent btn-xs font-display font-medium"
                        >
                          Ver Tour
                        </Link>
                        <button className="btn btn-outline btn-xs text-secondary font-display">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtradas.length === 0 && (
              <div className="py-16 text-center text-secondary font-body text-sm">
                No se encontraron activos con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Grid View ──────────────────────────────────── */}
      {vistaActual === 'cuadricula' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtradas.map((p) => (
            <div
              key={p.id}
              className="card bg-base-100 border border-base-300 card-gold overflow-hidden hover:shadow-md transition-shadow"
            >
              <figure className="relative h-44 overflow-hidden">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="text-white">
                    <div className="font-display font-semibold text-sm leading-tight">{p.nombre}</div>
                    <div className="font-mono-crm text-[10px] text-white/70">{p.id}</div>
                  </div>
                  <span className={`badge ${estadoTourConfig[p.estadoTour].clase} badge-sm font-mono-crm text-[10px]`}>
                    {estadoTourConfig[p.estadoTour].label}
                  </span>
                </div>
              </figure>

              <div className="card-body p-4 gap-2">
                <div className="flex justify-between items-start">
                  <span className="badge badge-outline badge-sm text-secondary border-base-300 text-[11px]">
                    {p.tipo}
                  </span>
                  <div className="text-right">
                    <div className="font-display font-bold text-primary text-sm">{fmt(p.valoracion)}</div>
                    <div className="font-mono-crm text-[10px] text-accent">{p.tasaCapitalizacion}% cap rate</div>
                  </div>
                </div>

                <p className="font-mono-crm text-[11px] text-secondary truncate">{p.ubicacion}</p>

                <div className="flex gap-4 pt-1">
                  {[
                    { label: 'Hab.', val: p.habitaciones },
                    { label: 'Baños', val: p.banos },
                    { label: 'm²', val: p.area.toLocaleString() },
                    { label: 'Nodos', val: p.nodosEspaciales },
                  ].map((d) => (
                    <div key={d.label} className="text-center">
                      <div className="font-mono-crm text-xs font-medium text-primary">{d.val}</div>
                      <div className="font-mono-crm text-[9px] text-secondary uppercase">{d.label}</div>
                    </div>
                  ))}
                </div>

                <div className="card-actions pt-1">
                  <Link to={`/propiedades/${p.id}`} className="btn btn-accent btn-sm w-full font-display font-medium">
                    Ver Tour 3D Virtual
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtradas.length === 0 && (
            <div className="col-span-3 py-16 text-center text-secondary font-body text-sm">
              No se encontraron activos con los filtros seleccionados.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
