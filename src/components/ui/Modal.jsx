import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] ?? 'max-w-lg'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClass} bg-base-100 rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 flex-shrink-0">
          <h2 className="font-display font-semibold text-base text-primary">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  )
}
