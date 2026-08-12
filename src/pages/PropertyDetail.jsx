import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Car, Layers,
  Phone, Mail, Calendar, ChevronRight, Compass, CheckCircle2,
  DollarSign, TrendingUp, FileText, Map,
} from 'lucide-react'
import { getPropiedad, estadoTourConfig } from '../data/properties.js'

const fmt = (v) => '$' + new Intl.NumberFormat('en-US').format(v)

const escenas = [
  'Sala Principal', 'Suite Principal', 'Cocina Gourmet',
  'Terraza Panorámica', 'Acceso / Entrada', 'Jardín y Exteriores',
]

export default function PropertyDetail() {
  const { id } = useParams()
  const propiedad = getPropiedad(id)
  const [tabActivo, setTabActivo]     = useState('resumen')
  const [escenaActiva, setEscenaActiva] = useState(escenas[0])
  const [nombre, setNombre]           = useState('')
  const [email, setEmail]             = useState('')
  const [telefono, setTelefono]       = useState('')
  const [mensaje, setMensaje]         = useState('')

  if (!propiedad) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-secondary font-body">Propiedad no encontrada.</p>
        <Link to="/portafolio" className="btn btn-primary btn-sm">
          Volver al Portafolio
        </Link>
      </div>
    )
  }

  const cfg = estadoTourConfig[propiedad.estadoTour]
  const fin = propiedad.proyeccionFinanciera

  return (
    <div className="space-y-0 -mt-1">
      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          to="/portafolio"
          className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Portafolio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-base-300" />
        <span className="text-sm font-display font-medium text-primary">{propiedad.nombre}</span>
        <span className="font-mono-crm text-[10px] text-secondary bg-base-200 px-2 py-0.5 rounded">
          {propiedad.id}
        </span>
        <span className={`badge ${cfg.clase} badge-sm font-mono-crm text-[10px] ml-1`}>{cfg.label}</span>
      </div>

      {/* ── Tour Viewport ────────────────────────────────── */}
      <div className="relative w-full bg-primary rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {propiedad.estadoTour === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="text-6xl opacity-30">📷</div>
            <p className="text-primary-content/60 font-body text-sm">Tour no disponible — Error en activos RAW</p>
            <button className="btn btn-accent btn-sm">Reanudar Ingestión</button>
          </div>
        ) : (
          <iframe
            src={`${propiedad.tourUrl}?logo=0&info=1&fs=1&vr=0&sd=1&initload=0&thumbs=1`}
            title={`Tour virtual — ${propiedad.nombre}`}
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0"
            allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
            allowFullScreen
          />
        )}

        {/* Top-right overlay: compass + badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
          <div className="glass-dock rounded-full p-2">
            <Compass className="w-5 h-5 text-white/80" />
          </div>
          <div className="glass-dock rounded-full flex items-center gap-1.5 px-3 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono-crm text-[10px] text-white/90 tracking-wide">Tour Verificado GSV</span>
          </div>
        </div>

        {/* Spatial hotspots (decorative overlay, shown on top) */}
        <div className="absolute top-1/3 left-1/4 z-10 pointer-events-none">
          <div className="relative group">
            <button className="w-7 h-7 rounded-full bg-accent hotspot flex items-center justify-center pointer-events-auto">
              <span className="text-accent-content text-[10px] font-bold">+</span>
            </button>
            <div className="absolute left-9 top-0 glass-dock rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="font-mono-crm text-[10px] text-white/90">Mármol Carrara</span>
            </div>
          </div>
        </div>

        {/* Bottom floating dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="glass-dock rounded-xl px-4 py-2.5 flex items-center gap-3">
            <select
              className="select select-xs bg-white/10 text-white border-white/20 font-display text-[12px] min-w-[160px] focus:outline-none focus:border-accent"
              value={escenaActiva}
              onChange={(e) => setEscenaActiva(e.target.value)}
            >
              {escenas.map((s) => (
                <option key={s} value={s} className="text-primary bg-base-100">
                  {s}
                </option>
              ))}
            </select>
            <div className="h-4 w-px bg-white/20" />
            <button className="btn btn-xs btn-ghost text-white/70 hover:text-white gap-1 font-mono-crm text-[10px]">
              <Map className="w-3.5 h-3.5" />
              Plano
            </button>
            <button className="btn btn-xs btn-ghost text-white/70 hover:text-white gap-1 font-mono-crm text-[10px]">
              <Maximize2 className="w-3.5 h-3.5" />
              Pantalla Completa
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 pt-5">
        {/* Left — Tabs */}
        <div className="space-y-0">
          {/* Property title */}
          <div className="mb-4">
            <h1 className="text-xl font-display font-semibold text-primary leading-tight">{propiedad.nombre}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              <span className="font-body text-sm text-secondary">{propiedad.ubicacion}</span>
              <span className="badge badge-outline badge-sm text-secondary border-base-300 text-[11px]">
                {propiedad.tipo}
              </span>
            </div>
          </div>

          <div role="tablist" className="tabs tabs-lifted">
            {[
              { id: 'resumen',    label: 'Resumen' },
              { id: 'financiero', label: 'Financiero' },
              { id: 'plano',      label: 'Plano & Nodos' },
              { id: 'documentos', label: 'Documentos' },
            ].map((t) => (
              <button
                key={t.id}
                role="tab"
                onClick={() => setTabActivo(t.id)}
                className={`tab font-display text-sm ${
                  tabActivo === t.id
                    ? 'tab-active text-primary border-b-2 border-accent'
                    : 'text-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-base-100 border border-base-300 border-t-0 rounded-b-lg p-5">
            {/* ── Resumen ── */}
            {tabActivo === 'resumen' && (
              <div className="space-y-5">
                <p className="font-body text-sm text-secondary leading-relaxed">{propiedad.descripcion}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Bed,      label: 'Habitaciones', val: propiedad.habitaciones },
                    { icon: Bath,     label: 'Baños',        val: propiedad.banos },
                    { icon: Maximize2,label: 'Superficie',   val: `${propiedad.area.toLocaleString()} m²` },
                    { icon: Car,      label: 'Estac.',       val: propiedad.estacionamientos },
                    { icon: Layers,   label: 'Pisos',        val: propiedad.pisos },
                    { icon: Layers,   label: 'Nodos Tour',   val: propiedad.nodosEspaciales },
                  ].map((d) => (
                    <div key={d.label} className="bg-base-200 rounded-lg p-3 flex items-center gap-2">
                      <d.icon className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div>
                        <div className="font-display font-semibold text-primary text-sm">{d.val}</div>
                        <div className="font-mono-crm text-[9px] text-secondary uppercase">{d.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-display font-semibold text-sm text-primary mb-2">
                    Características Destacadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {propiedad.caracteristicas.map((c) => (
                      <span key={c} className="badge badge-outline badge-sm text-secondary border-base-300 font-body text-[11px] gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-accent" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-sm text-primary mb-2">Agente Asignado</h3>
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="avatar placeholder flex-shrink-0">
                      <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <span className="text-xs font-display font-semibold">
                          {propiedad.agente.nombre.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm text-primary">{propiedad.agente.nombre}</div>
                      <div className="font-mono-crm text-[10px] text-secondary">{propiedad.agente.cargo}</div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <a href={`tel:${propiedad.agente.telefono}`} className="btn btn-ghost btn-xs text-secondary">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a href={`mailto:${propiedad.agente.email}`} className="btn btn-ghost btn-xs text-secondary">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Financiero ── */}
            {tabActivo === 'financiero' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Valor de Mercado',    val: fmt(fin.valorMercado),   icon: DollarSign },
                    { label: 'Ingreso Anual Bruto',  val: fmt(fin.ingresoAnual),   icon: TrendingUp },
                    { label: 'Gasto Operativo',      val: fmt(fin.gastoOperativo), icon: DollarSign },
                    { label: 'NOI (Ingreso Neto)',    val: fmt(fin.noi),            icon: TrendingUp },
                    { label: 'Tasa de Capitalización',val: fin.tasaCap + '%',       icon: TrendingUp },
                    { label: 'Retorno sobre Inversión',val: fin.retornoInversion + '%', icon: TrendingUp },
                  ].map((d) => (
                    <div key={d.label} className="bg-base-200 rounded-lg p-3">
                      <div className="font-mono-crm text-[9px] text-secondary uppercase tracking-wider mb-1">
                        {d.label}
                      </div>
                      <div className="font-display font-bold text-primary text-base">{d.val}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-base-300 rounded-lg p-4">
                  <h3 className="font-display font-semibold text-sm text-primary mb-2">
                    Proyección a 5 Años
                  </h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((yr) => {
                      const growth = 1 + 0.04 * yr
                      return (
                        <div key={yr} className="flex items-center gap-3">
                          <span className="font-mono-crm text-[10px] text-secondary w-12 flex-shrink-0">
                            Año {yr}
                          </span>
                          <div className="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all"
                              style={{ width: `${Math.min(100, 40 + yr * 12)}%` }}
                            />
                          </div>
                          <span className="font-mono-crm text-[10px] text-primary font-medium w-24 text-right flex-shrink-0">
                            {fmt(Math.round(fin.noi * growth))} NOI
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Plano & Nodos ── */}
            {tabActivo === 'plano' && (
              <div className="space-y-4">
                <div className="bg-base-200 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-base-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="font-body text-sm text-secondary">Plano de planta disponible en el tour virtual</p>
                    <p className="font-mono-crm text-[10px] text-secondary/60 mt-1">
                      {propiedad.nodosEspaciales} nodos espaciales conectados
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-primary mb-2">Nodos Configurados</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {escenas.map((s, i) => (
                      <div key={s} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        <span className="font-mono-crm text-[11px] text-primary">{s}</span>
                        <span className="font-mono-crm text-[9px] text-secondary ml-auto">N-{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Documentos ── */}
            {tabActivo === 'documentos' && (
              <div className="space-y-2">
                {['Memoria Descriptiva', 'Certificado de Dominio', 'Planos Arquitectónicos', 'Informe de Tasación', 'Prospecto de Inversión'].map(
                  (doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="font-body text-sm text-primary">{doc}</span>
                      </div>
                      <button className="btn btn-ghost btn-xs text-accent font-mono-crm text-[10px]">
                        Descargar
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Lead Capture Card */}
        <div className="lg:sticky lg:top-0 self-start space-y-4">
          <div className="card bg-base-100 border border-base-300 card-gold">
            <div className="card-body p-5 gap-4">
              <div>
                <div className="font-display font-bold text-2xl text-primary">{fmt(propiedad.valoracion)}</div>
                <div className="font-mono-crm text-[10px] text-accent mt-0.5">
                  Tasa Cap {propiedad.tasaCapitalizacion}% · NOI {fmt(propiedad.ingresoNeto)}/año
                </div>
              </div>

              <div className="divider my-0 before:bg-base-300 after:bg-base-300" />

              <div className="flex items-center gap-3">
                <div className="avatar placeholder flex-shrink-0">
                  <div className="w-11 rounded-full bg-primary text-primary-content">
                    <span className="text-sm font-display font-semibold">
                      {propiedad.agente.nombre.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-primary">{propiedad.agente.nombre}</div>
                  <div className="font-mono-crm text-[10px] text-secondary">{propiedad.agente.cargo}</div>
                </div>
              </div>

              <button className="btn btn-accent w-full font-display font-semibold gap-2">
                <Calendar className="w-4 h-4" />
                Agendar Tour Privado
              </button>
              <button className="btn btn-outline w-full font-display gap-2">
                <Phone className="w-4 h-4" />
                Llamar al Agente
              </button>

              <div className="divider my-0 before:bg-base-300 after:bg-base-300">
                <span className="font-mono-crm text-[10px] text-secondary">o enviar consulta</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  className="input input-sm input-bordered w-full font-body"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="input input-sm input-bordered w-full font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="input input-sm input-bordered w-full font-body"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                <textarea
                  placeholder="Mensaje o consulta..."
                  className="textarea textarea-bordered w-full text-sm font-body resize-none h-20"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
                <button className="btn btn-primary w-full font-display text-sm">
                  Enviar Consulta
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 p-4">
            <div className="font-mono-crm text-[9px] text-secondary uppercase tracking-widest mb-2">
              Datos del Activo
            </div>
            {[
              { k: 'ID del Activo', v: propiedad.id },
              { k: 'Fecha de Listado', v: propiedad.fechaListado },
              { k: 'Área Total', v: `${propiedad.area.toLocaleString()} m²` },
              { k: 'Pisos', v: propiedad.pisos },
              { k: 'Nodos Espaciales', v: propiedad.nodosEspaciales },
              { k: 'Coordenadas', v: `${propiedad.coordenadas.lat}, ${propiedad.coordenadas.lng}` },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-base-200 last:border-0">
                <span className="font-mono-crm text-[10px] text-secondary">{k}</span>
                <span className="font-mono-crm text-[10px] text-primary font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
