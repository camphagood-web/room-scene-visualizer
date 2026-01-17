import { ReactNode } from 'react'

interface ParameterSectionProps {
  title: string
  description?: string
  children: ReactNode
  disabled?: boolean
}

export function ParameterSection({
  title,
  description,
  children,
  disabled = false,
}: ParameterSectionProps) {
  return (
    <section className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-500">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  )
}
