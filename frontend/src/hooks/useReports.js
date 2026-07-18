import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kpi_report_history'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function useReports() {
  const [reports, setReports] = useState(load)

  const addReport = useCallback((analysisResult, meta = {}) => {
    const pdfPath = analysisResult?.pdf_path ?? analysisResult?.memory?.pdf_path ?? null
    const filename = pdfPath ? pdfPath.split(/[\\/]/).pop() : null

    const entry = {
      id:        crypto.randomUUID(),
      name:      filename
                   ? filename.replace('.pdf', '').replace(/_/g, ' ')
                   : `Report ${new Date().toLocaleString()}`,
      filename,
      pdfPath,
      dataset:   meta.dataset  || analysisResult?.dataset  || '—',
      table:     meta.table    || analysisResult?.table    || '—',
      projectId: meta.project_id || '—',
      status:    filename ? 'ready' : 'no-pdf',
      generatedAt: new Date().toISOString(),
      // store text report for preview fallback
      reportText: analysisResult?.report ?? null,
      kpis:       analysisResult?.kpis   ?? null,
    }

    setReports(prev => {
      const next = [entry, ...prev]
      save(next)
      return next
    })

    return entry
  }, [])

  const removeReport = useCallback((id) => {
    setReports(prev => {
      const next = prev.filter(r => r.id !== id)
      save(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setReports([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { reports, addReport, removeReport, clearAll }
}
