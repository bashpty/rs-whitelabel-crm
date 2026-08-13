import { useState } from 'react'
import { TrendingUp, AlertTriangle, Building2, DollarSign, Plus, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'

const kpis = [
  { label: 'Ocupación Total',       value: '92%',   sub: '+2.4%',  subColor: 'text-accent', bar: 92, icon: Building2 },
  { label: 'Arrendamientos Activos',value: '128',   sub: 'En 4 propiedades', subColor: 'text-secondary', bar: null, icon: Building2 },
  { label: 'Vencimientos Próximos', value: '12',    sub: '< 90 Días',  subColor: 'text-error', bar: null, icon: AlertTriangle, warn: true },
  { label: 'Renta Mensual Total',   value: '$1.4M', sub: 'Proyectado mes actual', subColor: 'text-secondary', bar: null, icon: DollarSign },
]

const arrendamientos = [
  { unidad: 'Suite 400',    inquilino: 'Acme Corp',        id: 'TC-8492', monto: '$12,500/mes', inicio: 'Ene 1, 2022',  fin: 'Dic 31, 2026',  encumbrance: null,   warn: false },
  { unidad: 'Penthouse A',  inquilino: 'Stark Ind.',       id: 'TC-1104', monto: '$45,000/mes', inicio: 'Mar 15, 2019', fin: 'Nov 30, 2024',  encumbrance: null,   warn: true, daysLeft: 45 },
  { unidad: 'Retail 101',   inquilino: 'Bean Roasters',    id: 'TC-3321', monto: '$8,200/mes',  inicio: 'Jun 1, 2023',  fin: 'May 31, 2028',  encumbrance: 'ROFR', warn: false },
  { unidad: 'Suite 250',    inquilino: 'Globex',           id: 'TC-9921', monto: '$15,000/mes', inicio: 'Oct 1, 2023',  fin: 'Sep 30, 2030',  encumbrance: null,   warn: false },
  { unidad: 'Retail 202',   inquilino: 'LuxBrand Co.',     id: 'TC-4410', monto: '$22,000/mes', inicio: 'Feb 1, 2023',  fin: 'Jan 31, 2025',  encumbrance: 'ROFR', warn: true, daysLeft: 82 },
  { unidad: 'Office Wing B',inquilino: 'Meridian Capital', id: 'TC-7821', monto: '$38,000/mes', inicio: 'Jul 15, 2021', fin: 'Jul 14, 2029',  encumbrance: null,   warn: false },
]

export default function LeasingOccupancy() {
  const [filtro, setFiltro] = useState('Todos los Estados')

  const filtrados = filtro === 'Expirando Pronto'
    ? arrendamientos.filter((a) => a.warn)
    : filtro === 'Activos'
      ? arrendamientos.filter((a) => !a.warn)
      : arrendamientos

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary leading-tight">
            Arrendamiento y Ocupación
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            Contratos activos · Vencimientos próximos · Utilización de espacio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost border border-base-300 font-display gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button className="btn btn-accent btn-sm font-display gap-1.5">
            <Plus className="w-4 h-4" />
            Nuevo Arrendamiento
          </button>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`stat bg-base-100 border rounded-lg p-4 ${k.warn ? 'border-error/30' : 'border-base-300'}`}>
            <div className="flex justify-between items-start">
              <div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary leading-tight">
                {k.label}
              </div>
              <k.icon className={`w-4 h-4 flex-shrink-0 ${k.warn ? 'text-error' : 'text-secondary'}`} />
            </div>
            <div className={`stat-value font-display text-xl mt-1 leading-tight ${k.warn ? 'text-error' : 'text-primary'}`}>
              {k.value}
            </div>
            <div className={`stat-desc font-mono-crm text-[10px] mt-0.5 flex items-center gap-1 ${k.subColor}`}>
              {k.label === 'Ocupación Total' && <TrendingUp className="w-3 h-3" />}
              {k.sub}
            </div>
            {k.bar && (
              <div className="mt-2 w-full bg-base-300 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${k.bar}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Lease Register Table ───────────────────────── */}
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display font-semibold text-sm text-primary">Registro de Arrendamientos</h2>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="select select-sm bg-base-100 border-base-300 font-mono-crm text-xs"
          >
            <option>Todos los Estados</option>
            <option>Activos</option>
            <option>Expirando Pronto</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-base-300 bg-base-200">
                {['Unidad', 'Inquilino / ID', 'Monto Renta', 'Inicio', 'Vencimiento', 'Gravamen', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {filtrados.map((a) => (
                <tr key={a.id} className={`hover:bg-base-200 transition-colors ${a.warn ? 'bg-warning/5' : ''}`}>
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{a.unidad}</td>
                  <td className="px-4 py-3">
                    <div className="font-display text-xs text-primary">{a.inquilino}</div>
                    <div className="font-mono-crm text-[10px] text-secondary">ID: {a.id}</div>
                  </td>
                  <td className="px-4 py-3 font-mono-crm text-xs text-primary font-medium">{a.monto}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{a.inicio}</td>
                  <td className="px-4 py-3">
                    {a.warn ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono-crm text-[10px] text-warning font-medium">{a.fin}</span>
                        <span className="flex items-center gap-1 bg-warning/10 text-warning font-mono-crm text-[9px] px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {a.daysLeft} días
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono-crm text-[10px] text-secondary">{a.fin}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.encumbrance ? (
                      <span className="bg-error/10 text-error border border-error/20 font-mono-crm text-[9px] px-2 py-0.5 rounded">
                        {a.encumbrance}
                      </span>
                    ) : (
                      <span className="bg-base-200 text-secondary font-mono-crm text-[9px] px-2 py-0.5 rounded">
                        Ninguno
                      </span>
                    )}
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

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-base-300 bg-base-200 flex items-center justify-between">
          <span className="font-mono-crm text-[10px] text-secondary">
            Mostrando 1-{filtrados.length} de {arrendamientos.length} arrendamientos
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-xs" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-crm text-[10px] text-secondary">Página 1 de 1</span>
            <button className="btn btn-ghost btn-xs" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
