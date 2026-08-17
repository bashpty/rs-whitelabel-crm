/** Wrapper for react-hook-form fields with label, error and description */
export default function FormField({ label, error, required, children, hint }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="font-mono-crm text-[10px] uppercase tracking-widest text-secondary flex items-center gap-1">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="font-mono-crm text-[10px] text-secondary/60">{hint}</p>}
      {error && (
        <p className="font-mono-crm text-[10px] text-error flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
