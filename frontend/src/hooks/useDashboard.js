import { useState, useCallback } from 'react'
import { runAnalysis } from '../api/api'

const DEFAULT_PAYLOAD = {
  project_id: import.meta.env.VITE_PROJECT_ID || 'your-gcp-project',
  dataset:    import.meta.env.VITE_BQ_DATASET  || 'your_dataset',
  table:      import.meta.env.VITE_BQ_TABLE    || 'your_table',
  user_query: import.meta.env.VITE_USER_QUERY  || 'Analyze business KPIs and provide insights.',
}

export function useDashboard({ onSuccess } = {}) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async (payload = DEFAULT_PAYLOAD) => {
    setLoading(true)
    setError(null)
    try {
      const res = await runAnalysis(payload)
      setData(res.data)
      onSuccess?.(res.data, payload)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  return { data, loading, error, fetch }
}
