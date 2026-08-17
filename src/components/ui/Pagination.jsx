import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null
  const { page, totalPages, total, limit } = meta
  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-base-300 bg-base-200 text-xs">
      <span className="font-mono-crm text-[10px] text-secondary">
        {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-ghost btn-xs btn-circle disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono-crm text-[10px] text-secondary">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-ghost btn-xs btn-circle disabled:opacity-40"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
