import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserCog, Shield, Users, Key } from 'lucide-react'
import { usersApi, acpApi } from '../lib/api.js'
import Pagination from '../components/ui/Pagination.jsx'

export default function UsersRoles() {
  const [uPage, setUPage] = useState(1)
  const [aPage, setAPage] = useState(1)

  const { data: uData, isLoading: uLoading } = useQuery({ queryKey: ['users', uPage], queryFn: () => usersApi.list({ page: uPage, limit: 15 }) })
  const { data: aData, isLoading: aLoading } = useQuery({ queryKey: ['acp', aPage], queryFn: () => acpApi.list({ page: aPage, limit: 15 }) })

  const users = uData?.data ?? []
  const acps = aData?.data ?? []

  const kpis = [
    { titulo: 'Total Usuarios', valor: uData?.meta?.total ?? '—', icon: Users },
    { titulo: 'Administradores', valor: users.filter((u) => u.role === 'ADMIN').length, icon: Shield },
    { titulo: 'Políticas de Acceso', valor: aData?.meta?.total ?? '—', icon: Key },
    { titulo: 'Roles Únicos', valor: new Set(users.map((u) => u.role).filter(Boolean)).size, icon: UserCog },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-semibold text-primary leading-tight">Usuarios y Roles</h1>
        <p className="text-sm text-secondary mt-0.5">Directorio de usuarios y control de acceso</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.titulo} className="stat bg-base-100 border border-base-300 rounded-lg p-4">
            <div className="flex justify-between items-start"><div className="stat-title font-mono-crm text-[10px] tracking-widest uppercase text-secondary">{k.titulo}</div><k.icon className="w-4 h-4 text-secondary" /></div>
            <div className="stat-value font-display text-xl text-primary mt-1">{k.valor}</div>
          </div>
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Usuarios del Sistema</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['Nombre', 'Email', 'Rol', 'Creado'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {uLoading && <tr><td colSpan={4} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-display font-medium text-xs text-primary">{u.firstName ?? ''} {u.lastName ?? ''}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.email ?? '—'}</td>
                  <td className="px-4 py-3"><span className="font-mono-crm text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-base-200 text-secondary">{u.role ?? '—'}</span></td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={uData?.meta} onPageChange={setUPage} />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-base-300 bg-base-200"><span className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary">Políticas de Control de Acceso</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-base-300 bg-base-200">{['ID', 'Rol', 'Recurso', 'Acciones'].map((h) => <th key={h} className="px-4 py-2.5 font-mono-crm text-[9px] uppercase tracking-widest text-secondary font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base-300">
              {aLoading && <tr><td colSpan={4} className="text-center py-8 text-secondary font-mono-crm text-xs">Cargando…</td></tr>}
              {acps.map((a) => (
                <tr key={a.id} className="hover:bg-base-200 transition-colors">
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{a.id?.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{a.role ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-primary">{a.resource ?? '—'}</td>
                  <td className="px-4 py-3 font-mono-crm text-[10px] text-secondary">{Array.isArray(a.actions) ? a.actions.join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination meta={aData?.meta} onPageChange={setAPage} />
      </div>
    </div>
  )
}
