import { useState } from 'react'
import { Upload, Filter, Folder, FolderOpen, FileText, FileBadge, FileSignature, ChevronRight, MoreVertical, AlertCircle } from 'lucide-react'

const carpetas = [
  { nombre: '740 Park Ave (Activo)', activa: true },
  { nombre: 'Project Skyline', activa: false },
  { nombre: 'One Vanderbilt', activa: false },
  { nombre: 'Geneva Vertex', activa: false },
]

const tiposDoc = ['Todos', 'Contratos', 'Arrendamientos', 'Ofertas', 'Divulgaciones Financieras']

const contratos = [
  {
    id: 'CNT-0091',
    titulo: 'Acuerdo de Compraventa – Penthouse A',
    contraparte: 'Sterling Trust LLC',
    vencimiento: 'Nov 15, 2024',
    accionReq: true,
    tipo: 'Contrato',
  },
  {
    id: 'CNT-0087',
    titulo: 'Enmienda de Arrendamiento – Suite 400',
    contraparte: 'Acme Corp',
    vencimiento: 'Nov 30, 2024',
    accionReq: true,
    tipo: 'Arrendamiento',
  },
  {
    id: 'CNT-0080',
    titulo: 'NDA – Geneva Vertex Estate',
    contraparte: 'Vanguard Capital SA',
    vencimiento: 'Oct 8, 2024',
    accionReq: false,
    tipo: 'Acuerdo',
  },
  {
    id: 'CNT-0076',
    titulo: 'Term Sheet – Retail 101 Renovación',
    contraparte: 'Bean Roasters Int.',
    vencimiento: 'Oct 22, 2024',
    accionReq: false,
    tipo: 'Oferta',
  },
]

const documentos = [
  { nombre: 'Due Diligence Pack Q3', tipo: 'Financiero', fecha: 'Oct 12, 2024', size: '14.2 MB' },
  { nombre: 'Spatial Scan LOD400 – 740 Park', tipo: 'Datos Espaciales', fecha: 'Oct 10, 2024', size: '2.1 GB' },
  { nombre: 'Título de Propiedad – One Vanderbilt', tipo: 'Legal', fecha: 'Sep 28, 2024', size: '3.8 MB' },
  { nombre: 'Encuesta de Satisfacción Inquilinos Q3', tipo: 'Reporte', fecha: 'Sep 20, 2024', size: '890 KB' },
  { nombre: 'Proyecciones Financieras 2025', tipo: 'Financiero', fecha: 'Sep 15, 2024', size: '1.1 MB' },
]

const iconTipo = { Contrato: FileSignature, Arrendamiento: FileText, Acuerdo: FileBadge, Oferta: FileText }

export default function DocumentVault() {
  const [carpetaActiva, setCarpetaActiva] = useState(0)
  const [tipoActivo, setTipoActivo] = useState('Todos')

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-crm text-[9px] uppercase tracking-widest text-secondary">Portafolio</span>
            <ChevronRight className="w-3 h-3 text-secondary" />
            <span className="font-mono-crm text-[9px] uppercase tracking-widest text-primary font-medium">Bóveda Legal</span>
          </div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Bóveda de Documentos</h1>
          <p className="text-sm text-secondary mt-0.5">
            Contratos · Arrendamientos · Ofertas · Divulgaciones financieras
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost border border-base-300 font-display gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Subir
          </button>
        </div>
      </div>

      {/* ── Main Layout ────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">
        {/* ── Left Pane: Folders & Filters ───────────── */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          {/* Deal Rooms */}
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-base-200 border-b border-base-300 flex justify-between items-center">
              <span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary font-medium">Deal Rooms</span>
              <button className="text-secondary hover:text-accent transition-colors text-lg leading-none">+</button>
            </div>
            <ul className="py-2 px-2 space-y-0.5">
              {carpetas.map((c, i) => (
                <li key={c.nombre}>
                  <button
                    onClick={() => setCarpetaActiva(i)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs w-full text-left transition-colors font-display ${
                      carpetaActiva === i
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-secondary hover:bg-base-200'
                    }`}
                  >
                    {carpetaActiva === i
                      ? <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      : <Folder className="w-3.5 h-3.5 flex-shrink-0" />
                    }
                    {c.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Document Types */}
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-base-200 border-b border-base-300">
              <span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary font-medium">Tipos de Documento</span>
            </div>
            <div className="p-3 space-y-1.5">
              {tiposDoc.map((t) => (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tipoActivo === t || tipoActivo === 'Todos'}
                    onChange={() => setTipoActivo(t)}
                    className="checkbox checkbox-xs checkbox-accent"
                  />
                  <span className="font-display text-xs text-secondary hover:text-primary transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Pane: Contracts + Documents ──────── */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Contracts requiring action */}
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden border-t-4 border-t-accent">
            <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-sm text-primary flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-accent" />
                  Contratos y Acuerdos
                </h2>
                <p className="font-mono-crm text-[10px] text-secondary mt-0.5">Acciones pendientes de autorización</p>
              </div>
              <span className="bg-accent text-accent-content font-mono-crm text-[10px] px-2.5 py-1 rounded-full font-bold">
                2 Acción Requerida
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-base-300 bg-base-200">
                    {['Contrato / Oferta', 'Contraparte', 'Tipo', 'Vencimiento', ''].map((h) => (
                      <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {contratos.map((c) => {
                    const Icon = iconTipo[c.tipo] || FileText
                    return (
                      <tr key={c.id} className="hover:bg-base-200 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${c.accionReq ? 'bg-error/10' : 'bg-base-200'}`}>
                              <Icon className={`w-3.5 h-3.5 ${c.accionReq ? 'text-error' : 'text-secondary'}`} />
                            </div>
                            <div>
                              <div className="font-display font-medium text-xs text-primary">{c.titulo}</div>
                              <div className="font-mono-crm text-[10px] text-secondary">{c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-display text-xs text-secondary">{c.contraparte}</td>
                        <td className="px-4 py-3">
                          <span className="bg-base-200 text-secondary font-mono-crm text-[9px] px-2 py-0.5 rounded">{c.tipo}</span>
                        </td>
                        <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{c.vencimiento}</td>
                        <td className="px-4 py-3 text-right">
                          {c.accionReq ? (
                            <button className="btn btn-accent btn-xs font-mono-crm gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Revisar
                            </button>
                          ) : (
                            <button className="btn btn-ghost btn-xs btn-circle">
                              <MoreVertical className="w-3.5 h-3.5 text-secondary" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* General Documents */}
          <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-base-300 bg-base-200">
              <h3 className="font-display font-semibold text-sm text-primary">Documentos Recientes</h3>
            </div>
            <div className="divide-y divide-base-300">
              {documentos.map((d) => (
                <div key={d.nombre} className="px-4 py-3 flex items-center justify-between hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <div className="font-display font-medium text-xs text-primary">{d.nombre}</div>
                      <div className="font-mono-crm text-[10px] text-secondary">{d.tipo} · {d.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-crm text-[10px] text-secondary">{d.fecha}</span>
                    <button className="btn btn-ghost btn-xs btn-circle">
                      <MoreVertical className="w-3.5 h-3.5 text-secondary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
