import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// In case env wasn't injected (misconfigured build), avoid throwing at runtime.
// This prevents breaking the whole app; requests will fail gracefully.
if (!API_BASE_URL) {
  console.error('Missing VITE_API_URL. Expected to be injected at build time.')
}


const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const runAnalysis = (payload) => client.post('/analyze', payload)
export const listReports = () => client.get('/reports')
export const downloadReport = (filename) => client.get(`/reports/${filename}/download`, { responseType: 'blob' })
export const getReportUrl = (filename) => `${API_BASE_URL}/reports/${filename}/download`

export const sendChat = (payload) => client.post('/chat', payload)

export default client

