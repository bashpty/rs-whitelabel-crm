import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, Globe } from 'lucide-react'

const PASOS = [
  { id: 1, label: 'Subir RAW',         desc: 'Imágenes duales 360°' },
  { id: 2, label: 'Estabilizar',       desc: 'Horizonte y Stitching' },
  { id: 3, label: 'Metadatos GPano',   desc: 'Verificar EXIF/XMP' },
  { id: 4, label: 'Mapeo de Nodos',    desc: 'Grafo de Conexiones' },
  { id: 5, label: 'Publicar GSV',      desc: 'Google Street View API' },
]

const METADATOS = [
  { campo: 'GPano:ProjectionType',             valor: 'equirectangular',           estado: 'ok' },
  { campo: 'GPano:UsePanoramaViewer',          valor: 'True',                       estado: 'ok' },
  { campo: 'GPano:FullPanoWidthPixels',        valor: '8192',                       estado: 'ok' },
  { campo: 'GPano:FullPanoHeightPixels',       valor: '4096',                       estado: 'ok' },
  { campo: 'GPano:PoseHeadingDegrees',         valor: '180.0',                      estado: 'ok' },
  { campo: 'GPano:PosePitchDegrees',           valor: '0.0',                        estado: 'ok' },
  { campo: 'GPano:PoseRollDegrees',            valor: '0.0',                        estado: 'ok' },
  { campo: 'GPano:CroppedAreaImageWidthPixels',valor: '8192',                       estado: 'ok' },
  { campo: 'GPano:CroppedAreaHeightPixels',    valor: '4096',                       estado: 'ok' },
  { campo: 'GPS:Latitude',                     valor: '25.7617° N',                 estado: 'ok' },
  { campo: 'GPS:Longitude',                    valor: '-80.1918° W',                estado: 'ok' },
  { campo: 'GPS:Altitude',                     valor: '125.4 m',                    estado: 'warning' },
  { campo: 'EXIF:CaptureTime',                 valor: '1711920000000 (ms)',          estado: 'ok' },
  { campo: 'GPano:CaptureSoftware',            valor: 'CRM-SpatialEngine-v1',        estado: 'ok' },
  { campo: 'GPano:StitchingSoftware',          valor: 'CRM-GoogleStitch-Bridge',     estado: 'ok' },
]

const NODOS_EJEMPLO = [
  { id: 'N-01', label: 'Entrada Principal',   x: 100, y: 80,  conexiones: ['N-02', 'N-03'] },
  { id: 'N-02', label: 'Sala Principal',      x: 200, y: 80,  conexiones: ['N-01', 'N-04'] },
  { id: 'N-03', label: 'Cocina',             x: 100, y: 180, conexiones: ['N-01', 'N-05'] },
  { id: 'N-04', label: 'Suite Principal',    x: 300, y: 60,  conexiones: ['N-02', 'N-06'] },
  { id: 'N-05', label: 'Comedor',            x: 200, y: 180, conexiones: ['N-03', 'N-02'] },
  { id: 'N-06', label: 'Terraza',            x: 380, y: 80,  conexiones: ['N-04'] },
]

export default function SpatialIngestion() {
  const [pasoActivo, setPasoActivo] = useState(3)
  const [metaExpanded, setMetaExpanded]   = useState(true)
  const [apiExpanded, setApiExpanded]     = useState(false)
  const [archivoNombre, setArchivoNombre] = useState('')
  const [oauthStatus] = useState('conectado')

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
          Pipeline de Ingestión Espacial
        </h1>
        <p className="text-sm text-secondary mt-0.5">
          Procesamiento de imágenes 360° · Verificación GPano · Publicación Google Street View
        </p>
      </div>

      {/* ── Steps Progress ─────────────────────────────── */}
      <div className="bg-base-100 border border-base-300 rounded-lg px-6 py-5">
        <ul className="steps steps-horizontal w-full">
          {PASOS.map((p) => (
            <li
              key={p.id}
              className={`step text-xs cursor-pointer ${
                p.id <= pasoActivo ? 'step-accent' : ''
              }`}
              onClick={() => setPasoActivo(p.id)}
            >
              <div>
                <div className="font-display font-medium text-primary text-[12px] leading-tight">{p.label}</div>
                <div className="font-mono-crm text-[9px] text-secondary">{p.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Main Workspace ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left — Panorama / Upload canvas */}
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between">
            <span className="font-display font-semibold text-sm text-primary">
              {pasoActivo === 1 ? 'Zona de Carga de Archivos' : 'Visor Equirectangular 2:1'}
            </span>
            <span className="font-mono-crm text-[10px] text-secondary">
              {archivoNombre || 'Sin archivo seleccionado'}
            </span>
          </div>

          {pasoActivo === 1 ? (
            /* Upload dropzone */
            <div className="p-6">
              <label
                className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-base-300
                           rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <Upload className="w-7 h-7 text-secondary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-sm text-primary">
                      Arrastra archivos RAW aquí
                    </p>
                    <p className="font-body text-xs text-secondary mt-0.5">
                      .DNG, .INSP, .JPG, .PNG — Parejas de lente dual 360°
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm font-display">Seleccionar Archivos</button>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".dng,.insp,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => setArchivoNombre(e.target.files[0]?.name || '')}
                />
              </label>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: 'Imágenes Cargadas',  val: '0 / 0' },
                  { label: 'Tamaño Total',        val: '0 MB' },
                  { label: 'Formato Detectado',   val: '—' },
                  { label: 'Estado',              val: 'En espera' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-base-200 rounded p-2.5">
                    <div className="font-mono-crm text-[9px] text-secondary uppercase">{label}</div>
                    <div className="font-display font-semibold text-sm text-primary mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Panorama preview */
            <div className="relative bg-primary" style={{ aspectRatio: '2/1' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-primary-content/30">
                  <div className="text-5xl mb-2">🌐</div>
                  <p className="font-body text-xs">Vista Equirectangular 2:1</p>
                  <p className="font-mono-crm text-[10px] mt-1">8192 × 4096 px</p>
                </div>
              </div>
              {/* Horizon grid overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="none">
                {[25,50,75,100,125,150,175].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#D4AF37" strokeWidth="0.5" />
                ))}
                {[50,100,150,200,250,300,350].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#D4AF37" strokeWidth="0.5" />
                ))}
                {/* Horizon line */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#D4AF37" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* Controls */}
          {pasoActivo !== 1 && (
            <div className="p-4 border-t border-base-300 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono-crm text-[10px] text-secondary w-24">Inclinación H</span>
                <input type="range" min="-90" max="90" defaultValue="0" className="range range-xs range-accent flex-1" />
                <span className="font-mono-crm text-[10px] text-secondary w-8 text-right">0°</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-crm text-[10px] text-secondary w-24">Inclinación V</span>
                <input type="range" min="-45" max="45" defaultValue="0" className="range range-xs range-accent flex-1" />
                <span className="font-mono-crm text-[10px] text-secondary w-8 text-right">0°</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono-crm text-[10px] text-secondary w-24">Exposición</span>
                <input type="range" min="-3" max="3" step="0.1" defaultValue="0" className="range range-xs range-accent flex-1" />
                <span className="font-mono-crm text-[10px] text-secondary w-8 text-right">0.0</span>
              </div>
            </div>
          )}
        </div>

        {/* Right — Node Graph Editor */}
        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between">
            <span className="font-display font-semibold text-sm text-primary">Editor de Grafo Espacial</span>
            <span className="font-mono-crm text-[10px] text-secondary">{NODOS_EJEMPLO.length} nodos · {NODOS_EJEMPLO.reduce((s,n) => s + n.conexiones.length, 0) / 2} conexiones</span>
          </div>

          <div className="relative bg-base-200/40 overflow-hidden" style={{ height: '320px' }}>
            <svg viewBox="0 0 480 320" className="w-full h-full">
              {/* Connection arrows */}
              {NODOS_EJEMPLO.map((nodo) =>
                nodo.conexiones.map((targetId) => {
                  const target = NODOS_EJEMPLO.find((n) => n.id === targetId)
                  if (!target || targetId < nodo.id) return null
                  return (
                    <line
                      key={`${nodo.id}-${targetId}`}
                      x1={nodo.x} y1={nodo.y}
                      x2={target.x} y2={target.y}
                      stroke="#D4AF37" strokeWidth="1.5"
                      strokeOpacity="0.5"
                      markerEnd="url(#arrow)"
                    />
                  )
                })
              )}
              {/* Arrow marker */}
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#D4AF37" fillOpacity="0.6" />
                </marker>
              </defs>
              {/* Nodes */}
              {NODOS_EJEMPLO.map((nodo) => (
                <g key={nodo.id} className="cursor-pointer">
                  <circle cx={nodo.x} cy={nodo.y} r="16" fill="#0A192F" stroke="#D4AF37" strokeWidth="2" />
                  <text x={nodo.x} y={nodo.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize="8" fill="#D4AF37" fontFamily="JetBrains Mono">{nodo.id}</text>
                  <text x={nodo.x} y={nodo.y + 26} textAnchor="middle"
                    fontSize="8" fill="#64748B" fontFamily="Inter">{nodo.label}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="p-4 border-t border-base-300">
            <p className="font-mono-crm text-[10px] text-secondary text-center">
              Arrastra nodos para reposicionar · Click para editar · Alt+Click para conectar
            </p>
          </div>
        </div>
      </div>

      {/* ── Metadata Accordion ─────────────────────────── */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg">
        <input type="checkbox" checked={metaExpanded} onChange={(e) => setMetaExpanded(e.target.checked)} />
        <div className="collapse-title font-display font-semibold text-sm text-primary py-4 px-5">
          Inspector de Metadatos GPano / EXIF
        </div>
        <div className="collapse-content px-5">
          <div className="overflow-x-auto">
            <table className="table table-xs w-full">
              <thead>
                <tr>
                  {['Campo XMP / EXIF', 'Valor', 'Estado'].map((h) => (
                    <th key={h} className="th-crm py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METADATOS.map((m) => (
                  <tr key={m.campo} className="hover:bg-base-200/60">
                    <td className="px-3 py-1.5">
                      <span className="font-mono-crm text-[11px] text-primary">{m.campo}</span>
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="font-mono-crm text-[11px] text-accent">{m.valor}</span>
                    </td>
                    <td className="px-3 py-1.5">
                      {m.estado === 'ok' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-warning" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── GSV API Sync Bar ───────────────────────────── */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg">
        <input type="checkbox" checked={apiExpanded} onChange={(e) => setApiExpanded(e.target.checked)} />
        <div className="collapse-title font-display font-semibold text-sm text-primary py-4 px-5">
          Barra de Sincronización Google Street View API
        </div>
        <div className="collapse-content px-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary" />
                <span className="font-mono-crm text-[11px] text-secondary">OAuth2 Status:</span>
                <span className={`badge ${oauthStatus === 'conectado' ? 'badge-success' : 'badge-error'} badge-sm font-mono-crm text-[10px]`}>
                  {oauthStatus === 'conectado' ? 'Autenticado' : 'No autenticado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-crm text-[11px] text-secondary">Scope:</span>
                <code className="font-mono-crm text-[10px] bg-base-200 px-2 py-0.5 rounded text-accent">
                  streetviewpublish
                </code>
              </div>
            </div>

            <div className="bg-primary rounded-lg p-4 font-mono-crm text-[11px] text-primary-content/60 space-y-1 max-h-36 overflow-y-auto">
              <div><span className="text-accent">[2024-03-15 10:31:02]</span> POST /v1/photo:startUpload → 200 OK</div>
              <div><span className="text-accent">[2024-03-15 10:31:03]</span> Upload URL recibida: https://streetviewpublish...</div>
              <div><span className="text-accent">[2024-03-15 10:31:14]</span> Binary stream completado — 8192×4096 JPEG</div>
              <div><span className="text-accent">[2024-03-15 10:31:15]</span> POST /v1/photo → 200 OK</div>
              <div><span className="text-success">[2024-03-15 10:31:15]</span> Photo ID: CAoSLEFGMVFpcE5xLU5XYWJRR...</div>
              <div><span className="text-success">[2024-03-15 10:31:16]</span> ✓ Nodo publicado en Google Street View</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Footer ──────────────────────────────── */}
      <div className="sticky bottom-0 bg-base-100 border border-base-300 rounded-lg px-6 py-4 flex flex-wrap gap-3 items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono-crm text-[11px] text-secondary">GPano: 14/15 campos OK</span>
          </div>
          <div className="h-4 w-px bg-base-300" />
          <span className="font-mono-crm text-[11px] text-secondary">OAuth2 activo</span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm font-display gap-1.5">
            <RefreshCw className="w-4 h-4" />
            Verificar Metadatos
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5 font-semibold">
            <Globe className="w-4 h-4" />
            Publicar en Google Street View
          </button>
        </div>
      </div>
    </div>
  )
}
