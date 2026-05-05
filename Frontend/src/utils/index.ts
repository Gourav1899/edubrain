import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatCurrency = (amount: number, currency = '₹') => {
  if (amount >= 100000) return `${currency}${(amount/100000).toFixed(1)}L`
  if (amount >= 1000) return `${currency}${(amount/1000).toFixed(0)}K`
  return `${currency}${amount.toLocaleString()}`
}

export const getGrade = (pct: number) => {
  if (pct >= 90) return 'A+'; if (pct >= 80) return 'A'; if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'; if (pct >= 50) return 'C'; if (pct >= 35) return 'D'; return 'F'
}

export const getAttColor = (pct: number) =>
  pct >= 85 ? 'text-accent-green' : pct >= 75 ? 'text-accent-amber' : 'text-red-400'

export const getRiskVariant = (risk: string): 'red' | 'amber' | 'green' =>
  risk === 'high' ? 'red' : risk === 'medium' ? 'amber' : 'green'

export const initials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export const generateCode = () =>
  'EDU' + Math.random().toString(36).substring(2, 8).toUpperCase()

export const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
