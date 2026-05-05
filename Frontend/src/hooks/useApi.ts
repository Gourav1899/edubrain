import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useApi<T = any>(apiCall: (...args: any[]) => Promise<any>, opts: { successMsg?: string; errorMsg?: string; onSuccess?: (d: any) => void } = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true); setError(null)
    try {
      const res = await apiCall(...args)
      setData(res.data)
      if (opts.successMsg) toast.success(opts.successMsg)
      opts.onSuccess?.(res.data)
      return res.data
    } catch (err: any) {
      const msg = opts.errorMsg || err.message || 'Error occurred'
      setError(msg); toast.error(msg)
    } finally { setLoading(false) }
  }, [apiCall])

  return { data, loading, error, execute }
}
