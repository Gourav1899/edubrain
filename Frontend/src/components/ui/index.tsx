import { clsx } from 'clsx'
import React from 'react'

// ─── BUTTON ───────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, iconRight, children, className, disabled, ...props
}: BtnProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    accent:  'bg-purple-600 hover:bg-purple-700 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost:   'text-gray-700 hover:bg-gray-100',
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  }
  const sizes = { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg', xl: 'px-8 py-4 text-xl' }

  return (
    <button
      className={clsx('rounded font-medium transition-colors', variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span>Loading...</span> : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  )
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, inputSize = 'md', className, ...props }, ref) => {
    const sizes = { sm: 'px-2 py-1 text-sm', md: 'px-3 py-2', lg: 'px-4 py-3 text-lg' }
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
              sizes[inputSize],
              icon && 'pl-10',
              iconRight && 'pr-10',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {iconRight}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
        {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, glow, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-gray-200 rounded-lg p-5 shadow-sm',
        hover && 'hover:shadow-md cursor-pointer',
        glow && 'shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, action, subtitle }: { title: React.ReactNode; action?: React.ReactNode; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'violet' | 'cyan' | 'gray'
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ variant = 'blue', children, className, dot }: BadgeProps) {
  const variants = {
    green:  'bg-green-100 text-green-800',
    red:    'bg-red-100 text-red-800',
    amber:  'bg-amber-100 text-amber-800',
    blue:   'bg-blue-100 text-blue-800',
    violet: 'bg-violet-100 text-violet-800',
    cyan:   'bg-cyan-100 text-cyan-800',
    gray:   'bg-gray-100 text-gray-800',
  }
  return (
    <span className={clsx('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />}
      {children}
    </span>
  )
}

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

export function Avatar({ name, size = 'md', color = 'bg-gradient-to-br from-sky-500 to-indigo-600', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || name.slice(0, 2).toUpperCase()

  const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-16 h-16 text-xl',
  }

  return (
    <div className={clsx('inline-flex items-center justify-center rounded-full text-white font-semibold', sizeClasses[size], color, className)}>
      {initials}
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | 'up' | 'down'
  icon?: React.ReactNode
  color?: string
  onClick?: () => void
}

export function StatCard({ label, value, change, changeType = 'neutral', icon, color = 'text-blue-600', onClick }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral:  'text-gray-600',
  }

  return (
    <Card onClick={onClick} hover={!!onClick} className="cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={clsx('text-sm font-medium mt-1', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && <div className={clsx('text-2xl', color)}>{icon}</div>}
      </div>
    </Card>
  )
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        disabled={disabled}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  hint?: string
}

export function Select({ label, options, error, hint, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={clsx(
          'border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500',
          className,
          error && 'border-red-500'
        )}
        {...props}
      >
        {options.map((option: SelectOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'border border-gray-300 rounded px-3 py-2 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500',
          className,
          error && 'border-red-500'
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={clsx('w-full rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden', sizeClasses[size])}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div
            className={clsx('w-full rounded-t', item.color || 'bg-blue-500')}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-xs text-gray-600 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── QUICK ACTION ─────────────────────────────────────────────────────────────
interface QuickActionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function QuickAction({ icon, label, onClick, variant = 'primary' }: QuickActionProps) {
  const variants = {
    primary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
    secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
        variants[variant]
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <Card>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </Card>
  )
}

// ─── PROGRESS RING ────────────────────────────────────────────────────────────
interface ProgressRingProps {
  progress?: number // 0-100
  value?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export function ProgressRing({
  progress = 0,
  value,
  size = 80,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb'
}: ProgressRingProps) {
  const computedProgress = Math.max(0, Math.min(100, value ?? progress))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (computedProgress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">{computedProgress}%</span>
      </div>
    </div>
  )
}