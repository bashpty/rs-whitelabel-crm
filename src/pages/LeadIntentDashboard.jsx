import { useState } from 'react'
import { prospectos, kpiProspectos, estadoProspectoConfig, tipoActividadConfig } from '../data/leads.js'
import { propiedades } from '../data/properties.js'
import { Eye, Clock, Flame, MapPin, Phone, Mail, Building2, DollarSign } from 'lucide-react'

const fmt = (v) => '$' + new Intl.NumberFormat('en-US').format(v)

function RadialProgress({ value, size = '5rem' }) {
  return (
    <div
      className="radial-progress font-display font-bold text-accent border-4 border-base-300"
      style={{ '--value': value, '--size': size, '--thickness': '6px' }}
      role="progressbar"
    >
      <span className="text-sm text-primary">{value}%</span>
    </div>
  )
}

export default function LeadIntentDashboard() {
  const [seleccionado, setSeleccionado] = useState(prospectos[0])

  const prop = propiedades.find((p) => p.id === seleccionado.propiedadInteres)

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Panel de Intención de Prospectos
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Analítica comportamental de tours virtuales · Clasificación por intención de compra
          </p>
        </div>
        <button className="btn btn-accent btn-sm font-display flex-shrink-0">
          Exportar Reporte
        </button>
      </div>

      {/* ── KPI Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { titulo: 'Total Vistas de Tour', valor: kpiProspectos.totalVistasTour.toLocaleString(), desc: 'Últimos 30 días', icon: Eye },
          { titulo: 'Dwell Promedio',        valor: kpiProspectos.tiempoPromedioDwell,              desc: 'Por sesión de tour',  icon: Clock },
          { titulo: 'Prospectos Alto Intento',valor: kpiProspectos.prospectoAltoIntento,            desc: 'Puntuación > 80',     icon: Flame },
          { titulo: 'Habitación Más Vista',  valor: kpiProspectos.habitacionMasVista,              desc: 'Mayor dwell time',    icon: MapPin },
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

      {/* ── 3-Column Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5 min-h-[600px]">
        {/* Column 1 — Lead Roster */}
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between flex-shrink-0">
            <span className="font-display font-semibold text-sm text-primary">Prospectos Activos</span>
            <span className="badge badge-primary badge-sm font-mono-crm">{prospectos.length}</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {[...prospectos].sort((a, b) => b.puntuacionIntento - a.puntuacionIntento).map((p) => {
              const isActive = seleccionado.id === p.id
              const cfg = estadoProspectoConfig[p.estado]
              return (
                <button
                  key={p.id}
                  onClick={() => setSeleccionado(p)}
                  className={`w-full text-left px-4 py-3 border-b border-base-200 last:border-0 transition-colors hover:bg-base-200/70 ${
                    isActive ? 'bg-primary/5 border-l-2 border-l-accent' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="avatar placeholder flex-shrink-0 mt-0.5">
                      <div className="w-9 rounded-full bg-primary text-primary-content">
                        <span className="text-[11px] font-display font-semibold">{p.iniciales}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="font-display font-semibold text-[13px] text-primary leading-tight truncate">
                          {p.nombre}
                        </span>
                        <span className={`badge ${cfg.clase} badge-xs font-mono-crm text-[8px] flex-shrink-0`}>
                          {p.puntuacionIntento}%
                        </span>
                      </div>
                      <div className="font-mono-crm text-[10px] text-secondary truncate">{p.empresa}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`badge ${cfg.clase} badge-xs font-mono-crm text-[9px]`}>{cfg.label}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Column 2 — Lead Profile + Timeline */}
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-base-300 bg-base-200 flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="avatar placeholder flex-shrink-0">
                <div className="w-12 rounded-full bg-primary text-primary-content">
                  <span className="text-sm font-display font-semibold">{seleccionado.iniciales}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="font-display font-semibold text-base text-primary leading-tight">
                      {seleccionado.nombre}
                    </h2>
                    <p className="font-mono-crm text-[11px] text-secondary">{seleccionado.empresa}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="badge badge-outline badge-sm text-secondary border-base-300 font-mono-crm text-[10px]">
                      {seleccionado.tipoInversor}
                    </span>
                    <span className={`badge ${estadoProspectoConfig[seleccionado.estado].clase} badge-sm font-mono-crm text-[10px]`}>
                      {estadoProspectoConfig[seleccionado.estado].label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  {[
                    { icon: DollarSign, val: fmt(seleccionado.presupuesto), label: 'Presupuesto' },
                    { icon: Building2,  val: seleccionado.nombrePropiedad,  label: 'Propiedad Interés' },
                    { icon: Clock,      val: seleccionado.duracionTour,     label: 'Duración Tour' },
                    { icon: Eye,        val: seleccionado.vistasTotal + ' vistas', label: 'Total Vistas' },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-1.5">
                      <d.icon className="w-3 h-3 text-secondary flex-shrink-0" />
                      <div>
                        <div className="font-mono-crm text-[11px] text-primary font-medium">{d.val}</div>
                        <div className="font-mono-crm text-[9px] text-secondary">{d.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-5 py-3 bg-accent/5 border-b border-base-300 flex-shrink-0">
            <p className="font-body text-xs text-secondary italic leading-relaxed">{seleccionado.notas}</p>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <h3 className="font-display font-semibold text-sm text-primary mb-3">
              Línea de Tiempo Espacial
            </h3>
            <ul className="timeline timeline-vertical timeline-compact">
              {seleccionado.actividades.map((act, i) => {
                const cfg2 = tipoActividadConfig[act.tipo] || tipoActividadConfig.vista
                return (
                  <li key={i}>
                    {i !== 0 && <hr className="bg-base-300" />}
                    <div className="timeline-start font-mono-crm text-[10px] text-secondary whitespace-nowrap">
                      {act.hora}
                    </div>
                    <div className="timeline-middle">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                          act.tipo === 'accion' ? 'bg-accent text-accent-content' : 'bg-base-300 text-secondary'
                        }`}
                      >
                        {cfg2.icono}
                      </div>
                    </div>
                    <div className="timeline-end pb-3">
                      <div className="font-body text-[12px] text-primary leading-snug">{act.accion}</div>
                      {act.duracion && (
                        <div className="font-mono-crm text-[10px] text-accent mt-0.5">⏱ {act.duracion}</div>
                      )}
                    </div>
                    {i !== seleccionado.actividades.length - 1 && <hr className="bg-base-300" />}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Actions */}
          <div className="px-5 py-3 border-t border-base-300 flex gap-2 flex-shrink-0">
            <a href={`tel:${seleccionado.telefono}`} className="btn btn-primary btn-sm flex-1 gap-1.5 font-display">
              <Phone className="w-3.5 h-3.5" /> Llamar
            </a>
            <a href={`mailto:${seleccionado.email}`} className="btn btn-outline btn-sm flex-1 gap-1.5 font-display">
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
            <button className="btn btn-accent btn-sm flex-1 gap-1.5 font-display">
              Agendar Visita
            </button>
          </div>
        </div>

        {/* Column 3 — Heatmap + Radial */}
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex-shrink-0">
            <span className="font-display font-semibold text-sm text-primary">Mapa de Interacción</span>
          </div>

          <div className="p-4 flex-1 space-y-5 overflow-y-auto">
            {/* Score */}
            <div className="flex flex-col items-center py-3">
              <RadialProgress value={seleccionado.puntuacionIntento} size="7rem" />
              <div className="font-display font-semibold text-sm text-primary mt-2">Puntuación de Intento</div>
              <div className={`badge ${estadoProspectoConfig[seleccionado.estado].clase} badge-sm mt-1 font-mono-crm text-[10px]`}>
                {estadoProspectoConfig[seleccionado.estado].label}
              </div>
            </div>

            <div className="divider my-0 before:bg-base-300 after:bg-base-300" />

            {/* Rooms heatmap */}
            <div>
              <h4 className="font-display font-semibold text-xs text-primary mb-3">
                Tiempo por Habitación (seg.)
              </h4>
              <div className="space-y-2">
                {seleccionado.habitacionesMasVistas.map((h) => {
                  const intensity = h.porcentaje / 30
                  const bg = intensity > 0.8 ? 'bg-error/20' : intensity > 0.6 ? 'bg-warning/20' : 'bg-success/15'
                  return (
                    <div key={h.nombre}>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-mono-crm text-[10px] text-primary truncate pr-2">{h.nombre}</span>
                        <span className="font-mono-crm text-[10px] text-secondary flex-shrink-0">
                          {h.tiempo}s · {h.porcentaje}%
                        </span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-accent transition-all`}
                          style={{ width: `${h.porcentaje * 3.3}%`, opacity: 0.3 + intensity * 0.7 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="divider my-0 before:bg-base-300 after:bg-base-300" />

            {/* Floor plan placeholder heatmap */}
            <div>
              <h4 className="font-display font-semibold text-xs text-primary mb-2">
                Plano con Dwell Térmico
              </h4>
              <div className="bg-base-200 rounded-lg h-36 relative overflow-hidden border border-base-300">
                {/* Simplified floor plan */}
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  <rect x="10" y="10" width="80" height="50" rx="2" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                  <rect x="100" y="10" width="90" height="50" rx="2" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                  <rect x="10" y="70" width="55" height="40" rx="2" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                  <rect x="75" y="70" width="55" height="40" rx="2" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                  <rect x="140" y="70" width="50" height="40" rx="2" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                  {/* Heatmap overlays */}
                  {seleccionado.habitacionesMasVistas[0] && (
                    <rect x="100" y="10" width="90" height="50" rx="2"
                      fill={`rgba(212,175,55,${seleccionado.habitacionesMasVistas[0].porcentaje / 100})`} />
                  )}
                  {seleccionado.habitacionesMasVistas[1] && (
                    <rect x="10" y="10" width="80" height="50" rx="2"
                      fill={`rgba(212,175,55,${seleccionado.habitacionesMasVistas[1].porcentaje / 100})`} />
                  )}
                  {seleccionado.habitacionesMasVistas[2] && (
                    <rect x="75" y="70" width="55" height="40" rx="2"
                      fill={`rgba(212,175,55,${(seleccionado.habitacionesMasVistas[2]?.porcentaje || 0) / 100})`} />
                  )}
                  {/* Labels */}
                  <text x="50" y="40" textAnchor="middle" fontSize="7" fill="#64748B">Sala</text>
                  <text x="145" y="40" textAnchor="middle" fontSize="7" fill="#64748B">Suite Ppal.</text>
                  <text x="37" y="93" textAnchor="middle" fontSize="7" fill="#64748B">Cocina</text>
                  <text x="102" y="93" textAnchor="middle" fontSize="7" fill="#64748B">Baño</text>
                  <text x="165" y="93" textAnchor="middle" fontSize="7" fill="#64748B">Estudio</text>
                </svg>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1.5 bg-gradient-to-r from-success/30 to-error/40 rounded-full" />
                </div>
                <span className="font-mono-crm text-[9px] text-secondary">Bajo ↔ Alto tiempo</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-secondary flex-shrink-0" />
                <span className="font-mono-crm text-[10px] text-secondary truncate">{seleccionado.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-secondary flex-shrink-0" />
                <span className="font-mono-crm text-[10px] text-secondary">{seleccionado.telefono}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
