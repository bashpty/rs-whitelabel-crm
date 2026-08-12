import { useState } from 'react'
import { Save, Eye, EyeOff, RefreshCw, Shield, Bell, Database, Globe, Users, Key } from 'lucide-react'

const SECCIONES = [
  { id: 'perfil',         label: 'Perfil de Organización', icon: Shield },
  { id: 'api',            label: 'Integración API',          icon: Globe },
  { id: 'usuarios',       label: 'Gestión de Usuarios',      icon: Users },
  { id: 'notificaciones', label: 'Notificaciones',           icon: Bell },
  { id: 'datos',          label: 'Datos y Retención',        icon: Database },
]

const USUARIOS = [
  { nombre: 'Juan Directivo',   email: 'j.directivo@luxspatial.com', rol: 'Director General', estado: 'activo' },
  { nombre: 'Carlos Rodríguez', email: 'c.rodriguez@luxspatial.com', rol: 'Agente Senior',    estado: 'activo' },
  { nombre: 'María García',     email: 'm.garcia@luxspatial.com',    rol: 'Agente Principal',  estado: 'activo' },
  { nombre: 'Roberto Martínez', email: 'r.martinez@luxspatial.com',  rol: 'Director de Lujo', estado: 'activo' },
  { nombre: 'Ana López',        email: 'a.lopez@luxspatial.com',     rol: 'Dir. Comercial',   estado: 'activo' },
  { nombre: 'Diego Herrera',    email: 'd.herrera@luxspatial.com',   rol: 'Agente Senior',    estado: 'inactivo' },
  { nombre: 'Sofía Vargas',     email: 's.vargas@luxspatial.com',    rol: 'Agente Creativa',  estado: 'activo' },
]

export default function Settings() {
  const [seccionActiva, setSeccionActiva] = useState('perfil')
  const [mostrarApiKey, setMostrarApiKey] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = () => {
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Configuración y Gobernanza
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Parámetros del sistema · Integraciones API · Gestión de acceso
          </p>
        </div>
        <button
          onClick={handleGuardar}
          className={`btn btn-sm font-display flex-shrink-0 gap-1.5 ${guardado ? 'btn-success' : 'btn-accent'}`}
        >
          <Save className="w-4 h-4" />
          {guardado ? '¡Cambios Guardados!' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        {/* ── Sidebar Nav ──────────────────────────────── */}
        <div className="bg-base-100 border border-base-300 rounded-lg p-2 h-fit">
          {SECCIONES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSeccionActiva(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                seccionActiva === id
                  ? 'bg-accent text-accent-content'
                  : 'text-secondary hover:bg-base-200 hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-display text-[13px] font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Content Panel ────────────────────────────── */}
        <div className="bg-base-100 border border-base-300 rounded-lg">
          {/* ── Perfil ── */}
          {seccionActiva === 'perfil' && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="font-display font-semibold text-base text-primary">Perfil de Organización</h2>
                <p className="font-body text-xs text-secondary mt-0.5">Información corporativa del bróker</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre de la Empresa',    placeholder: 'LUX-SPATIAL Inmobiliaria', defaultVal: 'LUX-SPATIAL Inmobiliaria' },
                  { label: 'CIF / NIT',               placeholder: 'B-12345678',                defaultVal: 'B-12345678' },
                  { label: 'País de Operación',       placeholder: 'Estados Unidos',            defaultVal: 'Estados Unidos' },
                  { label: 'Ciudad Principal',        placeholder: 'Miami, FL',                 defaultVal: 'Miami, FL' },
                  { label: 'Teléfono Corporativo',    placeholder: '+1 (305) 555-0100',         defaultVal: '+1 (305) 555-0100' },
                  { label: 'Email de Contacto',       placeholder: 'info@luxspatial.com',       defaultVal: 'info@luxspatial.com' },
                ].map(({ label, placeholder, defaultVal }) => (
                  <div key={label}>
                    <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">{label}</label>
                    <input
                      type="text"
                      className="input input-sm input-bordered w-full font-body"
                      placeholder={placeholder}
                      defaultValue={defaultVal}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">
                  Descripción Corporativa
                </label>
                <textarea
                  className="textarea textarea-bordered w-full font-body text-sm resize-none h-20"
                  defaultValue="Bróker institucional de bienes raíces de alto valor con especialización en tours virtuales 3D y análisis espacial avanzado."
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Moneda',     val: 'USD ($)' },
                  { label: 'Idioma',     val: 'Español' },
                  { label: 'Zona Horaria',val: 'America/Miami' },
                  { label: 'Versión CRM', val: 'v2.4.1' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-base-200 rounded-lg p-2.5">
                    <div className="font-mono-crm text-[9px] text-secondary uppercase">{label}</div>
                    <div className="font-display font-semibold text-sm text-primary mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── API ── */}
          {seccionActiva === 'api' && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="font-display font-semibold text-base text-primary">Integración API</h2>
                <p className="font-body text-xs text-secondary mt-0.5">
                  Claves y configuración de servicios externos
                </p>
              </div>

              {/* GSV API */}
              <div className="space-y-3 p-4 border border-base-300 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-secondary" />
                  <h3 className="font-display font-semibold text-sm text-primary">Google Street View Publish API</h3>
                  <span className="badge badge-success badge-sm font-mono-crm text-[10px] ml-auto">Conectado</span>
                </div>
                <div>
                  <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={mostrarApiKey ? 'text' : 'password'}
                      className="input input-sm input-bordered flex-1 font-mono-crm text-[11px]"
                      defaultValue="AIzaSyD-9tSrke72NouZFQxxxxxxxxxxxxxx"
                      readOnly
                    />
                    <button
                      onClick={() => setMostrarApiKey(!mostrarApiKey)}
                      className="btn btn-outline btn-sm"
                    >
                      {mostrarApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">
                    OAuth2 Scope
                  </label>
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full font-mono-crm text-[11px]"
                    defaultValue="https://www.googleapis.com/auth/streetviewpublish"
                    readOnly
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-mono-crm text-[10px] text-secondary">Última verificación: 15/03/2024 10:31 UTC</span>
                </div>
              </div>

              {/* Kuula */}
              <div className="space-y-3 p-4 border border-base-300 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-4 h-4 text-secondary" />
                  <h3 className="font-display font-semibold text-sm text-primary">Kuula Virtual Tours</h3>
                  <span className="badge badge-success badge-sm font-mono-crm text-[10px] ml-auto">Activo</span>
                </div>
                <div>
                  <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">
                    URL Base de Embeds
                  </label>
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full font-mono-crm text-[11px]"
                    defaultValue="https://kuula.co/share"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tours Publicados', val: '4 activos' },
                    { label: 'Nodos Totales',    val: '96 nodos' },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-base-200 rounded p-2.5">
                      <div className="font-mono-crm text-[9px] text-secondary uppercase">{label}</div>
                      <div className="font-display font-semibold text-sm text-primary mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Usuarios ── */}
          {seccionActiva === 'usuarios' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-semibold text-base text-primary">Gestión de Usuarios</h2>
                  <p className="font-body text-xs text-secondary mt-0.5">{USUARIOS.length} usuarios registrados</p>
                </div>
                <button className="btn btn-accent btn-sm font-display">+ Invitar Usuario</button>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      {['Usuario', 'Correo', 'Rol', 'Estado', 'Acciones'].map((h) => (
                        <th key={h} className="th-crm py-2 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {USUARIOS.map((u) => (
                      <tr key={u.email} className="hover:bg-base-200/60">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="avatar placeholder">
                              <div className="w-7 rounded-full bg-primary text-primary-content">
                                <span className="text-[10px] font-display font-semibold">
                                  {u.nombre.split(' ').map((n) => n[0]).join('').slice(0,2)}
                                </span>
                              </div>
                            </div>
                            <span className="font-display font-semibold text-sm text-primary">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4">
                          <span className="font-mono-crm text-[11px] text-secondary">{u.email}</span>
                        </td>
                        <td className="px-4">
                          <span className="badge badge-outline badge-sm text-secondary border-base-300 font-body text-[11px]">
                            {u.rol}
                          </span>
                        </td>
                        <td className="px-4">
                          <span className={`badge badge-sm font-mono-crm text-[10px] ${u.estado === 'activo' ? 'badge-success' : 'badge-ghost'}`}>
                            {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4">
                          <div className="flex gap-1">
                            <button className="btn btn-ghost btn-xs text-secondary">Editar</button>
                            <button className="btn btn-ghost btn-xs text-error">Revocar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Notificaciones ── */}
          {seccionActiva === 'notificaciones' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-semibold text-base text-primary">Preferencias de Notificaciones</h2>
                <p className="font-body text-xs text-secondary mt-0.5">Configurar alertas y reportes automáticos</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Nuevo prospecto con alto intento (>80%)',   desc: 'Alerta inmediata cuando un prospecto supera puntuación crítica' },
                  { label: 'Tour virtual completado',                    desc: 'Notificación al finalizar un tour de 360°' },
                  { label: 'Actualización de estado de transacción',    desc: 'Cambios en etapas del pipeline' },
                  { label: 'Error en pipeline de ingestión GPano',      desc: 'Fallos en metadatos EXIF o en la API de Google' },
                  { label: 'Reporte semanal de portafolio',             desc: 'Resumen ejecutivo cada lunes a las 8:00 AM' },
                  { label: 'Vencimiento de OAuth2 token',               desc: 'Aviso 24h antes de expiración del token GSV' },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-3 bg-base-200 rounded-lg gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-medium text-sm text-primary">{n.label}</div>
                      <div className="font-body text-xs text-secondary mt-0.5">{n.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle toggle-accent toggle-sm flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Datos ── */}
          {seccionActiva === 'datos' && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="font-display font-semibold text-base text-primary">Datos y Retención</h2>
                <p className="font-body text-xs text-secondary mt-0.5">Políticas de almacenamiento y auditoría</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Almacenamiento Usado', val: '2.4 TB / 10 TB' },
                  { label: 'Imágenes RAW',          val: '847 archivos' },
                  { label: 'Tours Publicados',      val: '4 activos' },
                  { label: 'Retención de Datos',    val: '7 años' },
                  { label: 'Última Copia de Seg.',  val: '15/03/2024' },
                  { label: 'Cifrado',               val: 'AES-256' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-base-200 rounded-lg p-3">
                    <div className="font-mono-crm text-[9px] text-secondary uppercase">{label}</div>
                    <div className="font-display font-semibold text-sm text-primary mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <label className="font-mono-crm text-[10px] text-secondary uppercase tracking-wider block mb-1">
                  Período de Retención de Logs (días)
                </label>
                <input type="range" min="30" max="365" defaultValue="90" className="range range-accent w-full max-w-xs" />
                <div className="font-mono-crm text-[10px] text-secondary mt-1">90 días actualmente</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-outline btn-sm font-display gap-1.5">
                  <Database className="w-4 h-4" />
                  Exportar Respaldo
                </button>
                <button className="btn btn-error btn-sm btn-outline font-display gap-1.5">
                  Purgar Datos de Prueba
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
